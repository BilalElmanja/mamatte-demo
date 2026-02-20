# E2E Testing with Playwright

## Setup

```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
```

## Basic Tests

```typescript
// tests/e2e/home.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('shows hero section', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: /get started/i })).toBeVisible()
  })

  test('navigates to pricing', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Pricing')
    
    await expect(page).toHaveURL('/pricing')
    await expect(page.getByRole('heading', { name: /pricing/i })).toBeVisible()
  })
})
```

## Authentication Tests

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('shows sign in page', async ({ page }) => {
    await page.goto('/sign-in')
    
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })

  test('redirects unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard')
    
    await expect(page).toHaveURL(/sign-in/)
  })

  test('signs in with email', async ({ page }) => {
    await page.goto('/sign-in')
    
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
  })
})
```

## Authenticated Test Fixtures

```typescript
// tests/e2e/fixtures.ts
import { test as base } from '@playwright/test'

type AuthFixtures = {
  authenticatedPage: Page
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Sign in before test
    await page.goto('/sign-in')
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL!)
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD!)
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    await use(page)
  },
})

export { expect } from '@playwright/test'
```

```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from './fixtures'

test.describe('Dashboard', () => {
  test('shows dashboard for authenticated user', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard')
    
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
    await expect(page.getByRole('navigation')).toBeVisible()
  })
})
```

## Testing CRUD Operations

```typescript
// tests/e2e/projects.spec.ts
import { test, expect } from './fixtures'

test.describe('Projects', () => {
  test('creates a new project', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/projects')
    
    // Click create button
    await page.click('button:has-text("New Project")')
    
    // Fill form
    await page.fill('[name="name"]', 'E2E Test Project')
    await page.fill('[name="description"]', 'Created by E2E test')
    
    // Submit
    await page.click('button[type="submit"]')
    
    // Verify created
    await expect(page.getByText('E2E Test Project')).toBeVisible()
  })

  test('edits a project', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/projects')
    
    // Click on project
    await page.click('text=E2E Test Project')
    
    // Click edit
    await page.click('button:has-text("Edit")')
    
    // Update name
    await page.fill('[name="name"]', 'Updated Project Name')
    await page.click('button[type="submit"]')
    
    // Verify updated
    await expect(page.getByText('Updated Project Name')).toBeVisible()
  })

  test('deletes a project', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/projects')
    
    // Open menu
    await page.click('[data-testid="project-menu"]:first-child')
    await page.click('text=Delete')
    
    // Confirm deletion
    await page.click('button:has-text("Confirm")')
    
    // Verify deleted
    await expect(page.getByText('E2E Test Project')).not.toBeVisible()
  })
})
```

## Testing Billing Flow

```typescript
// tests/e2e/billing.spec.ts
import { test, expect } from './fixtures'

test.describe('Billing', () => {
  test('shows upgrade options for free users', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard/settings/billing')
    
    await expect(page.getByText('Free Plan')).toBeVisible()
    await expect(page.getByRole('button', { name: /upgrade/i })).toBeVisible()
  })

  test('navigates to checkout', async ({ authenticatedPage: page }) => {
    await page.goto('/pricing')
    
    await page.click('button:has-text("Subscribe")')
    
    // Should redirect to Stripe
    await expect(page).toHaveURL(/checkout\.stripe\.com/)
  })
})
```

## Visual Regression Testing

```typescript
test('pricing page visual', async ({ page }) => {
  await page.goto('/pricing')
  
  // Wait for animations to complete
  await page.waitForTimeout(500)
  
  await expect(page).toHaveScreenshot('pricing-page.png', {
    fullPage: true,
    animations: 'disabled',
  })
})
```

## Mobile Testing

```typescript
import { test, expect, devices } from '@playwright/test'

test.describe('Mobile', () => {
  test.use(devices['iPhone 13'])

  test('shows mobile menu', async ({ page }) => {
    await page.goto('/')
    
    // Desktop nav should be hidden
    await expect(page.locator('nav.desktop')).not.toBeVisible()
    
    // Mobile menu button should be visible
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()
    
    // Open menu
    await page.click('button[aria-label="Menu"]')
    await expect(page.locator('nav.mobile')).toBeVisible()
  })
})
```

## API Testing

```typescript
// tests/e2e/api.spec.ts
import { test, expect } from '@playwright/test'

test.describe('API', () => {
  test('health check endpoint', async ({ request }) => {
    const response = await request.get('/api/health')
    
    expect(response.ok()).toBeTruthy()
    expect(await response.json()).toEqual({ status: 'ok' })
  })

  test('returns 401 for unauthenticated requests', async ({ request }) => {
    const response = await request.get('/api/projects')
    
    expect(response.status()).toBe(401)
  })
})
```

## Page Object Model

```typescript
// tests/e2e/pages/dashboard-page.ts
import { Page, Locator } from '@playwright/test'

export class DashboardPage {
  readonly page: Page
  readonly heading: Locator
  readonly createButton: Locator
  readonly projectList: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: /dashboard/i })
    this.createButton = page.getByRole('button', { name: /new project/i })
    this.projectList = page.getByTestId('project-list')
  }

  async goto() {
    await this.page.goto('/dashboard')
  }

  async createProject(name: string, description?: string) {
    await this.createButton.click()
    await this.page.fill('[name="name"]', name)
    if (description) {
      await this.page.fill('[name="description"]', description)
    }
    await this.page.click('button[type="submit"]')
  }

  async getProjectCount() {
    return await this.projectList.locator('[data-testid="project-card"]').count()
  }
}
```

```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from './fixtures'
import { DashboardPage } from './pages/dashboard-page'

test('creates project', async ({ authenticatedPage: page }) => {
  const dashboard = new DashboardPage(page)
  await dashboard.goto()
  
  const initialCount = await dashboard.getProjectCount()
  await dashboard.createProject('New Project', 'Description')
  
  expect(await dashboard.getProjectCount()).toBe(initialCount + 1)
})
```

## CI Configuration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```