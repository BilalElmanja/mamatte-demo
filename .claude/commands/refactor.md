# /refactor

## Command Description
Use this command to refactor/restructure code without changing its behavior. Claude will help plan and execute safe refactoring.

---

## Conversation Flow

When the user types `/refactor`, respond with:

---

### Step 1: What to Refactor

> **Let's refactor some code! What do you want to improve?**
>
> *Point me to the code:*
> - File path(s): ___
> - Component/function name: ___
> - Or describe: ___
>
> *Example: "The `ProjectService` is too large and handles too many things"*
> *Example: "The `DashboardPage` component has 500 lines and is hard to maintain"*

Wait for response, then:

---

### Step 2: Current Problems

> **What's wrong with the current code?**
>
> - [ ] **Too large** - File/function is too big
> - [ ] **Too many responsibilities** - Does too many things
> - [ ] **Hard to test** - Can't easily write tests
> - [ ] **Duplicated code** - Same logic in multiple places
> - [ ] **Poor naming** - Names don't reflect purpose
> - [ ] **Architecture violation** - Wrong layer or dependency
> - [ ] **Performance** - Inefficient patterns
> - [ ] **Type safety** - Missing or incorrect types
> - [ ] **Readability** - Hard to understand
> - [ ] **Other:** ___
>
> *Describe the specific issues:*

Wait for response, then:

---

### Step 3: Refactoring Goal

> **What should be better after refactoring?**
>
> *Example: "The service should be split into smaller, focused services"*
> *Example: "The component should be broken into smaller, reusable pieces"*
> *Example: "The business logic should move from the action to the service"*

Wait for response, then:

---

### Step 4: Refactoring Type

> **What kind of refactoring is this?**
>
> - [ ] **Extract** - Pull code out into new function/component/file
> - [ ] **Split** - Break large file into multiple files
> - [ ] **Rename** - Better naming for clarity
> - [ ] **Move** - Relocate to correct layer/folder
> - [ ] **Consolidate** - Combine duplicated code
> - [ ] **Simplify** - Reduce complexity
> - [ ] **Type** - Add/improve TypeScript types
> - [ ] **Pattern** - Apply design pattern (which? ___)
> - [ ] **Performance** - Optimize without changing behavior

Wait for response, then:

---

### Step 5: Constraints

> **What constraints must be respected?**
>
> - [ ] **External API unchanged** - Props, function signatures same
> - [ ] **Database unchanged** - No schema changes
> - [ ] **Backward compatible** - Old usage still works
> - [ ] **Tests must pass** - Existing tests unchanged
> - [ ] **No new dependencies** - Don't add packages
>
> *Any specific constraints?*

Wait for response, then:

---

### Step 6: Scope

> **How big is this refactoring?**
>
> - [ ] **Small** - Single file, quick changes
> - [ ] **Medium** - Few files, 1-2 hours
> - [ ] **Large** - Many files, significant restructure
>
> **Should I refactor:**
> - [ ] Just what you mentioned (minimal)
> - [ ] Related code that has same issues
> - [ ] Full area/module cleanup

Wait for response, then:

---

### Step 7: Testing Strategy

> **How should we verify the refactoring is safe?**
>
> - [ ] **Existing tests** - Run current test suite
> - [ ] **Manual testing** - Test specific flows
> - [ ] **Add new tests** - Write tests first
> - [ ] **Type checking** - TypeScript compilation
> - [ ] **Diff review** - Carefully review all changes
>
> **Specific things to verify:**
> *(e.g., "Make sure project creation still works")*

Wait for response, then:

---

### Step 8: Analysis

> **Let me analyze the current code...**
>
> *[Claude reads the file(s) and provides analysis]*
>
> **Current structure:**
> - [description of current code]
>
> **Issues identified:**
> 1. [issue 1]
> 2. [issue 2]
> 3. [issue 3]
>
> **Proposed changes:**
> 1. [change 1]
> 2. [change 2]
> 3. [change 3]
>
> **Files to create:**
> - [new file 1]
> - [new file 2]
>
> **Files to modify:**
> - [existing file 1]
> - [existing file 2]
>
> **Files to delete:**
> - [file to remove] (if any)
>
> ---
>
> **Does this refactoring plan look good?**
> - Type `yes` to proceed
> - Type `no` to adjust

Wait for confirmation, then proceed.

---

### Step 9: Execution

> **I'll refactor in this order:**
>
> 1. **Create new files** - Set up new structure
> 2. **Move code** - Transfer logic to new locations
> 3. **Update imports** - Fix all import statements
> 4. **Update usages** - Update code that uses refactored code
> 5. **Clean up** - Remove old code, fix any issues
> 6. **Verify** - Run tests, type check
>
> *Starting refactoring...*

---

## Refactoring Best Practices

1. **Small steps** - Make incremental changes
2. **Keep tests passing** - After each step
3. **No behavior changes** - Pure structure change
4. **Commit points** - Natural save points
5. **Review diff** - Before finishing, review all changes