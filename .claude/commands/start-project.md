# /start_project

## Command Description
Use this command to start a brand new SaaS project from scratch. Claude will guide you through discovery, planning, and initial setup to ensure a solid foundation.

---

## Conversation Flow

When the user types `/start_project`, respond with:

---

### Step 1: The Big Idea

> **🚀 Let's build something great! Tell me about your project.**
>
> **What's the name of your project?**
> *(Can be a working title - we can change it later)*
>
> **Describe your idea in 2-3 sentences:**
> *(What problem does it solve? Who is it for?)*
>
> *Example: "TaskFlow - A project management tool for small design agencies. Helps them track client projects, deadlines, and team workload in one place."*

Wait for response, then:

---

### Step 2: Target Users

> **Who are your target users?**
>
> **Primary user:**
> *(The main person who will use this daily)*
> - Job title/role: ___
> - What do they struggle with today? ___
> - What tools do they currently use? ___
>
> **Secondary users (if any):**
> *(Others who might use the product)*
>
> *Example:*
> - *Primary: "Creative agency project managers who juggle 10+ client projects"*
> - *Secondary: "Designers who need to see their tasks, agency owners who want high-level overview"*

Wait for response, then:

---

### Step 3: Core Problem

> **Let's dig deeper into the problem:**
>
> **What's the #1 pain point you're solving?**
> *(Be specific - not "save time" but "stop missing client deadlines because tasks fall through cracks")*
>
> **What happens if this problem isn't solved?**
> *(Consequences for the user)*
>
> **How do people solve this today?**
> *(Spreadsheets? Existing tools? Manual processes?)*
>
> **Why don't current solutions work well?**
> *(What's missing or frustrating?)*

Wait for response, then:

---

### Step 4: Core Features (MVP)

> **What are the absolute MUST-HAVE features for launch?**
>
> *List 3-5 core features that make this product useful. Be ruthless - what's the minimum needed for someone to pay for this?*
>
> *Example for a project management tool:*
> 1. *Create and organize projects by client*
> 2. *Add tasks with deadlines and assignees*
> 3. *Dashboard showing what's due this week*
> 4. *Basic team member management*
>
> **Your core features:**
> 1. ___
> 2. ___
> 3. ___
> 4. ___
> 5. ___

Wait for response, then:

---

### Step 5: Nice-to-Have Features

> **What features would be nice to have later (v2, v3)?**
>
> *These are features you'll build AFTER launch. Listing them now helps us design for them without building them yet.*
>
> *Example:*
> - *Time tracking*
> - *Client portal*
> - *Invoicing integration*
> - *Mobile app*
> - *Custom workflows*
>
> **Your nice-to-haves:**
> - ___
> - ___
> - ___

Wait for response, then:

---

### Step 6: User Journey

> **Walk me through the main user journey:**
>
> **1. Discovery:** How does someone find out about your product?
> *(e.g., "Google search for 'agency project management'")*
>
> **2. First visit:** What do they see on your landing page?
> *(Key message, main CTA)*
>
> **3. Sign up:** What info do you need?
> *(Just email? Company name? Team size?)*
>
> **4. Onboarding:** What's their first "aha moment"?
> *(e.g., "Creating their first project and seeing the dashboard")*
>
> **5. Daily use:** What does a typical session look like?
> *(e.g., "Check dashboard, update task statuses, add new tasks")*
>
> **6. Success:** How do they know the product is working for them?
> *(e.g., "No missed deadlines for 30 days")*

Wait for response, then:

---

### Step 7: Business Model

> **How will this make money?**
>
> **Pricing model:**
> - [ ] **Freemium** - Free tier + paid upgrades
> - [ ] **Free trial** - X days free, then paid
> - [ ] **Paid only** - No free option
> - [ ] **Usage-based** - Pay for what you use
> - [ ] **Not sure yet**
>
> **If you have pricing ideas:**
>
> | Plan | Price | Key Limits/Features |
> |------|-------|---------------------|
> | Free | $0 | ___ |
> | Pro | $_/mo | ___ |
> | Team | $_/mo | ___ |
>
> *Or describe your thinking:*

Wait for response, then:

---

### Step 8: Differentiator

> **What makes your product different/better?**
>
> **Main competitors:**
> *(List 2-3 alternatives users might consider)*
> 1. ___
> 2. ___
> 3. ___
>
> **Your unfair advantage:**
> *(Why will people choose YOU?)*
>
> - [ ] Simpler to use
> - [ ] More affordable
> - [ ] Better for specific niche
> - [ ] Missing feature competitors don't have
> - [ ] Better design/UX
> - [ ] Other: ___
>
> **In one sentence, why should someone switch to your product?**

Wait for response, then:

---

### Step 9: Technical Requirements

> **Let's talk technical needs:**
>
> **Authentication:**
> - [ ] Email/password only
> - [ ] Social login (Google, GitHub, etc.)
> - [ ] Magic link (passwordless)
> - [ ] SSO/SAML (for enterprise)
>
> **Multi-tenancy:**
> - [ ] Single user accounts (like Notion personal)
> - [ ] Team/organization accounts (like Slack)
> - [ ] Both individual and team
>
> **Key integrations needed for MVP:**
> *(e.g., "Slack notifications", "Google Calendar sync")*
> - ___
>
> **Data sensitivity:**
> - [ ] Standard (normal SaaS)
> - [ ] Sensitive (healthcare, finance - needs extra compliance)

Wait for response, then:

---

### Step 10: Content & Branding

> **Quick branding questions:**
>
> **Tone of voice:**
> - [ ] Professional/Corporate
> - [ ] Friendly/Casual
> - [ ] Playful/Fun
> - [ ] Technical/Developer-focused
>
> **Color preferences (if any):**
> *(e.g., "Blue and white", "Dark mode focused", "No preference")*
>
> **Any existing brand assets?**
> - [ ] Logo
> - [ ] Brand colors
> - [ ] Design mockups
> - [ ] Nothing yet

Wait for response, then:

---

### Step 11: Timeline & Priorities

> **What's your timeline?**
>
> **Launch goal:**
> - [ ] ASAP (weeks)
> - [ ] 1-2 months
> - [ ] 3-6 months
> - [ ] No rush, doing it right matters more
>
> **What matters most right now?**
> - [ ] **Speed** - Get to market fast, iterate later
> - [ ] **Quality** - Polish everything before launch
> - [ ] **Learning** - Validate idea with minimal build
>
> **Will you have help?**
> - [ ] Just me
> - [ ] Small team (___ people)
> - [ ] Will hire/outsource some parts

Wait for response, then:

---

### Step 12: Project Summary

> **📋 Here's what I understand about your project:**
>
> ---
>
> ## [Project Name]
>
> **Vision:** [2-3 sentence description]
>
> **Target User:** [Primary user description]
>
> **Core Problem:** [Main pain point]
>
> **Solution:** [How you solve it]
>
> ---
>
> ### MVP Features
> 1. [Feature 1]
> 2. [Feature 2]
> 3. [Feature 3]
> 4. [Feature 4]
> 5. [Feature 5]
>
> ### Future Features (Post-Launch)
> - [Feature A]
> - [Feature B]
> - [Feature C]
>
> ---
>
> ### Business Model
> - **Pricing:** [Model]
> - **Plans:** [Summary]
>
> ### Differentiator
> - **Competitors:** [List]
> - **Your edge:** [Why you win]
>
> ---
>
> ### Technical Decisions
> - **Auth:** [Method]
> - **Multi-tenancy:** [Type]
> - **Key integrations:** [List]
>
> ### Branding
> - **Tone:** [Style]
> - **Colors:** [Preference]
>
> ### Timeline
> - **Goal:** [Timeframe]
> - **Priority:** [Speed/Quality/Learning]
>
> ---
>
> **Does this capture your vision correctly?**
> - Type `yes` to proceed to project setup
> - Type `no` to make adjustments
> - Or tell me what to change

Wait for confirmation, then:

---

### Step 13: Project Architecture

> **Based on your requirements, here's the technical architecture:**
>
> ## Tech Stack
>
> | Layer | Technology |
> |-------|------------|
> | Framework | Next.js 14 (App Router) |
> | Language | TypeScript |
> | Database | PostgreSQL + Prisma |
> | Auth | Clerk |
> | Payments | Stripe |
> | Email | React Email + Resend |
> | Storage | Supabase Storage |
> | Background Jobs | Inngest |
> | Analytics | PostHog |
> | UI | Tailwind + shadcn/ui + Framer Motion |
>
> ## Database Models (Initial)
>
> ```
> User
> ├── id, clerkId, email, name
> ├── has many: [relevant models]
> └── has one: Subscription
>
> [Core Model 1]
> ├── [fields]
> └── [relations]
>
> [Core Model 2]
> ├── [fields]
> └── [relations]
>
> Subscription
> ├── plan, status, stripeCustomerId
> └── belongs to: User
> ```
>
> ## App Structure
>
> ```
> / (landing page)
> /pricing
> /sign-in, /sign-up
>
> /dashboard
> ├── /[core-feature-1]
> ├── /[core-feature-2]
> └── /settings
>     ├── /profile
>     ├── /team (if applicable)
>     └── /billing
> ```
>
> ## Plan Limits
>
> | Resource | Free | Pro |
> |----------|------|-----|
> | [Resource 1] | X | Y |
> | [Resource 2] | X | Y |
>
> ---
>
> **Ready to generate the project?**
> - Type `generate` to create the initial codebase
> - Type `adjust` to modify the architecture

Wait for confirmation, then:

---

### Step 14: Generate Project

> **🏗️ Generating your project...**
>
> I'll create:
>
> **1. Project Structure**
> - [ ] Next.js app with App Router
> - [ ] TypeScript configuration
> - [ ] Tailwind + shadcn/ui setup
> - [ ] Environment variables template
>
> **2. Database**
> - [ ] Prisma schema with all models
> - [ ] Initial migration
>
> **3. Authentication**
> - [ ] Clerk integration
> - [ ] Middleware for protected routes
> - [ ] Auth utilities
>
> **4. Core Pages**
> - [ ] Landing page
> - [ ] Pricing page
> - [ ] Dashboard layout
> - [ ] Settings pages
>
> **5. Billing**
> - [ ] Stripe integration
> - [ ] Plan configuration
> - [ ] Webhook handler
>
> **6. Core Features**
> - [ ] [Feature 1] - basic implementation
> - [ ] [Feature 2] - basic implementation
>
> ---
>
> *Generating...*

Proceed with code generation.

---

## Post-Generation Checklist

After generating, provide:

> **✅ Project generated! Here's what to do next:**
>
> ### 1. Environment Setup
> ```bash
> # Copy environment template
> cp .env.example .env.local
> ```
>
> Fill in these values:
> - [ ] `DATABASE_URL` - Create a PostgreSQL database
> - [ ] `CLERK_*` - Create Clerk app at clerk.com
> - [ ] `STRIPE_*` - Create Stripe account
> - [ ] `RESEND_API_KEY` - Create Resend account
> - [ ] `SUPABASE_*` - Create Supabase project
>
> ### 2. Database Setup
> ```bash
> npx prisma migrate dev
> npx prisma db seed
> ```
>
> ### 3. Run Development Server
> ```bash
> npm run dev
> ```
>
> ### 4. Stripe Setup
> - Create products/prices in Stripe Dashboard
> - Add price IDs to environment variables
> - Set up webhook endpoint
>
> ### 5. First Steps
> 1. Visit http://localhost:3000
> 2. Create an account
> 3. Try creating your first [core resource]
>
> ---
>
> **What would you like to work on first?**
> - Type `/add_new_feature` to add a feature
> - Ask me anything about the codebase