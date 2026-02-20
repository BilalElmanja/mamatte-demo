---
name: prisma-database
description: "Prisma ORM patterns for Next.js applications. Use when designing database schemas, writing queries, handling relations, implementing soft deletes, optimizing performance, or setting up migrations. Covers schema design, repository pattern, transactions, and common SaaS data models."
---

# Prisma Database Patterns

## When to Read Which Reference

| Task | Read This |
|------|-----------|
| Setting up Prisma | This file (Quick Start below) |
| Designing schemas & relations | [references/schema-design.md](references/schema-design.md) |
| Writing queries (CRUD, filters, pagination) | [references/queries.md](references/queries.md) |
| Repository pattern integration | [references/repositories.md](references/repositories.md) |
| SaaS models (users, teams, subscriptions) | [references/saas-models.md](references/saas-models.md) |

## Quick Start

### 1. Install

```bash
npm install prisma @prisma/client
npx prisma init
```

### 2. Configure Database

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

### 3. Create Prisma Client Singleton

```typescript
// src/lib/db/index.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

### 4. Basic Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  name      String?
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  projects  Project[]

  @@index([clerkId])
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([ownerId])
}
```

### 5. Run Migration

```bash
npx prisma migrate dev --name init
```

## Clean Architecture Integration

Prisma lives in the INFRASTRUCTURE layer. Data flows through layers:

```
┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION: Pages call actions, display data              │
│ Location: src/app/, src/components/                         │
├─────────────────────────────────────────────────────────────┤
│ APPLICATION: Server actions call services                   │
│ Location: src/actions/                                      │
├─────────────────────────────────────────────────────────────┤
│ DOMAIN: Services contain business logic, call repositories  │
│ Location: src/services/                                     │
├─────────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE: Repositories wrap Prisma, pure data access  │
│ Location: src/repositories/, src/lib/db/                    │
└─────────────────────────────────────────────────────────────┘
```

## File Structure (Clean Architecture)

```
src/
├── app/                            # PRESENTATION
│   └── (dashboard)/projects/
│       └── page.tsx                # Fetches via server component
├── actions/                        # APPLICATION
│   └── project-actions.ts          # Calls services, handles auth
├── services/                       # DOMAIN
│   └── project-service.ts          # Business logic, calls repositories
├── repositories/                   # INFRASTRUCTURE
│   ├── index.ts                    # Export all repositories
│   ├── user-repository.ts
│   └── project-repository.ts
├── lib/
│   └── db/                         # INFRASTRUCTURE
│       └── index.ts                # Prisma client singleton
├── types/                          # DOMAIN
│   ├── project.ts                  # Zod schemas & types
│   └── user.ts
└── prisma/
    ├── schema.prisma
    └── migrations/
```

## Repository Pattern (Infrastructure Layer)

Repositories abstract ALL database access. Services call repositories, never Prisma directly.

```typescript
// src/repositories/project-repository.ts
import { prisma } from '@/lib/db'
import type { Prisma } from '@prisma/client'

export const projectRepository = {
  findById: (id: string) =>
    prisma.project.findUnique({ where: { id } }),

  findByOwner: (ownerId: string) =>
    prisma.project.findMany({ 
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    }),

  create: (data: Prisma.ProjectCreateInput) =>
    prisma.project.create({ data }),

  update: (id: string, data: Prisma.ProjectUpdateInput) =>
    prisma.project.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.project.delete({ where: { id } }),

  count: (ownerId: string) =>
    prisma.project.count({ where: { ownerId } }),
}
```

## Service Pattern (Domain Layer)

Services contain ALL business logic. They call repositories, not Prisma.

```typescript
// src/services/project-service.ts
import { projectRepository } from '@/repositories/project-repository'
import { subscriptionRepository } from '@/repositories/subscription-repository'
import type { CreateProjectInput } from '@/types/project'

export const projectService = {
  async create(userId: string, input: CreateProjectInput) {
    // Business Rule: Check plan limits
    const subscription = await subscriptionRepository.findByUserId(userId)
    const count = await projectRepository.count(userId)
    const limit = subscription?.plan === 'pro' ? 50 : 5
    
    if (count >= limit) {
      throw new Error(`Project limit (${limit}) reached`)
    }

    // Business Rule: Reserved names
    if (['admin', 'api', 'system'].includes(input.name.toLowerCase())) {
      throw new Error('Reserved name')
    }

    // Create via repository (not Prisma directly)
    return projectRepository.create({
      ...input,
      owner: { connect: { id: userId } },
    })
  },

  async getByOwner(userId: string) {
    return projectRepository.findByOwner(userId)
  },
}
```

## Server Action Pattern (Application Layer)

Actions handle auth and call services. They never call Prisma or repositories directly.

```typescript
// src/actions/project-actions.ts
'use server'

import { requireAuth } from '@/lib/auth'
import { projectService } from '@/services/project-service'
import { createProjectSchema } from '@/types/project'
import { revalidatePath } from 'next/cache'

export async function createProjectAction(input: unknown) {
  // 1. Auth (application concern)
  const user = await requireAuth()

  // 2. Validate (application concern)
  const validated = createProjectSchema.parse(input)

  // 3. Execute (delegate to service)
  const project = await projectService.create(user.id, validated)

  // 4. Revalidate (application concern)
  revalidatePath('/dashboard/projects')

  return { success: true, data: project }
}
```

## Schema Design Rules

| Rule | Example |
|------|---------|
| Use `cuid()` for IDs | `@id @default(cuid())` |
| Always add timestamps | `createdAt DateTime @default(now())` |
| Index all foreign keys | `@@index([ownerId])` |
| Index frequently queried fields | `@@index([email])` |
| Use `onDelete: Cascade` carefully | Only for owned entities |
| Add soft delete when needed | `deletedAt DateTime?` |

## Common Commands

```bash
npx prisma generate        # Generate client
npx prisma migrate dev     # Create migration
npx prisma migrate reset   # Reset database
npx prisma studio          # Open GUI
npx prisma db push         # Push without migration
```

## Type Safety

```typescript
import type { User, Project, Prisma } from '@prisma/client'

// With relations
type ProjectWithOwner = Prisma.ProjectGetPayload<{
  include: { owner: true }
}>

// Specific fields
type ProjectSummary = Prisma.ProjectGetPayload<{
  select: { id: true; name: true }
}>
```

## Key Rules

1. **Prisma client in `lib/db/`** - Singleton, infrastructure layer
2. **Repositories wrap Prisma** - Pure data access, no business logic
3. **Services call repositories** - Never import Prisma in services
4. **Actions call services** - Never call repositories directly
5. **Types in `types/`** - Zod schemas and TypeScript types