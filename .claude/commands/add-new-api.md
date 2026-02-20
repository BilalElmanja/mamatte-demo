# /add_api

## Command Description
Use this command to add a new API endpoint (webhook handler, external API, etc.). Claude will gather all specifications for the endpoint.

---

## Conversation Flow

When the user types `/add_api`, respond with:

---

### Step 1: Endpoint Definition

> **Let's create a new API endpoint!**
>
> **What's the endpoint path and method?**
>
> *Format: `METHOD /api/path`*
>
> *Examples:*
> - `POST /api/webhooks/stripe`
> - `GET /api/projects`
> - `POST /api/integrations/slack/oauth`

Wait for response, then:

---

### Step 2: Endpoint Type

> **What type of endpoint is this?**
>
> - [ ] **Webhook handler** - Receives events from external service (Stripe, Clerk, etc.)
> - [ ] **External API** - For third parties to consume
> - [ ] **Internal API** - Only our frontend uses this
> - [ ] **OAuth callback** - Authentication flow
> - [ ] **File handling** - Upload/download
>
> *If webhook, which service?*

Wait for response, then:

---

### Step 3: Purpose

> **What does this endpoint do? Describe in 1-2 sentences.**
>
> *Example: "Handles Stripe webhook events for subscription lifecycle management - creates, updates, and cancels subscriptions based on events."*

Wait for response, then:

---

### Step 4: Authentication

> **How is this endpoint authenticated?**
>
> - [ ] **Public** - No authentication
> - [ ] **Session/Cookie** - User must be logged in
> - [ ] **API key** - Requires API key in header
> - [ ] **Webhook signature** - Verify signature from service
> - [ ] **Bearer token** - JWT or similar
> - [ ] **OAuth** - OAuth flow
>
> *If webhook, provide the signature header name:*
> *(e.g., "stripe-signature", "svix-signature")*

Wait for response, then:

---

### Step 5: Request Format

> **What does the request look like?**
>
> **Headers (required):**
> ```
> Content-Type: application/json
> [other-header]: [value]
> ```
>
> **Body (for POST/PUT/PATCH):**
> ```json
> {
>   "field1": "string",
>   "field2": 123,
>   "nested": {
>     "field": "value"
>   }
> }
> ```
>
> **Query params (for GET):**
> ```
> ?param1=value&param2=value
> ```
>
> *Describe the expected request:*

Wait for response, then:

---

### Step 6: Request Validation

> **What validation rules should be applied?**
>
> *For each field, specify:*
> - Required or optional?
> - Type (string, number, boolean, array, object)
> - Constraints (min/max length, enum values, regex)
>
> *Example:*
> - `email`: required, string, valid email format
> - `amount`: required, number, min 0
> - `status`: required, enum ["active", "inactive"]
>
> *Or: "No validation needed - raw webhook payload"*

Wait for response, then:

---

### Step 7: Response Format

> **What does a successful response look like?**
>
> **Status code:** *(e.g., 200, 201, 204)*
>
> **Response body:**
> ```json
> {
>   "success": true,
>   "data": {
>     // response shape
>   }
> }
> ```
>
> *Or for webhooks: "Just return 200 OK with no body"*

Wait for response, then:

---

### Step 8: Error Responses

> **What error responses should this endpoint return?**
>
> | Status | When | Response |
> |--------|------|----------|
> | 400 | Invalid input | `{ "error": "..." }` |
> | 401 | Unauthorized | `{ "error": "..." }` |
> | 404 | Not found | `{ "error": "..." }` |
> | 500 | Server error | `{ "error": "..." }` |
>
> *List the error cases for this specific endpoint:*

Wait for response, then:

---

### Step 9: Rate Limiting

> **Does this endpoint need rate limiting?**
>
> - [ ] **No rate limiting**
> - [ ] **Yes** - Limit: ___ requests per ___ (minute/hour/day)
>
> **Rate limit by:**
> - [ ] IP address
> - [ ] User ID
> - [ ] API key
> - [ ] Custom: ___

Wait for response, then:

---

### Step 10: Side Effects

> **What side effects does this endpoint have?**
>
> - [ ] **Database writes** - *What changes?*
> - [ ] **Sends email** - *Which template?*
> - [ ] **Triggers background job** - *Which job?*
> - [ ] **External API call** - *To where?*
> - [ ] **Analytics event** - *Which event?*
> - [ ] **File operations** - *What?*
> - [ ] **None** - Pure read operation
>
> *Describe the side effects:*

Wait for response, then:

---

### Step 11: Idempotency

> **Can this endpoint be safely called multiple times with the same data?**
>
> - [ ] **Yes, idempotent** - Same input always produces same result, safe to retry
> - [ ] **No, not idempotent** - Multiple calls may cause duplicates/issues
>
> *If not idempotent, how should we handle retries/duplicates?*
> *(e.g., "Check for existing record by external ID before creating")*

Wait for response, then:

---

### Step 12: Webhook Events (if applicable)

> **(Skip if not a webhook)**
>
> **Which events should this webhook handle?**
>
> *List each event and what should happen:*
>
> | Event | Action |
> |-------|--------|
> | `checkout.session.completed` | Create subscription record |
> | `customer.subscription.updated` | Update subscription status |
> | `customer.subscription.deleted` | Mark subscription cancelled |
>
> *List your events:*

Wait for response, then:

---

### Step 13: Testing

> **Provide a curl command example for testing:**
>
> ```bash
> curl -X POST http://localhost:3000/api/[path] \
>   -H "Content-Type: application/json" \
>   -H "[Auth-Header]: [value]" \
>   -d '{"field": "value"}'
> ```
>
> *I'll generate this based on your answers, but feel free to provide specifics.*

Wait for response, then:

---

### Step 14: Confirmation

> **Here's the API endpoint I'll create:**
>
> **Endpoint:** `[METHOD] /api/[path]`
> **Type:** [webhook/external/internal]
> **Auth:** [method]
>
> **Request:**
> ```json
> [request shape]
> ```
>
> **Response (200):**
> ```json
> [response shape]
> ```
>
> **Errors:** [list]
> **Rate limiting:** [yes/no + config]
> **Idempotent:** [yes/no]
>
> **Side effects:**
> - [effect 1]
> - [effect 2]
>
> ---
>
> **Does this look correct?**
> - Type `yes` to proceed
> - Type `no` to adjust

Wait for confirmation, then proceed.

---

## Implementation Order

1. **Create route file** - `app/api/[path]/route.ts`
2. **Add validation schema** - Zod schema for request
3. **Add authentication** - Middleware or in-route check
4. **Implement handler** - Call services
5. **Add to public routes** - If webhook, update middleware
6. **Add tests** - Request/response tests
7. **Document** - Add to API docs if external