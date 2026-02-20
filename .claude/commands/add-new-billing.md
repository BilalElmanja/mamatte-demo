# /add_billing

## Command Description
Use this command to add billing/payment functionality. Claude will guide you through Stripe integration, plan configuration, and billing UI.

---

## Conversation Flow

When the user types `/add_billing`, respond with:

---

### Step 1: Billing Type

> **Let's add a billing feature! What type?**
>
> - [ ] **New subscription plan** - Add a new tier (e.g., "Enterprise plan")
> - [ ] **One-time purchase** - Single payment for something
> - [ ] **Usage-based billing** - Charge based on usage (API calls, storage, etc.)
> - [ ] **Add-on/upgrade** - Optional extra on top of subscription
> - [ ] **Coupon/discount** - Promotional pricing
> - [ ] **Plan limits** - Add/modify feature limits
> - [ ] **Billing UI** - Customer portal, invoices, payment methods

Wait for response, then proceed to relevant section:

---

## For New Subscription Plan

### Step 2a: Plan Details

> **Tell me about the new plan:**
>
> **Plan name:** *(e.g., "Enterprise")*
>
> **Pricing:**
> - Monthly price: $___
> - Yearly price: $___ *(or "No yearly option")*
>
> **Position:** *(Where does this fit?)*
> - [ ] Below Free (free tier)
> - [ ] Between Free and Pro
> - [ ] Between Pro and Enterprise
> - [ ] Above all existing plans

Wait for response, then:

### Step 3a: Plan Limits

> **What limits does this plan have?**
>
> | Resource | Limit | (Compared to current top plan) |
> |----------|-------|-------------------------------|
> | Projects | ___ | Pro has: ___ |
> | Storage (MB) | ___ | Pro has: ___ |
> | Team members | ___ | Pro has: ___ |
> | API requests/month | ___ | Pro has: ___ |
> | [Custom resource] | ___ | |
>
> *Use -1 for unlimited*

Wait for response, then:

### Step 4a: Plan Features

> **What features are included in this plan?**
>
> *List features for the pricing page:*
> - *(e.g., "Unlimited projects")*
> - *(e.g., "Priority support")*
> - *(e.g., "SSO/SAML")*
> - *(e.g., "Custom integrations")*
> - *(e.g., "SLA guarantee")*

Wait for response, then:

### Step 5a: Trial Period

> **Does this plan have a trial?**
>
> - [ ] **Yes** - ___ days free trial
> - [ ] **No** - Payment required immediately
>
> *If yes, what happens when trial ends?*
> - [ ] Downgrade to free
> - [ ] Require payment to continue
> - [ ] Grace period of ___ days

Wait for response, then skip to Confirmation.

---

## For Usage-Based Billing

### Step 2b: Usage Metric

> **What usage are you charging for?**
>
> **Metric name:** *(e.g., "API calls", "Storage GB", "AI tokens")*
>
> **How is it measured:**
> - [ ] Count (number of actions)
> - [ ] Size (storage, bandwidth)
> - [ ] Time (compute minutes)
> - [ ] Custom: ___
>
> **Billing model:**
> - [ ] Pay per unit ($___ per [unit])
> - [ ] Tiered pricing (different rates at different volumes)
> - [ ] Included amount + overage (X free, then $___ per unit)

Wait for response, then:

### Step 3b: Usage Tracking

> **How do we track this usage?**
>
> - [ ] In application code (we'll report to Stripe)
> - [ ] Already tracked in database (table: ___)
> - [ ] External service provides metrics
>
> **When to report usage:**
> - [ ] Real-time (every action)
> - [ ] Batched (every hour/day)
> - [ ] End of billing period

Wait for response, then skip to Confirmation.

---

## For Plan Limits

### Step 2c: Limit Changes

> **What limits are you adding or changing?**
>
> **Resource:** *(e.g., "team members")*
>
> **Current limits:**
> - Free: ___
> - Pro: ___
>
> **New limits:**
> - Free: ___
> - Pro: ___
>
> *Adding a new resource? Describe it:*

Wait for response, then:

### Step 3c: Enforcement

> **How should limits be enforced?**
>
> - [ ] **Hard limit** - Block action when limit reached
> - [ ] **Soft limit** - Warn but allow (with upgrade prompt)
> - [ ] **Grace period** - Allow temporary overage, then block
>
> **Where to enforce:**
> *(e.g., "In projectService.create when counting projects")*

Wait for response, then:

### Step 4c: UI Updates

> **What UI needs to show these limits?**
>
> - [ ] Pricing page - Show in plan comparison
> - [ ] Usage display - Show current vs limit
> - [ ] Upgrade prompt - When limit approached/reached
> - [ ] Settings page - Display current plan limits

Wait for response, then skip to Confirmation.

---

## For Billing UI

### Step 2d: UI Components

> **What billing UI do you need?**
>
> - [ ] **Pricing page** - Public pricing display
> - [ ] **Checkout flow** - Subscribe button → Stripe
> - [ ] **Customer portal** - Manage subscription button
> - [ ] **Current plan display** - Show active plan
> - [ ] **Usage display** - Show current usage vs limits
> - [ ] **Invoice history** - List past invoices
> - [ ] **Payment method** - Update card
> - [ ] **Upgrade prompts** - CTAs throughout app
>
> *Which ones do you need?*

Wait for response, then:

### Step 3d: UI Details

> **For each UI component you selected:**
>
> **Location:** *(Where in the app?)*
>
> **Requirements:**
> *(Any specific design or behavior requirements?)*

Wait for response, then skip to Confirmation.

---

## Common for All Types

### Stripe Configuration

> **For Stripe setup, I'll need to:**
>
> - [ ] Create new Product in Stripe
> - [ ] Create Price(s) for the product
> - [ ] Update webhook handler for new events
> - [ ] Add price IDs to environment variables
>
> **Do you already have the Stripe product/price IDs?**
> - [ ] Yes - *Provide them:*
> - [ ] No - *I'll tell you what to create in Stripe Dashboard*

Wait for response, then:

### Webhook Events

> **Which Stripe webhook events do we need to handle?**
>
> - [ ] `checkout.session.completed` - New subscription
> - [ ] `customer.subscription.updated` - Plan changes
> - [ ] `customer.subscription.deleted` - Cancellation
> - [ ] `invoice.paid` - Successful payment
> - [ ] `invoice.payment_failed` - Failed payment
> - [ ] Already handling all needed events

Wait for response, then:

---

### Confirmation

> **Here's the billing feature I'll implement:**
>
> **Type:** [subscription/usage/limits/UI]
>
> **Details:**
> [Specific details based on type]
>
> **Stripe configuration:**
> - Products/Prices: [list]
> - Webhooks: [events]
>
> **UI changes:**
> - [component 1]
> - [component 2]
>
> **Code changes:**
> - Config: `config/plans.ts`
> - Service: `services/subscription-service.ts`
> - Components: [list]
>
> ---
>
> **Does this look correct?**
> - Type `yes` to proceed
> - Type `no` to adjust

Wait for confirmation, then proceed.

---

## Implementation Order

1. **Stripe Dashboard** - Create products/prices
2. **Environment variables** - Add price IDs
3. **Config** - Update `config/plans.ts`
4. **Database** - Schema changes if needed
5. **Service** - Update subscription service
6. **Webhook** - Handle new events
7. **UI** - Components and pages
8. **Test** - Full flow with Stripe test mode