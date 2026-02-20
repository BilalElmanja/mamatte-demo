# Prisma Queries

## Table of Contents
- [CRUD Operations](#crud-operations)
- [Filtering](#filtering)
- [Sorting & Pagination](#sorting--pagination)
- [Relations](#relations)
- [Aggregations](#aggregations)
- [Transactions](#transactions)
- [Raw Queries](#raw-queries)

## CRUD Operations

### Create

```typescript
// Single record
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
})

// With relation
const project = await prisma.project.create({
  data: {
    name: 'My Project',
    owner: { connect: { id: userId } },
  },
})

// Create many
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com' },
    { email: 'user2@example.com' },
  ],
  skipDuplicates: true,
})
```

### Read

```typescript
// Find by ID
const user = await prisma.user.findUnique({
  where: { id: 'user_123' },
})

// Find by unique field
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
})

// Find first matching
const project = await prisma.project.findFirst({
  where: { ownerId: userId, status: 'active' },
})

// Find many
const projects = await prisma.project.findMany({
  where: { ownerId: userId },
})

// Find or throw
const user = await prisma.user.findUniqueOrThrow({
  where: { id: 'user_123' },
})
```

### Update

```typescript
// Update one
const user = await prisma.user.update({
  where: { id: 'user_123' },
  data: { name: 'New Name' },
})

// Update many
const count = await prisma.project.updateMany({
  where: { ownerId: userId },
  data: { status: 'archived' },
})

// Upsert (create or update)
const user = await prisma.user.upsert({
  where: { email: 'user@example.com' },
  create: { email: 'user@example.com', name: 'New User' },
  update: { name: 'Updated Name' },
})
```

### Delete

```typescript
// Delete one
await prisma.project.delete({
  where: { id: 'project_123' },
})

// Delete many
const count = await prisma.project.deleteMany({
  where: { ownerId: userId, status: 'archived' },
})
```

## Filtering

### Basic Filters

```typescript
// Equals
await prisma.user.findMany({
  where: { role: 'admin' },
})

// Not equals
await prisma.user.findMany({
  where: { role: { not: 'admin' } },
})

// In array
await prisma.user.findMany({
  where: { role: { in: ['admin', 'member'] } },
})

// Not in array
await prisma.user.findMany({
  where: { role: { notIn: ['viewer'] } },
})
```

### String Filters

```typescript
await prisma.user.findMany({
  where: {
    name: { contains: 'john' },         // Contains
    email: { startsWith: 'admin' },     // Starts with
    name: { endsWith: 'doe' },          // Ends with
    email: { contains: 'test', mode: 'insensitive' },  // Case insensitive
  },
})
```

### Number Filters

```typescript
await prisma.product.findMany({
  where: {
    price: { gt: 100 },      // Greater than
    price: { gte: 100 },     // Greater than or equal
    price: { lt: 1000 },     // Less than
    price: { lte: 1000 },    // Less than or equal
  },
})
```

### Date Filters

```typescript
await prisma.project.findMany({
  where: {
    createdAt: { gte: new Date('2024-01-01') },
    createdAt: { lt: new Date('2024-12-31') },
  },
})
```

### Logical Operators

```typescript
// AND (implicit)
await prisma.user.findMany({
  where: {
    role: 'admin',
    isActive: true,
  },
})

// AND (explicit)
await prisma.user.findMany({
  where: {
    AND: [
      { role: 'admin' },
      { isActive: true },
    ],
  },
})

// OR
await prisma.user.findMany({
  where: {
    OR: [
      { role: 'admin' },
      { role: 'member' },
    ],
  },
})

// NOT
await prisma.user.findMany({
  where: {
    NOT: { role: 'viewer' },
  },
})
```

### Null Checks

```typescript
// Is null
await prisma.user.findMany({
  where: { deletedAt: null },
})

// Is not null
await prisma.user.findMany({
  where: { deletedAt: { not: null } },
})
```

### Relation Filters

```typescript
// Has related records
await prisma.user.findMany({
  where: {
    projects: { some: { status: 'active' } },
  },
})

// All related match
await prisma.user.findMany({
  where: {
    projects: { every: { status: 'completed' } },
  },
})

// No related records
await prisma.user.findMany({
  where: {
    projects: { none: { status: 'active' } },
  },
})
```

## Sorting & Pagination

### Sorting

```typescript
// Single field
await prisma.project.findMany({
  orderBy: { createdAt: 'desc' },
})

// Multiple fields
await prisma.project.findMany({
  orderBy: [
    { status: 'asc' },
    { createdAt: 'desc' },
  ],
})

// By relation
await prisma.project.findMany({
  orderBy: { owner: { name: 'asc' } },
})
```

### Pagination

```typescript
// Offset pagination
await prisma.project.findMany({
  skip: 20,      // Skip first 20
  take: 10,      // Take 10
  orderBy: { createdAt: 'desc' },
})

// Cursor pagination (better for large datasets)
await prisma.project.findMany({
  take: 10,
  cursor: { id: lastProjectId },
  skip: 1,  // Skip the cursor
  orderBy: { createdAt: 'desc' },
})
```

### Pagination Helper

```typescript
interface PaginationParams {
  page?: number
  limit?: number
}

async function getPaginatedProjects({ page = 1, limit = 10 }: PaginationParams) {
  const skip = (page - 1) * limit

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.project.count(),
  ])

  return {
    data: projects,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}
```

## Relations

### Include Relations

```typescript
// Include single relation
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { projects: true },
})

// Nested include
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    projects: {
      include: { tasks: true },
    },
  },
})

// Include with filter
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    projects: {
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      take: 5,
    },
  },
})
```

### Select Specific Fields

```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    name: true,
    email: true,
    projects: {
      select: { id: true, name: true },
    },
  },
})
```

## Aggregations

```typescript
// Count
const count = await prisma.project.count({
  where: { ownerId: userId },
})

// Aggregate
const stats = await prisma.product.aggregate({
  _avg: { price: true },
  _sum: { quantity: true },
  _min: { price: true },
  _max: { price: true },
  _count: true,
})

// Group by
const byStatus = await prisma.project.groupBy({
  by: ['status'],
  _count: { id: true },
})
```

## Transactions

### Sequential Transactions

```typescript
const [user, project] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'user@example.com' } }),
  prisma.project.create({ data: { name: 'Project', ownerId: 'temp' } }),
])
```

### Interactive Transactions

```typescript
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'user@example.com' },
  })

  const project = await tx.project.create({
    data: {
      name: 'My Project',
      ownerId: user.id,
    },
  })

  return { user, project }
})
```

### With Timeout

```typescript
await prisma.$transaction(
  async (tx) => {
    // Long running operations
  },
  {
    maxWait: 5000,    // Max wait to acquire connection
    timeout: 10000,   // Max transaction duration
  }
)
```

## Raw Queries

```typescript
// Raw query (PostgreSQL)
const users = await prisma.$queryRaw`
  SELECT * FROM "User" WHERE email LIKE ${`%${search}%`}
`

// Raw execute
await prisma.$executeRaw`
  UPDATE "Project" SET status = 'archived' WHERE "createdAt" < ${date}
`
```