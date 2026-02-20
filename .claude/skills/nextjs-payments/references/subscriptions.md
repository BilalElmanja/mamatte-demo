# Subscriptions & Plans

## Subscription Lifecycle

```
Created → Active → (Canceled/Past Due) → Expired
```

## Database Schema

```prisma
model Subscription {
  id                   String    @id @default(cuid())
  userId               String    @unique
  user                 User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  stripeCustomerId     String
  stripeSubscriptionId String    @unique
  stripePriceId        String
  
  status               String    // active, canceled, past_due, trialing, unpaid
  plan                 String    @default("free")
  
  currentPeriodStart   DateTime
  currentPeriodEnd     DateTime
  cancelAtPeriodEnd    Boolean   @default(false)
  trialEnd             DateTime?
  
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  @@index([stripeCustomerId])
  @@index([stripeSubscriptionId])
  @@index([status])
}
```

## Subscription Repository

```typescript
// src/repositories/subscription-repository.ts
import { prisma } from '@/lib/db'
import type { Prisma } from '@prisma/client'

export const subscriptionRepository = {
  findByUserId: (userId: string) =>
    prisma.subscription.findUnique({ where: { userId } }),

  findByStripeId: (stripeSubscriptionId: string) =>
    prisma.subscription.findUnique({ where: { stripeSubscriptionId } }),

  findByCustomerId: (stripeCustomerId: string) =>
    prisma.subscription.findFirst({ where: { stripeCustomerId } }),

  upsert: (data: Prisma.SubscriptionCreateInput) =>
    prisma.subscription.upsert({
      where: { userId: data.userId as string },
      create: data,
      update: data,
    }),

  updateByStripeId: (stripeSubscriptionId: string, data: Prisma.SubscriptionUpdateInput) =>
    prisma.subscription.update({
      where: { stripeSubscriptionId },
      data,
    }),

  delete: (userId: string) =>
    prisma.subscription.delete({ where: { userId } }),
}
```

## Subscription Service

```typescript
// src/services/subscription-service.ts
import { subscriptionRepository } from '@/repositories/subscription-repository'
import { PLANS, type PlanId } from '@/config/plans'
import { stripe } from '@/lib/payments/stripe'

export const subscriptionService = {
  async getSubscription(userId: string) {
    return subscriptionRepository.findByUserId(userId)
  },

  async getPlan(userId: string): Promise<PlanId> {
    const sub = await this.getSubscription(userId)
    if (!sub || !['active', 'trialing'].includes(sub.status)) {
      return 'free'
    }
    return sub.plan as PlanId
  },

  async isActive(userId: string): Promise<boolean> {
    const sub = await this.getSubscription(userId)
    return sub?.status === 'active' || sub?.status === 'trialing'
  },

  async isPro(userId: string): Promise<boolean> {
    const plan = await this.getPlan(userId)
    return plan === 'pro'
  },

  async getLimit(userId: string, resource: keyof typeof PLANS.free.limits) {
    const plan = await this.getPlan(userId)
    return PLANS[plan].limits[resource]
  },

  async checkLimit(userId: string, resource: keyof typeof PLANS.free.limits, current: number) {
    const limit = await this.getLimit(userId, resource)
    return current < limit
  },

  async getRemainingQuota(userId: string, resource: keyof typeof PLANS.free.limits, current: number) {
    const limit = await this.getLimit(userId, resource)
    return Math.max(0, limit - current)
  },

  // Cancel subscription at period end
  async cancelAtPeriodEnd(userId: string) {
    const sub = await this.getSubscription(userId)
    if (!sub?.stripeSubscriptionId) throw new Error('No subscription')

    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    })

    await subscriptionRepository.updateByStripeId(sub.stripeSubscriptionId, {
      cancelAtPeriodEnd: true,
    })
  },

  // Resume canceled subscription
  async resumeSubscription(userId: string) {
    const sub = await this.getSubscription(userId)
    if (!sub?.stripeSubscriptionId) throw new Error('No subscription')

    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: false,
    })

    await subscriptionRepository.updateByStripeId(sub.stripeSubscriptionId, {
      cancelAtPeriodEnd: false,
    })
  },
}
```

