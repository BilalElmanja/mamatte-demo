---
name: nextjs-payments
description: "Stripe integration for Next.js SaaS applications. Use when implementing checkout sessions, subscriptions, customer portal, usage-based billing, webhooks, or plan limits. Covers payment flows, subscription lifecycle, and billing UI components."
---

# Next.js Payments with Stripe

## When to Read Which Reference

| Task | Read This |
|------|-----------|
| Initial Stripe setup | This file (Quick Start below) |
| Checkout & one-time payments | [references/checkout.md](references/checkout.md) |
| Subscriptions & plans | [references/subscriptions.md](references/subscriptions.md) |
| Webhook handling | [references/webhooks.md](references/webhooks.md) |
| Customer portal & billing UI | [references/billing-ui.md](references/billing-ui.md) |

## Quick Start

### 1. Install

```bash
npm install stripe @stripe/stripe-js
```

### 2. Environment Variables

```env
# .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Product/Price IDs from Stripe Dashboard
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_YEARLY_PRICE_ID=price_...
```

### 3. Stripe Client Setup

```typescript
// src/lib/payments/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})
```

```typescript
// src/lib/payments/stripe-client.ts
import { loadStripe } from '@stripe/stripe-js'

export const getStripeClient = () =>
  loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
```

### 4. Add Webhook Route to Middleware

```typescript
// src/middleware.ts
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',  // Stripe webhooks must be public
])
```

## Clean Architecture Integration

```
┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION: Pricing page, billing UI, upgrade buttons     │
│ Location: src/app/(marketing)/pricing/, src/components/     │
├─────────────────────────────────────────────────────────────┤
│ APPLICATION: Checkout actions, webhook handler              │
│ Location: src/actions/billing-actions.ts                    │
│           src/app/api/webhooks/stripe/route.ts              │
├─────────────────────────────────────────────────────────────┤
│ DOMAIN: Subscription service, plan limits enforcement       │
│ Location: src/services/subscription-service.ts              │
├─────────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE: Stripe client, subscription repository      │
│ Location: src/lib/payments/, src/repositories/              │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/
├── app/
│   ├── (marketing)/pricing/page.tsx      # Public pricing page
│   ├── (dashboard)/settings/billing/     # Billing management
│   └── api/webhooks/stripe/route.ts      # Webhook handler
├── actions/
│   └── billing-actions.ts                # createCheckout, createPortal
├── services/
│   └── subscription-service.ts           # Plan limits, feature access
├── repositories/
│   └── subscription-repository.ts        # Subscription CRUD
├── lib/
│   └── payments/
│       ├── stripe.ts                     # Server-side Stripe client
│       ├── stripe-client.ts              # Client-side Stripe
│       └── plans.ts                      # Plan configuration
├── types/
│   └── subscription.ts                   # Types & Zod schemas
└── config/
    └── plans.ts                          # Plan features & limits
```

## Plan Configuration

```typescript
// src/config/plans.ts
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    limits: {
      projects: 3,
      storage: 100, // MB
      teamMembers: 1,
    },
    features: ['Basic analytics', 'Email support'],
  },
  pro: {
    name: 'Pro',
    price: 29,
    stripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    limits: {
      projects: 50,
      storage: 10000,
      teamMembers: 10,
    },
    features: ['Advanced analytics', 'Priority support', 'API access'],
  },
} as const

export type PlanId = keyof typeof PLANS
```

## Subscription Service (Domain Layer)

```typescript
// src/services/subscription-service.ts
import { subscriptionRepository } from '@/repositories/subscription-repository'
import { PLANS, type PlanId } from '@/config/plans'

export const subscriptionService = {
  async getUserPlan(userId: string): Promise<PlanId> {
    const sub = await subscriptionRepository.findByUserId(userId)
    if (!sub || sub.status !== 'active') return 'free'
    return sub.plan as PlanId
  },

  async checkLimit(userId: string, resource: string, current: number): Promise<boolean> {
    const plan = await this.getUserPlan(userId)
    const limit = PLANS[plan].limits[resource as keyof typeof PLANS.free.limits]
    return current < limit
  },

  async canCreateProject(userId: string, currentCount: number): Promise<boolean> {
    return this.checkLimit(userId, 'projects', currentCount)
  },

  async getFeatures(userId: string) {
    const plan = await this.getUserPlan(userId)
    return PLANS[plan].features
  },
}
```

