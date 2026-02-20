---
name: nextjs-background-jobs
description: "Background job processing for Next.js applications using Inngest. Use when implementing async tasks, scheduled jobs, email queues, webhook processing, long-running operations, or any work that should happen outside the request cycle. Covers job definitions, retries, scheduling, and progress tracking."
---

# Next.js Background Jobs with Inngest

## When to Read Which Reference

| Task | Read This |
|------|-----------|
| Initial setup | This file (Quick Start below) |
| Job patterns & examples | [references/job-patterns.md](references/job-patterns.md) |
| Scheduling & cron jobs | [references/scheduling.md](references/scheduling.md) |
| Error handling & retries | [references/reliability.md](references/reliability.md) |

## Quick Start

### 1. Install

```bash
npm install inngest
```

### 2. Create Inngest Client

```typescript
// src/lib/inngest/client.ts
import { Inngest } from 'inngest'

export const inngest = new Inngest({
  id: 'my-app',
  schemas: new EventSchemas().fromRecord<Events>(),
})

// Define your event types
type Events = {
  'user/created': { data: { userId: string; email: string } }
  'email/send': { data: { to: string; template: string; data: Record<string, any> } }
  'report/generate': { data: { userId: string; reportType: string } }
}
```

### 3. Create API Route

```typescript
// src/app/api/inngest/route.ts
import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'
import { functions } from '@/lib/inngest/functions'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
})
```

### 4. Define a Function

```typescript
// src/lib/inngest/functions/send-welcome-email.ts
import { inngest } from '../client'
import { emailService } from '@/lib/email'

export const sendWelcomeEmail = inngest.createFunction(
  { id: 'send-welcome-email' },
  { event: 'user/created' },
  async ({ event }) => {
    const { userId, email } = event.data
    
    await emailService.sendWelcome(email, userId)
    
    return { success: true }
  }
)
```

### 5. Export All Functions

```typescript
// src/lib/inngest/functions/index.ts
import { sendWelcomeEmail } from './send-welcome-email'
import { generateReport } from './generate-report'
import { processWebhook } from './process-webhook'

export const functions = [
  sendWelcomeEmail,
  generateReport,
  processWebhook,
]
```

### 6. Trigger a Job

```typescript
// From anywhere in your app
import { inngest } from '@/lib/inngest/client'

// In a server action or API route
await inngest.send({
  name: 'user/created',
  data: { userId: 'user_123', email: 'user@example.com' },
})
```

## Clean Architecture Integration

```
┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION: Job status UI, progress indicators            │
│ Location: src/components/jobs/                              │
├─────────────────────────────────────────────────────────────┤
│ APPLICATION: API route, trigger jobs from actions           │
│ Location: src/app/api/inngest/, src/actions/                │
├─────────────────────────────────────────────────────────────┤
│ DOMAIN: Job functions (business logic)                      │
│ Location: src/lib/inngest/functions/                        │
├─────────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE: Inngest client, job repository              │
│ Location: src/lib/inngest/client.ts                         │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/
├── app/
│   └── api/
│       └── inngest/route.ts          # Inngest API handler
├── lib/
│   └── inngest/
│       ├── client.ts                 # Inngest client & event types
│       └── functions/
│           ├── index.ts              # Export all functions
│           ├── send-welcome-email.ts
│           ├── generate-report.ts
│           ├── process-webhook.ts
│           └── scheduled-cleanup.ts
├── actions/
│   └── job-actions.ts                # Server actions to trigger jobs
└── types/
    └── jobs.ts                       # Job-related types
```

## Common Job Patterns

### Email Queue

```typescript
// src/lib/inngest/functions/send-email.ts
import { inngest } from '../client'
import { emailService } from '@/lib/email'

export const sendEmail = inngest.createFunction(
  { 
    id: 'send-email',
    retries: 3,
    concurrency: { limit: 10 }, // Max 10 concurrent
  },
  { event: 'email/send' },
  async ({ event }) => {
    const { to, template, data } = event.data
    await emailService.send(to, template, data)
    return { sent: true }
  }
)
```

### Report Generation

```typescript
// src/lib/inngest/functions/generate-report.ts
import { inngest } from '../client'
import { reportService } from '@/services/report-service'

export const generateReport = inngest.createFunction(
  { id: 'generate-report' },
  { event: 'report/generate' },
  async ({ event, step }) => {
    const { userId, reportType } = event.data

    // Step 1: Fetch data
    const data = await step.run('fetch-data', async () => {
      return reportService.fetchData(userId, reportType)
    })

    // Step 2: Generate PDF
    const pdf = await step.run('generate-pdf', async () => {
      return reportService.generatePdf(data)
    })

    // Step 3: Upload & notify
    await step.run('upload-and-notify', async () => {
      const url = await reportService.upload(pdf)
      await emailService.sendReportReady(userId, url)
    })

    return { success: true }
  }
)
```

### Scheduled Cleanup

```typescript
// src/lib/inngest/functions/scheduled-cleanup.ts
import { inngest } from '../client'
import { cleanupService } from '@/services/cleanup-service'

export const scheduledCleanup = inngest.createFunction(
  { id: 'scheduled-cleanup' },
  { cron: '0 3 * * *' }, // Daily at 3 AM
  async () => {
    await cleanupService.deleteExpiredSessions()
    await cleanupService.deleteOldLogs()
    return { cleaned: true }
  }
)
```

## Triggering Jobs

### From Server Actions

```typescript
// src/actions/user-actions.ts
'use server'

import { inngest } from '@/lib/inngest/client'
import { userRepository } from '@/repositories/user-repository'

export async function createUserAction(data: CreateUserInput) {
  const user = await userRepository.create(data)

  // Trigger background job
  await inngest.send({
    name: 'user/created',
    data: { userId: user.id, email: user.email },
  })

  return user
}
```

### From Webhooks

```typescript
// src/app/api/webhooks/stripe/route.ts
import { inngest } from '@/lib/inngest/client'

export async function POST(req: Request) {
  // ... verify webhook

  // Queue for background processing
  await inngest.send({
    name: 'webhook/stripe',
    data: { event: stripeEvent },
  })

  // Return immediately
  return new Response('OK')
}
```

### Batch Send

```typescript
// Send multiple events
await inngest.send([
  { name: 'email/send', data: { to: 'a@example.com', template: 'welcome' } },
  { name: 'email/send', data: { to: 'b@example.com', template: 'welcome' } },
  { name: 'email/send', data: { to: 'c@example.com', template: 'welcome' } },
])
```

## Development

### Local Dev Server

```bash
npx inngest-cli@latest dev
```

This starts a local Inngest dev server at http://localhost:8288 where you can:
- View all registered functions
- Trigger events manually
- See execution logs
- Debug failed jobs

### Environment Variables

```env
# Production only - get from Inngest dashboard
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...
```

## Key Rules

1. **Inngest client in `lib/inngest/`** - Infrastructure layer
2. **Functions contain business logic** - Like services
3. **Use steps for long operations** - Enables retries per step
4. **Trigger from actions/webhooks** - Not from components
5. **Return quickly from webhooks** - Queue for background processing