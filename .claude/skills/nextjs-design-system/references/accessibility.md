# Responsive Design & Accessibility

## Table of Contents
- [Breakpoint System](#breakpoint-system)
- [Responsive Patterns](#responsive-patterns)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Screen Reader Support](#screen-reader-support)
- [Keyboard Navigation](#keyboard-navigation)
- [Color Accessibility](#color-accessibility)

## Breakpoint System

### Breakpoint Tokens

```typescript
// lib/breakpoints.ts
export const breakpoints = {
  sm: 640,   // Mobile landscape
  md: 768,   // Tablet
  lg: 1024,  // Desktop
  xl: 1280,  // Large desktop
  '2xl': 1536, // Extra large
} as const
```

### useBreakpoint Hook

```typescript
// hooks/use-breakpoint.ts
'use client'
import { useState, useEffect } from 'react'
import { breakpoints } from '@/lib/breakpoints'

type Breakpoint = keyof typeof breakpoints

export function useBreakpoint() {
  const [current, setCurrent] = useState<Breakpoint | null>(null)

  useEffect(() => {
    const getBreakpoint = (): Breakpoint | null => {
      const width = window.innerWidth
      if (width >= breakpoints['2xl']) return '2xl'
      if (width >= breakpoints.xl) return 'xl'
      if (width >= breakpoints.lg) return 'lg'
      if (width >= breakpoints.md) return 'md'
      if (width >= breakpoints.sm) return 'sm'
      return null
    }

    const handleResize = () => setCurrent(getBreakpoint())
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    current,
    isMobile: current === null || current === 'sm',
    isTablet: current === 'md',
    isDesktop: current === 'lg' || current === 'xl' || current === '2xl',
  }
}
```

### useMediaQuery Hook

```typescript
// hooks/use-media-query.ts
'use client'
import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// Convenience hooks
export const useIsMobile = () => useMediaQuery('(max-width: 639px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
```

## Responsive Patterns

### Responsive Container

```typescript
// components/ui/container.tsx
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

const sizes = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
}

export function Container({ children, size = 'lg', className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizes[size], className)}>
      {children}
    </div>
  )
}
```

### Show/Hide Components

```typescript
// components/ui/responsive-visibility.tsx
import { cn } from '@/lib/utils'

export function Show({ children, above, below, className }: {
  children: React.ReactNode
  above?: 'sm' | 'md' | 'lg' | 'xl'
  below?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const classes = cn(
    above === 'sm' && 'hidden sm:block',
    above === 'md' && 'hidden md:block',
    above === 'lg' && 'hidden lg:block',
    below === 'md' && 'md:hidden',
    below === 'lg' && 'lg:hidden',
    className
  )
  return <div className={classes}>{children}</div>
}
```

## Accessibility Guidelines

### ARIA Patterns

```typescript
// components/ui/accessible-button.tsx
'use client'
import { forwardRef } from 'react'

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  pressed?: boolean
  expanded?: boolean
  controls?: string
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ loading, pressed, expanded, controls, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-busy={loading}
        aria-pressed={pressed}
        aria-expanded={expanded}
        aria-controls={controls}
        {...props}
      >
        {loading && <span className="sr-only">Loading...</span>}
        {children}
      </button>
    )
  }
)
```

### Live Regions

```typescript
// components/ui/live-region.tsx
'use client'
import { useEffect, useState } from 'react'

export function LiveRegion({ message, type = 'polite' }: { 
  message: string
  type?: 'polite' | 'assertive' 
}) {
  const [announcement, setAnnouncement] = useState(message)

  useEffect(() => {
    setAnnouncement(message)
  }, [message])

  return (
    <div role="status" aria-live={type} aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  )
}
```

## Screen Reader Support

### SR-Only Utility

```typescript
// components/ui/sr-only.tsx
export function SrOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}
```

### Skip Link

```typescript
// components/ui/skip-link.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:border
                 focus:rounded-lg focus:shadow-lg"
    >
      Skip to main content
    </a>
  )
}
```

## Keyboard Navigation

### Focus Trap Hook

```typescript
// hooks/use-focus-trap.ts
'use client'
import { useEffect, useRef } from 'react'

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0] as HTMLElement
    const last = focusable[focusable.length - 1] as HTMLElement

    first?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [isActive])

  return containerRef
}
```

### Roving Tab Index

```typescript
// hooks/use-roving-index.ts
'use client'
import { useState, useCallback, KeyboardEvent } from 'react'

export function useRovingIndex(itemCount: number) {
  const [focusedIndex, setFocusedIndex] = useState(0)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault()
        setFocusedIndex(i => (i + 1) % itemCount)
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault()
        setFocusedIndex(i => (i - 1 + itemCount) % itemCount)
        break
      case 'Home':
        e.preventDefault()
        setFocusedIndex(0)
        break
      case 'End':
        e.preventDefault()
        setFocusedIndex(itemCount - 1)
        break
    }
  }, [itemCount])

  return { focusedIndex, handleKeyDown, getTabIndex: (i: number) => i === focusedIndex ? 0 : -1 }
}
```

## Color Accessibility

### Contrast Requirements

| Text Size | Min Ratio (AA) | Min Ratio (AAA) |
|-----------|----------------|-----------------|
| Normal text | 4.5:1 | 7:1 |
| Large text (18px+) | 3:1 | 4.5:1 |
| UI components | 3:1 | 3:1 |

### Focus Indicators

```css
/* Ensure visible focus for all interactive elements */
:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* High contrast mode support */
@media (forced-colors: active) {
  :focus-visible {
    outline: 3px solid CanvasText;
  }
}
```