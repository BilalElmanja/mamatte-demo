# /delete_feature

## Command Description
Use this command to completely remove a feature from the application. Claude will ensure nothing is missed and guide you through safe removal.

---

## Conversation Flow

When the user types `/delete_feature`, respond with:

---

### Step 1: Identify Feature

> **⚠️ Feature deletion is permanent. Let's make sure we do this safely.**
>
> **What feature do you want to remove?**
> *(e.g., "Project templates", "Public profiles", "Legacy export")*

Wait for response, then:

---

### Step 2: Reason

> **Why are we removing this feature?**
>
> - [ ] No longer needed - *business decision*
> - [ ] Being replaced - *by what?*
> - [ ] Never used - *analytics show no usage*
> - [ ] Maintenance burden - *too costly to maintain*
> - [ ] Security concern - *vulnerability that can't be fixed*
> - [ ] Other: ___
>
> *This helps me understand if there's a replacement or migration needed.*

Wait for response, then:

---

### Step 3: Current Usage

> **Is anyone currently using this feature?**
>
> - Approximately how many users? *(or "unknown")*
> - Is there important user data that will be affected?
> - Will users lose access to something they rely on?
>
> *Example: "About 50 users have used this feature. They have data that will be deleted."*

Wait for response, then:

---

### Step 4: Dependencies Check

> **Does anything else depend on this feature?**
>
> - [ ] Other features use this
> - [ ] External integrations rely on this
> - [ ] Other parts of the codebase import from this
> - [ ] Not sure - *I'll investigate*
> - [ ] No dependencies
>
> *If there are dependencies, we need to handle those first.*

Wait for response, then:

---

### Step 5: Code Inventory

> **Let me identify everything that needs to be removed. Can you confirm or add to this list?**
>
> **Pages/Routes to remove:**
> - [ ] *(I'll list what I find)*
>
> **Components to remove:**
> - [ ] *(I'll list what I find)*
>
> **Actions to remove:**
> - [ ] *(I'll list what I find)*
>
> **Services/Repositories to remove:**
> - [ ] *(I'll list what I find)*
>
> **API routes to remove:**
> - [ ] *(I'll list what I find)*
>
> **Background jobs to remove:**
> - [ ] *(I'll list what I find)*
>
> *Do you know of specific files? List them here:*

Wait for response, then:

---

### Step 6: Database Decisions

> **What should happen to the database data?**
>
> **Models/Tables affected:**
> *(I'll identify these)*
>
> **Data handling:**
> - [ ] **Delete all data** - *Permanently remove*
> - [ ] **Archive first** - *Export/backup before deleting*
> - [ ] **Keep data** - *Remove code but preserve data*
> - [ ] **Migrate to** - *Move data elsewhere: ___*
>
> **Retention period (if archiving):**
> - [ ] 30 days
> - [ ] 90 days
> - [ ] Permanent archive
> - [ ] Not applicable

Wait for response, then:

---

### Step 7: External Cleanup

> **Are there external resources to clean up?**
>
> - [ ] **Stripe** - *Products, prices, webhooks*
> - [ ] **Supabase** - *Storage buckets, files*
> - [ ] **Inngest** - *Background job definitions*
> - [ ] **PostHog** - *Feature flags, events*
> - [ ] **Environment variables** - *API keys, configs*
> - [ ] **Third-party integrations** - *Specify: ___*
> - [ ] None

Wait for response, then:

---

### Step 8: User Communication

> **How should we communicate this to users?**
>
> - [ ] **In-app notification** - *Banner or toast*
> - [ ] **Email notification** - *To affected users*
> - [ ] **Changelog/docs update** - *Public announcement*
> - [ ] **No communication needed** - *Feature was internal/unused*
>
> *What should the message say?*

Wait for response, then:

---

### Step 9: Timeline

> **When should this happen?**
>
> - [ ] **Immediate** - *Remove now*
> - [ ] **Deprecation period** - *Warn users first*
>   - Announce date: ___
>   - Disable date: ___
>   - Remove code date: ___
>
> *If deprecation period, should the feature show a warning to users?*

Wait for response, then:

---

### Step 10: Final Checklist

> **Before I proceed, let's confirm the removal plan:**
>
> **Feature to remove:** [name]
> **Reason:** [reason]
>
> **Code to delete:**
> - Pages: [list]
> - Components: [list]
> - Actions: [list]
> - Services: [list]
> - API routes: [list]
> - Jobs: [list]
>
> **Database:**
> - Models: [list]
> - Data handling: [delete/archive/keep/migrate]
>
> **External cleanup:**
> - [list items]
>
> **User communication:** [plan]
> **Timeline:** [immediate/deprecation]
>
> ---
>
> **⚠️ This action cannot be easily undone.**
>
> **Type `CONFIRM DELETE` to proceed, or `cancel` to abort.**

Wait for explicit confirmation, then proceed.

---

## Deletion Order

Execute removal in this order to avoid broken dependencies:

1. **Disable** - Feature flag off (if using)
2. **Remove UI** - Pages, components, navigation links
3. **Remove Actions** - Server actions
4. **Remove API Routes** - Endpoints
5. **Remove Services** - Business logic
6. **Remove Repositories** - Data access
7. **Remove Jobs** - Background jobs
8. **Clean External** - Stripe, Supabase, etc.
9. **Database Migration** - Remove/archive data
10. **Clean Config** - Env vars, feature flags
11. **Remove Types** - TypeScript types
12. **Final Sweep** - Search codebase for any remaining references