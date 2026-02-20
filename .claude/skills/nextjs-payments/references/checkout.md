# Checkout & One-Time Payments

## Checkout Session Flow

```
User clicks "Buy" → Server Action → Stripe Checkout → Webhook → Database
```

## Creating Checkout Sessions

### Subscription Checkout

```typescript
// src/actions/billing-actions.ts
'use server'

import { requireAuth } from '@/lib/auth'
import { stripe } from '@/lib/payments/stripe'
import { userRepository } from '@/repositories/user-repository'
import { redirect } from 'next/navigation'

export async function createSubscriptionCheckout(priceId: string) {
  const user = await requireAuth()
  const dbUser = await userRepository.findByClerkId(user.clerkId)

  const session = await stripe.checkout.sessions.create({
    customer: dbUser?.stripeCustomerId || undefined,
    customer_email: dbUser?.stripeCustomerId ? undefined : user.email,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    metadata: {
      userId: dbUser?.id || '',
      clerkId: user.clerkId,
    },
  })

  redirect(session.url!)
}
```

### One-Time Payment Checkout

```typescript
export async function createOneTimeCheckout(priceId: string) {
  const user = await requireAuth()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { userId: user.id },
  })

  redirect(session.url!)
}
```

### Dynamic Price Checkout

```typescript
export async function createCustomCheckout(amount: number, description: string) {
  const user = await requireAuth()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'usd',
        unit_amount: amount * 100, // Stripe uses cents
        product_data: {
          name: description,
        },
      },
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
  })

  redirect(session.url!)
}
```

## Checkout Button Component

```typescript
// src/components/billing/checkout-button.tsx
'use client'

import { useState } from 'react'
import { createSubscriptionCheckout } from '@/actions/billing-actions'

interface CheckoutButtonProps {
  priceId: string
  children: React.ReactNode
}

export function CheckoutButton({ priceId, children }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await createSubscriptionCheckout(priceId)
    } catch (error) {
      console.error('Checkout error:', error)
      setLoading(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Loading...' : children}
    </button>
  )
}
```

## Verifying Checkout Success

```typescript
// src/app/purchase/success/page.tsx
import { stripe } from '@/lib/payments/stripe'
import { redirect } from 'next/navigation'

interface Props {
  searchParams: { session_id?: string }
}

export default async function PurchaseSuccessPage({ searchParams }: Props) {
  if (!searchParams.session_id) {
    redirect('/pricing')
  }

  const session = await stripe.checkout.sessions.retrieve(searchParams.session_id)

  if (session.payment_status !== 'paid') {
    redirect('/pricing?error=payment_failed')
  }

  return (
    <div>
      <h1>Thank you for your purchase!</h1>
      <p>Order ID: {session.id}</p>
    </div>
  )
}
```

## Checkout with Quantity

```typescript
export async function createCheckoutWithQuantity(
  priceId: string,
  quantity: number
) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{
      price: priceId,
      quantity,
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
        maximum: 100,
      },
    }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  })

  redirect(session.url!)
}
```

## Trial Period

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: priceId, quantity: 1 }],
  subscription_data: {
    trial_period_days: 14,
  },
  success_url: '...',
  cancel_url: '...',
})
```

## Applying Coupons

```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: priceId, quantity: 1 }],
  discounts: [{
    coupon: 'LAUNCH20', // 20% off coupon
  }],
  // OR allow user to enter promo code
  allow_promotion_codes: true,
  success_url: '...',
  cancel_url: '...',
})
```