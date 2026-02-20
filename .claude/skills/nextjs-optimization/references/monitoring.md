# Performance Monitoring

## Real User Monitoring (RUM)

### Next.js Web Vitals

```typescript
// app/providers.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { usePathname } from 'next/navigation'

export function PerformanceMonitor() {
  const pathname = usePathname()
  
  useReportWebVitals((metric) => {
    const body = {
      name: metric.name,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      page: pathname,
      timestamp: Date.now(),
    }
    
    // Send to your analytics endpoint
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', JSON.stringify(body))
    } else {
      fetch('/api/analytics/vitals', {
        method: 'POST',
        body: JSON.stringify(body),
        keepalive: true,
      })
    }
  })
  
  return null
}
```

### Vitals API Endpoint

```typescript
// app/api/analytics/vitals/route.ts
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const vitals = await request.json()
  
  // Log to your monitoring service
  console.log('[Web Vitals]', vitals)
  
  // Send to PostHog, Datadog, etc.
  await fetch(process.env.ANALYTICS_ENDPOINT!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'web_vitals',
      properties: vitals,
    }),
  })
  
  return new Response('OK')
}
```

## PostHog Performance Tracking

```typescript
// lib/analytics/performance.ts
import posthog from 'posthog-js'

export function trackPerformance() {
  // Track page load time
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      posthog.capture('page_load', {
        dns_time: navigation.domainLookupEnd - navigation.domainLookupStart,
        connect_time: navigation.connectEnd - navigation.connectStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        dom_load_time: navigation.domContentLoadedEventEnd - navigation.responseEnd,
        window_load_time: navigation.loadEventEnd - navigation.responseEnd,
        total_load_time: navigation.loadEventEnd - navigation.startTime,
      })
    })
  }
}

// Track slow interactions
export function trackSlowInteraction(interactionName: string, duration: number) {
  if (duration > 100) {  // Threshold: 100ms
    posthog.capture('slow_interaction', {
      interaction: interactionName,
      duration,
      page: window.location.pathname,
    })
  }
}
```

## Database Query Monitoring

### Prisma Query Logging

```typescript
// lib/db/index.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
  ],
})

// Log slow queries (> 100ms)
prisma.$on('query', (e) => {
  if (e.duration > 100) {
    console.warn(`[Slow Query] ${e.duration}ms`, {
      query: e.query,
      params: e.params,
      duration: e.duration,
    })
    
    // Send to monitoring
    trackSlowQuery(e.query, e.duration)
  }
})

function trackSlowQuery(query: string, duration: number) {
  // Send to your monitoring service
  fetch('/api/analytics/slow-queries', {
    method: 'POST',
    body: JSON.stringify({ query, duration }),
  })
}

export { prisma }
```

### Query Performance Dashboard

```typescript
// Track query metrics
interface QueryMetric {
  query: string
  duration: number
  timestamp: Date
  route: string
}

class QueryMetricsCollector {
  private metrics: QueryMetric[] = []
  
  add(metric: QueryMetric) {
    this.metrics.push(metric)
    
    // Flush every 100 queries or 60 seconds
    if (this.metrics.length >= 100) {
      this.flush()
    }
  }
  
  async flush() {
    if (this.metrics.length === 0) return
    
    const toSend = [...this.metrics]
    this.metrics = []
    
    await fetch('/api/analytics/queries', {
      method: 'POST',
      body: JSON.stringify({ metrics: toSend }),
    })
  }
  
  getStats() {
    const durations = this.metrics.map(m => m.duration)
    return {
      count: durations.length,
      avg: durations.reduce((a, b) => a + b, 0) / durations.length,
      p50: this.percentile(durations, 50),
      p95: this.percentile(durations, 95),
      p99: this.percentile(durations, 99),
    }
  }
  
  private percentile(arr: number[], p: number) {
    const sorted = [...arr].sort((a, b) => a - b)
    const index = Math.ceil((p / 100) * sorted.length) - 1
    return sorted[index]
  }
}
```

## API Response Time Monitoring

### Middleware Timing

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const start = Date.now()
  const response = NextResponse.next()
  
  // Add timing header
  response.headers.set('Server-Timing', `total;dur=${Date.now() - start}`)
  
  return response
}
```

### API Route Wrapper

```typescript
// lib/api/with-monitoring.ts
import { NextRequest, NextResponse } from 'next/server'

type Handler = (req: NextRequest) => Promise<NextResponse>

