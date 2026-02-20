# Event Tracking Patterns

## Client-Side Tracking

### Using the Hook

```typescript
'use client'

import { useAnalytics } from '@/hooks/use-analytics'

export function CreateProjectButton() {
  const { track } = useAnalytics()

  const handleClick = () => {
    track('create_project_clicked', {
      source: 'dashboard',
    })
  }

  return <button onClick={handleClick}>Create Project</button>
}
```

### Using PostHog Directly

```typescript
'use client'

import { usePostHog } from 'posthog-js/react'

export function PricingPage() {
  const posthog = usePostHog()

  const handlePlanSelect = (plan: string) => {
    posthog.capture('plan_selected', {
      plan,
      price: PLANS[plan].price,
      interval: 'monthly',
    })
  }

  return (
    <div>
      {Object.keys(PLANS).map(plan => (
        <button key={plan} onClick={() => handlePlanSelect(plan)}>
          {plan}
        </button>
      ))}
    </div>
  )
}
```

### Form Tracking

```typescript
'use client'

import { useAnalytics } from '@/hooks/use-analytics'

export function ContactForm() {
  const { track } = useAnalytics()

  const handleSubmit = async (data: FormData) => {
    track('form_submitted', {
      form_name: 'contact',
      fields_count: Object.keys(data).length,
    })

    await submitForm(data)

    track('form_submission_success', {
      form_name: 'contact',
    })
  }

  const handleError = (error: Error) => {
    track('form_submission_error', {
      form_name: 'contact',
      error: error.message,
    })
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

## Server-Side Tracking

### In Server Actions

```typescript
// src/actions/project-actions.ts
'use server'

import { posthogServer } from '@/lib/analytics/server'
import { requireAuth } from '@/lib/auth'

export async function createProjectAction(input: CreateProjectInput) {
  const user = await requireAuth()

  const project = await projectService.create(user.id, input)

  // Track on server
  posthogServer.capture({
    distinctId: user.id,
    event: 'project_created',
    properties: {
      project_id: project.id,
      project_name: project.name,
      template: input.template,
      $set: {
        total_projects: await projectRepository.countByUserId(user.id),
      },
    },
  })

  return project
}
```

### In Webhooks

```typescript
// src/app/api/webhooks/stripe/route.ts
import { posthogServer } from '@/lib/analytics/server'

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId

  if (userId) {
    posthogServer.capture({
      distinctId: userId,
      event: 'subscription_created',
      properties: {
        plan: session.metadata?.plan,
        amount: session.amount_total,
        currency: session.currency,
      },
      $set: {
        subscription_status: 'active',
        plan: session.metadata?.plan,
      },
    })
  }
}
```

## User Identification

### On Sign Up

```typescript
// src/app/api/webhooks/clerk/route.ts
import { posthogServer } from '@/lib/analytics/server'

async function handleUserCreated(data: ClerkUserData) {
  posthogServer.capture({
    distinctId: data.id,
    event: 'signed_up',
    properties: {
      email: data.email_addresses[0]?.email_address,
      method: data.external_accounts?.[0]?.provider || 'email',
    },
    $set: {
      email: data.email_addresses[0]?.email_address,
      name: `${data.first_name} ${data.last_name}`.trim(),
      created_at: data.created_at,
    },
  })
}
```

### Update User Properties

```typescript
// When user upgrades
posthogServer.capture({
  distinctId: userId,
  event: 'subscription_upgraded',
  properties: { new_plan: 'pro' },
  $set: {
    plan: 'pro',
    upgraded_at: new Date().toISOString(),
  },
})

// When user completes onboarding
posthogServer.capture({
  distinctId: userId,
  event: 'onboarding_completed',
  $set: {
    onboarding_completed: true,
    onboarding_completed_at: new Date().toISOString(),
  },
})
```

## Group Analytics

Track organizations/teams:

```typescript
// When user joins team
posthogServer.groupIdentify({
  groupType: 'company',
  groupKey: team.id,
  properties: {
    name: team.name,
    plan: team.plan,
    member_count: team.members.length,
    created_at: team.createdAt,
  },
})

// Associate user with group
posthogServer.capture({
  distinctId: userId,
  event: 'team_joined',
  groups: { company: team.id },
})
```

## Tracking Funnel Events

### Sign-up Funnel

```typescript
// Step 1: Viewed pricing
track('funnel_viewed_pricing')

// Step 2: Selected plan
track('funnel_selected_plan', { plan: 'pro' })

// Step 3: Started checkout
track('funnel_started_checkout', { plan: 'pro' })

// Step 4: Completed purchase
track('funnel_completed_purchase', { plan: 'pro', amount: 29 })
```

### Onboarding Funnel

```typescript
track('onboarding_started')
track('onboarding_step_completed', { step: 1, step_name: 'profile' })
track('onboarding_step_completed', { step: 2, step_name: 'workspace' })
track('onboarding_step_completed', { step: 3, step_name: 'invite' })
track('onboarding_completed', { total_time_seconds: 120 })
```

## Time Tracking

```typescript
// Start timing
const startTime = Date.now()

// ... user does something ...

// Track with duration
track('wizard_completed', {
  duration_seconds: Math.round((Date.now() - startTime) / 1000),
  steps_completed: 5,
})
```

## Error Tracking

```typescript
try {
  await riskyOperation()
} catch (error) {
  track('error_occurred', {
    error_type: error.name,
    error_message: error.message,
    page: window.location.pathname,
    action: 'create_project',
  })
  throw error
}
```

## A/B Test Event Tracking

```typescript
'use client'

import { usePostHog } from 'posthog-js/react'

export function CTAButton() {
  const posthog = usePostHog()
  const variant = posthog.getFeatureFlag('cta-experiment')

  const handleClick = () => {
    posthog.capture('cta_clicked', {
      variant,
      experiment: 'cta-experiment',
    })
  }

  return (
    <button onClick={handleClick}>
      {variant === 'test' ? 'Start Free Trial' : 'Get Started'}
    </button>
  )
}
```

## Best Practices

1. **Use snake_case for events** - `project_created` not `projectCreated`
2. **Be consistent with property names** - Always `user_id` not sometimes `userId`
3. **Track both start and end** - `checkout_started` and `checkout_completed`
4. **Include context** - source, referrer, page
5. **Don't track PII in properties** - No passwords, full credit cards
6. **Use $set for user properties** - Update user profile with events