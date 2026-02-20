---
name: nextjs-clean-architecture
description: "Clean Architecture patterns for Next.js 14+ SaaS platforms. Use when building or modifying Next.js applications requiring layered architecture (presentation, application, domain, infrastructure), server actions and API routes, services and repositories, business logic organization, authentication/authorization patterns, error handling strategies, or when asking questions about code organization, dependency rules, or architectural decisions in Next.js projects."
---

# Clean Architecture for Next.js SaaS Platforms

## Core Philosophy

**Maintainability over convenience. Explicit over clever. Boring is good.**

## Layer Stack (Top to Bottom)

```
┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION: Pages, Components, Hooks (Client)             │
├─────────────────────────────────────────────────────────────┤
│ APPLICATION: Server Actions, API Route Handlers             │
├─────────────────────────────────────────────────────────────┤
│ DOMAIN: Services (Business Logic), Types/Schemas            │
├─────────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE: Repositories (DB), Lib (External APIs)      │
└─────────────────────────────────────────────────────────────┘
```

## Dependency Rule (STRICT)

```
Pages → Components → Hooks → Actions → Services → Repositories → Lib
```

- ✅ Higher layers MAY depend on lower layers
- ❌ Lower layers MUST NEVER depend on higher layers
- ❌ Horizontal peer dependencies FORBIDDEN
- ❌ Circular dependencies FORBIDDEN

## Layer Responsibilities

| Layer | Purpose | Must Not |
|-------|---------|----------|
| **Pages** | Routes, layout, metadata, data fetching entry | Contain business logic, call repos directly |
| **Components** | UI presentation, user interaction | Call services, access database |
| **Hooks** | Client-side stateful logic | Contain business logic, call services |
| **Actions** | Mutations from client (auth→validate→service) | Contain business logic, access DB directly |
| **API Routes** | Webhooks, external APIs | Contain business logic, access DB directly |
| **Services** | ALL business logic | Access UI, depend on Next.js APIs |
| **Repositories** | Abstract all database access | Contain business logic, know about HTTP |
| **Lib** | Encapsulate external systems | Import from services/actions |

## File Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth route group
│   ├── (dashboard)/        # Protected routes
│   │   └── projects/
│   │       ├── _components/  # Page-specific components
│   │       ├── actions.ts    # Co-located actions (optional)
│   │       └── page.tsx
│   └── api/webhooks/       # API Routes
├── components/             # Shared components
│   ├── ui/                 # Primitives (button, card, input)
│   ├── forms/              # Form components
│   └── layouts/            # Layout components
├── hooks/                  # Custom React hooks
├── actions/                # Server Actions (centralized)
├── services/               # Business Logic
├── repositories/           # Data Access
├── lib/                    # Infrastructure
│   ├── db/                 # Prisma client
│   ├── auth/               # Auth config
│   ├── payments/           # Stripe
│   └── utils/              # Shared utilities
├── types/                  # TypeScript types & Zod schemas
└── config/                 # App configuration
```

## Server Action Structure (MANDATORY)

Every server action follows this exact pattern:

```typescript
'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'
import { projectService } from '@/services/project-service'
import { createProjectSchema } from '@/types/project'
import { ActionError, handleActionError } from '@/lib/utils/errors'

export async function createProjectAction(input: z.infer<typeof createProjectSchema>) {
  try {
    // 1. AUTHENTICATE
    const user = await getCurrentUser()
    if (!user) throw new ActionError('UNAUTHORIZED', 'Must be logged in')

    // 2. VALIDATE INPUT
    const validated = createProjectSchema.parse(input)

    // 3. AUTHORIZE
    const canCreate = await hasPermission(user.id, 'project:create')
    if (!canCreate) throw new ActionError('FORBIDDEN', 'Cannot create projects')

    // 4. EXECUTE (delegate to service)
    const project = await projectService.create(user.id, validated)

    // 5. REVALIDATE
    revalidatePath('/dashboard/projects')

    // 6. RETURN
    return { success: true, data: project }
  } catch (error) {
    return handleActionError(error)
  }
}
```

## Service Pattern

Services contain ALL business logic:

```typescript
// src/services/project-service.ts
export const projectService = {
  async create(userId: string, input: CreateProjectInput): Promise<Project> {
    // Business Rule: Check plan limits
    const subscription = await subscriptionRepository.findByUserId(userId)
    const count = await projectRepository.countByUserId(userId)
    const limit = subscription?.plan === 'pro' ? 50 : 5
    if (count >= limit) {
      throw new ServiceError('LIMIT_EXCEEDED', `Project limit (${limit}) reached`)
    }

    // Business Rule: Reserved names
    if (['admin', 'api', 'system'].includes(input.name.toLowerCase())) {
      throw new ServiceError('VALIDATION_ERROR', 'Reserved name')
    }

    // Create via repository
    return projectRepository.create({ ...input, ownerId: userId, status: 'active' })
  },
}
```

## Repository Pattern

Repositories abstract ALL database access:

```typescript
// src/repositories/project-repository.ts
export const projectRepository = {
  async findById(id: string): Promise<Project | null> {
    return prisma.project.findUnique({ where: { id } })
  },

  async create(data: CreateProjectData): Promise<Project> {
    return prisma.project.create({ data })
  },
}
```

## When to Use What

| Use Case | Use |
|----------|-----|
| Form submission, client mutation | Server Action |
| Webhook, external API, file upload, streaming | API Route |
| Static content, data fetching, backend access | Server Component |
| Interactive UI, event listeners, browser APIs | Client Component |

## Pre-Flight Checklist

Before writing/modifying code, verify:

- [ ] Code is in correct layer
- [ ] Dependency direction respected
- [ ] Business logic ONLY in services
- [ ] Actions are thin (auth → validate → service)
- [ ] Auth checked server-side
- [ ] Authorization checked for mutations
- [ ] Input validated with Zod
- [ ] No cross-route `_components/` imports

## Detailed References

- **Layer implementation details**: See [references/layers.md](references/layers.md)
- **Error handling patterns**: See [references/errors.md](references/errors.md)
- **Security architecture**: See [references/security.md](references/security.md)
- **Anti-patterns to avoid**: See [references/anti-patterns.md](references/anti-patterns.md)
- **Decision framework**: See [references/decisions.md](references/decisions.md)

## Companion Skills

This architecture works with these companion skills:

| Skill | Layer | Purpose |
|-------|-------|---------|
| **nextjs-auth** | Middleware + lib/auth/ | Authentication & RBAC with Clerk |
| **prisma-database** | repositories/ + lib/db/ | Database schemas & queries |
| **nextjs-design-system** | components/ + lib/motion/ | UI components with animations |

### Integration Points

```
nextjs-clean-architecture (this skill)
├── Middleware ← nextjs-auth (route protection)
├── app/ ← nextjs-design-system (pages with animations)
├── components/ ← nextjs-design-system (shared UI)
├── actions/ ← nextjs-auth (requireAuth), calls services
├── services/ ← Business logic, calls repositories
├── repositories/ ← prisma-database (data access patterns)
├── lib/
│   ├── auth/ ← nextjs-auth (helpers)
│   ├── db/ ← prisma-database (client singleton)
│   └── motion/ ← nextjs-design-system (animation utils)
└── types/ ← Zod schemas used by all layers
```

## Final Rules

> If it breaks clean architecture, it does not ship.
> If it's fast but unmaintainable, reject it.
> If it works but breaks boundaries, refactor it.
> If it's secure, modular, and boring, ship it.