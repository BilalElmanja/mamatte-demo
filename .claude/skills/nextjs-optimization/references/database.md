# Database Optimization

## Query Optimization

### Select Only What You Need

```typescript
// ❌ Bad - fetches all columns
const users = await prisma.user.findMany()

// ✅ Good - fetches only needed columns
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    avatarUrl: true
  }
})

// Result: Smaller payload, faster query, less memory
```

### Use Proper Indexes

```prisma
// schema.prisma

model Project {
  id          String   @id @default(cuid())
  name        String
  status      String
  ownerId     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  owner       User     @relation(fields: [ownerId], references: [id])

  // ✅ Single column indexes for common lookups
  @@index([ownerId])
  @@index([status])
  @@index([createdAt])
  
  // ✅ Composite index for filtered + sorted queries
  @@index([ownerId, status])
  @@index([status, createdAt])
}

model Task {
  id          String   @id @default(cuid())
  projectId   String
  assigneeId  String?
  status      String
  dueDate     DateTime?
  
  // ✅ Index for common query patterns
  @@index([projectId, status])
  @@index([assigneeId, status])
  @@index([dueDate])
}
```

### When to Add Indexes

```typescript
// Add index when you frequently:

// 1. Filter by a column
await prisma.project.findMany({
  where: { ownerId: userId }  // ← Index ownerId
})

// 2. Sort by a column
await prisma.project.findMany({
  orderBy: { createdAt: 'desc' }  // ← Index createdAt
})

// 3. Filter + Sort together
await prisma.project.findMany({
  where: { status: 'active' },
  orderBy: { createdAt: 'desc' }  // ← Composite index [status, createdAt]
})

// 4. Join on a column (already indexed via @relation)
await prisma.project.findMany({
  include: { owner: true }  // ← ownerId already indexed
})
```

## N+1 Query Prevention

### The Problem

```typescript
// ❌ N+1 Problem - 1 query + N additional queries
const projects = await prisma.project.findMany()  // 1 query

for (const project of projects) {
  // Each iteration = 1 query (N queries total)
  const owner = await prisma.user.findUnique({
    where: { id: project.ownerId }
  })
  project.owner = owner
}
// Total: 1 + N queries (if 100 projects = 101 queries!)
```

### The Solution: Include

```typescript
// ✅ Single query with JOIN
const projects = await prisma.project.findMany({
  include: {
    owner: {
      select: { id: true, name: true, avatarUrl: true }
    }
  }
})
// Total: 1 query
```

### Nested Includes

```typescript
// ✅ Multiple levels in one query
const projects = await prisma.project.findMany({
  include: {
    owner: {
      select: { id: true, name: true }
    },
    tasks: {
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        assignee: {
          select: { id: true, name: true }
        }
      }
    },
    _count: {
      select: { tasks: true, members: true }
    }
  }
})
```

### Batch Queries with $transaction

```typescript
// ✅ Multiple queries in single round-trip
const [projects, stats, recentActivity] = await prisma.$transaction([
  prisma.project.findMany({ where: { ownerId: userId } }),
  prisma.project.aggregate({
    where: { ownerId: userId },
    _count: true,
    _sum: { budget: true }
  }),
  prisma.activity.findMany({
    where: { userId },
    take: 10,
    orderBy: { createdAt: 'desc' }
  })
])
```

## Pagination

### Cursor-Based (Recommended for Large Datasets)

```typescript
// ✅ Cursor pagination - consistent performance
async function getProjects(cursor?: string, limit = 20) {
  const projects = await prisma.project.findMany({
    take: limit + 1,  // Fetch one extra to check if more exist
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1  // Skip the cursor itself
    }),
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      createdAt: true
    }
  })
  
  const hasMore = projects.length > limit
  const items = hasMore ? projects.slice(0, -1) : projects
  const nextCursor = hasMore ? items[items.length - 1].id : null
  
  return { items, nextCursor, hasMore }
}

// Usage
const page1 = await getProjects()
const page2 = await getProjects(page1.nextCursor)
```

### Offset-Based (Simple, for Small Datasets)

```typescript
// Offset pagination - simpler but slower for large offsets
async function getProjects(page = 1, limit = 20) {
  const skip = (page - 1) * limit
  
  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.project.count()
  ])
  
  return {
    items: projects,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore: skip + projects.length < total
  }
}
```

