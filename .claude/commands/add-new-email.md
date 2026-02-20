# /add_email

## Command Description
Use this command to add a new email template. Claude will help you design the email content and implement it with React Email.

---

## Conversation Flow

When the user types `/add_email`, respond with:

---

### Step 1: Template Name

> **Let's create a new email template!**
>
> **What should this template be called?**
> *(Use kebab-case)*
>
> *Examples: `welcome`, `team-invite`, `password-reset`, `invoice`, `weekly-digest`*

Wait for response, then:

---

### Step 2: Trigger

> **When is this email sent?**
>
> *Example: "When a user is invited to join a team"*
> *Example: "Every Monday with the user's weekly stats"*
> *Example: "When a payment fails"*

Wait for response, then:

---

### Step 3: Recipients

> **Who receives this email?**
>
> **To:** *Primary recipient (e.g., "The invited user's email")*
>
> **CC:** *Anyone else? (or "None")*
>
> **Reply-to:** *Should replies go somewhere specific? (or "Default noreply")*

Wait for response, then:

---

### Step 4: Subject Line

> **What's the email subject line?**
>
> *Use `{{variable}}` for dynamic content*
>
> *Examples:*
> - `Welcome to {{appName}}!`
> - `{{inviterName}} invited you to join {{teamName}}`
> - `Your weekly report for {{weekRange}}`
> - `Action required: Payment failed`

Wait for response, then:

---

### Step 5: Preview Text

> **What preview text should show in the inbox?**
>
> *(This appears after the subject in most email clients)*
>
> *Examples:*
> - "Get started with your new account"
> - "You've been invited to collaborate on a project"
> - "Here's what happened this week"
>
> *Or: "Use first line of email body"*

Wait for response, then:

---

### Step 6: Template Variables

> **What dynamic data does this email need?**
>
> *List each variable:*
>
> | Variable | Type | Example |
> |----------|------|---------|
> | recipientName | string | "John" |
> | inviterName | string | "Jane" |
> | teamName | string | "Acme Corp" |
> | actionUrl | string | "https://app.com/invite/abc" |
> | expiresIn | string | "7 days" |
>
> *List your variables:*

Wait for response, then:

---

### Step 7: Email Content

> **Describe the email content structure:**
>
> **1. Greeting:**
> *(e.g., "Hi {{recipientName}},")*
>
> **2. Main message (1-3 paragraphs):**
> *(What's the core message?)*
>
> **3. Call-to-action:**
> - Button text: *(e.g., "Accept Invitation")*
> - Button URL: *(e.g., "{{actionUrl}}")*
>
> **4. Additional info (optional):**
> *(e.g., "This link expires in {{expiresIn}}")*
>
> **5. Sign-off:**
> *(e.g., "The {{appName}} Team")*
>
> *Describe each section:*

Wait for response, then:

---

### Step 8: Call-to-Action Details

> **About the call-to-action button:**
>
> **Button text:** *(e.g., "Accept Invitation")*
>
> **URL pattern:** *(e.g., `{{appUrl}}/invites/{{token}}`)*
>
> **Does the link expire?**
> - [ ] Yes - After how long? ___
> - [ ] No - Permanent link
>
> **Secondary action?** *(optional link, not a button)*
> *(e.g., "Or copy this link: {{actionUrl}}")*

Wait for response, then:

---

### Step 9: Design Requirements

> **Any special design needs?**
>
> - [ ] Use standard base template
> - [ ] Custom header image: *(describe)*
> - [ ] Special sections: *(e.g., "Stats table", "List of items")*
> - [ ] Brand colors different from default
> - [ ] Include logo
>
> *Describe any special design:*

Wait for response, then:

---

### Step 10: Send Method

> **How will this email be sent?**
>
> - [ ] **From server action** - User triggers it (e.g., "Send invite")
> - [ ] **From webhook** - External event triggers it (e.g., "Stripe payment")
> - [ ] **From background job** - Scheduled or async (e.g., "Weekly digest")
> - [ ] **From service** - Internal business logic
>
> *Where in the code should this be triggered from?*

Wait for response, then:

---

### Step 11: Testing Checklist

> **I'll make sure to test:**
>
> - [ ] All variables render correctly
> - [ ] Links work and point to correct URLs
> - [ ] Email is mobile-friendly
> - [ ] Works in major email clients (Gmail, Outlook, Apple Mail)
> - [ ] Dark mode compatible
> - [ ] Preview text shows correctly
>
> **Any specific test scenarios?**
> *(e.g., "Test with very long team name")*

Wait for response, then:

---

### Step 12: Confirmation

> **Here's the email template I'll create:**
>
> **Template:** `[name]`
> **Trigger:** [when sent]
>
> **Subject:** `[subject line]`
> **Preview:** `[preview text]`
>
> **Variables:**
> - [var1]: [type]
> - [var2]: [type]
>
> **Content structure:**
> 1. Greeting: [content]
> 2. Main message: [summary]
> 3. CTA button: [text] → [url]
> 4. Additional: [content]
> 5. Sign-off: [content]
>
> **Link expiration:** [yes/no + duration]
> **Send from:** [location in code]
>
> ---
>
> **Does this look correct?**
> - Type `yes` to proceed
> - Type `no` to adjust

Wait for confirmation, then proceed.

---

## Implementation Order

1. **Create template** - `emails/[name].tsx`
2. **Add to email service** - `lib/email/index.ts`
3. **Add trigger** - Where email gets sent from
4. **Test with preview** - `npm run email:dev`
5. **Test real send** - Send to test email