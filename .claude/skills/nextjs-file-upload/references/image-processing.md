# Image Processing

## Supabase Image Transformations

Supabase Storage supports on-the-fly image transformations via URL parameters.

### Basic Transformations

```typescript
// Get transformed image URL
const { data } = supabase.storage
  .from('images')
  .getPublicUrl('photo.jpg', {
    transform: {
      width: 400,
      height: 300,
    },
  })

// Result: https://xxx.supabase.co/storage/v1/render/image/public/images/photo.jpg?width=400&height=300
```

### Resize Modes

```typescript
// Cover - crop to fill dimensions (default)
const { data } = supabase.storage
  .from('images')
  .getPublicUrl('photo.jpg', {
    transform: {
      width: 200,
      height: 200,
      resize: 'cover',
    },
  })

// Contain - fit within dimensions, preserve aspect ratio
const { data } = supabase.storage
  .from('images')
  .getPublicUrl('photo.jpg', {
    transform: {
      width: 200,
      height: 200,
      resize: 'contain',
    },
  })

// Fill - stretch to fill dimensions
const { data } = supabase.storage
  .from('images')
  .getPublicUrl('photo.jpg', {
    transform: {
      width: 200,
      height: 200,
      resize: 'fill',
    },
  })
```

### Quality & Format

```typescript
const { data } = supabase.storage
  .from('images')
  .getPublicUrl('photo.jpg', {
    transform: {
      width: 800,
      quality: 75,        // 1-100, default 80
      format: 'webp',     // 'origin' | 'webp'
    },
  })
```

## Image Helper Functions

```typescript
// src/lib/supabase/images.ts
import { supabaseAdmin } from './server'

interface ImageTransform {
  width?: number
  height?: number
  quality?: number
  resize?: 'cover' | 'contain' | 'fill'
  format?: 'origin' | 'webp'
}

export function getImageUrl(
  bucket: string, 
  path: string, 
  transform?: ImageTransform
) {
  const { data } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(path, { transform })
  return data.publicUrl
}

// Predefined sizes
export function getAvatarUrl(path: string, size: 'sm' | 'md' | 'lg' = 'md') {
  const sizes = { sm: 40, md: 80, lg: 160 }
  return getImageUrl('avatars', path, {
    width: sizes[size],
    height: sizes[size],
    resize: 'cover',
  })
}

export function getThumbnailUrl(path: string) {
  return getImageUrl('images', path, {
    width: 200,
    height: 200,
    resize: 'cover',
    quality: 70,
  })
}

export function getOptimizedUrl(path: string, maxWidth = 1200) {
  return getImageUrl('images', path, {
    width: maxWidth,
    quality: 80,
    format: 'webp',
  })
}
```

## Server-Side Image Processing with Sharp

For advanced processing before upload:

```bash
npm install sharp
```

```typescript
// src/lib/images/process.ts
import sharp from 'sharp'

export async function processAvatar(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(400, 400, { fit: 'cover' })
    .webp({ quality: 80 })
    .toBuffer()
}

export async function processImage(buffer: Buffer, options?: {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}): Promise<Buffer> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 80 } = options || {}
  
  return sharp(buffer)
    .resize(maxWidth, maxHeight, { 
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toBuffer()
}

export async function generateThumbnail(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(200, 200, { fit: 'cover' })
    .webp({ quality: 70 })
    .toBuffer()
}

export async function getImageMetadata(buffer: Buffer) {
  const metadata = await sharp(buffer).metadata()
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    size: buffer.length,
  }
}
```

## Upload with Processing

