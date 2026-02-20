# Stripe Webhooks

## Setup

### 1. Get Webhook Secret

```bash
# Local development with Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook signing secret (whsec_...)
```

### 2. Add to Environment

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Add to Public Routes

```typescript
// src/middleware.ts
const isPublicRoute = createRouteMatcher([
  '/api/webhooks(.*)',  // Must be public
])
```

## Complete Webhook Handler

```typescript
// src/app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import { stripe } from '@/lib/payments/stripe'
import { subscriptionRepository } from '@/repositories/subscription-repository'
import { userRepository } from '@/repositories/user-repository'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  try {
    switch (event.type) {
      // Checkout completed
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      // Subscription events
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      // Payment events
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      // Customer events
      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return new Response('Webhook handler failed', { status: 500 })
  }
}
```

## Event Handlers

### Checkout Completed

```typescript
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode !== 'subscription') return

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  )

  const userId = session.metadata?.userId
  if (!userId) {
    console.error('No userId in checkout metadata')
    return
  }

  // Update user's stripe customer ID if needed
  if (!session.metadata?.hasCustomerId) {
    await userRepository.update(userId, {
      stripeCustomerId: session.customer as string,
    })
  }

  // Create subscription record
  await subscriptionRepository.upsert({
    userId,
    stripeCustomerId: session.customer as string,
    stripeSubscriptionId: subscription.id,
    stripePriceId: subscription.items.data[0].price.id,
    status: subscription.status,
    plan: mapPriceIdToPlan(subscription.items.data[0].price.id),
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    trialEnd: subscription.trial_end 
      ? new Date(subscription.trial_end * 1000) 
      : null,
  })

  console.log(`Subscription created for user ${userId}`)
}
```

### Subscription Updated

```typescript
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const existing = await subscriptionRepository.findByStripeId(subscription.id)
  if (!existing) {
    console.log('Subscription not found in database:', subscription.id)
    return
  }

  await subscriptionRepository.updateByStripeId(subscription.id, {
    status: subscription.status,
    stripePriceId: subscription.items.data[0].price.id,
    plan: mapPriceIdToPlan(subscription.items.data[0].price.id),
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  })

  console.log(`Subscription ${subscription.id} updated to ${subscription.status}`)
}
```

### Subscription Deleted

```typescript
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await subscriptionRepository.updateByStripeId(subscription.id, {
    status: 'canceled',
    cancelAtPeriodEnd: false,
  })

  console.log(`Subscription ${subscription.id} canceled`)
}
```

### Invoice Paid

```typescript
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return

  // Update subscription period
  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string
  )

  await subscriptionRepository.updateByStripeId(subscription.id, {
    status: 'active',
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  })

  console.log(`Invoice paid for subscription ${subscription.id}`)
}
```

### Payment Failed

```typescript
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return

  await subscriptionRepository.updateByStripeId(invoice.subscription as string, {
    status: 'past_due',
  })

  // TODO: Send email notification
  // await emailService.sendPaymentFailedEmail(invoice.customer_email)

  console.log(`Payment failed for invoice ${invoice.id}`)
}
```

### Customer Created

```typescript
async function handleCustomerCreated(customer: Stripe.Customer) {
  const clerkId = customer.metadata?.clerkId
  if (!clerkId) return

  await userRepository.updateByClerkId(clerkId, {
    stripeCustomerId: customer.id,
  })

  console.log(`Linked Stripe customer ${customer.id} to Clerk user ${clerkId}`)
}
```

## Helper Functions

```typescript
// Map Stripe price ID to plan name
function mapPriceIdToPlan(priceId: string): string {
  const priceMap: Record<string, string> = {
    [process.env.STRIPE_PRO_MONTHLY_PRICE_ID!]: 'pro',
    [process.env.STRIPE_PRO_YEARLY_PRICE_ID!]: 'pro',
    [process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID!]: 'enterprise',
    [process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID!]: 'enterprise',
  }
  return priceMap[priceId] || 'free'
}
```

## Testing Webhooks

### Stripe CLI

```bash
# Forward events to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger specific events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_failed
```

### Test Mode Events

```typescript
// Only in development
if (process.env.NODE_ENV === 'development') {
  console.log('Received webhook:', event.type)
  console.log('Data:', JSON.stringify(event.data.object, null, 2))
}
```

## Common Issues

| Issue | Solution |
|-------|----------|
| 400 Invalid signature | Check STRIPE_WEBHOOK_SECRET matches CLI output |
| Missing metadata | Ensure metadata passed in checkout session |
| Duplicate events | Stripe may retry; use idempotent operations |
| Event ordering | Don't assume events arrive in order |