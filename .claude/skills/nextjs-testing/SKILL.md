---
name: nextjs-testing
description: "Testing patterns for Next.js applications using Vitest and Playwright. Use when writing unit tests, integration tests, E2E tests, testing server actions, services, repositories, or React components. Covers test organization, mocking, and CI setup."
---

# Next.js Testing with Vitest & Playwright

## When to Read Which Reference

| Task | Read This |
|------|-----------|
| Initial setup | This file (Quick Start below) |
| Unit testing (services, utils) | [references/unit-testing.md](references/unit-testing.md) |
| Component testing | [references/component-testing.md](references/component-testing.md) |
| E2E testing | [references/e2e-testing.md](references/e2e-testing.md) |

## Quick Start

### 1. Install Vitest

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

### 2. Configure Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', '**/*.test.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 3. Setup File

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))
```

### 4. Add Scripts

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test"
  }
}
```

### 5. First Test

```typescript
// src/services/project-service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { projectService } from './project-service'
import { projectRepository } from '@/repositories/project-repository'

vi.mock('@/repositories/project-repository')

describe('projectService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('creates a project', async () => {
      const mockProject = { id: '1', name: 'Test', ownerId: 'user1' }
      vi.mocked(projectRepository.create).mockResolvedValue(mockProject)
      vi.mocked(projectRepository.countByUserId).mockResolvedValue(0)

      const result = await projectService.create('user1', { name: 'Test' })

      expect(result).toEqual(mockProject)
      expect(projectRepository.create).toHaveBeenCalledWith({
        name: 'Test',
        ownerId: 'user1',
      })
    })

    it('throws when limit exceeded', async () => {
      vi.mocked(projectRepository.countByUserId).mockResolvedValue(5)

      await expect(
        projectService.create('user1', { name: 'Test' })
      ).rejects.toThrow('limit')
    })
  })
})
```

## Clean Architecture Test Organization

```
src/
├── services/
│   ├── project-service.ts
│   └── project-service.test.ts      # Unit tests
├── repositories/
│   ├── project-repository.ts
│   └── project-repository.test.ts   # Integration tests (with DB)
├── actions/
│   ├── project-actions.ts
│   └── project-actions.test.ts      # Action tests
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── button.test.tsx          # Component tests
│   └── projects/
│       ├── project-card.tsx
│       └── project-card.test.tsx
├── lib/
│   └── utils/
│       ├── format.ts
│       └── format.test.ts           # Utility tests
tests/
├── e2e/                             # Playwright E2E tests
│   ├── auth.spec.ts
│   ├── projects.spec.ts
│   └── billing.spec.ts
└── fixtures/                        # Shared test data
    ├── users.ts
    └── projects.ts
```

## What to Test at Each Layer

| Layer | What to Test | How |
|-------|--------------|-----|
| **Services** | Business logic, rules, edge cases | Unit test with mocked repos |
| **Repositories** | Query correctness | Integration test with test DB |
| **Actions** | Auth + validation + orchestration | Mock services |
| **Components** | Rendering, interactions | React Testing Library |
| **E2E** | Critical user flows | Playwright |

## Mocking Patterns

### Mock Repository

```typescript
import { vi } from 'vitest'
import { projectRepository } from '@/repositories/project-repository'

vi.mock('@/repositories/project-repository', () => ({
  projectRepository: {
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    countByUserId: vi.fn(),
  },
}))

// In test
vi.mocked(projectRepository.findById).mockResolvedValue({
  id: '1',
  name: 'Test',
})
```

### Mock Auth

```typescript
import { vi } from 'vitest'

vi.mock('@/lib/auth', () => ({
  requireAuth: vi.fn().mockResolvedValue({
    id: 'user-123',
    email: 'test@example.com',
  }),
  getCurrentUser: vi.fn().mockResolvedValue({
    id: 'user-123',
    email: 'test@example.com',
  }),
}))
```

### Mock External Services

```typescript
vi.mock('@/lib/payments/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ url: 'https://checkout.stripe.com' }),
      },
    },
  },
}))
```

## Test Fixtures

```typescript
// tests/fixtures/projects.ts
export const mockProject = {
  id: 'proj-1',
  name: 'Test Project',
  description: 'A test project',
  ownerId: 'user-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockProjects = [
  mockProject,
  { ...mockProject, id: 'proj-2', name: 'Second Project' },
]

// tests/fixtures/users.ts
export const mockUser = {
  id: 'user-1',
  clerkId: 'clerk-123',
  email: 'test@example.com',
  name: 'Test User',
}
```

## Install Playwright

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
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Key Rules

1. **Unit test services** - Mock repositories, test business logic
2. **Integration test repositories** - Use test database
3. **Component test interactions** - User events, state changes
4. **E2E test critical flows** - Sign up, checkout, core features
5. **Mock at boundaries** - Repositories, external APIs, auth
6. **Test behavior, not implementation** - What, not how