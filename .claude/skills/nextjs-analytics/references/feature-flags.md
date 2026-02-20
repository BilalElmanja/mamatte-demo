# Feature Flags & Experiments

## Basic Feature Flags

### Check Flag (Client)

```typescript
'use client'

import { useFeatureFlagEnabled } from 'posthog-js/react'

export function Dashboard() {
  const showNewDashboard = useFeatureFlagEnabled('new-dashboard')

  if (showNewDashboard) {
    return <NewDashboard />
  }

  return <OldDashboard />
}
```

### Check Flag with Payload

```typescript
'use client'

import { useFeatureFlagPayload } from 'posthog-js/react'

export function Banner() {
  const bannerConfig = useFeatureFlagPayload('promo-banner')

  if (!bannerConfig) return null

  return (
    <div style={{ backgroundColor: bannerConfig.color }}>
      {bannerConfig.message}
    </div>
  )
}
```

### Multiple Flags

```typescript
'use client'

import { useActiveFeatureFlags } from 'posthog-js/react'

export function FeatureGate({ children, flag }: { children: React.ReactNode; flag: string }) {
  const activeFlags = useActiveFeatureFlags()
  
  if (!activeFlags.includes(flag)) {
    return null
  }

  return <>{children}</>
}

// Usage
<FeatureGate flag="beta-feature">
  <BetaFeature />
</FeatureGate>
```

## Server-Side Feature Flags

### In Server Components

```typescript
// src/lib/analytics/flags.ts
import { posthogServer } from './server'

export async function getFeatureFlag(userId: string, flag: string) {
  const isEnabled = await posthogServer.isFeatureEnabled(flag, userId)
  return isEnabled
}

export async function getFeatureFlags(userId: string) {
  const flags = await posthogServer.getAllFlags(userId)
  return flags
}
```

```typescript
// src/app/(dashboard)/page.tsx
import { getFeatureFlag } from '@/lib/analytics/flags'
import { requireAuth } from '@/lib/auth'

export default async function DashboardPage() {
  const user = await requireAuth()
  const showNewFeature = await getFeatureFlag(user.id, 'new-feature')

  return (
    <div>
      {showNewFeature && <NewFeature />}
      <RegularContent />
    </div>
  )
}
```

### In Server Actions

```typescript
'use server'

import { posthogServer } from '@/lib/analytics/server'
import { requireAuth } from '@/lib/auth'

export async function someAction() {
  const user = await requireAuth()
  
  const useNewAlgorithm = await posthogServer.isFeatureEnabled(
    'new-algorithm',
    user.id
  )

  if (useNewAlgorithm) {
    return newAlgorithm()
  }
  
  return oldAlgorithm()
}
```

## A/B Testing

### Simple A/B Test

```typescript
'use client'

import { useFeatureFlagVariantKey } from 'posthog-js/react'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'

export function PricingPage() {
  const posthog = usePostHog()
  const variant = useFeatureFlagVariantKey('pricing-experiment')

  // Track exposure
  useEffect(() => {
    if (variant) {
      posthog.capture('experiment_viewed', {
        experiment: 'pricing-experiment',
        variant,
      })
    }
  }, [variant, posthog])

  switch (variant) {
    case 'control':
      return <OriginalPricing />
    case 'test-a':
      return <PricingVariantA />
    case 'test-b':
      return <PricingVariantB />
    default:
      return <OriginalPricing /> // Fallback
  }
}
```

### Track Conversion

```typescript
'use client'

import { usePostHog } from 'posthog-js/react'

export function CheckoutButton({ variant }: { variant: string }) {
  const posthog = usePostHog()

  const handleClick = () => {
    posthog.capture('experiment_conversion', {
      experiment: 'pricing-experiment',
      variant,
      conversion_type: 'checkout_started',
    })
  }

  return <button onClick={handleClick}>Checkout</button>
}
```

## Feature Flag Wrapper Component

```typescript
// src/components/feature-flag.tsx
'use client'

import { useFeatureFlagEnabled, useFeatureFlagVariantKey } from 'posthog-js/react'
import { ReactNode } from 'react'

interface FeatureFlagProps {
  flag: string
  children: ReactNode
  fallback?: ReactNode
}

export function FeatureFlag({ flag, children, fallback = null }: FeatureFlagProps) {
  const isEnabled = useFeatureFlagEnabled(flag)

  if (!isEnabled) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface VariantProps {
  flag: string
  variants: Record<string, ReactNode>
  fallback?: ReactNode
}

export function Variant({ flag, variants, fallback = null }: VariantProps) {
  const variant = useFeatureFlagVariantKey(flag)

  if (!variant || !variants[variant]) {
    return <>{fallback}</>
  }

  return <>{variants[variant]}</>
}

// Usage
<FeatureFlag flag="beta-feature" fallback={<OldFeature />}>
  <NewFeature />
</FeatureFlag>

<Variant 
  flag="button-experiment"
  variants={{
    control: <BlueButton />,
    'test-a': <GreenButton />,
    'test-b': <RedButton />,
  }}
  fallback={<BlueButton />}
/>
```

## Early Access Program

```typescript
'use client'

import { useFeatureFlagEnabled } from 'posthog-js/react'

export function BetaFeatures() {
  const isBetaUser = useFeatureFlagEnabled('beta-program')

  if (!isBetaUser) {
    return (
      <div>
        <h2>Beta Features</h2>
        <p>Join our beta program to access new features early.</p>
        <JoinBetaButton />
      </div>
    )
  }

  return (
    <div>
      <h2>Beta Features</h2>
      <BetaFeatureList />
    </div>
  )
}
```

## Percentage Rollout

Configure in PostHog dashboard:
- 0% → Feature disabled for everyone
- 10% → 10% of users see the feature
- 100% → Feature enabled for everyone

```typescript
// Gradual rollout
export function NewFeature() {
  const isEnabled = useFeatureFlagEnabled('gradual-rollout-feature')

  if (!isEnabled) {
    return <OldFeature />
  }

  return <NewFeatureComponent />
}
```

## User Targeting

Target specific users in PostHog dashboard:
- By user property: `email contains @company.com`
- By group: `company.plan = 'enterprise'`
- By cohort: Users who signed up this week

```typescript
// Ensure user properties are set for targeting
posthog.identify(userId, {
  email: user.email,
  plan: user.plan,
  company_size: user.companySize,
})
```

## Override Flags (Development)

```typescript
// For testing locally
posthog.featureFlags.override({
  'new-feature': true,
  'experiment': 'test-b',
})

// Clear overrides
posthog.featureFlags.override(false)
```

## Flag Dependencies

```typescript
'use client'

import { useFeatureFlagEnabled } from 'posthog-js/react'

export function AdvancedFeature() {
  const hasBasicFeature = useFeatureFlagEnabled('basic-feature')
  const hasAdvancedFeature = useFeatureFlagEnabled('advanced-feature')

  // Advanced requires basic
  if (!hasBasicFeature) {
    return <UpgradePrompt feature="basic" />
  }

  if (!hasAdvancedFeature) {
    return <UpgradePrompt feature="advanced" />
  }

  return <AdvancedFeatureComponent />
}
```