---
name: nextjs-auth
description: "Clerk authentication and authorization for Next.js 14+ applications. Use when implementing user authentication, protecting routes, managing sessions, implementing RBAC/permissions, handling OAuth flows, syncing users to database via webhooks, or building custom auth UI. Covers middleware protection, server-side auth checks, and client-side auth state."
---

# Next.js Authentication with Clerk

## When to Read Which Reference

| Task | Read This |
|------|-----------|
| Initial Clerk setup | This file (Quick Start below) |
| Protecting routes with middleware | [references/middleware.md](references/middleware.md) |
| Server-side auth (components, actions, API) | [references/server-auth.md](references/server-auth.md) |
| Client-side auth (hooks, components) | [references/client-auth.md](references/client-auth.md) |
| Syncing users to database | [references/webhooks.md](references/webhooks.md) |
| Role-based access control (RBAC) | [references/rbac.md](references/rbac.md) |
| Custom auth UI & styling | [references/auth-ui.md](references/auth-ui.md) |

## Quick Start

### 1. Install

```bash
npm install @clerk/nextjs
```

### 2. Environment Variables

```env
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 3. Add Provider

```typescript
// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### 4. Protect Routes (Middleware)

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
])

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect()
  }
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

## Clean Architecture Integration

Auth spans multiple layers - place code in the correct layer:

```
┌─────────────────────────────────────────────────────────────┐
│ MIDDLEWARE: Route protection (runs on every request)        │
│ Location: src/middleware.ts                                 │
├─────────────────────────────────────────────────────────────┤
│ PRESENTATION: <UserButton/>, useUser(), <SignedIn/>         │
│ Location: src/components/, src/app/ pages                   │
├─────────────────────────────────────────────────────────────┤
│ APPLICATION: Server actions call auth() before executing    │
│ Location: src/actions/                                      │
├─────────────────────────────────────────────────────────────┤
│ DOMAIN: Services receive userId, enforce business rules     │
│ Location: src/services/                                     │
├─────────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE: Auth helpers, webhooks, user sync           │
│ Location: src/lib/auth/, src/app/api/webhooks/              │
└─────────────────────────────────────────────────────────────┘
```

## File Structure (Clean Architecture)

```
src/
├── app/
│   ├── (auth)/                         # PRESENTATION: Public auth pages
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/                    # PRESENTATION: Protected routes
│   │   ├── dashboard/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   └── api/webhooks/clerk/route.ts     # APPLICATION: Webhook handler
├── components/
│   └── auth/                           # PRESENTATION: Auth UI components
│       ├── user-button.tsx
│       └── auth-guard.tsx
├── actions/                            # APPLICATION: Server actions
│   └── user-actions.ts                 # Actions call lib/auth then services
├── services/                           # DOMAIN: Business logic
│   └── user-service.ts                 # Receives userId, no auth checks here
├── repositories/                       # INFRASTRUCTURE: Data access
│   └── user-repository.ts
├── lib/
│   └── auth/                           # INFRASTRUCTURE: Auth helpers
│       ├── index.ts                    # getCurrentUser(), requireAuth()
│       └── permissions.ts              # hasPermission(), RBAC logic
├── types/
│   └── auth.ts                         # Auth-related types
├── middleware.ts                       # Route protection
└── config/
    └── auth.ts                         # Auth configuration constants
```

## Auth Helpers (Infrastructure Layer)

```typescript
// src/lib/auth/index.ts
import { auth, currentUser } from '@clerk/nextjs/server'
import { cache } from 'react'

// Cached user fetch (deduped per request)
export const getCurrentUser = cache(async () => {
  const user = await currentUser()
  if (!user) return null
  
  return {
    clerkId: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? '',
    name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
    imageUrl: user.imageUrl,
  }
})

// Throws if not authenticated - use in actions
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

// Sync: get userId only
export function getAuthUserId() {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}
```

## Server Action Pattern (Application Layer)

```typescript
// src/actions/project-actions.ts
'use server'

import { requireAuth } from '@/lib/auth'
import { hasPermission } from '@/lib/auth/permissions'
import { projectService } from '@/services/project-service'
import { createProjectSchema } from '@/types/project'
import { revalidatePath } from 'next/cache'

export async function createProjectAction(input: unknown) {
  // 1. AUTHENTICATE (lib/auth)
  const user = await requireAuth()

  // 2. VALIDATE
  const validated = createProjectSchema.parse(input)

  // 3. AUTHORIZE (lib/auth/permissions)
  if (!await hasPermission(user.clerkId, 'projects:create')) {
    throw new Error('Forbidden')
  }

  // 4. EXECUTE (delegate to service - NO business logic here)
  const project = await projectService.create(user.clerkId, validated)

  // 5. REVALIDATE
  revalidatePath('/dashboard/projects')

  return { success: true, data: project }
}
```

## Security Checklist

- [ ] Clerk Provider wraps entire app in `src/app/layout.tsx`
- [ ] Middleware protects all private routes
- [ ] Public routes explicitly listed in matcher
- [ ] Server actions call `requireAuth()` before mutations
- [ ] Webhook syncs users to database via repository
- [ ] Webhook signature verified
- [ ] RBAC checks via `lib/auth/permissions.ts`
- [ ] Services receive userId, never call auth directly

## Key Rules

1. **Auth helpers in `lib/auth/`** - Not in services or repositories
2. **Actions check auth first** - Then delegate to services
3. **Services never import from Clerk** - Receive userId as parameter
4. **Repositories don't know about auth** - Pure data access
5. **RBAC logic in `lib/auth/permissions.ts`** - Reusable across actions