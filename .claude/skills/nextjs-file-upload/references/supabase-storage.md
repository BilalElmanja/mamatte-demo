# Supabase Storage API

## Bucket Setup

### Create Buckets in Dashboard

Go to Supabase Dashboard → Storage → New bucket

| Bucket | Public | Use Case |
|--------|--------|----------|
| `avatars` | Yes | Profile images, public assets |
| `documents` | No | User files, private documents |
| `attachments` | No | Project attachments |

### Create Buckets via SQL

```sql
-- Public bucket for avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Private bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES (
  'documents',
  'documents',
  false,
  52428800 -- 50MB
);
```

## RLS Policies

### Public Bucket (Avatars)

```sql
-- Anyone can view avatars
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Authenticated users can upload to their folder
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own avatars
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own avatars
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### Private Bucket (Documents)

```sql
-- Users can only access their own documents
CREATE POLICY "Users can read own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

## Upload Operations

### Basic Upload

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user-id/avatar.jpg', file)
```

### Upload with Options

```typescript
const { data, error } = await supabase.storage
  .from('documents')
  .upload(filePath, file, {
    cacheControl: '3600',        // Cache for 1 hour
    contentType: 'application/pdf',
    upsert: false,               // Don't overwrite existing
    duplex: 'half',              // For streaming uploads
  })
```

### Upload from Buffer (Server-side)

```typescript
const buffer = Buffer.from(await file.arrayBuffer())

const { data, error } = await supabaseAdmin.storage
  .from('documents')
  .upload(filePath, buffer, {
    contentType: file.type,
  })
```

### Upload from URL

```typescript
const { data, error } = await supabase.storage
  .from('images')
  .upload(filePath, 'https://example.com/image.jpg')
```

## Download & URLs

### Get Public URL (Public Buckets)

```typescript
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user-id/avatar.jpg')

console.log(data.publicUrl)
// https://xxx.supabase.co/storage/v1/object/public/avatars/user-id/avatar.jpg
```

### Get Signed URL (Private Buckets)

```typescript
const { data, error } = await supabase.storage
  .from('documents')
  .createSignedUrl('user-id/document.pdf', 3600) // 1 hour expiry

console.log(data.signedUrl)
```

### Get Multiple Signed URLs

```typescript
const { data, error } = await supabase.storage
  .from('documents')
  .createSignedUrls(['path1.pdf', 'path2.pdf'], 3600)
```

### Download File

```typescript
const { data, error } = await supabase.storage
  .from('documents')
  .download('user-id/document.pdf')

// data is a Blob
const url = URL.createObjectURL(data)
```

## File Operations

### List Files

```typescript
const { data, error } = await supabase.storage
  .from('documents')
  .list('user-id', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' },
  })

// data is array of FileObject
// { name, id, updated_at, created_at, last_accessed_at, metadata }
```

### Delete Files

```typescript
// Delete single file
const { error } = await supabase.storage
  .from('documents')
  .remove(['user-id/document.pdf'])

// Delete multiple files
const { error } = await supabase.storage
  .from('documents')
  .remove(['path1.pdf', 'path2.pdf', 'path3.pdf'])
```

### Move/Rename File

```typescript
const { error } = await supabase.storage
  .from('documents')
  .move('old-path/file.pdf', 'new-path/file.pdf')
```

### Copy File

```typescript
const { error } = await supabase.storage
  .from('documents')
  .copy('source/file.pdf', 'destination/file.pdf')
```

## Transformations (Images)

### Resize Image

```typescript
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user-id/avatar.jpg', {
    transform: {
      width: 200,
      height: 200,
      resize: 'cover', // 'contain' | 'cover' | 'fill'
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
      quality: 80,
      format: 'webp',
    },
  })
```

## Storage Helper Module

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
    if (error) throw new Error(`Upload failed: ${error.message}`)
    return data
  },

  getPublicUrl(bucket: string, path: string, transform?: {
    width?: number
    height?: number
    quality?: number
  }) {
    const { data } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(path, { transform })
    return data.publicUrl
  },

  async getSignedUrl(bucket: string, path: string, expiresIn = 3600) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)
    if (error) throw new Error(`Signed URL failed: ${error.message}`)
    return data.signedUrl
  },

  async delete(bucket: string, paths: string[]) {
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove(paths)
    if (error) throw new Error(`Delete failed: ${error.message}`)
  },

  async list(bucket: string, folder: string, options?: {
    limit?: number
    offset?: number
  }) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .list(folder, {
        limit: options?.limit ?? 100,
        offset: options?.offset ?? 0,
      })
    if (error) throw new Error(`List failed: ${error.message}`)
    return data
  },

  async getSize(bucket: string, folder: string): Promise<number> {
    const files = await this.list(bucket, folder)
    return files.reduce((acc, file) => acc + (file.metadata?.size ?? 0), 0)
  },
}
```

## Error Handling

```typescript
try {
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(path, file)

  if (error) {
    switch (error.message) {
      case 'The resource already exists':
        throw new Error('File already exists')
      case 'Payload too large':
        throw new Error('File too large')
      case 'Invalid file type':
        throw new Error('File type not allowed')
      default:
        throw new Error(`Upload failed: ${error.message}`)
    }
  }

  return data
} catch (error) {
  console.error('Storage error:', error)
  throw error
}
```

## With Clerk Auth (No Supabase Auth)

When using Clerk instead of Supabase Auth, use service role for all operations:

```typescript
// Always use admin client since we don't have Supabase auth
import { supabaseAdmin } from '@/lib/supabase/server'

// Server action
export async function uploadAction(formData: FormData) {
  // Auth via Clerk
  const user = await requireAuth()
  
  // Upload via Supabase admin client
  const file = formData.get('file') as File
  const path = `${user.id}/${nanoid()}.${ext}`
  
  await supabaseAdmin.storage
    .from('documents')
    .upload(path, file)
}
```