## Plan Configuration

```typescript
// src/config/plans.ts
export const PLANS = {
  free: {
    name: 'Free',
    description: 'For individuals getting started',
    price: { monthly: 0, yearly: 0 },
    stripePriceId: { monthly: null, yearly: null },
    limits: {
      projects: 3,
      storage: 100,        // MB
      teamMembers: 1,
      apiRequests: 1000,   // per month
    },
    features: [
      'Up to 3 projects',
      'Basic analytics',
      'Community support',
    ],
  },
  pro: {
    name: 'Pro',
    description: 'For professionals and small teams',
    price: { monthly: 29, yearly: 290 },
    stripePriceId: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
    },
    limits: {
      projects: 50,
      storage: 10000,
      teamMembers: 10,
      apiRequests: 50000,
    },
    features: [
      'Up to 50 projects',
      'Advanced analytics',
      'Priority support',
      'API access',
      'Custom domains',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    description: 'For large organizations',
    price: { monthly: 99, yearly: 990 },
    stripePriceId: {
      monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID,
    },
    limits: {
      projects: -1,        // Unlimited
      storage: -1,
      teamMembers: -1,
      apiRequests: -1,
    },
    features: [
      'Unlimited projects',
      'Unlimited storage',
      'Dedicated support',
      'SSO/SAML',
      'SLA guarantee',
      'Custom integrations',
    ],
  },
} as const

export type PlanId = keyof typeof PLANS
export type BillingInterval = 'monthly' | 'yearly'
```

## Changing Plans

```typescript
// src/actions/billing-actions.ts
'use server'

import { requireAuth } from '@/lib/auth'
import { stripe } from '@/lib/payments/stripe'
import { subscriptionRepository } from '@/repositories/subscription-repository'
import { PLANS, type PlanId, type BillingInterval } from '@/config/plans'

export async function changePlanAction(newPlan: PlanId, interval: BillingInterval) {
  const user = await requireAuth()
  const sub = await subscriptionRepository.findByUserId(user.id)

  if (!sub?.stripeSubscriptionId) {
    throw new Error('No active subscription')
  }

  const newPriceId = PLANS[newPlan].stripePriceId[interval]
  if (!newPriceId) throw new Error('Invalid plan')

  const subscription = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId)

  await stripe.subscriptions.update(sub.stripeSubscriptionId, {
    items: [{
      id: subscription.items.data[0].id,
      price: newPriceId,
    }],
    proration_behavior: 'create_prorations',
  })

  // Webhook will update database
}
```

## Usage-Based Billing

```typescript
// Report usage to Stripe
export async function reportUsage(userId: string, quantity: number) {
  const sub = await subscriptionRepository.findByUserId(userId)
  if (!sub?.stripeSubscriptionId) return

  const subscription = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId)
  const meteredItem = subscription.items.data.find(
    item => item.price.recurring?.usage_type === 'metered'
  )

  if (meteredItem) {
    await stripe.subscriptionItems.createUsageRecord(meteredItem.id, {
      quantity,
      timestamp: Math.floor(Date.now() / 1000),
      action: 'increment',
    })
  }
}
```

## Checking Access in Components

```typescript
// src/components/billing/plan-gate.tsx
import { subscriptionService } from '@/services/subscription-service'
import { requireAuth } from '@/lib/auth'

interface PlanGateProps {
  plan: PlanId
  children: React.ReactNode
  fallback?: React.ReactNode
}

export async function PlanGate({ plan, children, fallback }: PlanGateProps) {
  const user = await requireAuth()
  const userPlan = await subscriptionService.getPlan(user.id)

  const planOrder = ['free', 'pro', 'enterprise']
  const hasAccess = planOrder.indexOf(userPlan) >= planOrder.indexOf(plan)

  return hasAccess ? <>{children}</> : <>{fallback}</>
}
```

```typescript
// Usage in page
<PlanGate plan="pro" fallback={<UpgradePrompt />}>
  <AdvancedAnalytics />
</PlanGate>
```