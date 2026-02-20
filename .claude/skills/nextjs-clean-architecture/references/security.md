# Security Architecture

## Table of Contents
- [Authentication Flow](#authentication-flow)
- [Authorization (RBAC)](#authorization-rbac)
- [Input Validation](#input-validation)
- [Rate Limiting](#rate-limiting)

## Authentication Flow

```typescript
// src/lib/auth/index.ts

import { auth, currentUser } from '@clerk/nextjs/server'
import { cache } from 'react'

// Cached user fetch (deduplicated per request)
export const getCurrentUser = cache(async () => {
  const user = await currentUser()

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    name: `${user.firstName} ${user.lastName}`.trim(),
    imageUrl: user.imageUrl,
  }
})

// For middleware/API routes
export function getAuth() {
  return auth()
}

// Require auth (throws if not authenticated)
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new AuthenticationError()
  }

  return user
}
```

## Authorization (RBAC)

```typescript
// src/lib/auth/permissions.ts

export type Permission =
  | 'project:create'
  | 'project:read'
  | 'project:update'
  | 'project:delete'
  | 'team:manage'
  | 'billing:manage'

export type Role = 'owner' | 'admin' | 'member' | 'viewer'

const rolePermissions: Record<Role, Permission[]> = {
  owner: [
    'project:create', 'project:read', 'project:update', 'project:delete',
    'team:manage', 'billing:manage',
  ],
  admin: [
    'project:create', 'project:read', 'project:update', 'project:delete',
    'team:manage',
  ],
  member: [
    'project:create', 'project:read', 'project:update',
  ],
  viewer: [
    'project:read',
  ],
}

export async function hasPermission(
  userId: string,
  permission: Permission,
  resourceId?: string
): Promise<boolean> {
  const role = await getUserRole(userId, resourceId)

  if (!role) return false

  return rolePermissions[role].includes(permission)
}

export async function requirePermission(
  userId: string,
  permission: Permission,
  resourceId?: string
): Promise<void> {
  const allowed = await hasPermission(userId, permission, resourceId)

  if (!allowed) {
    throw new AuthorizationError()
  }
}
```

## Input Validation

### Schema Definition

```typescript
// src/types/project.ts

import { z } from 'zod'

// Schemas
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
    .regex(/^[a-zA-Z0-9-_ ]+$/, 'Name contains invalid characters'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
})

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['active', 'archived']).optional(),
})

// Types derived from schemas
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>

// Entity type (from database)
export interface Project {
  id: string
  name: string
  description: string | null
  status: 'active' | 'archived' | 'deleted'
  ownerId: string
  owner?: {
    id: string
    name: string
    email: string
  }
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
```

### Validation in Actions

Always validate at the action layer:

```typescript
export async function createProjectAction(input: z.infer<typeof createProjectSchema>) {
  try {
    const user = await getCurrentUser()
    if (!user) throw new ActionError('UNAUTHORIZED', 'Must be logged in')

    // Validate input - throws ZodError if invalid
    const validated = createProjectSchema.parse(input)

    // ... rest of action
  } catch (error) {
    return handleActionError(error) // Handles ZodError gracefully
  }
}
```

## Rate Limiting

```typescript
// src/lib/utils/rate-limit.ts

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { RateLimitError } from './errors'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Different rate limiters for different purposes
export const rateLimiters = {
  // General API: 100 requests per minute
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
  }),

  // Auth: 10 attempts per minute
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
  }),

  // Expensive operations: 5 per minute
  expensive: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: true,
  }),
}

export async function checkRateLimit(
  identifier: string,
  type: keyof typeof rateLimiters = 'api'
): Promise<void> {
  const { success, remaining, reset } = await rateLimiters[type].limit(identifier)

  if (!success) {
    throw new RateLimitError(
      `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`
    )
  }
}
```

### Rate Limiting in Actions

```typescript
export async function expensiveAction(input: Input) {
  try {
    const user = await getCurrentUser()
    if (!user) throw new ActionError('UNAUTHORIZED', 'Must be logged in')

    // Rate limit expensive operations
    await checkRateLimit(user.id, 'expensive')

    // ... rest of action
  } catch (error) {
    return handleActionError(error)
  }
}
```

## Security Checklist

Before any mutation:

- [ ] User authenticated (`getCurrentUser()`)
- [ ] User authorized for action (`hasPermission()`)
- [ ] Input validated with Zod schema
- [ ] Rate limiting applied (where appropriate)
- [ ] Queries scoped by user/tenant
- [ ] No secrets in code
- [ ] No trust in client-provided identity