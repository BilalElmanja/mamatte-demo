# Layer Implementation Details

## Table of Contents
- [Server Actions](#server-actions)
- [Services](#services)
- [Repositories](#repositories)
- [Lib Modules](#lib-modules)
- [API Route Handlers](#api-route-handlers)
- [Pages (Server Components)](#pages-server-components)
- [Import Rules Matrix](#import-rules-matrix)

## Server Actions

### Complete Structure

```typescript
// src/actions/project-actions.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'
import { hasPermission } from '@/lib/auth/permissions'
import { projectService } from '@/services/project-service'
import { createProjectSchema, updateProjectSchema } from '@/types/project'
import { ActionError, handleActionError } from '@/lib/utils/errors'

export async function createProjectAction(input: z.infer<typeof createProjectSchema>) {
  try {
    // 1. AUTHENTICATE
    const user = await getCurrentUser()
    if (!user) {
      throw new ActionError('UNAUTHORIZED', 'You must be logged in')
    }

    // 2. VALIDATE INPUT
    const validated = createProjectSchema.parse(input)

    // 3. AUTHORIZE
    const canCreate = await hasPermission(user.id, 'project:create')
    if (!canCreate) {
      throw new ActionError('FORBIDDEN', 'You cannot create projects')
    }

    // 4. EXECUTE (delegate to service)
    const project = await projectService.create(user.id, validated)

    // 5. REVALIDATE (if needed)
    revalidatePath('/dashboard/projects')

    // 6. RETURN
    return { success: true, data: project }

  } catch (error) {
    return handleActionError(error)
  }
}

export async function updateProjectAction(
  projectId: string,
  input: z.infer<typeof updateProjectSchema>
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new ActionError('UNAUTHORIZED', 'You must be logged in')
    }

    const validated = updateProjectSchema.parse(input)

    const canUpdate = await projectService.canUserModify(user.id, projectId)
    if (!canUpdate) {
      throw new ActionError('FORBIDDEN', 'You cannot modify this project')
    }

    const project = await projectService.update(projectId, validated)
    revalidatePath(`/dashboard/projects/${projectId}`)

    return { success: true, data: project }
  } catch (error) {
    return handleActionError(error)
  }
}

export async function deleteProjectAction(projectId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new ActionError('UNAUTHORIZED', 'You must be logged in')
    }

    if (!projectId || typeof projectId !== 'string') {
      throw new ActionError('VALIDATION_ERROR', 'Invalid project ID')
    }

    const canDelete = await projectService.canUserDelete(user.id, projectId)
    if (!canDelete) {
      throw new ActionError('FORBIDDEN', 'You cannot delete this project')
    }

    await projectService.delete(projectId)
    revalidatePath('/dashboard/projects')

    return { success: true }
  } catch (error) {
    return handleActionError(error)
  }
}
```

## Services

### Complete Structure

```typescript
// src/services/project-service.ts

import { projectRepository } from '@/repositories/project-repository'
import { subscriptionRepository } from '@/repositories/subscription-repository'
import { notificationService } from '@/services/notification-service'
import { ServiceError } from '@/lib/utils/errors'
import type { CreateProjectInput, UpdateProjectInput, Project } from '@/types/project'

export const projectService = {
  async create(userId: string, input: CreateProjectInput): Promise<Project> {
    // Business Rule: Check project limit based on plan
    const subscription = await subscriptionRepository.findByUserId(userId)
    const projectCount = await projectRepository.countByUserId(userId)

    const limit = subscription?.plan === 'pro' ? 50 : 5
    if (projectCount >= limit) {
      throw new ServiceError(
        'LIMIT_EXCEEDED',
        `You have reached your project limit (${limit}). Please upgrade your plan.`
      )
    }

    // Business Rule: Reserved names
    const reservedNames = ['admin', 'api', 'system', 'root']
    if (reservedNames.includes(input.name.toLowerCase())) {
      throw new ServiceError('VALIDATION_ERROR', 'This project name is reserved')
    }

    // Business Rule: Unique name per user
    const existing = await projectRepository.findByUserAndName(userId, input.name)
    if (existing) {
      throw new ServiceError('CONFLICT', 'You already have a project with this name')
    }

    // Create project
    const project = await projectRepository.create({
      ...input,
      ownerId: userId,
      status: 'active',
    })

    // Side effect: Send notification
    await notificationService.send(userId, {
      type: 'project_created',
      title: 'Project Created',
      message: `Your project "${project.name}" has been created.`,
    })

    return project
  },

  async update(projectId: string, input: UpdateProjectInput): Promise<Project> {
    const project = await projectRepository.findById(projectId)
    if (!project) {
      throw new ServiceError('NOT_FOUND', 'Project not found')
    }

    // Business Rule: Cannot update archived projects
    if (project.status === 'archived') {
      throw new ServiceError('INVALID_OPERATION', 'Cannot update an archived project')
    }

    return projectRepository.update(projectId, input)
  },

  async delete(projectId: string): Promise<void> {
    const project = await projectRepository.findById(projectId)
    if (!project) {
      throw new ServiceError('NOT_FOUND', 'Project not found')
    }

    // Soft delete
    await projectRepository.update(projectId, {
      status: 'deleted',
      deletedAt: new Date(),
    })
  },

  // Authorization helpers
  async canUserModify(userId: string, projectId: string): Promise<boolean> {
    const project = await projectRepository.findById(projectId)
    if (!project) return false

    if (project.ownerId === userId) return true

    const membership = await projectRepository.findMembership(projectId, userId)
    return membership?.role === 'editor' || membership?.role === 'admin'
  },

  async canUserDelete(userId: string, projectId: string): Promise<boolean> {
    const project = await projectRepository.findById(projectId)
    if (!project) return false
    return project.ownerId === userId
  },

  async getByIdForUser(userId: string, projectId: string): Promise<Project | null> {
    const project = await projectRepository.findById(projectId)
    if (!project) return null

    const hasAccess = project.ownerId === userId ||
      await projectRepository.findMembership(projectId, userId)

    return hasAccess ? project : null
  },

  async listForUser(userId: string, options?: { status?: string }): Promise<Project[]> {
    return projectRepository.findByUserId(userId, {
      status: options?.status ?? 'active',
    })
  },
}
```

## Repositories

### Complete Structure

```typescript
// src/repositories/project-repository.ts

import { prisma } from '@/lib/db'
import type { Project, CreateProjectData, UpdateProjectData } from '@/types/project'

export const projectRepository = {
  // Queries
  async findById(id: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    })
  },

  async findByUserId(
    userId: string,
    options?: { status?: string; limit?: number; offset?: number }
  ): Promise<Project[]> {
    return prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
        status: options?.status,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      take: options?.limit,
      skip: options?.offset,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { tasks: true } },
      },
    })
  },

  async findByUserAndName(userId: string, name: string): Promise<Project | null> {
    return prisma.project.findFirst({
      where: {
        ownerId: userId,
        name: { equals: name, mode: 'insensitive' },
        deletedAt: null,
      },
    })
  },

  async countByUserId(userId: string): Promise<number> {
    return prisma.project.count({
      where: { ownerId: userId, deletedAt: null },
    })
  },

  async findMembership(projectId: string, userId: string) {
    return prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    })
  },

  // Mutations
  async create(data: CreateProjectData): Promise<Project> {
    return prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
        status: data.status ?? 'active',
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    })
  },

  async update(id: string, data: UpdateProjectData): Promise<Project> {
    return prisma.project.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    })
  },

  async delete(id: string): Promise<void> {
    await prisma.project.delete({ where: { id } })
  },
}
```

## Lib Modules

### Complete Structure (Stripe Example)

```typescript
// src/lib/payments/stripe.ts

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const stripeLib = {
  // Customers
  async createCustomer(params: {
    email: string
    name?: string
    metadata?: Record<string, string>
  }): Promise<Stripe.Customer> {
    return stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: params.metadata,
    })
  },

  async getCustomer(customerId: string): Promise<Stripe.Customer | null> {
    try {
      const customer = await stripe.customers.retrieve(customerId)
      return customer.deleted ? null : customer as Stripe.Customer
    } catch {
      return null
    }
  },

  // Subscriptions
  async createSubscription(params: {
    customerId: string
    priceId: string
    trialDays?: number
  }): Promise<Stripe.Subscription> {
    return stripe.subscriptions.create({
      customer: params.customerId,
      items: [{ price: params.priceId }],
      trial_period_days: params.trialDays,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    })
  },

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return stripe.subscriptions.cancel(subscriptionId)
  },

  // Checkout
  async createCheckoutSession(params: {
    customerId: string
    priceId: string
    successUrl: string
    cancelUrl: string
  }): Promise<Stripe.Checkout.Session> {
    return stripe.checkout.sessions.create({
      customer: params.customerId,
      mode: 'subscription',
      line_items: [{ price: params.priceId, quantity: 1 }],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    })
  },

  // Webhooks
  constructWebhookEvent(body: string, signature: string): Stripe.Event {
    return stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  },
}

export type { Stripe }
```

## API Route Handlers

### Webhook Handler Example

```typescript
// src/app/api/webhooks/stripe/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { stripeLib } from '@/lib/payments/stripe'
import { billingService } from '@/services/billing-service'
import { logger } from '@/lib/utils/logger'

export async function POST(request: NextRequest) {
  try {
    // 1. GET RAW BODY
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // 2. VERIFY WEBHOOK
    const event = stripeLib.constructWebhookEvent(body, signature)

    // 3. DELEGATE TO SERVICE
    await billingService.handleWebhookEvent(event)

    // 4. RETURN SUCCESS
    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Stripe webhook error', { error })
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
```

## Pages (Server Components)

### Page Structure

```typescript
// src/app/(dashboard)/projects/page.tsx

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { projectService } from '@/services/project-service'
import { ProjectList } from './_components/project-list'
import { ProjectListSkeleton } from './_components/project-list-skeleton'
import { CreateProjectButton } from './_components/create-project-button'

export const metadata = { title: 'Projects | Dashboard' }

export default async function ProjectsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your projects</p>
        </div>
        <CreateProjectButton />
      </div>

      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectListLoader userId={user.id} />
      </Suspense>
    </div>
  )
}

async function ProjectListLoader({ userId }: { userId: string }) {
  const projects = await projectService.listForUser(userId)
  return <ProjectList projects={projects} />
}
```

## Import Rules Matrix

| From ↓ / To → | Pages | Components | Hooks | Actions | Services | Repos | Lib | Types |
|---------------|-------|------------|-------|---------|----------|-------|-----|-------|
| **Pages** | ❌ | ✅ | ✅ | ✅ | ✅* | ❌ | ❌ | ✅ |
| **Components** | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Hooks** | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Actions** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅** | ✅ |
| **Services** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Repos** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Lib** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️*** | ✅ |

*Pages may call services in Server Components  
**Actions may import auth lib only  
***Lib modules may import shared utilities only