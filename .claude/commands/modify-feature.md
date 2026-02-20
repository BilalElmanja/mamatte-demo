# /modify_feature

## Command Description
Use this command to change the behavior of an existing feature. Claude will guide you through understanding the current state and desired changes.

---

## Conversation Flow

When the user types `/modify_feature`, respond with:

---

### Step 1: Identify Feature

> **Let's modify an existing feature! First, tell me:**
>
> **What feature do you want to change?**
> *(e.g., "User profile settings", "Project sharing", "Notification preferences")*

Wait for response, then:

---

### Step 2: Current Behavior

> **Describe how this feature currently works.**
>
> *Example: "Currently, users can only share projects with one person at a time. They have to repeat the process for each team member."*

Wait for response, then:

---

### Step 3: Desired Behavior

> **Now describe how it should work after the changes.**
>
> *Example: "Users should be able to add multiple email addresses at once, separated by commas, to invite several people in one action."*

Wait for response, then:

---

### Step 4: Reason for Change

> **Why are we making this change?**
>
> - [ ] Bug fix - *something isn't working correctly*
> - [ ] User feedback - *users requested this*
> - [ ] New requirement - *business/product need*
> - [ ] Performance - *it's too slow*
> - [ ] Security - *vulnerability or improvement*
> - [ ] Tech debt - *code quality improvement*

Wait for response, then:

---

### Step 5: Scope Assessment

> **Based on what you described, I'll need to check which files are affected.**
>
> **Do you know which parts of the code this touches?**
>
> - [ ] Database schema
> - [ ] Backend (services, repositories, actions)
> - [ ] Frontend (components, pages)
> - [ ] API routes
> - [ ] Not sure - *I'll investigate*
>
> *Or just tell me what you know, and I'll figure out the rest.*

Wait for response, then:

---

### Step 6: Breaking Changes

> **Will this change break anything for existing users?**
>
> - [ ] **API changes** - *Existing integrations might break*
> - [ ] **Database migration** - *Schema changes needed*
> - [ ] **Data transformation** - *Existing data needs updating*
> - [ ] **UI changes** - *Users will see different interface*
> - [ ] **No breaking changes expected**
>
> *Example: "Yes, the API response will include a new field, but it's additive so existing clients should be fine."*

Wait for response, then:

---

### Step 7: Migration Plan (if applicable)

> **If there are breaking changes or data migrations needed:**
>
> **How should we handle existing data/users?**
>
> *Example: "Existing single invitations should be converted to the new format automatically."*
>
> *(Skip this if no migration needed)*

Wait for response or skip, then:

---

### Step 8: Backward Compatibility

> **Do we need to maintain backward compatibility?**
>
> - [ ] Yes - *old behavior must still work alongside new*
> - [ ] No - *we can fully replace the old behavior*
>
> *If yes, explain the compatibility requirements:*

Wait for response, then:

---

### Step 9: Test Cases

> **What should I verify after making changes?**
>
> **Existing behavior that should still work:**
> *(e.g., "Single email invite should still work")*
>
> **New behavior to test:**
> *(e.g., "Multiple emails should create multiple invitations")*
>
> **Edge cases:**
> *(e.g., "Mixed valid and invalid emails in the list")*

Wait for response, then:

---

### Step 10: Rollback Plan

> **If something goes wrong, how do we revert?**
>
> - [ ] Feature flag - *we can toggle it off*
> - [ ] Database backup - *restore from backup*
> - [ ] Git revert - *simple code revert*
> - [ ] Not needed - *low risk change*
>
> *Any specific rollback considerations?*

Wait for response, then:

---

### Step 11: Confirmation

> **Here's my understanding of the changes:**
>
> **Feature:** [name]
>
> **Current behavior:**
> [description]
>
> **New behavior:**
> [description]
>
> **Reason:** [reason]
>
> **Affected areas:**
> - [area 1]
> - [area 2]
>
> **Breaking changes:** [yes/no + details]
> **Migration:** [plan or N/A]
> **Backward compatible:** [yes/no]
>
> **Test cases:**
> - [test 1]
> - [test 2]
>
> ---
>
> **Does this look correct?**
> - Type `yes` to proceed
> - Type `no` to adjust

Wait for confirmation, then proceed with implementation.

---

## Implementation Order

1. **Analyze** - Review current implementation
2. **Plan** - Identify all files to change
3. **Database** - Schema changes if needed
4. **Backend** - Services, repositories, actions
5. **Frontend** - Components, pages
6. **Migration** - Data migration if needed
7. **Test** - Verify all test cases
8. **Document** - Update any affected docs