# Unit Testing

## Testing Services

Services contain business logic and are the most important layer to test.

### Basic Service Test

```typescript
// src/services/project-service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { projectService } from './project-service'
import { projectRepository } from '@/repositories/project-repository'
import { subscriptionRepository } from '@/repositories/subscription-repository'

// Mock all repository dependencies
vi.mock('@/repositories/project-repository')
vi.mock('@/repositories/subscription-repository')

describe('projectService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('creates a project for user within limits', async () => {
      // Arrange
      vi.mocked(projectRepository.countByUserId).mockResolvedValue(2)
      vi.mocked(subscriptionRepository.findByUserId).mockResolvedValue({
        plan: 'free',
      })
      vi.mocked(projectRepository.create).mockResolvedValue({
        id: 'new-id',
        name: 'New Project',
        ownerId: 'user-1',
      })

      // Act
      const result = await projectService.create('user-1', {
        name: 'New Project',
      })

      // Assert
      expect(result.name).toBe('New Project')
      expect(projectRepository.create).toHaveBeenCalledWith({
        name: 'New Project',
        ownerId: 'user-1',
      })
    })

    it('throws when free plan limit exceeded', async () => {
      vi.mocked(projectRepository.countByUserId).mockResolvedValue(5)
      vi.mocked(subscriptionRepository.findByUserId).mockResolvedValue({
        plan: 'free',
      })

      await expect(
        projectService.create('user-1', { name: 'Test' })
      ).rejects.toThrow('limit')
    })

    it('allows more projects for pro plan', async () => {
      vi.mocked(projectRepository.countByUserId).mockResolvedValue(10)
      vi.mocked(subscriptionRepository.findByUserId).mockResolvedValue({
        plan: 'pro',
      })
      vi.mocked(projectRepository.create).mockResolvedValue({
        id: 'new-id',
        name: 'Test',
        ownerId: 'user-1',
      })

      const result = await projectService.create('user-1', { name: 'Test' })

      expect(result).toBeDefined()
    })

    it('rejects reserved project names', async () => {
      vi.mocked(projectRepository.countByUserId).mockResolvedValue(0)

      await expect(
        projectService.create('user-1', { name: 'admin' })
      ).rejects.toThrow('reserved')
    })
  })

  describe('delete', () => {
    it('deletes project owned by user', async () => {
      vi.mocked(projectRepository.findById).mockResolvedValue({
        id: 'proj-1',
        ownerId: 'user-1',
      })
      vi.mocked(projectRepository.delete).mockResolvedValue({ id: 'proj-1' })

      await projectService.delete('user-1', 'proj-1')

      expect(projectRepository.delete).toHaveBeenCalledWith('proj-1')
    })

    it('throws when user does not own project', async () => {
      vi.mocked(projectRepository.findById).mockResolvedValue({
        id: 'proj-1',
        ownerId: 'other-user',
      })

      await expect(
        projectService.delete('user-1', 'proj-1')
      ).rejects.toThrow('not found')
    })
  })
})
```

### Testing Edge Cases

```typescript
describe('subscriptionService', () => {
  describe('checkLimit', () => {
    it.each([
      { plan: 'free', current: 0, expected: true },
      { plan: 'free', current: 4, expected: true },
      { plan: 'free', current: 5, expected: false },
      { plan: 'pro', current: 49, expected: true },
      { plan: 'pro', current: 50, expected: false },
      { plan: 'enterprise', current: 1000, expected: true }, // unlimited
    ])('returns $expected for $plan plan with $current projects', 
      async ({ plan, current, expected }) => {
        vi.mocked(subscriptionRepository.findByUserId).mockResolvedValue({ plan })
        
        const result = await subscriptionService.checkLimit('user-1', 'projects', current)
        
        expect(result).toBe(expected)
      }
    )
  })
})
```

## Testing Utilities

```typescript
// src/lib/utils/format.test.ts
import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, slugify } from './format'

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('handles negative numbers', () => {
    expect(formatCurrency(-50)).toBe('-$50.00')
  })
})

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(slugify('Hello! @World#')).toBe('hello-world')
  })

  it('handles multiple spaces', () => {
    expect(slugify('Hello    World')).toBe('hello-world')
  })
})
```

## Testing with Async/Await

```typescript
describe('asyncService', () => {
  it('handles successful async operation', async () => {
    const result = await asyncService.fetchData()
    expect(result).toBeDefined()
  })

  it('handles rejected promise', async () => {
    vi.mocked(repository.fetch).mockRejectedValue(new Error('Network error'))
    
    await expect(asyncService.fetchData()).rejects.toThrow('Network error')
  })

  it('handles timeout', async () => {
    vi.mocked(repository.fetch).mockImplementation(
      () => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 100)
      )
    )

    await expect(asyncService.fetchData()).rejects.toThrow('Timeout')
  })
})
```

## Mocking Time

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('time-sensitive tests', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('checks if subscription is expired', () => {
    vi.setSystemTime(new Date('2024-06-15'))

    const subscription = {
      currentPeriodEnd: new Date('2024-06-01'),
    }

    expect(subscriptionService.isExpired(subscription)).toBe(true)
  })

  it('returns false for active subscription', () => {
    vi.setSystemTime(new Date('2024-06-15'))

    const subscription = {
      currentPeriodEnd: new Date('2024-06-30'),
    }

    expect(subscriptionService.isExpired(subscription)).toBe(false)
  })
})
```

## Testing Error Handling

```typescript
describe('error handling', () => {
  it('throws ServiceError with correct code', async () => {
    vi.mocked(repository.findById).mockResolvedValue(null)

    try {
      await service.getById('non-existent')
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ServiceError)
      expect(error.code).toBe('NOT_FOUND')
      expect(error.message).toContain('not found')
    }
  })

  it('wraps unexpected errors', async () => {
    vi.mocked(repository.create).mockRejectedValue(new Error('DB error'))

    try {
      await service.create({ name: 'Test' })
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ServiceError)
      expect(error.code).toBe('INTERNAL_ERROR')
    }
  })
})
```

## Test Helpers

```typescript
// tests/helpers/service-test.ts
import { vi } from 'vitest'

export function mockRepository<T extends object>(methods: (keyof T)[]) {
  const mock = {} as Record<keyof T, ReturnType<typeof vi.fn>>
  
  for (const method of methods) {
    mock[method] = vi.fn()
  }
  
  return mock
}

// Usage
const mockProjectRepo = mockRepository<typeof projectRepository>([
  'findById',
  'create',
  'update',
  'delete',
])
```

```typescript
// tests/helpers/factories.ts
export function createMockProject(overrides = {}) {
  return {
    id: 'proj-1',
    name: 'Test Project',
    description: null,
    ownerId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function createMockUser(overrides = {}) {
  return {
    id: 'user-1',
    clerkId: 'clerk-123',
    email: 'test@example.com',
    name: 'Test User',
    ...overrides,
  }
}
```