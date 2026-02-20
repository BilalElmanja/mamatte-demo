---
name: nextjs-analytics
description: "Product analytics for Next.js applications using PostHog. Use when implementing event tracking, user identification, feature flags, A/B testing, session recording, or product metrics. Covers client and server tracking, user identification with Clerk, and analytics dashboards."
---

# Next.js Analytics with PostHog

## When to Read Which Reference

| Task | Read This |
|------|-----------|
| Initial setup | This file (Quick Start below) |
| Event tracking patterns | [references/tracking.md](references/tracking.md) |
| Feature flags & experiments | [references/feature-flags.md](references/feature-flags.md) |
| Dashboard & metrics | [references/metrics.md](references/metrics.md) |

## Quick Start

### 1. Install

```bash
npm install posthog-js posthog-node
```

### 2. Environment Variables

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
# Or self-hosted: https://posthog.yourdomain.com
```

### 3. Create PostHog Provider

```typescript
// src/components/providers/posthog-provider.tsx
'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'

export function PHProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, userId } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // We capture manually
      capture_pageleave: true,
    })
  }, [])

  // Identify user when signed in
  useEffect(() => {
    if (isSignedIn && userId && user) {
      posthog.identify(userId, {
        email: user.emailAddresses[0]?.emailAddress,
        name: user.fullName,
        createdAt: user.createdAt,
      })
    } else if (!isSignedIn) {
      posthog.reset()
    }
  }, [isSignedIn, userId, user])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
```

### 4. Add to Layout

```typescript
// src/app/layout.tsx
import { PHProvider } from '@/components/providers/posthog-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <PHProvider>
          {children}
        </PHProvider>
      </body>
    </html>
  )
}
```

### 5. Track Page Views

```typescript
// src/components/providers/pageview-tracker.tsx
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

export function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + '?' + searchParams.toString()
      }
      posthog.capture('$pageview', { '$current_url': url })
    }
  }, [pathname, searchParams, posthog])

  return null
}
```

### 6. Track Events

```typescript
'use client'

import { usePostHog } from 'posthog-js/react'

export function UpgradeButton() {
  const posthog = usePostHog()

  const handleClick = () => {
    posthog.capture('upgrade_clicked', {
      plan: 'pro',
      source: 'pricing_page',
    })
  }

  return <button onClick={handleClick}>Upgrade</button>
}
```

## Clean Architecture Integration

```
┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION: Tracking hooks, provider, pageview tracker    │
│ Location: src/components/providers/, src/hooks/             │
├─────────────────────────────────────────────────────────────┤
│ APPLICATION: Server-side tracking in actions                │
│ Location: src/actions/                                      │
├─────────────────────────────────────────────────────────────┤
│ DOMAIN: Analytics service (what events mean)                │
│ Location: src/services/analytics-service.ts                 │
├─────────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE: PostHog clients                             │
│ Location: src/lib/analytics/                                │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/
├── components/
│   └── providers/
│       ├── posthog-provider.tsx    # Client provider
│       └── pageview-tracker.tsx    # Automatic pageviews
├── hooks/
│   └── use-analytics.ts            # Analytics hook
├── lib/
│   └── analytics/
│       ├── client.ts               # Browser PostHog
│       ├── server.ts               # Server PostHog
│       └── events.ts               # Event definitions
├── services/
│   └── analytics-service.ts        # Analytics business logic
└── actions/
    └── analytics-actions.ts        # Server-side tracking
```

## Server-Side Tracking

```typescript
// src/lib/analytics/server.ts
import { PostHog } from 'posthog-node'

export const posthogServer = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
})

// Important: Call this in your shutdown handler
// posthogServer.shutdown()
```

```typescript
// src/actions/project-actions.ts
'use server'

import { posthogServer } from '@/lib/analytics/server'
import { requireAuth } from '@/lib/auth'

export async function createProjectAction(input: CreateProjectInput) {
  const user = await requireAuth()
  
  const project = await projectService.create(user.id, input)

  // Track server-side
  posthogServer.capture({
    distinctId: user.id,
    event: 'project_created',
    properties: {
      projectId: project.id,
      projectName: project.name,
    },
  })

  return project
}
```

## Analytics Hook

```typescript
// src/hooks/use-analytics.ts
'use client'

import { usePostHog } from 'posthog-js/react'
import { useCallback } from 'react'

export function useAnalytics() {
  const posthog = usePostHog()

  const track = useCallback((event: string, properties?: Record<string, any>) => {
    posthog?.capture(event, properties)
  }, [posthog])

  const identify = useCallback((userId: string, traits?: Record<string, any>) => {
    posthog?.identify(userId, traits)
  }, [posthog])

  const reset = useCallback(() => {
    posthog?.reset()
  }, [posthog])

  return { track, identify, reset, posthog }
}
```

## Event Definitions

```typescript
// src/lib/analytics/events.ts
export const ANALYTICS_EVENTS = {
  // Auth
  SIGNED_UP: 'signed_up',
  SIGNED_IN: 'signed_in',
  SIGNED_OUT: 'signed_out',

  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  ONBOARDING_COMPLETED: 'onboarding_completed',

  // Projects
  PROJECT_CREATED: 'project_created',
  PROJECT_UPDATED: 'project_updated',
  PROJECT_DELETED: 'project_deleted',

  // Billing
  UPGRADE_CLICKED: 'upgrade_clicked',
  CHECKOUT_STARTED: 'checkout_started',
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',

  // Features
  FEATURE_USED: 'feature_used',
  EXPORT_CREATED: 'export_created',
  INVITE_SENT: 'invite_sent',
} as const

export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]
```

## Feature Flags

```typescript
'use client'

import { useFeatureFlagEnabled } from 'posthog-js/react'

export function NewFeature() {
  const showNewFeature = useFeatureFlagEnabled('new-feature-flag')

  if (!showNewFeature) {
    return <OldFeature />
  }

  return <NewFeatureComponent />
}
```

## Key Events to Track

| Event | When | Properties |
|-------|------|------------|
| `signed_up` | User creates account | method, referrer |
| `signed_in` | User logs in | method |
| `project_created` | New project | name, template |
| `upgrade_clicked` | Click upgrade CTA | source, plan |
| `checkout_started` | Begin checkout | plan, interval |
| `subscription_created` | Payment success | plan, amount |
| `feature_used` | Use key feature | feature_name |

## Key Rules

1. **Client tracking for UI events** - Clicks, views, interactions
2. **Server tracking for business events** - Purchases, sign-ups
3. **Always identify users** - Link events to user profiles
4. **Define events centrally** - Use constants, not strings
5. **Track properties that matter** - Don't over-track