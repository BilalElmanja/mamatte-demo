# /add_tests

## Command Description
Use this command to add test coverage. Claude will help you write appropriate tests based on what you're testing.

---

## Conversation Flow

When the user types `/add_tests`, respond with:

---

### Step 1: Test Target

> **Let's write some tests! What do you want to test?**
>
> - [ ] **Service** - Business logic (e.g., `projectService`)
> - [ ] **Repository** - Data access (e.g., `projectRepository`)
> - [ ] **Utility** - Helper functions (e.g., `formatDate`)
> - [ ] **Component** - React component (e.g., `ProjectCard`)
> - [ ] **Action** - Server action (e.g., `createProjectAction`)
> - [ ] **Hook** - Custom React hook (e.g., `useProjects`)
> - [ ] **API Route** - Endpoint (e.g., `/api/webhooks/stripe`)
> - [ ] **E2E Flow** - User journey (e.g., "signup to first project")
>
> **File/function to test:** ___

Wait for response, then:

---

### Step 2: Test Type

> **What type of tests should I write?**
>
> - [ ] **Unit tests** - Test in isolation, mock dependencies
> - [ ] **Integration tests** - Test with real dependencies (DB, etc.)
> - [ ] **Component tests** - Test React rendering and interactions
> - [ ] **E2E tests** - Test full user flows in browser
>
> *Usually:*
> - *Services, utils → Unit tests*
> - *Repositories → Integration tests*
> - *Components → Component tests*
> - *User flows → E2E tests*

Wait for response, then:

---

### Step 3: Coverage Goal

> **What level of coverage do you want?**
>
> - [ ] **Full coverage** - All public methods and edge cases
> - [ ] **Critical paths** - Main functionality only
> - [ ] **Specific scenarios** - Only these cases: ___
>
> **Any specific scenarios you know need testing?**
> *(e.g., "Test what happens when user exceeds project limit")*

Wait for response, then:

---

### Step 4: Analysis (for existing code)

> **Let me analyze the code to test...**
>
> *[Claude reads the file and identifies test cases]*
>
> **Functions/methods to test:**
> 1. `methodName` - [what it does]
> 2. `methodName` - [what it does]
>
> **Test cases I'll write:**
>
> **Happy paths (normal operation):**
> - [ ] [test case 1]
> - [ ] [test case 2]
>
> **Error cases (things go wrong):**
> - [ ] [error case 1]
> - [ ] [error case 2]
>
> **Edge cases (boundaries):**
> - [ ] [edge case 1]
> - [ ] [edge case 2]
>
> **Do you want me to add or remove any test cases?**

Wait for response, then:

---

### Step 5: Mocking Requirements (for unit tests)

> **What dependencies need to be mocked?**
>
> - [ ] **Repositories** - `vi.mock('@/repositories/...')`
> - [ ] **Services** - `vi.mock('@/services/...')`
> - [ ] **Auth** - `vi.mock('@/lib/auth')`
> - [ ] **External APIs** - `vi.mock('@/lib/...')`
> - [ ] **Next.js** - `vi.mock('next/navigation')`
>
> *I'll set up mocks for: [list]*

Wait for response, then:

---

### Step 6: Test Data

> **What test data/fixtures do you need?**
>
> - [ ] Use existing fixtures from `tests/fixtures/`
> - [ ] Create new fixtures
>
> **Sample data needed:**
> - [ ] Mock user: `{ id: 'user-1', email: '...', ... }`
> - [ ] Mock project: `{ id: 'proj-1', name: '...', ... }`
> - [ ] Other: ___
>
> *Describe any specific test data requirements:*

Wait for response, then:

---

### Step 7: For Component Tests

> **(Skip if not testing components)**
>
> **What interactions should I test?**
>
> - [ ] **Rendering** - Component displays correctly
> - [ ] **Props** - Different props render differently
> - [ ] **User events** - Clicks, typing, form submission
> - [ ] **Loading states** - Shows skeleton/spinner
> - [ ] **Error states** - Shows error message
> - [ ] **Empty states** - Shows empty message
>
> **Specific interactions:**
> *(e.g., "Click delete button opens confirm dialog")*

Wait for response, then:

---

### Step 8: For E2E Tests

> **(Skip if not E2E tests)**
>
> **What user flow should I test?**
>
> **Starting point:** *(e.g., "User is logged in on dashboard")*
>
> **Steps:**
> 1. *(e.g., "Click 'New Project'")*
> 2. *(e.g., "Fill in project name")*
> 3. *(e.g., "Click 'Create'")*
>
> **End state:** *(e.g., "Project appears in list")*
>
> **Describe the flow:*

Wait for response, then:

---

### Step 9: Confirmation

> **Here's the test plan:**
>
> **Testing:** `[file/function name]`
> **Test type:** [unit/integration/component/e2e]
>
> **Test file:** `[path to test file]`
>
> **Test cases:**
>
> ✅ Happy paths:
> - [test 1]
> - [test 2]
>
> ❌ Error cases:
> - [test 1]
> - [test 2]
>
> 🔲 Edge cases:
> - [test 1]
> - [test 2]
>
> **Mocks:** [list]
> **Fixtures:** [list]
>
> ---
>
> **Does this look good?**
> - Type `yes` to write the tests
> - Type `no` to adjust

Wait for confirmation, then write the tests.

---

## Test File Templates

### Unit Test (Service)
```typescript
// src/services/[name]-service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { [service] } from './[name]-service'
import { [repository] } from '@/repositories/[name]-repository'

vi.mock('@/repositories/[name]-repository')

describe('[serviceName]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('[methodName]', () => {
    it('should [expected behavior]', async () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

### Component Test
```typescript
// src/components/[name].test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { [Component] } from './[name]'

describe('[ComponentName]', () => {
  it('renders correctly', () => {
    render(<[Component] />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })
})
```

### E2E Test
```typescript
// tests/e2e/[flow].spec.ts
import { test, expect } from '@playwright/test'

test.describe('[Flow Name]', () => {
  test('should [expected outcome]', async ({ page }) => {
    await page.goto('/')
    // ... test steps
  })
})
```