# Anti-Patterns & Violations

## Table of Contents
- [Forbidden Import Patterns](#forbidden-import-patterns)
- [Business Logic in Action](#business-logic-in-action)
- [Component Fetching Data](#component-fetching-data)
- [Service Calling External API Directly](#service-calling-external-api-directly)
- [Cross-Route Component Import](#cross-route-component-import)
- [Skipping Authorization](#skipping-authorization)
- [Other Common Violations](#other-common-violations)

## Forbidden Import Patterns

```typescript
// ❌ FORBIDDEN: Action importing repository
// src/actions/project-actions.ts
import { projectRepository } from '@/repositories/project-repository'

// ❌ FORBIDDEN: Component importing service
// src/components/project-card.tsx
import { projectService } from '@/services/project-service'

// ❌ FORBIDDEN: Service importing action
// src/services/project-service.ts
import { createProjectAction } from '@/actions/project-actions'

// ❌ FORBIDDEN: Cross-route component import
// src/app/dashboard/page.tsx
import { Card } from '@/app/settings/_components/card'

// ❌ FORBIDDEN: Lib importing service
// src/lib/stripe/index.ts
import { billingService } from '@/services/billing-service'
```

## Business Logic in Action

```typescript
// ❌ WRONG
export async function createProjectAction(input) {
  const user = await getCurrentUser()

  // ❌ Business logic in action!
  if (input.name === 'admin') {
    throw new Error('Reserved name')
  }

  // ❌ Direct DB access!
  const count = await prisma.project.count({ where: { ownerId: user.id } })
  if (count >= 5) {
    throw new Error('Limit reached')
  }

  return prisma.project.create({ data: input })
}

// ✅ CORRECT
export async function createProjectAction(input) {
  const user = await requireAuth()
  const validated = createProjectSchema.parse(input)

  // Delegate ALL logic to service
  return projectService.create(user.id, validated)
}
```

## Component Fetching Data

```typescript
// ❌ WRONG
'use client'
export function ProjectList() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(setProjects)
  }, [])

  return <div>{projects.map(p => <Card key={p.id} />)}</div>
}

// ✅ CORRECT - Server Component
export async function ProjectList() {
  const projects = await projectService.listForUser(userId)
  return <div>{projects.map(p => <ProjectCard key={p.id} project={p} />)}</div>
}

// ✅ CORRECT - Client with hook
'use client'
export function ProjectList({ initialProjects }) {
  const { data: projects } = useProjects({ initialData: initialProjects })
  return <div>{projects.map(p => <ProjectCard key={p.id} project={p} />)}</div>
}
```

## Service Calling External API Directly

```typescript
// ❌ WRONG
// src/services/billing-service.ts
export async function createSubscription(userId, planId) {
  const stripe = new Stripe(process.env.STRIPE_KEY!)
  return stripe.subscriptions.create({ ... })
}

// ✅ CORRECT
// src/lib/payments/stripe.ts
export const stripeLib = {
  createSubscription: (params) => stripe.subscriptions.create(params)
}

// src/services/billing-service.ts
export const billingService = {
  async subscribe(userId, planId) {
    // Business logic here
    const customer = await this.getOrCreateCustomer(userId)
    return stripeLib.createSubscription({ customerId: customer.id, ... })
  }
}
```

## Cross-Route Component Import

```typescript
// ❌ WRONG
// src/app/(dashboard)/settings/page.tsx
import { StatCard } from '@/app/(dashboard)/dashboard/_components/stat-card'

// ✅ CORRECT - Move to shared components
// src/components/cards/stat-card.tsx
export function StatCard() { ... }

// Then import from shared
import { StatCard } from '@/components/cards/stat-card'
```

## Skipping Authorization

```typescript
// ❌ WRONG
export async function deleteProject(projectId: string) {
  // No authorization check!
  return projectRepository.delete(projectId)
}

// ✅ CORRECT
export async function deleteProject(userId: string, projectId: string) {
  const project = await projectRepository.findById(projectId)

  if (!project) {
    throw new NotFoundError('Project')
  }

  // Check ownership
  if (project.ownerId !== userId) {
    throw new AuthorizationError('You cannot delete this project')
  }

  return projectRepository.softDelete(projectId)
}
```

## Other Common Violations

### Direct Database Access in Actions

```typescript
// ❌ WRONG
export async function updateProjectAction(id: string, data: any) {
  return prisma.project.update({ where: { id }, data })
}

// ✅ CORRECT
export async function updateProjectAction(id: string, input: UpdateProjectInput) {
  const user = await requireAuth()
  const validated = updateProjectSchema.parse(input)
  
  const canUpdate = await projectService.canUserModify(user.id, id)
  if (!canUpdate) throw new ActionError('FORBIDDEN', 'Cannot update')
  
  return projectService.update(id, validated)
}
```

### Hooks Containing Business Logic

```typescript
// ❌ WRONG
export function useProjectLimit() {
  const { data: subscription } = useSubscription()
  const { data: projects } = useProjects()
  
  // Business logic in hook!
  const limit = subscription?.plan === 'pro' ? 50 : 5
  const canCreate = projects.length < limit
  
  return { canCreate, limit }
}

// ✅ CORRECT - Check in service, expose via action
export async function checkCanCreateProject() {
  const user = await requireAuth()
  return projectService.canUserCreate(user.id)
}
```

### Missing Input Validation

```typescript
// ❌ WRONG
export async function createProjectAction(input: any) {
  const user = await requireAuth()
  return projectService.create(user.id, input) // Unvalidated input!
}

// ✅ CORRECT
export async function createProjectAction(input: unknown) {
  const user = await requireAuth()
  const validated = createProjectSchema.parse(input) // Always validate
  return projectService.create(user.id, validated)
}
```

### Throwing Errors to Client

```typescript
// ❌ WRONG
export async function deleteProjectAction(id: string) {
  const user = await requireAuth()
  await projectService.delete(id) // Throws to client!
  revalidatePath('/projects')
}

// ✅ CORRECT
export async function deleteProjectAction(id: string) {
  try {
    const user = await requireAuth()
    await projectService.delete(id)
    revalidatePath('/projects')
    return { success: true }
  } catch (error) {
    return handleActionError(error) // Always handle errors
  }
}
```