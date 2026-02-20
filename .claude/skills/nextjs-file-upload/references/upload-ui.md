# Upload UI Components

## Drag & Drop Dropzone

```typescript
// src/components/upload/dropzone.tsx
'use client'

import { useCallback, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  maxFiles?: number
  maxSize?: number
  disabled?: boolean
  className?: string
}

export function Dropzone({
  onFilesSelected,
  accept = '*',
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  disabled = false,
  className,
}: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }, [])

  const validateFiles = useCallback((files: File[]) => {
    return files
      .filter(file => file.size <= maxSize)
      .slice(0, maxFiles)
  }, [maxFiles, maxSize])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (disabled) return

    const files = validateFiles(Array.from(e.dataTransfer.files))
    if (files.length > 0) {
      onFilesSelected(files)
    }
  }, [disabled, validateFiles, onFilesSelected])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = validateFiles(Array.from(e.target.files))
      if (files.length > 0) {
        onFilesSelected(files)
      }
    }
  }, [validateFiles, onFilesSelected])

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors',
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <input
        type="file"
        accept={accept}
        multiple={maxFiles > 1}
        onChange={handleChange}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
      <p className="text-foreground font-medium">
        {isDragActive ? 'Drop files here' : 'Drop files here or click to upload'}
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        Up to {maxFiles} files, max {(maxSize / 1024 / 1024).toFixed(0)}MB each
      </p>
    </div>
  )
}
```

## File List with Progress

```typescript
// src/components/upload/file-list.tsx
'use client'

import { X, File, Image as ImageIcon, FileText, Loader2, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  progress?: number
  status: 'pending' | 'uploading' | 'complete' | 'error'
  url?: string
  error?: string
}

interface FileListProps {
  files: FileItem[]
  onRemove: (id: string) => void
}

export function FileList({ files, onRemove }: FileListProps) {
  if (files.length === 0) return null

  return (
    <ul className="space-y-2 mt-4">
      {files.map((file) => (
        <li 
          key={file.id}
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg border',
            file.status === 'error' && 'border-destructive/50 bg-destructive/5'
          )}
        >
          <FileIcon type={file.type} />
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)}
              {file.error && <span className="text-destructive ml-2">{file.error}</span>}
            </p>
            
            {file.status === 'uploading' && file.progress !== undefined && (
              <div className="h-1 bg-muted rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {file.status === 'uploading' && (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            )}
            {file.status === 'complete' && (
              <Check className="w-4 h-4 text-green-500" />
            )}
            {file.status === 'error' && (
              <AlertCircle className="w-4 h-4 text-destructive" />
            )}
            
            <button
              onClick={() => onRemove(file.id)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

function FileIcon({ type }: { type: string }) {
  if (type.startsWith('image/')) {
    return <ImageIcon className="w-8 h-8 text-blue-500 shrink-0" />
  }
  if (type === 'application/pdf') {
    return <FileText className="w-8 h-8 text-red-500 shrink-0" />
  }
  return <File className="w-8 h-8 text-muted-foreground shrink-0" />
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
```

## Avatar Upload Component

```typescript
// src/components/upload/avatar-upload.tsx
'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Camera, Loader2, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface AvatarUploadProps {
  currentUrl?: string
  userId: string
  onUploadComplete: (url: string) => void
  size?: number
}

export function AvatarUpload({ 
  currentUrl, 
  userId,
  onUploadComplete,
  size = 96
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate
    if (!file.type.startsWith('image/')) {
      alert('Please select an image')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      alert('Image must be less than 4MB')
      return
    }

    // Preview immediately
    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const ext = file.name.split('.').pop()
      const path = `${userId}/${Date.now()}.${ext}`

      const { error } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })

      if (error) throw error

      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      onUploadComplete(data.publicUrl)
    } catch (error) {
      console.error('Upload error:', error)
      setPreview(currentUrl) // Revert on error
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative inline-block">
      <div 
        className={cn(
          'rounded-full overflow-hidden bg-muted cursor-pointer',
          'ring-2 ring-background shadow-sm'
        )}
        style={{ width: size, height: size }}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Avatar"
            width={size}
            height={size}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-1/2 h-1/2 text-muted-foreground" />
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      <button
        type="button"
        onClick={() => !uploading && inputRef.current?.click()}
        disabled={uploading}
        className={cn(
          'absolute bottom-0 right-0 p-1.5 rounded-full',
          'bg-primary text-primary-foreground shadow-sm',
          'hover:bg-primary/90 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <Camera className="w-4 h-4" />
      </button>
    </div>
  )
}
```

