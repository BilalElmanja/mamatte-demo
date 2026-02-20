# Error Handling & Reliability

## Retries

### Default Retries

```typescript
export const myFunction = inngest.createFunction(
  { 
    id: 'my-function',
    retries: 5, // Max 5 retries (default is 3)
  },
  { event: 'my/event' },
  async ({ event }) => {
    // If this throws, it will retry up to 5 times
    await riskyOperation()
  }
)
```

### Custom Backoff

```typescript
export const myFunction = inngest.createFunction(
  { 
    id: 'my-function',
    retries: 5,
    backoff: {
      type: 'exponential',
      base: 30,       // 30 seconds initial delay
      factor: 2,      // Double each time: 30s, 60s, 120s, 240s, 480s
      max: 3600,      // Cap at 1 hour
    },
  },
  { event: 'my/event' },
  async ({ event }) => {
    // ...
  }
)
```

### Non-Retriable Errors

```typescript
import { NonRetriableError } from 'inngest'

export const processPayment = inngest.createFunction(
  { id: 'process-payment' },
  { event: 'payment/process' },
  async ({ event }) => {
    const { amount, cardToken } = event.data

    try {
      await paymentService.charge(amount, cardToken)
    } catch (error) {
      // Card declined - don't retry
      if (error.code === 'card_declined') {
        throw new NonRetriableError('Card declined', { cause: error })
      }
      // Network error - let it retry
      throw error
    }
  }
)
```

## Step-Level Retries

Each step is retried independently:

```typescript
export const processOrder = inngest.createFunction(
  { id: 'process-order', retries: 3 },
  { event: 'order/created' },
  async ({ event, step }) => {
    // If step 1 succeeds but step 2 fails,
    // only step 2 will be retried
    
    await step.run('step-1-charge', async () => {
      await paymentService.charge(event.data.amount)
    })

    await step.run('step-2-ship', async () => {
      await shippingService.createLabel(event.data.address)
    })

    await step.run('step-3-notify', async () => {
      await emailService.sendConfirmation(event.data.email)
    })
  }
)
```

## Idempotency

Design functions to be safely retriable:

```typescript
export const processWebhook = inngest.createFunction(
  { id: 'process-webhook' },
  { event: 'webhook/received' },
  async ({ event, step }) => {
    const { webhookId, payload } = event.data

    // Check if already processed
    const existing = await step.run('check-existing', async () => {
      return webhookRepository.findById(webhookId)
    })

    if (existing?.processed) {
      return { skipped: true, reason: 'already-processed' }
    }

    // Mark as processing (with idempotency key)
    await step.run('mark-processing', async () => {
      await webhookRepository.upsert({
        id: webhookId,
        status: 'processing',
        receivedAt: new Date(),
      })
    })

    // Process
    await step.run('process', async () => {
      await webhookService.process(payload)
    })

    // Mark as complete
    await step.run('mark-complete', async () => {
      await webhookRepository.update(webhookId, {
        status: 'complete',
        processedAt: new Date(),
      })
    })

    return { processed: true }
  }
)
```

## Timeouts

```typescript
export const longRunningJob = inngest.createFunction(
  { 
    id: 'long-running-job',
    // Function-level timeout
    cancelOn: [
      { event: 'job/cancel', match: 'data.jobId' }
    ],
  },
  { event: 'job/start' },
  async ({ event, step }) => {
    // Step-level timeout
    const result = await step.run('long-operation', async () => {
      return longOperation()
    })

    return result
  }
)
```

## Dead Letter Queue Pattern

```typescript
// Main function
export const processTask = inngest.createFunction(
  { id: 'process-task', retries: 3 },
  { event: 'task/process' },
  async ({ event }) => {
    try {
      await taskService.process(event.data)
    } catch (error) {
      // After all retries exhausted, this final throw
      // will trigger onFailure
      throw error
    }
  }
)

// Failure handler
export const handleTaskFailure = inngest.createFunction(
  { id: 'handle-task-failure' },
  { event: 'inngest/function.failed' },
  async ({ event, step }) => {
    const { function_id, event: originalEvent, error } = event.data

    if (function_id !== 'process-task') return

    // Log to dead letter table
    await step.run('log-failure', async () => {
      await deadLetterRepository.create({
        functionId: function_id,
        eventData: originalEvent,
        error: error.message,
        failedAt: new Date(),
      })
    })

    // Notify
    await step.run('notify', async () => {
      await slackService.sendAlert({
        channel: '#alerts',
        message: `Task processing failed: ${error.message}`,
        data: originalEvent,
      })
    })
  }
)
```

## Concurrency Control

```typescript
// Limit concurrent executions
export const sendEmail = inngest.createFunction(
  { 
    id: 'send-email',
    concurrency: {
      limit: 10, // Max 10 concurrent executions
    },
  },
  { event: 'email/send' },
  async ({ event }) => {
    await emailService.send(event.data)
  }
)

// Per-key concurrency (e.g., per user)
export const userTask = inngest.createFunction(
  { 
    id: 'user-task',
    concurrency: {
      limit: 1,
      key: 'event.data.userId', // 1 at a time per user
    },
  },
  { event: 'user/task' },
  async ({ event }) => {
    await userService.doTask(event.data.userId)
  }
)
```

## Rate Limiting

```typescript
export const apiCall = inngest.createFunction(
  { 
    id: 'api-call',
    rateLimit: {
      limit: 100,
      period: '1m', // 100 per minute
      key: 'event.data.apiKey', // Per API key
    },
  },
  { event: 'api/call' },
  async ({ event }) => {
    await externalApi.call(event.data)
  }
)
```

## Monitoring & Logging

```typescript
export const monitoredJob = inngest.createFunction(
  { id: 'monitored-job' },
  { event: 'job/start' },
  async ({ event, step, logger }) => {
    logger.info('Job started', { jobId: event.data.jobId })

    try {
      const result = await step.run('process', async () => {
        return processJob(event.data)
      })

      logger.info('Job completed', { 
        jobId: event.data.jobId,
        result,
      })

      return result
    } catch (error) {
      logger.error('Job failed', {
        jobId: event.data.jobId,
        error: error.message,
      })
      throw error
    }
  }
)
```

## Cancellation

```typescript
// Define cancellation trigger
export const longRunning = inngest.createFunction(
  { 
    id: 'long-running',
    cancelOn: [
      { event: 'job/cancel', match: 'data.jobId' }
    ],
  },
  { event: 'job/start' },
  async ({ event, step }) => {
    // This will be cancelled if job/cancel is sent
    // with matching jobId
    await step.sleep('wait', '1h')
    await step.run('process', async () => {
      await processJob(event.data)
    })
  }
)

// Cancel from action
export async function cancelJobAction(jobId: string) {
  await inngest.send({
    name: 'job/cancel',
    data: { jobId },
  })
}
```