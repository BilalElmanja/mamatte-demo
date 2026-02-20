# Repository Pattern

## Table of Contents
- [Repository Structure](#repository-structure)
- [Base Repository](#base-repository)
- [Typed Repositories](#typed-repositories)
- [Repository with Soft Delete](#repository-with-soft-delete)
- [Testing Repositories](#testing-repositories)

## Repository Structure

### File Organization

```
src/
├── repositories/
│   ├── index.ts              # Export all repositories
│   ├── base-repository.ts    # Optional base class
│   ├── user-repository.ts
│   ├── project-repository.ts
│   └── team-repository.ts
├── services/
│   └── project-service.ts    # Uses repositories
└── lib/
    └── db.ts                 # Prisma client
```

### Export Pattern

```typescript
// repositories/index.ts
export { userRepository } from './user-repository'
export { projectRepository } from './project-repository'
export { teamRepository } from './team-repository'
```

## Base Repository

### Simple Repositories (Recommended)

```typescript
// repositories/user-repository.ts
import { prisma } from '@/lib/db'
import type { Prisma } from '@prisma/client'

export const userRepository = {
  findById: (id: string) =>
    prisma.user.findUnique({ where: { id } }),

  findByClerkId: (clerkId: string) =>
    prisma.user.findUnique({ where: { clerkId } }),

  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  findMany: (where?: Prisma.UserWhereInput) =>
    prisma.user.findMany({ where }),

  create: (data: Prisma.UserCreateInput) =>
    prisma.user.create({ data }),

  update: (id: string, data: Prisma.UserUpdateInput) =>
    prisma.user.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.user.delete({ where: { id } }),
}
```

### Project Repository

```typescript
// repositories/project-repository.ts
import { prisma } from '@/lib/db'
import type { Prisma } from '@prisma/client'

export const projectRepository = {
  findById: (id: string) =>
    prisma.project.findUnique({
      where: { id },
      include: { owner: true },
    }),

  findByOwner: (ownerId: string) =>
    prisma.project.findMany({
      where: { ownerId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    }),

  findByTeam: (teamId: string) =>
    prisma.project.findMany({
      where: { teamId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { owner: { select: { id: true, name: true } } },
    }),

  search: (query: string, ownerId: string) =>
    prisma.project.findMany({
      where: {
        ownerId,
        deletedAt: null,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    }),

  create: (data: Prisma.ProjectCreateInput) =>
    prisma.project.create({ data }),

  update: (id: string, data: Prisma.ProjectUpdateInput) =>
    prisma.project.update({ where: { id }, data }),

  delete: (id: string) =>
    prisma.project.delete({ where: { id } }),

  count: (ownerId: string) =>
    prisma.project.count({ where: { ownerId, deletedAt: null } }),
}
```

## Typed Repositories

### With Full Type Safety

```typescript
// repositories/project-repository.ts
import { prisma } from '@/lib/db'
import type { Project, Prisma } from '@prisma/client'

// Define return types for complex queries
type ProjectWithOwner = Prisma.ProjectGetPayload<{
  include: { owner: true }
}>

type ProjectSummary = Prisma.ProjectGetPayload<{
  select: { id: true; name: true; status: true }
}>

export const projectRepository = {
  findById: async (id: string): Promise<ProjectWithOwner | null> =>
    prisma.project.findUnique({
      where: { id },
      include: { owner: true },
    }),

  findSummaries: async (ownerId: string): Promise<ProjectSummary[]> =>
    prisma.project.findMany({
      where: { ownerId },
      select: { id: true, name: true, status: true },
    }),

  create: async (data: Prisma.ProjectCreateInput): Promise<Project> =>
    prisma.project.create({ data }),
}
```

### Generic Repository Type

```typescript
// types/repository.ts
import type { Prisma } from '@prisma/client'

export interface Repository<T, CreateInput, UpdateInput, WhereInput> {
  findById(id: string): Promise<T | null>
  findMany(where?: WhereInput): Promise<T[]>
  create(data: CreateInput): Promise<T>
  update(id: string, data: UpdateInput): Promise<T>
  delete(id: string): Promise<T>
}
```

## Repository with Soft Delete

```typescript
// repositories/project-repository.ts
import { prisma } from '@/lib/db'
import type { Prisma } from '@prisma/client'

export const projectRepository = {
  // Always exclude soft-deleted
  findById: (id: string) =>
    prisma.project.findFirst({
      where: { id, deletedAt: null },
    }),

  findMany: (where: Prisma.ProjectWhereInput = {}) =>
    prisma.project.findMany({
      where: { ...where, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    }),

  // Include soft-deleted (admin only)
  findManyIncludeDeleted: (where: Prisma.ProjectWhereInput = {}) =>
    prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    }),

  // Only soft-deleted
  findDeleted: (ownerId: string) =>
    prisma.project.findMany({
      where: { ownerId, deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
    }),

  create: (data: Prisma.ProjectCreateInput) =>
    prisma.project.create({ data }),

  update: (id: string, data: Prisma.ProjectUpdateInput) =>
    prisma.project.update({
      where: { id },
      data,
    }),

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

  // Count active only
  count: (ownerId: string) =>
    prisma.project.count({
      where: { ownerId, deletedAt: null },
    }),
}
```

## Using in Services

```typescript
// services/project-service.ts
import { projectRepository } from '@/repositories'
import type { Prisma } from '@prisma/client'

export const projectService = {
  async createProject(
    ownerId: string,
    data: { name: string; description?: string }
  ) {
    // Business validation
    const existingCount = await projectRepository.count(ownerId)
    if (existingCount >= 10) {
      throw new Error('Project limit reached')
    }

    // Create via repository
    return projectRepository.create({
      name: data.name,
      description: data.description,
      owner: { connect: { id: ownerId } },
    })
  },

  async deleteProject(projectId: string, userId: string) {
    const project = await projectRepository.findById(projectId)
    
    if (!project) {
      throw new Error('Project not found')
    }

    if (project.ownerId !== userId) {
      throw new Error('Not authorized')
    }

    // Soft delete
    return projectRepository.softDelete(projectId)
  },
}
```

## Testing Repositories

### Mock Prisma Client

```typescript
// __tests__/repositories/project-repository.test.ts
import { prismaMock } from '@/lib/__mocks__/prisma'
import { projectRepository } from '@/repositories/project-repository'

// Setup mock
jest.mock('@/lib/db', () => ({
  prisma: prismaMock,
}))

describe('projectRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('finds project by id', async () => {
    const mockProject = {
      id: 'project_1',
      name: 'Test Project',
      ownerId: 'user_1',
    }

    prismaMock.project.findFirst.mockResolvedValue(mockProject)

    const result = await projectRepository.findById('project_1')

    expect(result).toEqual(mockProject)
    expect(prismaMock.project.findFirst).toHaveBeenCalledWith({
      where: { id: 'project_1', deletedAt: null },
    })
  })

  it('creates project', async () => {
    const input = {
      name: 'New Project',
      owner: { connect: { id: 'user_1' } },
    }

    prismaMock.project.create.mockResolvedValue({
      id: 'project_2',
      name: 'New Project',
      ownerId: 'user_1',
    })

    const result = await projectRepository.create(input)

    expect(result.name).toBe('New Project')
  })
})
```

### Prisma Mock Setup

```typescript
// lib/__mocks__/prisma.ts
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

export const prismaMock = mockDeep<PrismaClient>()

beforeEach(() => {
  mockReset(prismaMock)
})
```