# Component Testing

## Setup

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}))
```

## Testing UI Components

### Button Component

```typescript
// src/components/ui/button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('applies variant styles', () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')
  })
})
```

### Form Component

```typescript
// src/components/forms/project-form.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectForm } from './project-form'

describe('ProjectForm', () => {
  it('renders form fields', () => {
    render(<ProjectForm onSubmit={vi.fn()} />)
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument()
  })

  it('submits form data', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(<ProjectForm onSubmit={handleSubmit} />)

    await user.type(screen.getByLabelText(/name/i), 'My Project')
    await user.type(screen.getByLabelText(/description/i), 'A description')
    await user.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'My Project',
        description: 'A description',
      })
    })
  })

  it('shows validation errors', async () => {
    const user = userEvent.setup()
    render(<ProjectForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })
  })

  it('disables submit while loading', () => {
    render(<ProjectForm onSubmit={vi.fn()} isLoading />)
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled()
  })
})
```

## Testing with User Events

```typescript
import userEvent from '@testing-library/user-event'

describe('Interactive component', () => {
  it('handles user interactions', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)

    // Click
    await user.click(screen.getByRole('button'))

    // Type
    await user.type(screen.getByRole('textbox'), 'Hello')

    // Clear and type
    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), 'New value')

    // Select option
    await user.selectOptions(screen.getByRole('combobox'), 'option1')

    // Keyboard
    await user.keyboard('{Enter}')
    await user.keyboard('{Escape}')

    // Hover
    await user.hover(screen.getByRole('button'))
    await user.unhover(screen.getByRole('button'))
  })
})
```

## Testing Async Components

```typescript
// src/components/projects/project-list.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ProjectList } from './project-list'

// Mock the data fetching
vi.mock('@/hooks/use-projects', () => ({
  useProjects: vi.fn(),
}))

import { useProjects } from '@/hooks/use-projects'

describe('ProjectList', () => {
  it('shows loading state', () => {
    vi.mocked(useProjects).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    })

    render(<ProjectList />)
    
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('shows error state', () => {
    vi.mocked(useProjects).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch'),
    })

    render(<ProjectList />)
    
    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument()
  })

  it('shows empty state', () => {
    vi.mocked(useProjects).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    })

    render(<ProjectList />)
    
    expect(screen.getByText(/no projects/i)).toBeInTheDocument()
  })

  it('renders projects', () => {
    vi.mocked(useProjects).mockReturnValue({
      data: [
        { id: '1', name: 'Project 1' },
        { id: '2', name: 'Project 2' },
      ],
      isLoading: false,
      error: null,
    })

    render(<ProjectList />)
    
    expect(screen.getByText('Project 1')).toBeInTheDocument()
    expect(screen.getByText('Project 2')).toBeInTheDocument()
  })
})
```

## Testing Modals & Dialogs

```typescript
// src/components/overlays/confirm-dialog.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from './confirm-dialog'

describe('ConfirmDialog', () => {
  it('shows when open is true', () => {
    render(
      <ConfirmDialog
        open={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        title="Delete Project"
        description="Are you sure?"
      />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Delete Project')).toBeInTheDocument()
  })

  it('hides when open is false', () => {
    render(
      <ConfirmDialog
        open={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        title="Delete Project"
      />
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onConfirm when confirmed', async () => {
    const user = userEvent.setup()
    const handleConfirm = vi.fn()

    render(
      <ConfirmDialog
        open={true}
        onConfirm={handleConfirm}
        onCancel={vi.fn()}
        title="Delete Project"
      />
    )

    await user.click(screen.getByRole('button', { name: /confirm/i }))

    expect(handleConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when cancelled', async () => {
    const user = userEvent.setup()
    const handleCancel = vi.fn()

    render(
      <ConfirmDialog
        open={true}
        onConfirm={vi.fn()}
        onCancel={handleCancel}
        title="Delete Project"
      />
    )

    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(handleCancel).toHaveBeenCalledOnce()
  })
})
```

## Testing Hooks

```typescript
// src/hooks/use-toggle.test.ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToggle } from './use-toggle'

describe('useToggle', () => {
  it('initializes with false by default', () => {
    const { result } = renderHook(() => useToggle())
    expect(result.current[0]).toBe(false)
  })

  it('initializes with provided value', () => {
    const { result } = renderHook(() => useToggle(true))
    expect(result.current[0]).toBe(true)
  })

  it('toggles value', () => {
    const { result } = renderHook(() => useToggle())

    act(() => {
      result.current[1]() // toggle
    })

    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[1]() // toggle again
    })

    expect(result.current[0]).toBe(false)
  })
})
```

## Testing with Providers

```typescript
// tests/helpers/render.tsx
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  )
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

// Usage
import { renderWithProviders } from '@/tests/helpers/render'

it('works with providers', () => {
  renderWithProviders(<MyComponent />)
})
```

## Snapshot Testing

```typescript
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ProjectCard } from './project-card'

describe('ProjectCard', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <ProjectCard
        project={{
          id: '1',
          name: 'Test Project',
          description: 'A test',
          createdAt: new Date('2024-01-01'),
        }}
      />
    )

    expect(container).toMatchSnapshot()
  })
})
```