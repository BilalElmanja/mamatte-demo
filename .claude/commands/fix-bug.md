# /fix_bug

## Command Description
Use this command to report and fix a bug. Claude will gather details to diagnose and fix the issue properly.

---

## Conversation Flow

When the user types `/fix_bug`, respond with:

---

### Step 1: Bug Summary

> **Let's fix this bug! First, describe the issue in one sentence.**
>
> *Example: "Users can't save their profile after uploading an avatar"*
> *Example: "Checkout button shows loading forever on mobile"*
> *Example: "Deleted projects still appear in the list"*

Wait for response, then:

---

### Step 2: Severity

> **How severe is this bug?**
>
> - [ ] 🔴 **Critical** - App unusable, data loss, security issue
> - [ ] 🟠 **High** - Major feature completely broken
> - [ ] 🟡 **Medium** - Feature partially broken, workaround exists
> - [ ] 🟢 **Low** - Minor issue, cosmetic, edge case

Wait for response, then:

---

### Step 3: Environment

> **Where does this bug occur?**
>
> - [ ] Production
> - [ ] Staging
> - [ ] Development
> - [ ] All environments
>
> **Browser/Device (if relevant):**
> *(e.g., "Chrome on Mac", "Safari on iPhone", "All browsers")*

Wait for response, then:

---

### Step 4: Steps to Reproduce

> **How can I reproduce this bug?**
>
> *List the exact steps:*
>
> 1. *(e.g., "Go to /dashboard/settings")*
> 2. *(e.g., "Click on 'Edit Profile'")*
> 3. *(e.g., "Upload an avatar image")*
> 4. *(e.g., "Click 'Save'")*
> 5. *(e.g., "Observe the error")*
>
> *Be as specific as possible:*

Wait for response, then:

---

### Step 5: Expected vs Actual

> **What should happen?**
> *(Expected behavior)*
>
> **What actually happens?**
> *(Actual behavior)*
>
> *Example:*
> - *Expected: "Profile saves and shows success toast"*
> - *Actual: "Button stays loading, console shows 500 error"*

Wait for response, then:

---

### Step 6: Error Messages

> **Are there any error messages?**
>
> **In the UI:**
> *(What does the user see?)*
>
> **In the browser console:**
> ```
> [Paste any console errors]
> ```
>
> **In the server logs:**
> ```
> [Paste any server errors]
> ```
>
> *Or: "No visible errors"*

Wait for response, then:

---

### Step 7: Frequency & Affected Users

> **How often does this happen?**
>
> - [ ] Every time (100% reproducible)
> - [ ] Most of the time
> - [ ] Sometimes / intermittent
> - [ ] Rarely
> - [ ] Only once so far
>
> **Who is affected?**
>
> - [ ] All users
> - [ ] Specific plan: ___
> - [ ] Specific browser/device: ___
> - [ ] Specific conditions: ___
> - [ ] Just me / one user

Wait for response, then:

---

### Step 8: Recent Changes

> **Did this work before?**
>
> - [ ] **Yes, it's a regression** - When did it stop working? ___
> - [ ] **Never worked** - It's always been broken
> - [ ] **Not sure** - First time testing this
>
> **Any recent changes that might be related?**
> *(e.g., "We deployed a new avatar upload feature yesterday")*

Wait for response, then:

---

### Step 9: Your Hypothesis (Optional)

> **Do you have any idea what might be causing this?**
>
> *(This helps me focus my investigation)*
>
> *Example: "I think it might be a file size validation issue"*
> *Example: "Maybe the webhook isn't being triggered"*
>
> *Or: "No idea"*

Wait for response, then:

---

### Step 10: Files Involved (Optional)

> **Do you know which files might be involved?**
>
> *List any files you suspect:*
> - *(e.g., `actions/profile-actions.ts`)*
> - *(e.g., `components/forms/profile-form.tsx`)*
>
> *Or: "Not sure - please investigate"*

Wait for response, then:

---

### Step 11: Workaround

> **Is there a current workaround?**
>
> - [ ] **Yes** - *Describe:*
> - [ ] **No** - Users are stuck

Wait for response, then:

---

### Step 12: Investigation Plan

> **Here's what I'll do to fix this bug:**
>
> **Bug:** [summary]
> **Severity:** [level]
>
> **Reproduction steps:**
> 1. [step 1]
> 2. [step 2]
> 3. [step 3]
>
> **My investigation plan:**
>
> 1. **Reproduce** - Confirm I can reproduce the issue
> 2. **Locate** - Find the source of the bug
> 3. **Diagnose** - Understand root cause
> 4. **Fix** - Implement the fix
> 5. **Test** - Verify fix works
> 6. **Prevent** - Add test to prevent regression
>
> **Files I'll check first:**
> - [file 1]
> - [file 2]
>
> ---
>
> **Ready to investigate?**
> - Type `yes` and I'll start debugging
> - Or provide more information

Wait for confirmation, then begin investigation.

---

## Debugging Process

1. **Reproduce** - Confirm the bug exists
2. **Check layer by layer:**
   - UI Component → Is the event firing?
   - Server Action → Is it being called? What's the response?
   - Service → Is business logic correct?
   - Repository → Is the query correct?
   - Database → Is data in expected state?
3. **Find root cause** - Identify exactly where it breaks
4. **Implement fix** - Make minimal necessary change
5. **Test fix** - Verify original bug is fixed
6. **Test regression** - Verify nothing else broke
7. **Document** - Explain what caused it and how it was fixed