## Multi-File Upload with Supabase

```typescript
// src/components/upload/multi-upload.tsx
'use client'

import { useState, useCallback } from 'react'
import { nanoid } from 'nanoid'
import { createClient } from '@/lib/supabase/client'
import { Dropzone } from './dropzone'
import { FileList } from './file-list'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: 'pending' | 'uploading' | 'complete' | 'error'
  url?: string
  path?: string
  error?: string
}

interface MultiUploadProps {
  bucket: string
  folder: string
  onUploadComplete: (files: { url: string; name: string; path: string }[]) => void
  maxFiles?: number
  maxSize?: number
  accept?: string
}

export function MultiUpload({
  bucket,
  folder,
  onUploadComplete,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  accept = '*',
}: MultiUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const supabase = createClient()

  const uploadFile = async (file: UploadedFile, rawFile: File) => {
    const ext = rawFile.name.split('.').pop()
    const path = `${folder}/${nanoid()}.${ext}`

    setFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
    ))

    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, rawFile, {
          cacheControl: '3600',
        })

      if (error) throw error

      const { data } = supabase.storage.from(bucket).getPublicUrl(path)

      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, status: 'complete' as const, progress: 100, url: data.publicUrl, path }
          : f
      ))

      return { url: data.publicUrl, name: rawFile.name, path }
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, status: 'error' as const, error: 'Upload failed' }
          : f
      ))
      return null
    }
  }

  const handleFilesSelected = useCallback(async (selectedFiles: File[]) => {
    const newFiles: UploadedFile[] = selectedFiles.map(file => ({
      id: nanoid(),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending' as const,
    }))

    setFiles(prev => [...prev, ...newFiles])

    // Upload all files
    const results = await Promise.all(
      newFiles.map((file, index) => uploadFile(file, selectedFiles[index]))
    )

    const successful = results.filter(Boolean) as { url: string; name: string; path: string }[]
    if (successful.length > 0) {
      onUploadComplete(successful)
    }
  }, [bucket, folder, onUploadComplete, supabase])

  const handleRemove = useCallback(async (id: string) => {
    const file = files.find(f => f.id === id)
    
    // Delete from Supabase if uploaded
    if (file?.path && file.status === 'complete') {
      await supabase.storage.from(bucket).remove([file.path])
    }

    setFiles(prev => prev.filter(f => f.id !== id))
  }, [files, bucket, supabase])

  return (
    <div>
      <Dropzone
        onFilesSelected={handleFilesSelected}
        accept={accept}
        maxFiles={maxFiles}
        maxSize={maxSize}
        disabled={files.filter(f => f.status === 'uploading').length > 0}
      />
      <FileList files={files} onRemove={handleRemove} />
    </div>
  )
}
```

## Image Preview Grid

```typescript
// src/components/upload/image-grid.tsx
'use client'

import Image from 'next/image'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageGridProps {
  images: { url: string; path: string }[]
  onRemove?: (path: string) => void
  columns?: number
}

export function ImageGrid({ images, onRemove, columns = 4 }: ImageGridProps) {
  if (images.length === 0) return null

  return (
    <div 
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {images.map((image) => (
        <div key={image.path} className="relative aspect-square group">
          <Image
            src={image.url}
            alt=""
            fill
            className="object-cover rounded-lg"
          />
          {onRemove && (
            <button
              onClick={() => onRemove(image.path)}
              className={cn(
                'absolute -top-2 -right-2 p-1 rounded-full',
                'bg-destructive text-destructive-foreground',
                'opacity-0 group-hover:opacity-100 transition-opacity',
                'shadow-sm'
              )}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
```