```typescript
// src/actions/upload-actions.ts
'use server'

import { requireAuth } from '@/lib/auth'
import { storage } from '@/lib/supabase/storage'
import { processAvatar, generateThumbnail } from '@/lib/images/process'
import { nanoid } from 'nanoid'

export async function uploadProcessedImageAction(formData: FormData) {
  const user = await requireAuth()
  const file = formData.get('file') as File

  if (!file) throw new Error('No file')
  if (!file.type.startsWith('image/')) throw new Error('Not an image')

  const buffer = Buffer.from(await file.arrayBuffer())
  const id = nanoid()

  // Process main image
  const processed = await processAvatar(buffer)
  const mainPath = `${user.id}/${id}.webp`
  
  await storage.upload('avatars', mainPath, processed, {
    contentType: 'image/webp',
  })

  // Generate and upload thumbnail
  const thumbnail = await generateThumbnail(buffer)
  const thumbPath = `${user.id}/${id}-thumb.webp`
  
  await storage.upload('avatars', thumbPath, thumbnail, {
    contentType: 'image/webp',
  })

  return {
    url: storage.getPublicUrl('avatars', mainPath),
    thumbnailUrl: storage.getPublicUrl('avatars', thumbPath),
    path: mainPath,
  }
}
```

## Responsive Image Component

```typescript
// src/components/ui/responsive-image.tsx
'use client'

import Image from 'next/image'
import { getImageUrl } from '@/lib/supabase/images'

interface ResponsiveImageProps {
  bucket: string
  path: string
  alt: string
  sizes?: string
  className?: string
  priority?: boolean
}

export function ResponsiveImage({
  bucket,
  path,
  alt,
  sizes = '100vw',
  className,
  priority = false,
}: ResponsiveImageProps) {
  // Generate srcSet for different widths
  const widths = [320, 640, 960, 1280, 1920]
  
  const srcSet = widths
    .map(w => `${getImageUrl(bucket, path, { width: w, format: 'webp' })} ${w}w`)
    .join(', ')

  const src = getImageUrl(bucket, path, { width: 1280, format: 'webp' })

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
    />
  )
}
```

## Avatar with Fallback

```typescript
// src/components/ui/avatar.tsx
'use client'

import Image from 'next/image'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAvatarUrl } from '@/lib/supabase/images'

interface AvatarProps {
  path?: string | null
  name?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = { sm: 32, md: 40, lg: 64 }

export function Avatar({ path, name, size = 'md', className }: AvatarProps) {
  const pixels = sizeMap[size]
  const url = path ? getAvatarUrl(path, size) : null

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-muted flex items-center justify-center',
        className
      )}
      style={{ width: pixels, height: pixels }}
    >
      {url ? (
        <Image
          src={url}
          alt={name || 'Avatar'}
          width={pixels}
          height={pixels}
          className="object-cover"
        />
      ) : name ? (
        <span className="text-sm font-medium text-muted-foreground">
          {name.charAt(0).toUpperCase()}
        </span>
      ) : (
        <User className="w-1/2 h-1/2 text-muted-foreground" />
      )}
    </div>
  )
}
```

## Image Validation

```typescript
// src/lib/images/validate.ts

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_DIMENSIONS = { width: 4096, height: 4096 }

export function validateImageType(type: string): boolean {
  return ALLOWED_TYPES.includes(type)
}

export function validateImageSize(size: number, maxSize = MAX_SIZE): boolean {
  return size <= maxSize
}

export async function validateImageDimensions(
  buffer: Buffer,
  max = MAX_DIMENSIONS
): Promise<boolean> {
  const sharp = (await import('sharp')).default
  const metadata = await sharp(buffer).metadata()
  
  return (
    (metadata.width || 0) <= max.width &&
    (metadata.height || 0) <= max.height
  )
}

export async function validateImage(file: File, options?: {
  maxSize?: number
  maxWidth?: number
  maxHeight?: number
  allowedTypes?: string[]
}): Promise<{ valid: boolean; error?: string }> {
  const {
    maxSize = MAX_SIZE,
    maxWidth = MAX_DIMENSIONS.width,
    maxHeight = MAX_DIMENSIONS.height,
    allowedTypes = ALLOWED_TYPES,
  } = options || {}

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: `File too large (max ${maxSize / 1024 / 1024}MB)` }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const dimensionsValid = await validateImageDimensions(buffer, { 
    width: maxWidth, 
    height: maxHeight 
  })

  if (!dimensionsValid) {
    return { valid: false, error: `Image too large (max ${maxWidth}x${maxHeight})` }
  }

  return { valid: true }
}
```