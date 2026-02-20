# /add_new_feature

## Command Description
Use this command to add a completely new feature to the application. Claude will guide you through a series of questions to capture all requirements before implementation.

---

## Conversation Flow

When the user types `/add_new_feature`, respond with:

---

### Step 1: Feature Overview

> **Let's add a new feature! I'll ask you a few questions to make sure I build exactly what you need.**
>
> **What's the name of this feature?**
> *(e.g., "Team Invitations", "Project Templates", "Export to PDF")*

Wait for response, then:

---

### Step 2: Description

> **Got it! Now describe what this feature does from the user's perspective in 2-3 sentences.**
>
> *Example: "Allow project owners to invite other users to collaborate on their projects via email. Invited users receive an email with a link to accept the invitation."*

Wait for response, then:

---

### Step 3: User Stories

> **Who will use this feature and why? Give me 1-3 user stories.**
>
> *Format: "As a [user type], I want to [action] so that [benefit]"*
>
> *Example:*
> - *As a project owner, I want to invite team members by email so that we can collaborate*
> - *As an invited user, I want to accept an invitation so that I can access the shared project*

Wait for response, then:

---

### Step 4: Scope & Access

> **Two quick questions:**
>
> **1. What's the scope?**
> - [ ] MVP (minimal working version - just core functionality)
> - [ ] Production-ready (full error handling, all edge cases)
>
> **2. Who can access this feature?**
> - [ ] All users (including free plan)
> - [ ] Pro plan and above
> - [ ] Enterprise only

Wait for response, then:

---

### Step 5: Input/Output

> **Let's define the expected behavior:**
>
> **What does the user provide (input)?**
> *(e.g., "Email address and role selection")*
>
> **What does the user get back (output)?**
> *(e.g., "Success message, invitation appears in pending list")*

Wait for response, then:

---

### Step 6: UI Requirements

> **What UI elements are needed? Check all that apply:**
>
> - [ ] New page - *if yes, what path?* (e.g., `/dashboard/projects/[id]/team`)
> - [ ] Modal/dialog
> - [ ] Form - *if yes, what fields?*
> - [ ] List/table view
> - [ ] Empty state
> - [ ] Loading state
>
> *Example: "Modal with a form containing email input and role dropdown. Also need a table showing pending invitations."*

Wait for response, then:

---

### Step 7: Data Requirements

> **Does this feature need database changes?**
>
> - [ ] New model(s) needed - *if yes, what fields?*
> - [ ] Modify existing model - *if yes, which one and how?*
> - [ ] No database changes
>
> *Example: "New Invitation model with: id, email, role, status, projectId, invitedById, token, expiresAt"*

Wait for response, then:

---

### Step 8: Integrations

> **Does this feature integrate with any of these? Check all that apply:**
>
> - [ ] **Email** - *What email should be sent and when?*
> - [ ] **Background job** - *What should run in the background?*
> - [ ] **Analytics** - *What events should we track?*
> - [ ] **Payments** - *Any billing implications?*
> - [ ] **File upload** - *Any files involved?*
> - [ ] None of the above

Wait for response, then:

---

### Step 9: Edge Cases

> **What edge cases should I handle?**
>
> *Examples:*
> - *What if the user is already a member?*
> - *What if the invitation expires?*
> - *What if the user doesn't have an account?*
>
> *List any specific scenarios you want me to handle:*

Wait for response, then:

---

### Step 10: Out of Scope

> **Is there anything I should explicitly NOT implement?**
>
> *(This helps me avoid scope creep)*
>
> *Example: "Don't implement bulk invite, custom messages, or resend functionality - that's for v2"*

Wait for response, then:

---

### Step 11: Confirmation

> **Here's what I understood:**
>
> **Feature:** [name]
> **Description:** [description]
> **Scope:** [MVP/Production-ready]
> **Access:** [plan level]
>
> **User Stories:**
> - [story 1]
> - [story 2]
>
> **UI:** [summary]
> **Data:** [summary]
> **Integrations:** [summary]
>
> **Edge Cases:**
> - [case 1]
> - [case 2]
>
> **Out of Scope:** [items]
>
> ---
>
> **Does this look correct?**
> - Type `yes` to proceed with implementation
> - Type `no` to make changes
> - Or tell me what to adjust

Wait for confirmation, then proceed with implementation following the architectural patterns.

---

## Implementation Order

Once confirmed, implement in this order:

1. **Database** - Schema changes, migrations
2. **Repository** - Data access methods
3. **Service** - Business logic
4. **Actions** - Server actions
5. **Components** - UI components
6. **Page** - Page integration
7. **Integrations** - Email, jobs, analytics
8. **Tests** - If production-ready scope