## Aggregations

### Efficient Counting

```typescript
// ✅ Count without fetching data
const projectCount = await prisma.project.count({
  where: { ownerId: userId }
})

// ✅ Multiple counts in one query
const stats = await prisma.project.groupBy({
  by: ['status'],
  where: { ownerId: userId },
  _count: true
})
// Result: [{ status: 'active', _count: 5 }, { status: 'archived', _count: 3 }]
```

### Aggregate Functions

```typescript
// ✅ Sum, avg, min, max in one query
const projectStats = await prisma.project.aggregate({
  where: { ownerId: userId },
  _count: true,
  _sum: { budget: true },
  _avg: { budget: true },
  _max: { updatedAt: true }
})
```

## Connection Pooling

### Configure for Serverless

```env
# Connection string with pooling parameters
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=10"

# For PgBouncer or similar
DATABASE_URL="postgresql://user:pass@pgbouncer:6432/db?pgbouncer=true"
```

### Prisma Configuration

```typescript
// lib/db/index.ts
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

## Query Performance Monitoring

### Log Slow Queries

```typescript
// lib/db/index.ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' }
  ]
})

// Log queries taking > 100ms
prisma.$on('query', (e) => {
  if (e.duration > 100) {
    console.warn(`Slow query (${e.duration}ms):`, e.query)
  }
})
```

### Explain Analyze

```typescript
// Check query execution plan
const explain = await prisma.$queryRaw`
  EXPLAIN ANALYZE 
  SELECT * FROM "Project" 
  WHERE "ownerId" = ${userId} 
  ORDER BY "createdAt" DESC 
  LIMIT 20
`
console.log(explain)
```

## Common Patterns

### Soft Delete with Efficient Queries

```prisma
model Project {
  id        String    @id @default(cuid())
  deletedAt DateTime?
  
  @@index([deletedAt])  // Index for filtering
}
```

```typescript
// Repository pattern for soft delete
export const projectRepository = {
  findMany: (where: Prisma.ProjectWhereInput) => 
    prisma.project.findMany({
      where: { ...where, deletedAt: null }
    }),
    
  softDelete: (id: string) =>
    prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() }
    })
}
```

### Upsert Pattern

```typescript
// ✅ Create or update in single query
const subscription = await prisma.subscription.upsert({
  where: { userId },
  create: {
    userId,
    plan: 'free',
    status: 'active'
  },
  update: {
    plan: newPlan,
    status: 'active'
  }
})
```

### Atomic Updates

```typescript
// ✅ Increment without race conditions
await prisma.project.update({
  where: { id: projectId },
  data: {
    viewCount: { increment: 1 }
  }
})

// ✅ Conditional update
await prisma.project.updateMany({
  where: { 
    id: projectId,
    version: currentVersion  // Optimistic locking
  },
  data: {
    name: newName,
    version: { increment: 1 }
  }
})
```

## Anti-Patterns

### ❌ Fetching to Count

```typescript
// ❌ Bad - fetches all data just to count
const projects = await prisma.project.findMany({ where: { ownerId: userId } })
const count = projects.length

// ✅ Good - count query
const count = await prisma.project.count({ where: { ownerId: userId } })
```

### ❌ Fetching Then Filtering in JS

```typescript
// ❌ Bad - fetches all, filters in JS
const allProjects = await prisma.project.findMany()
const activeProjects = allProjects.filter(p => p.status === 'active')

// ✅ Good - filter in database
const activeProjects = await prisma.project.findMany({
  where: { status: 'active' }
})
```

### ❌ Missing Pagination

```typescript
// ❌ Bad - fetches unlimited rows
const projects = await prisma.project.findMany()

// ✅ Good - always paginate
const projects = await prisma.project.findMany({
  take: 20,
  orderBy: { createdAt: 'desc' }
})
```

### ❌ Over-Including Relations

```typescript
// ❌ Bad - includes everything
const project = await prisma.project.findUnique({
  where: { id },
  include: {
    owner: true,
    tasks: true,
    members: true,
    comments: true,
    files: true,
    activity: true
  }
})

// ✅ Good - include only what's needed for this view
const project = await prisma.project.findUnique({
  where: { id },
  include: {
    owner: { select: { id: true, name: true } },
    _count: { select: { tasks: true, members: true } }
  }
})
```