export function withMonitoring(handler: Handler): Handler {
  return async (req: NextRequest) => {
    const start = Date.now()
    const route = req.nextUrl.pathname
    
    try {
      const response = await handler(req)
      const duration = Date.now() - start
      
      // Log slow responses
      if (duration > 500) {
        console.warn(`[Slow API] ${route}: ${duration}ms`)
      }
      
      // Add timing header
      response.headers.set('X-Response-Time', `${duration}ms`)
      
      // Track metrics
      trackApiMetric(route, duration, response.status)
      
      return response
    } catch (error) {
      const duration = Date.now() - start
      trackApiMetric(route, duration, 500)
      throw error
    }
  }
}

// Usage
export const GET = withMonitoring(async (req) => {
  // Your handler logic
  return NextResponse.json({ data: 'example' })
})
```

## Bundle Size Monitoring

### Build-time Analysis

```javascript
// scripts/analyze-bundle.js
const fs = require('fs')
const path = require('path')

function analyzeBuild() {
  const buildManifest = JSON.parse(
    fs.readFileSync('.next/build-manifest.json', 'utf8')
  )
  
  const stats = {
    pages: {},
    totalSize: 0,
    largestPage: { name: '', size: 0 },
  }
  
  for (const [page, files] of Object.entries(buildManifest.pages)) {
    const pageSize = files.reduce((total, file) => {
      const filePath = path.join('.next', file)
      if (fs.existsSync(filePath)) {
        return total + fs.statSync(filePath).size
      }
      return total
    }, 0)
    
    stats.pages[page] = pageSize
    stats.totalSize += pageSize
    
    if (pageSize > stats.largestPage.size) {
      stats.largestPage = { name: page, size: pageSize }
    }
  }
  
  console.log('Bundle Analysis:')
  console.log('================')
  console.log(`Total Size: ${(stats.totalSize / 1024).toFixed(2)} KB`)
  console.log(`Largest Page: ${stats.largestPage.name} (${(stats.largestPage.size / 1024).toFixed(2)} KB)`)
  
  // Warn if any page exceeds 200KB
  for (const [page, size] of Object.entries(stats.pages)) {
    if (size > 200 * 1024) {
      console.warn(`⚠️ ${page} exceeds 200KB: ${(size / 1024).toFixed(2)} KB`)
    }
  }
  
  return stats
}

analyzeBuild()
```

### CI Bundle Check

```yaml
# .github/workflows/bundle-check.yml
name: Bundle Size Check

on: [pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      
      - name: Check bundle size
        run: node scripts/analyze-bundle.js
        
      - name: Compare to main
        uses: preactjs/compressed-size-action@v2
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          pattern: '.next/**/*.js'
```

## Alerting

### Performance Degradation Alerts

```typescript
// lib/monitoring/alerts.ts
interface PerformanceThresholds {
  lcp: number
  fid: number
  cls: number
  ttfb: number
  queryTime: number
}

const thresholds: PerformanceThresholds = {
  lcp: 2500,      // 2.5s
  fid: 100,       // 100ms
  cls: 0.1,       // 0.1
  ttfb: 500,      // 500ms
  queryTime: 100, // 100ms
}

export function checkThreshold(metric: string, value: number) {
  const threshold = thresholds[metric as keyof PerformanceThresholds]
  
  if (threshold && value > threshold) {
    sendAlert({
      severity: 'warning',
      metric,
      value,
      threshold,
      message: `${metric} exceeded threshold: ${value} > ${threshold}`,
    })
  }
}

async function sendAlert(alert: {
  severity: string
  metric: string
  value: number
  threshold: number
  message: string
}) {
  // Send to Slack
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    body: JSON.stringify({
      text: `🚨 Performance Alert: ${alert.message}`,
    }),
  })
  
  // Or PagerDuty, Datadog, etc.
}
```

## Dashboards

### Key Metrics to Track

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| LCP p75 | < 2.5s | > 3s |
| FID p75 | < 100ms | > 150ms |
| CLS p75 | < 0.1 | > 0.15 |
| TTFB p75 | < 200ms | > 500ms |
| DB Query p95 | < 50ms | > 100ms |
| API p95 | < 500ms | > 1s |
| Error Rate | < 0.1% | > 1% |
| Bundle Size | < 200KB | > 300KB |

### Example Grafana Dashboard Query

```sql
-- Average LCP by page (last 24h)
SELECT 
  page,
  AVG(value) as avg_lcp,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY value) as p75_lcp,
  COUNT(*) as samples
FROM web_vitals
WHERE name = 'LCP'
  AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY page
ORDER BY avg_lcp DESC;
```