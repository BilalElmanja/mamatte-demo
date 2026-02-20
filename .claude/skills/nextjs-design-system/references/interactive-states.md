# Interactive States

## Table of Contents
- [State Definitions](#state-definitions)
- [Button States](#button-states)
- [Input States](#input-states)
- [Link States](#link-states)
- [Card States](#card-states)
- [Focus Management](#focus-management)
- [State Transitions](#state-transitions)

## State Definitions

### Core States

| State | Description | Visual Treatment |
|-------|-------------|------------------|
| **Default** | Resting state | Base styling |
| **Hover** | Mouse over element | Subtle highlight, cursor change |
| **Focus** | Keyboard navigation | Visible focus ring |
| **Active/Pressed** | Being clicked | Slight depression/scale |
| **Disabled** | Not interactive | Reduced opacity, no cursor |
| **Loading** | Processing action | Spinner, reduced opacity |
| **Error** | Invalid state | Red border, error message |
| **Success** | Valid/complete | Green indicator |

### State Priority (Highest to Lowest)

```
1. Disabled (always takes precedence)
2. Loading
3. Error
4. Active/Pressed
5. Focus
6. Hover
7. Default
```

## Button States

### Complete Button Component

```typescript
// components/ui/button.tsx
'use client'
import { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  `inline-flex items-center justify-center rounded-lg font-medium
   transition-colors focus-visible:outline-none focus-visible:ring-2 
   focus-visible:ring-ring focus-visible:ring-offset-2
   disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        default: 'h-10 px-4',
        lg: 'h-11 px-6 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ButtonProps 
  extends Omit<HTMLMotionProps<'button'>, 'children'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    const isDisabled = disabled || loading

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        whileHover={isDisabled ? {} : { scale: 1.02 }}
        whileTap={isDisabled ? {} : { scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
```

### Button State Styles

```css
/* Button states in CSS (for reference) */
.button {
  /* Default */
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  transition: all 150ms ease;
}

.button:hover:not(:disabled) {
  /* Hover - slightly darker */
  background: hsl(var(--primary) / 0.9);
}

.button:focus-visible {
  /* Focus - ring */
  outline: none;
  ring: 2px solid hsl(var(--ring));
  ring-offset: 2px;
}

.button:active:not(:disabled) {
  /* Active/Pressed - slight scale down handled by Framer */
  background: hsl(var(--primary) / 0.85);
}

.button:disabled {
  /* Disabled */
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
```

## Input States

### Complete Input Component

```typescript
// components/ui/input.tsx
'use client'
import { forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, hint, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    const stateClasses = cn(
      'w-full px-4 py-2.5 rounded-lg border bg-background transition-all',
      'placeholder:text-muted-foreground',
      // Default
      !error && !success && !isFocused && 'border-input',
      // Focus
      isFocused && !error && 'border-primary ring-2 ring-primary/20',
      // Error
      error && 'border-destructive ring-2 ring-destructive/20',
      // Success
      success && !error && 'border-green-500 ring-2 ring-green-500/20',
      // Disabled
      props.disabled && 'opacity-50 cursor-not-allowed bg-muted',
      className
    )

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            className={stateClasses}
            aria-invalid={!!error}
            aria-describedby={error ? 'error-message' : hint ? 'hint-message' : undefined}
            {...props}
          />

          {/* State icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {error && <AlertCircle className="w-5 h-5 text-destructive" />}
            {success && !error && <CheckCircle className="w-5 h-5 text-green-500" />}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              id="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-destructive flex items-center gap-1"
            >
              {error}
            </motion.p>
          )}
          {hint && !error && (
            <motion.p
              id="hint-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground"
            >
              {hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Input.displayName = 'Input'
```

## Link States

### Interactive Link Component

```typescript
// components/ui/link.tsx
'use client'
import { motion } from 'framer-motion'
import NextLink from 'next/link'
import { cn } from '@/lib/utils'

interface LinkProps {
  href: string
  children: React.ReactNode
  variant?: 'default' | 'muted' | 'nav'
  external?: boolean
  className?: string
}

export function Link({ href, children, variant = 'default', external, className }: LinkProps) {
  const variants = {
    default: 'text-primary hover:text-primary/80 underline-offset-4 hover:underline',
    muted: 'text-muted-foreground hover:text-foreground',
    nav: 'text-foreground/60 hover:text-foreground',
  }

  const content = (
    <motion.span
      className={cn(
        'inline-flex items-center gap-1 transition-colors',
        variants[variant],
        className
      )}
      whileHover={{ x: variant === 'nav' ? 2 : 0 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.span>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return <NextLink href={href}>{content}</NextLink>
}
```

### Animated Underline Link

```typescript
// components/ui/underline-link.tsx
'use client'
import { motion } from 'framer-motion'
import NextLink from 'next/link'

export function UnderlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <NextLink href={href} className="relative inline-block">
      <span>{children}</span>
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 bg-primary"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.2 }}
      />
    </NextLink>
  )
}
```

## Card States

### Interactive Card

```typescript
// components/ui/interactive-card.tsx
'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InteractiveCardProps {
  children: React.ReactNode
  onClick?: () => void
  selected?: boolean
  disabled?: boolean
  className?: string
}

export function InteractiveCard({
  children,
  onClick,
  selected,
  disabled,
  className
}: InteractiveCardProps) {
  return (
    <motion.div
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { y: -4 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-xl border bg-card p-6 transition-all',
        // Default
        'border-border',
        // Clickable
        onClick && !disabled && 'cursor-pointer',
        // Hover (CSS fallback)
        onClick && !disabled && 'hover:shadow-md hover:border-primary/20',
        // Selected
        selected && 'border-primary bg-primary/5 ring-2 ring-primary/20',
        // Disabled
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-pressed={selected}
      aria-disabled={disabled}
    >
      {children}
    </motion.div>
  )
}
```

## Focus Management

### Focus Ring Utility

```typescript
// lib/focus.ts

export const focusRing = `
  focus-visible:outline-none 
  focus-visible:ring-2 
  focus-visible:ring-ring 
  focus-visible:ring-offset-2
  focus-visible:ring-offset-background
`

export const focusWithin = `
  focus-within:ring-2 
  focus-within:ring-ring 
  focus-within:ring-offset-2
`
```

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
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // Focus first element
    firstElement?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [isActive])

  return containerRef
}
```

## State Transitions

### Transition Timing Guidelines

| State Change | Duration | Easing |
|--------------|----------|--------|
| Hover enter | 150ms | ease-out |
| Hover leave | 100ms | ease-in |
| Focus | instant | - |
| Active/Press | 100ms | ease-out |
| Disabled | 200ms | ease-in-out |
| Error appear | 200ms | ease-out |
| Error dismiss | 150ms | ease-in |
| Loading enter | 200ms | ease-out |
| Loading exit | 150ms | ease-in |

### State Machine Pattern

```typescript
// hooks/use-button-state.ts
'use client'
import { useState, useCallback } from 'react'

type ButtonState = 'idle' | 'hover' | 'active' | 'loading' | 'success' | 'error'

export function useButtonState(initialState: ButtonState = 'idle') {
  const [state, setState] = useState<ButtonState>(initialState)

  const handlers = {
    onMouseEnter: useCallback(() => {
      if (state === 'idle') setState('hover')
    }, [state]),
    
    onMouseLeave: useCallback(() => {
      if (state === 'hover' || state === 'active') setState('idle')
    }, [state]),
    
    onMouseDown: useCallback(() => {
      if (state === 'hover') setState('active')
    }, [state]),
    
    onMouseUp: useCallback(() => {
      if (state === 'active') setState('hover')
    }, [state]),
  }

  const setLoading = useCallback(() => setState('loading'), [])
  const setSuccess = useCallback(() => setState('success'), [])
  const setError = useCallback(() => setState('error'), [])
  const reset = useCallback(() => setState('idle'), [])

  return { state, handlers, setLoading, setSuccess, setError, reset }
}
```