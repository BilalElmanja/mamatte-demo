# Schema Design

## Table of Contents
- [Field Types](#field-types)
- [Relations](#relations)
- [Indexes](#indexes)
- [Soft Delete](#soft-delete)
- [Enums](#enums)
- [JSON Fields](#json-fields)

## Field Types

### Common Field Patterns

```prisma
model Example {
  // IDs
  id        String   @id @default(cuid())    // Recommended
  uuid      String   @id @default(uuid())    // Alternative
  autoId    Int      @id @default(autoincrement())  // Sequential

  // Strings
  name      String                           // Required
  bio       String?                          // Optional
  content   String   @db.Text                // Long text

  // Numbers
  count     Int      @default(0)
  price     Decimal  @db.Decimal(10, 2)      // Money
  rating    Float

  // Boolean
  isActive  Boolean  @default(true)

  // Dates
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?                        // Soft delete
  expiresAt DateTime?

  // External IDs
  clerkId   String   @unique                 // Auth provider
  stripeId  String?  @unique                 // Stripe customer

  // Unique constraints
  email     String   @unique
  slug      String   @unique

  // Compound unique
  @@unique([orgId, slug])
}
```

### Default Values

```prisma
model Settings {
  theme       String   @default("light")
  locale      String   @default("en")
  count       Int      @default(0)
  isEnabled   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  metadata    Json     @default("{}")
}
```

## Relations

### One-to-Many

```prisma
model User {
  id       String    @id @default(cuid())
  projects Project[]
}

model Project {
  id      String @id @default(cuid())
  ownerId String
  owner   User   @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  @@index([ownerId])
}
```

### Many-to-Many (Implicit)

```prisma
model Post {
  id       String @id @default(cuid())
  tags     Tag[]
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}
```

### Many-to-Many (Explicit - Recommended for Extra Fields)

```prisma
model User {
  id          String       @id @default(cuid())
  memberships Membership[]
}

model Team {
  id      String       @id @default(cuid())
  members Membership[]
}

model Membership {
  id        String   @id @default(cuid())
  userId    String
  teamId    String
  role      String   @default("member")
  joinedAt  DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  team      Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)

  @@unique([userId, teamId])
  @@index([userId])
  @@index([teamId])
}
```

### Self-Referencing

```prisma
model Category {
  id       String     @id @default(cuid())
  name     String
  parentId String?
  parent   Category?  @relation("CategoryToCategory", fields: [parentId], references: [id])
  children Category[] @relation("CategoryToCategory")

  @@index([parentId])
}
```

### One-to-One

```prisma
model User {
  id      String   @id @default(cuid())
  profile Profile?
}

model Profile {
  id     String @id @default(cuid())
  bio    String?
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Indexes

### When to Index

```prisma
model Project {
  id          String   @id @default(cuid())
  name        String
  slug        String
  status      String
  ownerId     String
  teamId      String?
  createdAt   DateTime @default(now())

  // Always index foreign keys
  @@index([ownerId])
  @@index([teamId])

  // Index fields used in WHERE clauses
  @@index([status])

  // Compound index for common query patterns
  @@index([ownerId, status])
  @@index([teamId, createdAt])

  // Unique compound index
  @@unique([teamId, slug])
}
```

### Index Types

```prisma
model Example {
  id    String @id
  email String @unique              // Unique index
  name  String

  @@index([name])                   // Regular index
  @@unique([field1, field2])        // Compound unique
  @@index([field1, field2])         // Compound index
}
```

## Soft Delete

### Pattern

```prisma
model Project {
  id        String    @id @default(cuid())
  name      String
  deletedAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([deletedAt])
}
```

### Query Helpers

```typescript
// repositories/project-repository.ts
import { prisma } from '@/lib/db'

export const projectRepository = {
  // Exclude soft-deleted by default
  findMany: (where: Prisma.ProjectWhereInput = {}) =>
    prisma.project.findMany({
      where: { ...where, deletedAt: null },
    }),

  // Include soft-deleted (admin)
  findManyIncludeDeleted: (where: Prisma.ProjectWhereInput = {}) =>
    prisma.project.findMany({ where }),

  // Soft delete
  softDelete: (id: string) =>
    prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    }),

  // Restore
  restore: (id: string) =>
    prisma.project.update({
      where: { id },
      data: { deletedAt: null },
    }),

  // Hard delete (permanent)
  hardDelete: (id: string) =>
    prisma.project.delete({ where: { id } }),
}
```

## Enums

### Define Enums

```prisma
enum Role {
  ADMIN
  MEMBER
  VIEWER
}

enum ProjectStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}

model User {
  id   String @id @default(cuid())
  role Role   @default(MEMBER)
}

model Project {
  id     String        @id @default(cuid())
  status ProjectStatus @default(DRAFT)
}
```

### Usage

```typescript
import { Role, ProjectStatus } from '@prisma/client'

await prisma.user.create({
  data: {
    email: 'admin@example.com',
    role: Role.ADMIN,
  },
})

await prisma.project.findMany({
  where: { status: ProjectStatus.ACTIVE },
})
```

## JSON Fields

### Schema

```prisma
model Settings {
  id         String @id @default(cuid())
  userId     String @unique
  preferences Json  @default("{}")
  metadata   Json?
}
```

### Usage

```typescript
// Create with JSON
await prisma.settings.create({
  data: {
    userId: 'user_123',
    preferences: {
      theme: 'dark',
      notifications: { email: true, push: false },
    },
  },
})

// Query JSON fields (PostgreSQL)
await prisma.settings.findMany({
  where: {
    preferences: {
      path: ['theme'],
      equals: 'dark',
    },
  },
})

// Update nested JSON
await prisma.settings.update({
  where: { userId: 'user_123' },
  data: {
    preferences: {
      theme: 'light',
      notifications: { email: false, push: true },
    },
  },
})
```

### Type-Safe JSON

```typescript
// types/settings.ts
interface UserPreferences {
  theme: 'light' | 'dark'
  notifications: {
    email: boolean
    push: boolean
  }
}

// Usage with type assertion
const settings = await prisma.settings.findUnique({
  where: { userId: 'user_123' },
})

const prefs = settings?.preferences as UserPreferences
```