# Clerk Middleware & Route Protection

## Table of Contents
- [Basic Setup](#basic-setup)
- [Route Matching Patterns](#route-matching-patterns)
- [Role-Based Protection](#role-based-protection)
- [API Route Protection](#api-route-protection)

## Basic Setup

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/pricing',
  '/about',
])

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

## Route Matching Patterns

### Public Routes

```typescript
const isPublicRoute = createRouteMatcher([
  '/',                    // Home
  '/sign-in(.*)',         // Auth pages
  '/sign-up(.*)',
  '/api/webhooks(.*)',    // Webhooks (must be public)
  '/pricing',             // Marketing pages
  '/blog(.*)',
])
```

### Protected by Default

```typescript
export default clerkMiddleware((auth, req) => {
  // Everything not public requires auth
  if (!isPublicRoute(req)) {
    auth().protect()
  }
})
```

## Role-Based Protection

```typescript
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims } = auth()

  if (isPublicRoute(req)) return

  if (!userId) {
    return auth().protect()
  }

  // Admin routes require admin role
  if (isAdminRoute(req)) {
    const role = (sessionClaims?.metadata as any)?.role
    if (role !== 'admin') {
      return Response.redirect(new URL('/dashboard', req.url))
    }
  }
})
```

## API Route Protection

```typescript
const isProtectedApi = createRouteMatcher([
  '/api/projects(.*)',
  '/api/user(.*)',
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedApi(req)) {
    auth().protect()
  }
})
```