# Billing UI Components

## Pricing Page

```typescript
// src/app/(marketing)/pricing/page.tsx
import { PLANS } from '@/config/plans'
import { PricingCard } from './_components/pricing-card'

export default function PricingPage() {
  return (
    <div className="py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
        <p className="text-muted-foreground mt-4">
          Choose the plan that's right for you
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {Object.entries(PLANS).map(([id, plan]) => (
          <PricingCard key={id} planId={id} plan={plan} />
        ))}
      </div>
    </div>
  )
}
```

### Pricing Card Component

```typescript
// src/app/(marketing)/pricing/_components/pricing-card.tsx
'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { createSubscriptionCheckout } from '@/actions/billing-actions'
import type { PlanId, BillingInterval } from '@/config/plans'

interface PricingCardProps {
  planId: string
  plan: {
    name: string
    description: string
    price: { monthly: number; yearly: number }
    stripePriceId: { monthly: string | null; yearly: string | null }
    features: string[]
  }
  currentPlan?: PlanId
}

export function PricingCard({ planId, plan, currentPlan }: PricingCardProps) {
  const [interval, setInterval] = useState<BillingInterval>('monthly')
  const [loading, setLoading] = useState(false)

  const price = plan.price[interval]
  const priceId = plan.stripePriceId[interval]
  const isCurrentPlan = currentPlan === planId
  const isFree = price === 0

  const handleSubscribe = async () => {
    if (!priceId || isFree) return
    setLoading(true)
    try {
      await createSubscriptionCheckout(priceId)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-xl p-8 flex flex-col">
      <h3 className="text-xl font-semibold">{plan.name}</h3>
      <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>

      <div className="mt-6">
        <span className="text-4xl font-bold">${price}</span>
        {!isFree && <span className="text-muted-foreground">/{interval}</span>}
      </div>

      {!isFree && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setInterval('monthly')}
            className={`px-3 py-1 rounded ${interval === 'monthly' ? 'bg-primary text-white' : 'bg-muted'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval('yearly')}
            className={`px-3 py-1 rounded ${interval === 'yearly' ? 'bg-primary text-white' : 'bg-muted'}`}
          >
            Yearly
            <span className="text-xs ml-1 text-green-500">Save 20%</span>
          </button>
        </div>
      )}

      <ul className="mt-8 space-y-3 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={loading || isCurrentPlan || isFree}
        className="mt-8 w-full py-3 rounded-lg bg-primary text-white disabled:opacity-50"
      >
        {isCurrentPlan ? 'Current Plan' : isFree ? 'Get Started' : loading ? 'Loading...' : 'Subscribe'}
      </button>
    </div>
  )
}
```

## Customer Portal Button

```typescript
// src/components/billing/manage-subscription-button.tsx
'use client'

import { useState } from 'react'
import { createPortalAction } from '@/actions/billing-actions'

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await createPortalAction()
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Loading...' : 'Manage Subscription'}
    </button>
  )
}
```

## Current Plan Display

```typescript
// src/components/billing/current-plan.tsx
import { subscriptionService } from '@/services/subscription-service'
import { requireAuth } from '@/lib/auth'
import { PLANS } from '@/config/plans'
import { ManageSubscriptionButton } from './manage-subscription-button'

export async function CurrentPlan() {
  const user = await requireAuth()
  const subscription = await subscriptionService.getSubscription(user.id)
  const planId = await subscriptionService.getPlan(user.id)
  const plan = PLANS[planId]

  return (
    <div className="border rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{plan.name} Plan</h3>
          <p className="text-sm text-muted-foreground">
            {subscription?.status === 'active' && 'Active'}
            {subscription?.status === 'trialing' && 'Trial'}
            {subscription?.cancelAtPeriodEnd && ' • Cancels at period end'}
          </p>
        </div>
        {planId !== 'free' && <ManageSubscriptionButton />}
      </div>

      {subscription?.currentPeriodEnd && (
        <p className="text-sm text-muted-foreground mt-4">
          {subscription.cancelAtPeriodEnd ? 'Access until' : 'Renews'}{' '}
          {subscription.currentPeriodEnd.toLocaleDateString()}
        </p>
      )}
    </div>
  )
}
```

## Usage Display

```typescript
// src/components/billing/usage-display.tsx
import { subscriptionService } from '@/services/subscription-service'
import { projectRepository } from '@/repositories/project-repository'
import { requireAuth } from '@/lib/auth'

export async function UsageDisplay() {
  const user = await requireAuth()
  
  const [projectCount, projectLimit] = await Promise.all([
    projectRepository.countByUserId(user.id),
    subscriptionService.getLimit(user.id, 'projects'),
  ])

  const percentage = projectLimit === -1 ? 0 : (projectCount / projectLimit) * 100

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold mb-4">Usage</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Projects</span>
            <span>
              {projectCount} / {projectLimit === -1 ? '∞' : projectLimit}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Upgrade Prompt

```typescript
// src/components/billing/upgrade-prompt.tsx
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface UpgradePromptProps {
  feature: string
  plan?: string
}

export function UpgradePrompt({ feature, plan = 'Pro' }: UpgradePromptProps) {
  return (
    <div className="border border-dashed rounded-lg p-8 text-center">
      <Sparkles className="w-8 h-8 mx-auto text-primary mb-4" />
      <h3 className="font-semibold">Upgrade to {plan}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {feature} requires a {plan} subscription
      </p>
      <Link
        href="/pricing"
        className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg"
      >
        View Plans
      </Link>
    </div>
  )
}
```

## Billing Settings Page

```typescript
// src/app/(dashboard)/settings/billing/page.tsx
import { CurrentPlan } from '@/components/billing/current-plan'
import { UsageDisplay } from '@/components/billing/usage-display'
import { BillingHistory } from '@/components/billing/billing-history'

export default function BillingSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing
        </p>
      </div>

      <CurrentPlan />
      <UsageDisplay />
      <BillingHistory />
    </div>
  )
}
```

## Billing History

```typescript
// src/components/billing/billing-history.tsx
import { stripe } from '@/lib/payments/stripe'
import { subscriptionRepository } from '@/repositories/subscription-repository'
import { requireAuth } from '@/lib/auth'

export async function BillingHistory() {
  const user = await requireAuth()
  const subscription = await subscriptionRepository.findByUserId(user.id)

  if (!subscription?.stripeCustomerId) {
    return null
  }

  const invoices = await stripe.invoices.list({
    customer: subscription.stripeCustomerId,
    limit: 10,
  })

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold mb-4">Billing History</h3>

      {invoices.data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No invoices yet</p>
      ) : (
        <div className="space-y-3">
          {invoices.data.map((invoice) => (
            <div key={invoice.id} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">
                  {new Date(invoice.created * 1000).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {invoice.status}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  ${(invoice.amount_paid / 100).toFixed(2)}
                </p>
                {invoice.invoice_pdf && (
                  <a
                    href={invoice.invoice_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary"
                  >
                    Download
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```