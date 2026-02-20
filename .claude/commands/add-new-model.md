# /add_model

## Command Description
Use this command to add a new database model/table. Claude will guide you through schema design following best practices.

---

## Conversation Flow

When the user types `/add_model`, respond with:

---

### Step 1: Model Name

> **Let's create a new database model!**
>
> **What's the model name?**
> *(Use PascalCase, singular form)*
>
> *Examples: `TeamInvitation`, `ProjectComment`, `NotificationPreference`*

Wait for response, then:

---

### Step 2: Purpose

> **What does this model store? Describe in 1-2 sentences.**
>
> *Example: "Stores pending invitations to join a team/project. Tracks who was invited, by whom, their role, and expiration."*

Wait for response, then:

---

### Step 3: Fields

> **What fields does this model need?**
>
> *For each field, provide:*
> - Name (camelCase)
> - Type (String, Int, Boolean, DateTime, Json, Enum)
> - Required or optional?
> - Default value?
> - Unique?
>
> *Example:*
> ```
> - email: String, required
> - role: Enum (viewer, editor, admin), required, default: viewer
> - status: Enum (pending, accepted, expired), required, default: pending
> - token: String, required, unique
> - expiresAt: DateTime, required
> - message: String, optional
> ```
>
> *List your fields:*

Wait for response, then:

---

### Step 4: Relations

> **How does this model relate to other models?**
>
> **Belongs to (foreign key on this model):**
> - *Example: "Belongs to Project (projectId)"*
> - *Example: "Belongs to User as inviter (invitedById)"*
>
> **Has many (other models reference this):**
> - *Example: "Has many Comments"*
>
> **Many-to-many:**
> - *Example: "Many-to-many with Tags via ProjectTag"*
>
> *List relationships:*

Wait for response, then:

---

### Step 5: Indexes

> **What queries will you run against this model?**
>
> *This helps me create the right indexes.*
>
> *Examples:*
> - "Find all invitations for a project" → index on `projectId`
> - "Find invitation by token" → unique index on `token`
> - "Find pending invitations for an email" → index on `[email, status]`
>
> *List your common queries:*

Wait for response, then:

---

### Step 6: Constraints

> **Any special constraints?**
>
> - [ ] **Unique fields** - *Which fields must be unique?*
> - [ ] **Unique combinations** - *Which field combinations must be unique?*
> - [ ] **Enum values** - *List enum options for any enum fields*
> - [ ] **Cascade delete** - *When parent deleted, delete these too?*
>
> *Example: "Unique combination of [projectId, email] - can't invite same email twice to same project"*

Wait for response, then:

---

### Step 7: Soft Delete

> **Should this model use soft delete?**
>
> - [ ] **Yes** - Add `deletedAt` field, filter out deleted records
> - [ ] **No** - Hard delete (permanently remove records)
>
> *Soft delete is good for: audit trails, accidental deletion recovery, data retention requirements*

Wait for response, then:

---

### Step 8: Timestamps

> **Which timestamps do you need?**
>
> - [ ] `createdAt` - When record was created (usually always yes)
> - [ ] `updatedAt` - When record was last modified (usually yes)
> - [ ] Custom: ___ - *(e.g., `acceptedAt`, `lastLoginAt`)*

Wait for response, then:

---

### Step 9: Repository Methods

> **What repository methods will you need?**
>
> - [ ] `findById(id)`
> - [ ] `findByUserId(userId)`
> - [ ] `findMany(filters)`
> - [ ] `create(data)`
> - [ ] `update(id, data)`
> - [ ] `delete(id)`
> - [ ] `count(filters)`
>
> **Custom methods:**
> - *Example: `findPendingByEmail(email)` - find all pending invitations for an email*
> - *Example: `expireOld()` - mark old invitations as expired*
>
> *List any custom methods:*

Wait for response, then:

---

### Step 10: Seed Data

> **Do you need seed data for development?**
>
> - [ ] **Yes** - *Describe what sample data to create*
> - [ ] **No** - No seed data needed
>
> *Example: "Create 5 sample invitations in various states (pending, accepted, expired)"*

Wait for response, then:

---

### Step 11: Migration Notes

> **Any migration considerations?**
>
> - [ ] This is a brand new model (simple migration)
> - [ ] Need to populate from existing data
> - [ ] Need to split from existing model
> - [ ] Has default values that need backfilling
>
> *Any special migration steps?*

Wait for response, then:

---

### Step 12: Confirmation

> **Here's the model I'll create:**
>
> ```prisma
> model [ModelName] {
>   id        String   @id @default(cuid())
>   
>   [field1]  [Type]   [modifiers]
>   [field2]  [Type]   [modifiers]
>   
>   // Relations
>   [relation]
>   
>   // Timestamps
>   createdAt DateTime @default(now())
>   updatedAt DateTime @updatedAt
>   
>   // Indexes
>   @@index([field])
>   @@unique([field1, field2])
> }
> ```
>
> **Repository methods:**
> - [method 1]
> - [method 2]
>
> **Soft delete:** [yes/no]
> **Seed data:** [yes/no]
>
> ---
>
> **Does this look correct?**
> - Type `yes` to proceed
> - Type `no` to adjust

Wait for confirmation, then proceed.

---

## Implementation Order

1. **Add to schema** - `prisma/schema.prisma`
2. **Generate migration** - `npx prisma migrate dev --name add_[model]`
3. **Create repository** - `repositories/[model]-repository.ts`
4. **Create types** - `types/[model].ts` (if needed)
5. **Add seed data** - `prisma/seed.ts` (if needed)
6. **Create service methods** - (if model needs business logic)