## Checkout Action (Application Layer)

```typescript
// src/actions/billing-actions.ts
'use server'

import { requireAuth } from '@/lib/auth'
import { stripe } from '@/lib/payments/stripe'
import { userRepository } from '@/repositories/user-repository'
import { redirect } from 'next/navigation'

export async function createCheckoutAction(priceId: string) {
  const user = await requireAuth()
  
  // Get or create Stripe customer
  let dbUser = await userRepository.findByClerkId(user.clerkId)
  
  if (!dbUser?.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { clerkId: user.clerkId },
    })
    dbUser = await userRepository.update(dbUser!.id, {
      stripeCustomerId: customer.id,
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer: dbUser.stripeCustomerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { userId: dbUser.id },
  })

  redirect(session.url!)
}

export async function createPortalAction() {
  const user = await requireAuth()
  const dbUser = await userRepository.findByClerkId(user.clerkId)

  if (!dbUser?.stripeCustomerId) {
    throw new Error('No billing account')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing`,
  })

  redirect(session.url)
}
```

## Webhook Handler

```typescript
// src/app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import { stripe } from '@/lib/payments/stripe'
import { subscriptionRepository } from '@/repositories/subscription-repository'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed')
    return new Response('Invalid signature', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object)
        break
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionChange(event.data.object)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return new Response('Webhook handler failed', { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  )
  
  await subscriptionRepository.upsert({
    userId: session.metadata!.userId,
    stripeCustomerId: session.customer as string,
    stripeSubscriptionId: subscription.id,
    stripePriceId: subscription.items.data[0].price.id,
    status: subscription.status,
    plan: 'pro', // Map from price ID in production
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  })
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  await subscriptionRepository.updateByStripeId(subscription.id, {
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  })
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Send email, show banner, etc.
  console.log('Payment failed for customer:', invoice.customer)
}
```

## Database Schema

```prisma
// prisma/schema.prisma

model User {
  id               String   @id @default(cuid())
  clerkId          String   @unique
  email            String   @unique
  stripeCustomerId String?  @unique
  
  subscription     Subscription?
}

model Subscription {
  id                   String    @id @default(cuid())
  userId               String    @unique
  user                 User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  stripeCustomerId     String
  stripeSubscriptionId String    @unique
  stripePriceId        String
  
  status               String    // active, canceled, past_due, etc.
  plan                 String    @default("free")
  
  currentPeriodEnd     DateTime
  cancelAtPeriodEnd    Boolean   @default(false)
  
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  @@index([stripeCustomerId])
  @@index([status])
}
```

## Enforcing Limits in Services

```typescript
// src/services/project-service.ts
import { projectRepository } from '@/repositories/project-repository'
import { subscriptionService } from '@/services/subscription-service'

export const projectService = {
  async create(userId: string, input: CreateProjectInput) {
    // Check plan limits
    const count = await projectRepository.countByUserId(userId)
    const canCreate = await subscriptionService.canCreateProject(userId, count)
    
    if (!canCreate) {
      throw new Error('Project limit reached. Please upgrade your plan.')
    }

    return projectRepository.create({ ...input, ownerId: userId })
  },
}
```

## Key Rules

1. **Stripe client in `lib/payments/`** - Infrastructure layer
2. **Webhook handler is an API route** - Application layer, calls repositories
3. **Subscription service enforces limits** - Domain layer, called by other services
4. **Always verify webhook signatures** - Security requirement
5. **Store subscription state in database** - Don't rely on Stripe API calls