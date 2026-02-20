# Performance & Optimization

## Table of Contents
- [Connection Management](#connection-management)
- [Query Optimization](#query-optimization)
- [N+1 Problem](#n1-problem)
- [Indexing Strategy](#indexing-strategy)
- [Caching Patterns](#caching-patterns)

## Connection Management

### Singleton Pattern (Required)

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

### Connection Pooling (Serverless)

```env
# For serverless (Vercel, etc.)
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=1"

# Direct connection for migrations
DIRECT_DATABASE_URL="postgresql://user:pass@host:5432/db"
```

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}
```

## Query Optimization

### Select Only Needed Fields

```typescript
// ❌ Bad: Fetches all fields
const users = await prisma.user.findMany()

// ✅ Good: Only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
})
```

### Use findFirst for Single Results

```typescript
// ❌ Slower: Fetches all, takes first
const projects = await prisma.project.findMany({
  where: { ownerId, status: 'active' },
  take: 1,
})
const project = projects[0]

// ✅ Faster: Stops at first match
const project = await prisma.project.findFirst({
  where: { ownerId, status: 'active' },
})
```

### Batch Operations

```typescript
// ❌ Bad: Multiple queries
for (const id of projectIds) {
  await prisma.project.update({
    where: { id },
    data: { status: 'archived' },
  })
}

// ✅ Good: Single query
await prisma.project.updateMany({
  where: { id: { in: projectIds } },
  data: { status: 'archived' },
})
```

### Parallel Queries

```typescript
// ❌ Sequential
const users = await prisma.user.findMany()
const projects = await prisma.project.findMany()
const teams = await prisma.team.findMany()

// ✅ Parallel
const [users, projects, teams] = await Promise.all([
  prisma.user.findMany(),
  prisma.project.findMany(),
  prisma.team.findMany(),
])
```

## N+1 Problem

### The Problem

```typescript
// ❌ N+1: 1 query for projects + N queries for owners
const projects = await prisma.project.findMany()

for (const project of projects) {
  const owner = await prisma.user.findUnique({
    where: { id: project.ownerId },
  })
  console.log(project.name, owner.name)
}
```

### The Solution: Include

```typescript
// ✅ Single query with join
const projects = await prisma.project.findMany({
  include: { owner: true },
})

for (const project of projects) {
  console.log(project.name, project.owner.name)
}
```

### Nested Includes

```typescript
// ✅ All in one query
const teams = await prisma.team.findMany({
  include: {
    members: {
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    },
    projects: {
      where: { deletedAt: null },
      take: 5,
    },
  },
})
```

## Indexing Strategy

### What to Index

```prisma
model Project {
  id          String    @id @default(cuid())
  name        String
  status      String
  ownerId     String
  teamId      String?
  createdAt   DateTime  @default(now())
  deletedAt   DateTime?
  
  // 1. Always index foreign keys
  @@index([ownerId])
  @@index([teamId])
  
  // 2. Index fields in WHERE clauses
  @@index([status])
  @@index([deletedAt])
  
  // 3. Compound index for common query patterns
  @@index([ownerId, status])
  @@index([teamId, deletedAt, createdAt])
}
```

### Check Query Performance

```typescript
// Enable query logging
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query:', e.query)
  console.log('Duration:', e.duration, 'ms')
})
```

## Caching Patterns

### React Cache (Request Deduplication)

```typescript
// lib/queries.ts
import { cache } from 'react'
import { prisma } from '@/lib/db'

// Deduplicated within same request
export const getUser = cache(async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
  })
})

export const getProjects = cache(async (ownerId: string) => {
  return prisma.project.findMany({
    where: { ownerId, deletedAt: null },
  })
})
```

### Unstable Cache (Cross-Request)

```typescript
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/db'

export const getCachedTeam = unstable_cache(
  async (teamSlug: string) => {
    return prisma.team.findUnique({
      where: { slug: teamSlug },
      include: { subscription: true },
    })
  },
  ['team'],
  { revalidate: 60, tags: ['team'] }
)

// Invalidate when team updates
import { revalidateTag } from 'next/cache'

export async function updateTeam(teamId: string, data: any) {
  const team = await prisma.team.update({
    where: { id: teamId },
    data,
  })
  revalidateTag('team')
  return team
}
```

### Count Caching

```typescript
// Cache expensive counts
export const getProjectCount = unstable_cache(
  async (ownerId: string) => {
    return prisma.project.count({
      where: { ownerId, deletedAt: null },
    })
  },
  ['project-count'],
  { revalidate: 300 }
)
```

## Pagination Performance

### Cursor Pagination (Large Datasets)

```typescript
async function getProjectsCursor(cursor?: string, limit = 20) {
  const projects = await prisma.project.findMany({
    take: limit + 1, // Fetch one extra to check if more exist
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
    orderBy: { createdAt: 'desc' },
  })

  const hasMore = projects.length > limit
  const data = hasMore ? projects.slice(0, -1) : projects
  const nextCursor = hasMore ? data[data.length - 1].id : null

  return { data, nextCursor, hasMore }
}
```

### Offset Pagination (Small Datasets)

```typescript
async function getProjectsOffset(page = 1, limit = 20) {
  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    prisma.project.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.project.count(),
  ])

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
```