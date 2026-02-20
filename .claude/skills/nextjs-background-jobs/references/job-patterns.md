# Job Patterns & Examples

## Function Definition

### Basic Function

```typescript
import { inngest } from '../client'

export const myFunction = inngest.createFunction(
  { id: 'my-function' },           // Function config
  { event: 'my/event' },           // Trigger
  async ({ event }) => {           // Handler
    // Do work
    return { success: true }
  }
)
```

### With Options

```typescript
export const myFunction = inngest.createFunction(
  {
    id: 'my-function',
    name: 'My Function',           // Display name
    retries: 5,                    // Max retries
    concurrency: { limit: 10 },    // Max concurrent executions
    rateLimit: {                   // Rate limiting
      limit: 100,
      period: '1m',
    },
    cancelOn: [                    // Cancel on event
      { event: 'user/deleted', match: 'data.userId' }
    ],
  },
  { event: 'my/event' },
  async ({ event }) => {
    // ...
  }
)
```

## Using Steps

Steps allow you to break work into retriable units:

```typescript
export const processOrder = inngest.createFunction(
  { id: 'process-order' },
  { event: 'order/created' },
  async ({ event, step }) => {
    // Step 1: Validate inventory
    const inventory = await step.run('validate-inventory', async () => {
      return inventoryService.check(event.data.items)
    })

    if (!inventory.available) {
      return { success: false, reason: 'out-of-stock' }
    }

    // Step 2: Charge payment
    const payment = await step.run('charge-payment', async () => {
      return paymentService.charge(event.data.paymentMethodId, event.data.total)
    })

    // Step 3: Create shipment
    const shipment = await step.run('create-shipment', async () => {
      return shippingService.createLabel(event.data.address, event.data.items)
    })

    // Step 4: Send confirmation
    await step.run('send-confirmation', async () => {
      return emailService.sendOrderConfirmation(event.data.email, {
        orderId: event.data.orderId,
        trackingNumber: shipment.trackingNumber,
      })
    })

    return { success: true, trackingNumber: shipment.trackingNumber }
  }
)
```

## Sleep & Delays

```typescript
export const delayedEmail = inngest.createFunction(
  { id: 'delayed-email' },
  { event: 'user/signed-up' },
  async ({ event, step }) => {
    // Wait 1 day before sending onboarding email
    await step.sleep('wait-1-day', '1d')

    await step.run('send-onboarding', async () => {
      return emailService.sendOnboarding(event.data.email)
    })

    // Wait 3 more days
    await step.sleep('wait-3-days', '3d')

    await step.run('send-tips', async () => {
      return emailService.sendTips(event.data.email)
    })
  }
)
```

## Wait for Event

```typescript
export const trialConversion = inngest.createFunction(
  { id: 'trial-conversion' },
  { event: 'trial/started' },
  async ({ event, step }) => {
    // Wait up to 14 days for subscription
    const subscribed = await step.waitForEvent('wait-for-subscription', {
      event: 'subscription/created',
      match: 'data.userId',
      timeout: '14d',
    })

    if (subscribed) {
      // User subscribed - send thank you
      await step.run('send-thank-you', async () => {
        return emailService.sendThankYou(event.data.email)
      })
    } else {
      // Trial expired - send winback
      await step.run('send-winback', async () => {
        return emailService.sendTrialExpired(event.data.email)
      })
    }
  }
)
```

## Fan-out Pattern

```typescript
export const notifyAllUsers = inngest.createFunction(
  { id: 'notify-all-users' },
  { event: 'announcement/created' },
  async ({ event, step }) => {
    // Get all users
    const users = await step.run('fetch-users', async () => {
      return userRepository.findAllActive()
    })

    // Send individual events for each user
    await step.sendEvent('notify-users',
      users.map(user => ({
        name: 'notification/send',
        data: {
          userId: user.id,
          message: event.data.message,
        },
      }))
    )

    return { notified: users.length }
  }
)

// Individual notification handler
export const sendNotification = inngest.createFunction(
  { 
    id: 'send-notification',
    concurrency: { limit: 50 }, // Process 50 at a time
  },
  { event: 'notification/send' },
  async ({ event }) => {
    await notificationService.send(event.data.userId, event.data.message)
  }
)
```

## Batch Processing

```typescript
export const processImport = inngest.createFunction(
  { id: 'process-import' },
  { event: 'import/started' },
  async ({ event, step }) => {
    const { fileUrl, userId } = event.data

    // Download and parse file
    const rows = await step.run('parse-file', async () => {
      const data = await fetch(fileUrl).then(r => r.text())
      return parseCSV(data)
    })

    // Process in batches of 100
    const batchSize = 100
    const batches = chunk(rows, batchSize)

    for (let i = 0; i < batches.length; i++) {
      await step.run(`process-batch-${i}`, async () => {
        await importService.processBatch(batches[i])
      })

      // Update progress
      await step.run(`update-progress-${i}`, async () => {
        const progress = ((i + 1) / batches.length) * 100
        await importRepository.updateProgress(event.data.importId, progress)
      })
    }

    // Mark complete
    await step.run('mark-complete', async () => {
      await importRepository.markComplete(event.data.importId)
      await emailService.sendImportComplete(userId, rows.length)
    })

    return { processed: rows.length }
  }
)

function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}
```

## Webhook Processing

```typescript
export const processStripeWebhook = inngest.createFunction(
  { 
    id: 'process-stripe-webhook',
    retries: 5,
  },
  { event: 'webhook/stripe' },
  async ({ event, step }) => {
    const stripeEvent = event.data.event

    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await step.run('handle-checkout', async () => {
          await subscriptionService.handleCheckout(stripeEvent.data.object)
        })
        break

      case 'invoice.paid':
        await step.run('handle-invoice-paid', async () => {
          await subscriptionService.handleInvoicePaid(stripeEvent.data.object)
        })
        break

      case 'customer.subscription.deleted':
        await step.run('handle-cancellation', async () => {
          await subscriptionService.handleCancellation(stripeEvent.data.object)
        })
        break
    }

    return { processed: stripeEvent.type }
  }
)
```

## Long-Running with Progress

```typescript
export const generateLargeReport = inngest.createFunction(
  { id: 'generate-large-report' },
  { event: 'report/generate-large' },
  async ({ event, step }) => {
    const { reportId, userId, dateRange } = event.data

    // Update status: started
    await step.run('mark-started', async () => {
      await reportRepository.update(reportId, { status: 'processing', progress: 0 })
    })

    // Fetch data in chunks
    const totalPages = await step.run('count-pages', async () => {
      return dataService.countPages(userId, dateRange)
    })

    const allData: any[] = []
    
    for (let page = 0; page < totalPages; page++) {
      const pageData = await step.run(`fetch-page-${page}`, async () => {
        return dataService.fetchPage(userId, dateRange, page)
      })
      allData.push(...pageData)

      // Update progress
      await step.run(`update-progress-${page}`, async () => {
        const progress = Math.round(((page + 1) / totalPages) * 50) // 0-50%
        await reportRepository.update(reportId, { progress })
      })
    }

    // Generate report
    await step.run('generate', async () => {
      await reportRepository.update(reportId, { progress: 75 })
      return reportService.generate(allData)
    })

    // Upload
    const url = await step.run('upload', async () => {
      await reportRepository.update(reportId, { progress: 90 })
      return storageService.upload(report)
    })

    // Complete
    await step.run('complete', async () => {
      await reportRepository.update(reportId, { 
        status: 'complete',
        progress: 100,
        url,
      })
      await emailService.sendReportReady(userId, url)
    })

    return { url }
  }
)
```