# /add_upload

## Command Description
Use this command to add file upload functionality. Claude will set up Supabase Storage, upload UI, and proper file handling.

---

## Conversation Flow

When the user types `/add_upload`, respond with:

---

### Step 1: Upload Type

> **Let's add file upload! What type of upload is this?**
>
> - [ ] **Avatar/Profile image** - User profile picture
> - [ ] **Document attachment** - PDFs, docs, spreadsheets
> - [ ] **Image gallery** - Multiple images for a resource
> - [ ] **General file** - Any file type
> - [ ] **Import file** - CSV/Excel for data import
>
> *What are users uploading?*

Wait for response, then:

---

### Step 2: Location

> **Where in the app does this upload appear?**
>
> *Example: "User settings page for avatar upload"*
> *Example: "Project detail page for attachments"*
> *Example: "Message composer for file attachments"*

Wait for response, then:

---

### Step 3: File Requirements

> **What are the file requirements?**
>
> **Allowed file types:**
> *(e.g., "Images only", "Images and PDFs", "Any file")*
>
> Specific MIME types:
> - [ ] `image/jpeg`
> - [ ] `image/png`
> - [ ] `image/webp`
> - [ ] `image/gif`
> - [ ] `application/pdf`
> - [ ] `application/msword`
> - [ ] `text/csv`
> - [ ] Other: ___
>
> **Max file size:** ___ MB *(e.g., "4MB for avatars", "50MB for documents")*
>
> **Max number of files:** ___ *(e.g., "1 for avatar", "10 for gallery")*

Wait for response, then:

---

### Step 4: Storage Configuration

> **How should files be stored?**
>
> **Bucket name:** *(e.g., "avatars", "documents", "attachments")*
>
> **Bucket visibility:**
> - [ ] **Public** - Anyone with URL can access (good for avatars)
> - [ ] **Private** - Requires signed URL (good for documents)
>
> **File path pattern:**
> *(How to organize files in the bucket)*
>
> *Examples:*
> - `{userId}/avatar.{ext}` - One avatar per user
> - `{userId}/{timestamp}-{filename}` - Multiple files per user
> - `{projectId}/attachments/{filename}` - Files per project

Wait for response, then:

---

### Step 5: Image Processing

> **(Skip if not uploading images)**
>
> **Should images be processed?**
>
> - [ ] **Resize/optimize** - Max dimensions: ___x___ px
> - [ ] **Generate thumbnail** - Thumbnail size: ___x___ px
> - [ ] **Convert format** - Convert to: ___ (e.g., webp)
> - [ ] **No processing** - Store as-is
>
> *For avatars, recommend: "Resize to 400x400, convert to webp"*

Wait for response, then:

---

### Step 6: UI Requirements

> **What upload UI do you need?**
>
> - [ ] **Click to upload button** - Simple file input
> - [ ] **Drag & drop zone** - Drop files onto area
> - [ ] **Avatar preview** - Circular image with edit button
> - [ ] **Progress indicator** - Show upload progress
> - [ ] **Preview before upload** - Show selected file
> - [ ] **Preview after upload** - Show uploaded file
> - [ ] **Delete button** - Remove uploaded file
> - [ ] **Multiple file list** - Show all uploaded files
>
> *Describe the desired UI:*

Wait for response, then:

---

### Step 7: Access Control

> **Who can access uploaded files?**
>
> **Upload permission:**
> - [ ] Only authenticated users
> - [ ] Only resource owner (e.g., project owner)
> - [ ] Specific roles: ___
>
> **View permission:**
> - [ ] Public (anyone with URL)
> - [ ] Authenticated users only
> - [ ] Only uploader
> - [ ] Resource members (e.g., project team)
>
> **Delete permission:**
> - [ ] Only uploader
> - [ ] Resource owner
> - [ ] Admins

Wait for response, then:

---

### Step 8: Metadata Storage

> **Should we store file metadata in the database?**
>
> - [ ] **Yes** - Track uploads with these fields:
>   - [ ] filename
>   - [ ] size
>   - [ ] type (MIME)
>   - [ ] path (storage path)
>   - [ ] url (public/signed URL)
>   - [ ] uploadedBy (user ID)
>   - [ ] uploadedAt (timestamp)
>   - [ ] Custom: ___
>
> - [ ] **No** - Just store the URL/path on the parent record
>   - Field name: ___ *(e.g., "avatarUrl" on User model)*

Wait for response, then:

---

### Step 9: Plan Limits

> **Should uploads be limited by plan?**
>
> - [ ] **No limits** - All plans same
> - [ ] **Storage limit** - Total storage per plan:
>   - Free: ___ MB
>   - Pro: ___ MB
>   - Enterprise: ___ MB
> - [ ] **File count limit** - Max files per plan
> - [ ] **File size limit by plan** - Larger files for higher plans

Wait for response, then:

---

### Step 10: Error Handling

> **What errors should we handle?**
>
> - [ ] File too large → "File exceeds maximum size of X MB"
> - [ ] Wrong file type → "Only [types] files are allowed"
> - [ ] Storage limit reached → "Storage limit reached. Upgrade to upload more."
> - [ ] Upload failed → "Upload failed. Please try again."
> - [ ] Network error → "Connection lost. Please check your internet."
>
> *Any custom error scenarios?*

Wait for response, then:

---

### Step 11: Confirmation

> **Here's the upload feature I'll implement:**
>
> **Type:** [avatar/document/gallery/etc.]
> **Location:** [where in app]
>
> **File requirements:**
> - Types: [allowed types]
> - Max size: [X MB]
> - Max count: [X files]
>
> **Storage:**
> - Bucket: [name] ([public/private])
> - Path: [pattern]
>
> **Processing:** [resize/thumbnail/convert/none]
>
> **UI components:**
> - [component 1]
> - [component 2]
>
> **Access control:**
> - Upload: [who]
> - View: [who]
> - Delete: [who]
>
> **Metadata:** [database fields or parent field]
>
> **Plan limits:** [limits or none]
>
> ---
>
> **Does this look correct?**
> - Type `yes` to proceed
> - Type `no` to adjust

Wait for confirmation, then proceed.

---

## Implementation Order

1. **Supabase bucket** - Create bucket with policies
2. **Storage helpers** - Add to `lib/supabase/storage.ts`
3. **Server action** - Upload action with validation
4. **Database** - Metadata model/fields if needed
5. **UI component** - Upload component
6. **Integration** - Add to page/form
7. **Test** - Upload, view, delete flows