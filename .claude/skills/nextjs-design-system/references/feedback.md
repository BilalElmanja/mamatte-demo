# Feedback Components

## Table of Contents
- [Toast Notifications](#toast-notifications)
- [Loading States](#loading-states)
- [Skeleton Loaders](#skeleton-loaders)
- [Progress Indicators](#progress-indicators)
- [Empty States](#empty-states)

## Toast Notifications

### Toast Provider Setup

```typescript
// components/ui/toast/toast-provider.tsx
'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
}

const ToastContext = createContext<{
  toast: (props: Omit<Toast, 'id'>) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ type, title, description }: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, type, title, description }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <ToastItem key={t.id} {...t} onDismiss={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const styles = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  error: 'bg-red-50 border-red-200 text-red-900',
  info: 'bg-blue-50 border-blue-200 text-blue-900',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
}

function ToastItem({ 
  id, type, title, description, onDismiss 
}: Toast & { onDismiss: () => void }) {
  const Icon = icons[type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg
        min-w-[320px] max-w-[420px] ${styles[type]}
      `}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        {description && (
          <p className="text-sm opacity-80 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
```

### Usage

```typescript
'use client'
import { useToast } from '@/components/ui/toast/toast-provider'

function MyComponent() {
  const { toast } = useToast()

  const handleSuccess = () => {
    toast({
      type: 'success',
      title: 'Project created',
      description: 'Your project has been created successfully.',
    })
  }

  const handleError = () => {
    toast({
      type: 'error',
      title: 'Something went wrong',
      description: 'Please try again later.',
    })
  }
}
```

## Loading States

### Button Loading State

```typescript
// components/ui/button.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
}

export function Button({ loading, children, disabled, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      className="relative px-4 py-2 bg-primary text-primary-foreground rounded-lg
                 disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </motion.span>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
```

### Full Page Loading

```typescript
// components/ui/page-loader.tsx
'use client'
import { motion } from 'framer-motion'

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-muted-foreground">Loading...</p>
      </motion.div>
    </div>
  )
}
```

### Inline Loading Spinner

```typescript
// components/ui/spinner.tsx
'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <motion.div
      className={cn('border-2 border-current/20 border-t-current rounded-full', sizes[size], className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  )
}
```

## Skeleton Loaders

### Base Skeleton

```typescript
// components/ui/skeleton.tsx
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  )
}
```

### Card Skeleton

```typescript
// components/ui/card-skeleton.tsx
import { Skeleton } from './skeleton'

export function CardSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}
```

### Table Skeleton

```typescript
// components/ui/table-skeleton.tsx
import { Skeleton } from './skeleton'

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-muted/50 border-b">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b last:border-0">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  )
}
```

### Animated Skeleton (Shimmer Effect)

```typescript
// components/ui/shimmer-skeleton.tsx
'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function ShimmerSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-md bg-muted', className)}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ translateX: ['100%', '-100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
```

## Progress Indicators

### Linear Progress

```typescript
// components/ui/progress.tsx
'use client'
import { motion } from 'framer-motion'

interface ProgressProps {
  value: number // 0-100
  showLabel?: boolean
}

export function Progress({ value, showLabel }: ProgressProps) {
  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{value}%</span>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
```

### Circular Progress

```typescript
// components/ui/circular-progress.tsx
'use client'
import { motion } from 'framer-motion'

interface CircularProgressProps {
  value: number // 0-100
  size?: number
  strokeWidth?: number
}

export function CircularProgress({ 
  value, 
  size = 64, 
  strokeWidth = 4 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-muted"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-primary"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium">{value}%</span>
      </div>
    </div>
  )
}
```

## Empty States

### Generic Empty State

```typescript
// components/ui/empty-state.tsx
'use client'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4"
      >
        <Icon className="w-8 h-8 text-muted-foreground" />
      </motion.div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}
```

### Usage

```typescript
import { FolderOpen } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

function ProjectsPage() {
  return (
    <EmptyState
      icon={FolderOpen}
      title="No projects yet"
      description="Get started by creating your first project."
      action={{
        label: 'Create Project',
        onClick: () => setShowCreateModal(true),
      }}
    />
  )
}
```