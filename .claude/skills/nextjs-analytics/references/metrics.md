# Dashboard & Metrics

## Key SaaS Metrics to Track

### Acquisition

| Metric | Event | Properties |
|--------|-------|------------|
| Sign-ups | `signed_up` | method, referrer, utm_* |
| Activations | `onboarding_completed` | time_to_complete |
| Trial starts | `trial_started` | plan |

### Engagement

| Metric | Event | Properties |
|--------|-------|------------|
| DAU/MAU | `$pageview` | Automatic |
| Feature usage | `feature_used` | feature_name |
| Sessions | `$session_start` | Automatic |
| Time in app | `$pageleave` | Automatic |

### Revenue

| Metric | Event | Properties |
|--------|-------|------------|
| Conversion | `subscription_created` | plan, amount |
| Upgrades | `subscription_upgraded` | from_plan, to_plan |
| Churn | `subscription_cancelled` | reason |
| Revenue | `payment_received` | amount, currency |

### Retention

| Metric | Event | Properties |
|--------|-------|------------|
| Return visits | `$pageview` | days_since_signup |
| Feature retention | `feature_used` | days_since_first_use |

## Setting Up Dashboards

### Acquisition Dashboard

```sql
-- Sign-ups over time
SELECT 
  date_trunc('day', timestamp) as day,
  count(distinct distinct_id) as signups
FROM events
WHERE event = 'signed_up'
GROUP BY 1
ORDER BY 1

-- Sign-ups by source
SELECT 
  properties->>'referrer' as source,
  count(*) as signups
FROM events
WHERE event = 'signed_up'
GROUP BY 1
ORDER BY 2 DESC
```

### Revenue Dashboard

```sql
-- MRR by plan
SELECT
  properties->>'plan' as plan,
  sum((properties->>'amount')::numeric) as mrr
FROM events
WHERE event = 'subscription_created'
  AND timestamp > now() - interval '30 days'
GROUP BY 1

-- Conversion funnel
SELECT
  count(case when event = 'signed_up' then 1 end) as signups,
  count(case when event = 'trial_started' then 1 end) as trials,
  count(case when event = 'subscription_created' then 1 end) as conversions
FROM events
WHERE timestamp > now() - interval '30 days'
```

## Custom User Properties

Track user state for segmentation:

```typescript
// When user upgrades
posthog.capture('subscription_created', {
  plan: 'pro',
  $set: {
    plan: 'pro',
    subscription_status: 'active',
    upgraded_at: new Date().toISOString(),
    lifetime_value: calculateLTV(user),
  },
})

// When user completes onboarding
posthog.capture('onboarding_completed', {
  $set: {
    onboarding_completed: true,
    activation_date: new Date().toISOString(),
  },
})

// Track usage counts
posthog.capture('project_created', {
  $set: {
    total_projects: projectCount,
    last_project_created: new Date().toISOString(),
  },
})
```

## Cohort Analysis

### Define Cohorts

In PostHog:
1. Go to Cohorts
2. Create cohort with criteria:
   - Users who performed `subscription_created` in last 7 days
   - Users who have property `plan = 'pro'`
   - Users in group `company` with `plan = 'enterprise'`

### Track by Cohort

```typescript
// Track which cohort triggered an event
const userCohorts = await posthogServer.getAllFlags(userId)

posthog.capture('feature_used', {
  feature: 'export',
  user_cohorts: userCohorts,
})
```

## Funnel Analysis

### Define Funnel Steps

1. **Awareness**: `$pageview` on `/pricing`
2. **Interest**: `plan_selected`
3. **Desire**: `checkout_started`
4. **Action**: `subscription_created`

### Track Funnel Progress

```typescript
// Step 1
track('funnel_pricing_viewed')

// Step 2
track('funnel_plan_selected', { plan: 'pro' })

// Step 3
track('funnel_checkout_started', { plan: 'pro' })

// Step 4 (usually server-side in webhook)
track('funnel_subscription_created', { plan: 'pro', amount: 29 })
```

## Session Recording Integration

```typescript
// src/components/providers/posthog-provider.tsx
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  
  // Session recording settings
  session_recording: {
    maskAllInputs: true,           // Mask input values
    maskTextContent: false,        // Show text content
    recordCrossOriginIframes: false,
  },
  
  // Only record for paying users
  loaded: (posthog) => {
    if (user?.plan === 'free') {
      posthog.sessionRecording?.disable()
    }
  },
})
```

## Real-Time Alerts

Set up in PostHog Actions:

1. **Spike in errors**
   - Event: `error_occurred`
   - Threshold: > 100 in 5 minutes
   - Action: Slack notification

2. **Payment failures**
   - Event: `payment_failed`
   - Threshold: > 10 in 1 hour
   - Action: Slack + Email

3. **High-value conversion**
   - Event: `subscription_created`
   - Filter: `properties.plan = 'enterprise'`
   - Action: Slack celebration 🎉

## Export Data

### API Export

```typescript
import { PostHog } from 'posthog-node'

const posthog = new PostHog(process.env.POSTHOG_API_KEY!)

// Query events
const events = await posthog.api.get('/api/event/', {
  searchParams: {
    event: 'subscription_created',
    after: '2024-01-01',
  },
})
```

### Webhook to Data Warehouse

Configure in PostHog:
1. Go to Data Pipeline
2. Add destination (BigQuery, Snowflake, etc.)
3. Configure sync schedule

## Privacy & Compliance

```typescript
// Don't track sensitive pages
if (pathname.includes('/settings/billing')) {
  posthog.capture('$pageview', {
    $current_url: '/settings/billing', // Mask actual URL
  })
  return
}

// Opt-out support
export function PrivacySettings() {
  const posthog = usePostHog()
  
  const handleOptOut = () => {
    posthog.opt_out_capturing()
    posthog.reset()
  }

  const handleOptIn = () => {
    posthog.opt_in_capturing()
  }

  return (
    <div>
      <button onClick={handleOptOut}>Opt Out of Analytics</button>
      <button onClick={handleOptIn}>Opt In to Analytics</button>
    </div>
  )
}
```