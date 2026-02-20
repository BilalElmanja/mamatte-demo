# /add_job

## Command Description
Use this command to add a new background job (async task, scheduled job, queue processor). Claude will set up the job with proper reliability patterns.

---

## Conversation Flow

When the user types `/add_job`, respond with:

---

### Step 1: Job Name

> **Let's create a new background job!**
>
> **What should this job be called?**
> *(Use kebab-case)*
>
> *Examples: `send-welcome-email`, `generate-weekly-report`, `sync-stripe-data`, `cleanup-expired-sessions`*

Wait for response, then:

---

### Step 2: Trigger Type

> **How is this job triggered?**
>
> - [ ] **Event-based** - Triggered when something happens
>   - *What event? (e.g., `user/created`, `order/completed`)*
> - [ ] **Scheduled (cron)** - Runs on a schedule
>   - *What schedule? (e.g., "every day at 3am", "every hour")*
> - [ ] **Manual** - Triggered via action/API call
>   - *From where?*

Wait for response, then:

---

### Step 3: Purpose

> **What does this job do? Describe in 1-2 sentences.**
>
> *Example: "Sends a welcome email to new users after they sign up, including their name and a link to get started."*

Wait for response, then:

---

### Step 4: Input Data

> **What data does this job receive?**
>
> *If event-based, what's in the event payload?*
> *If scheduled, what data does it need to fetch?*
>
> ```typescript
> {
>   userId: string
>   email: string
>   // ...
> }
> ```
>
> *Describe the input:*

Wait for response, then:

---

### Step 5: Processing Steps

> **What steps does this job perform?**
>
> *Break down the work into steps. Each step can be retried independently.*
>
> *Example:*
> 1. Fetch user details from database
> 2. Generate email content
> 3. Send email via Resend
> 4. Update user record (emailSentAt)
>
> *List your steps:*

Wait for response, then:

---

### Step 6: Side Effects

> **What does this job produce/change?**
>
> - [ ] **Updates database** - *What records?*
> - [ ] **Sends email** - *Which template?*
> - [ ] **Calls external API** - *Which service?*
> - [ ] **Creates files** - *Where?*
> - [ ] **Triggers other jobs** - *Which ones?*
> - [ ] **Sends notification** - *Push/in-app?*
>
> *Describe the outputs:*

Wait for response, then:

---

### Step 7: Reliability Requirements

> **How should this job handle failures?**
>
> **Retries:**
> - Max retry attempts: ___ *(default: 3)*
> - Retry delay strategy:
>   - [ ] Exponential backoff (recommended)
>   - [ ] Fixed delay: ___ seconds
>   - [ ] No retries
>
> **Timeout:**
> - Expected duration: ___ *(e.g., "under 30 seconds")*
> - Max allowed duration: ___ *(e.g., "5 minutes")*

Wait for response, then:

---

### Step 8: Idempotency

> **Can this job be safely run multiple times with the same input?**
>
> - [ ] **Yes, idempotent** - Running twice won't cause duplicates
> - [ ] **No, needs protection** - *How to prevent duplicates?*
>
> *If not idempotent, describe how to make it safe:*
> *Example: "Check if welcome email already sent before sending again"*

Wait for response, then:

---

### Step 9: Concurrency

> **Can multiple instances of this job run at the same time?**
>
> - [ ] **Yes, fully parallel** - No limits
> - [ ] **Limited concurrency** - Max ___ running at once
> - [ ] **Sequential per key** - One at a time per user/resource
> - [ ] **Globally sequential** - Only one instance ever
>
> *If limited, what's the key?*
> *(e.g., "One at a time per userId")*

Wait for response, then:

---

### Step 10: Failure Handling

> **What should happen if the job fails after all retries?**
>
> - [ ] **Log and alert** - Notify team via Slack/email
> - [ ] **Dead letter queue** - Store for manual review
> - [ ] **Retry later** - Schedule another attempt
> - [ ] **Fail silently** - Log only, no action needed
>
> *Any specific failure handling?*

Wait for response, then:

---

### Step 11: Delays/Scheduling (if applicable)

> **Does this job involve any waiting/delays?**
>
> - [ ] **No delays** - Execute immediately
> - [ ] **Initial delay** - Wait ___ before starting
> - [ ] **Between steps** - Wait ___ between step X and Y
> - [ ] **Wait for event** - Pause until ___ event occurs
>
> *Example: "Wait 1 day after signup before sending onboarding tips email"*

Wait for response, then:

---

### Step 12: Monitoring

> **How should we monitor this job?**
>
> - [ ] **Log progress** - Log each step completion
> - [ ] **Track in database** - Store job status in a table
> - [ ] **Analytics event** - Track completion in PostHog
> - [ ] **Custom metrics** - *What to measure?*
>
> *Any specific monitoring needs?*

Wait for response, then:

---

### Step 13: Confirmation

> **Here's the background job I'll create:**
>
> **Name:** `[name]`
> **Trigger:** [event/cron/manual]
>
> **Input:**
> ```typescript
> [input shape]
> ```
>
> **Steps:**
> 1. [step 1]
> 2. [step 2]
> 3. [step 3]
>
> **Side effects:**
> - [effect 1]
> - [effect 2]
>
> **Reliability:**
> - Retries: [X] with [strategy]
> - Timeout: [X]
> - Idempotent: [yes/no]
> - Concurrency: [config]
>
> **On failure:** [action]
>
> ---
>
> **Does this look correct?**
> - Type `yes` to proceed
> - Type `no` to adjust

Wait for confirmation, then proceed.

---

## Implementation Order

1. **Define event type** - Add to `lib/inngest/client.ts`
2. **Create function** - `lib/inngest/functions/[name].ts`
3. **Export function** - Add to `lib/inngest/functions/index.ts`
4. **Add trigger** - Where the job gets triggered from
5. **Test locally** - Use Inngest dev server
6. **Deploy** - Push and verify in Inngest dashboard