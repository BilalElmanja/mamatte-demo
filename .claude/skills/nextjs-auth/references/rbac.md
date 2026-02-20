# Role-Based Access Control (RBAC)

## Table of Contents
- [Role Setup](#role-setup)
- [Storing Roles](#storing-roles)
- [Permission Checking](#permission-checking)
- [Protecting by Role](#protecting-by-role)
- [UI Components](#ui-components)

## Role Setup

### Define Roles and Permissions

```typescript
// lib/auth/roles.ts
export const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

export const PERMISSIONS = {
  'projects:create': [ROLES.ADMIN, ROLES.MEMBER],
  'projects:read': [ROLES.ADMIN, ROLES.MEMBER, ROLES.VIEWER],
  'projects:update': [ROLES.ADMIN, ROLES.MEMBER],
  'projects:delete': [ROLES.ADMIN],
  'team:invite': [ROLES.ADMIN],
  'team:remove': [ROLES.ADMIN],
  'settings:billing': [ROLES.ADMIN],
  'admin:access': [ROLES.ADMIN],
} as const

export type Permission = keyof typeof PERMISSIONS
```

### Permission Checker

```typescript
// lib/auth/permissions.ts
import { PERMISSIONS, type Permission, type Role } from './roles'

export function hasPermission(role: Role, permission: Permission): boolean {
  return PERMISSIONS[permission].includes(role)
}
```

## Storing Roles

### Using Clerk Public Metadata (Recommended)

```typescript
// Set role via Clerk API
import { clerkClient } from '@clerk/nextjs/server'

await clerkClient.users.updateUser(userId, {
  publicMetadata: { role: 'admin' },
})
```

```typescript
// Get role server-side
import { auth } from '@clerk/nextjs/server'
import type { Role } from '@/lib/auth/roles'

export function getUserRole(): Role {
  const { sessionClaims } = auth()
  return (sessionClaims?.metadata?.role as Role) ?? 'viewer'
}
```

```typescript
// Get role client-side
import { useUser } from '@clerk/nextjs'

export function useUserRole(): Role {
  const { user } = useUser()
  return (user?.publicMetadata?.role as Role) ?? 'viewer'
}
```

## Permission Checking

### In Server Actions

```typescript
'use server'

import { auth } from '@clerk/nextjs/server'
import { hasPermission } from '@/lib/auth/permissions'
import type { Role } from '@/lib/auth/roles'

export async function deleteProjectAction(projectId: string) {
  const { userId, sessionClaims } = auth()
  if (!userId) return { error: 'Unauthorized' }

  const role = (sessionClaims?.metadata?.role as Role) ?? 'viewer'

  if (!hasPermission(role, 'projects:delete')) {
    return { error: 'Permission denied' }
  }

  await prisma.project.delete({ where: { id: projectId } })
  return { success: true }
}
```

### Reusable Helper

```typescript
// lib/auth/index.ts
export async function requirePermission(permission: Permission) {
  const { userId, sessionClaims } = auth()
  if (!userId) throw new Error('Unauthorized')

  const role = (sessionClaims?.metadata?.role as Role) ?? 'viewer'
  if (!hasPermission(role, permission)) {
    throw new Error(`Missing permission: ${permission}`)
  }

  return { userId, role }
}

// Usage
const { userId } = await requirePermission('projects:delete')
```

## Protecting by Role

### In Middleware

```typescript
// middleware.ts
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware((auth, req) => {
  if (isAdminRoute(req)) {
    const { sessionClaims } = auth()
    if (sessionClaims?.metadata?.role !== 'admin') {
      return Response.redirect(new URL('/dashboard', req.url))
    }
  }
})
```

### In Server Components

```typescript
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const { sessionClaims } = auth()
  
  if (sessionClaims?.metadata?.role !== 'admin') {
    redirect('/dashboard')
  }

  return <AdminDashboard />
}
```

## UI Components

### Permission Gate

```typescript
// components/auth/can.tsx
'use client'

import { useUser } from '@clerk/nextjs'
import { hasPermission } from '@/lib/auth/permissions'
import type { Permission, Role } from '@/lib/auth/roles'

export function Can({ 
  permission, 
  children, 
  fallback = null 
}: {
  permission: Permission
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { user, isLoaded } = useUser()
  if (!isLoaded) return null

  const role = (user?.publicMetadata?.role as Role) ?? 'viewer'

  return hasPermission(role, permission) ? <>{children}</> : <>{fallback}</>
}
```

```typescript
// Usage
<Can permission="projects:delete">
  <DeleteButton />
</Can>
```