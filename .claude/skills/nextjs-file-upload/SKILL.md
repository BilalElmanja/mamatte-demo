---
name: nextjs-file-upload
description: "File upload for Next.js applications using Supabase Storage. Use when implementing image uploads, document uploads, avatars, attachments, or any file handling. Covers upload UI components, server-side validation, storage buckets, and signed URLs."
---

# Next.js File Upload with Supabase Storage

## When to Read Which Reference

| Task | Read This |
|------|-----------|
| Initial setup | This file (Quick Start below) |
| Supabase Storage API | [references/supabase-storage.md](references/supabase-storage.md) |
| Upload UI components | [references/upload-ui.md](references/upload-ui.md) |
| Image optimization | [references/image-processing.md](references/image-processing.md) |

## Quick Start

### 1. Install

```bash
npm install @supabase/supabase-js
```

### 2. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-side only
```

### 3. Create Supabase Clients

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// src/lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js'

// Admin client for server-side operations
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### 4. Create Storage Bucket

In Supabase Dashboard → Storage → Create bucket:
- `avatars` - Public bucket for profile images
- `documents` - Private bucket for user files

### 5. Basic Upload Component

```typescript
// src/components/upload/file-upload.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface FileUploadProps {
  bucket: string
  folder: string
  onUploadComplete: (url: string, path: string) => void
  accept?: string
  maxSize?: number // bytes
}

export function FileUpload({ 
  bucket, 
  folder, 
  onUploadComplete,
  accept = '*',
  maxSize = 10 * 1024 * 1024
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSize) {
      alert(`File too large. Max size: ${maxSize / 1024 / 1024}MB`)
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Get URL based on bucket visibility
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
      
      onUploadComplete(data.publicUrl, filePath)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept={accept}
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading... {progress}%</p>}
    </div>
  )
}
```

## Clean Architecture Integration

```
┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION: Upload buttons, dropzones, progress UI        │
│ Location: src/components/upload/                            │
├─────────────────────────────────────────────────────────────┤
│ APPLICATION: Upload actions (validation, signed URLs)       │
│ Location: src/actions/upload-actions.ts                     │
├─────────────────────────────────────────────────────────────┤
│ DOMAIN: File service (limits, processing)                   │
│ Location: src/services/file-service.ts                      │
├─────────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE: Supabase client, file repository            │
│ Location: src/lib/supabase/, src/repositories/              │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/
├── components/
│   └── upload/
│       ├── file-upload.tsx         # Basic file uploader
│       ├── avatar-upload.tsx       # Avatar uploader
│       ├── dropzone.tsx            # Drag & drop zone
│       └── file-list.tsx           # Uploaded files display
├── actions/
│   └── upload-actions.ts           # Server actions for uploads
├── lib/
│   └── supabase/
│       ├── client.ts               # Browser client
│       ├── server.ts               # Server client (admin)
│       └── storage.ts              # Storage helpers
├── services/
│   └── file-service.ts             # File processing logic
├── repositories/
│   └── file-repository.ts          # File metadata storage
└── types/
    └── file.ts                     # File types & schemas
```

## Storage Helper Functions

```typescript
// src/lib/supabase/storage.ts
import { supabaseAdmin } from './server'

export const storage = {
  async upload(bucket: string, path: string, file: File | Buffer, options?: {
    contentType?: string
    upsert?: boolean
  }) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, {
        contentType: options?.contentType,
        cacheControl: '3600',
        upsert: options?.upsert ?? false,
      })
    if (error) throw error
    return data
  },

  getPublicUrl(bucket: string, path: string) {
    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  },

  async getSignedUrl(bucket: string, path: string, expiresIn = 3600) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)
    if (error) throw error
    return data.signedUrl
  },

  async delete(bucket: string, paths: string[]) {
    const { error } = await supabaseAdmin.storage.from(bucket).remove(paths)
    if (error) throw error
  },

  async list(bucket: string, folder: string) {
    const { data, error } = await supabaseAdmin.storage.from(bucket).list(folder)
    if (error) throw error
    return data
  },
}
```

## Server Action for Secure Upload

```typescript
// src/actions/upload-actions.ts
'use server'

import { requireAuth } from '@/lib/auth'
import { storage } from '@/lib/supabase/storage'
import { fileService } from '@/services/file-service'
import { nanoid } from 'nanoid'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_AVATAR_SIZE = 4 * 1024 * 1024 // 4MB

export async function uploadAvatarAction(formData: FormData) {
  const user = await requireAuth()
  const file = formData.get('file') as File

  if (!file) throw new Error('No file provided')
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) throw new Error('Invalid file type')
  if (file.size > MAX_AVATAR_SIZE) throw new Error('File too large (max 4MB)')

  const ext = file.name.split('.').pop()
  const path = `${user.id}/${nanoid()}.${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())
  await storage.upload('avatars', path, buffer, {
    contentType: file.type,
    upsert: true,
  })

  const url = storage.getPublicUrl('avatars', path)
  return { url, path }
}

export async function deleteFileAction(bucket: string, path: string) {
  const user = await requireAuth()

  // Verify ownership
  if (!path.startsWith(user.id + '/')) {
    throw new Error('Unauthorized')
  }

  await storage.delete(bucket, [path])
  return { success: true }
}
```

## Database Schema for Metadata

```prisma
model File {
  id        String   @id @default(cuid())
  name      String
  path      String   @unique
  bucket    String
  size      Int
  type      String
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@index([userId])
}
```

## Key Rules

1. **Use service role key server-side only** - Never expose in client
2. **Validate file types server-side** - Don't trust client validation
3. **Use signed URLs for private files** - Set appropriate expiration
4. **Organize by user ID** - Path: `{userId}/{filename}` for easy RLS
5. **Store metadata in database** - Track uploads per user
6. **Set up RLS policies** - Secure bucket access at database level