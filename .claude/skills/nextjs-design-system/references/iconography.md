# Iconography

## Table of Contents
- [Icon Library Setup](#icon-library-setup)
- [Icon Sizes](#icon-sizes)
- [Icon Components](#icon-components)
- [Animated Icons](#animated-icons)
- [Icon Guidelines](#icon-guidelines)

## Icon Library Setup

### Lucide React (Recommended)

```bash
npm install lucide-react
```

```typescript
// Usage
import { Home, Settings, User, ChevronRight } from 'lucide-react'

function Example() {
  return <Home className="w-5 h-5" />
}
```

### Icon Registry Pattern

```typescript
// lib/icons.ts
import {
  Home,
  Settings,
  User,
  Users,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Check,
  Plus,
  Minus,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  ExternalLink,
  Link,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Star,
  Heart,
  Bookmark,
  Share,
  MoreHorizontal,
  MoreVertical,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  HelpCircle,
  Loader2,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  type LucideIcon,
} from 'lucide-react'

export const icons = {
  // Navigation
  home: Home,
  settings: Settings,
  menu: Menu,
  close: X,
  back: ArrowLeft,
  forward: ArrowRight,

  // Actions
  search: Search,
  edit: Edit,
  delete: Trash2,
  copy: Copy,
  download: Download,
  upload: Upload,
  share: Share,
  add: Plus,
  remove: Minus,

  // Status
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  help: HelpCircle,

  // UI
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  check: Check,
  more: MoreHorizontal,
  moreVertical: MoreVertical,

  // Loading
  spinner: Loader2,
  refresh: RefreshCw,

  // User
  user: User,
  users: Users,

  // Communication
  bell: Bell,
  mail: Mail,
  phone: Phone,

  // Visibility
  eye: Eye,
  eyeOff: EyeOff,

  // Security
  lock: Lock,
  unlock: Unlock,

  // Favorites
  star: Star,
  heart: Heart,
  bookmark: Bookmark,
} as const

export type IconName = keyof typeof icons
export type { LucideIcon }
```

## Icon Sizes

### Size Scale

```typescript
// lib/icon-sizes.ts

export const iconSizes = {
  xs: 'w-3 h-3',      // 12px - Inline with small text
  sm: 'w-4 h-4',      // 16px - Buttons, inputs
  md: 'w-5 h-5',      // 20px - Default
  lg: 'w-6 h-6',      // 24px - Headers, navigation
  xl: 'w-8 h-8',      // 32px - Feature icons
  '2xl': 'w-10 h-10', // 40px - Hero sections
  '3xl': 'w-12 h-12', // 48px - Empty states
} as const

export type IconSize = keyof typeof iconSizes
```

### Size Context Guidelines

| Context | Size | Use Case |
|---------|------|----------|
| Inline text | `xs` (12px) | Labels, badges |
| Buttons | `sm` (16px) | Icon buttons, input icons |
| Navigation | `md` (20px) | Menu items, tabs |
| Headers | `lg` (24px) | Page headers |
| Features | `xl` (32px) | Feature cards |
| Hero | `2xl` (40px) | Hero sections |
| Empty States | `3xl` (48px) | Illustrations |

## Icon Components

### Base Icon Component

```typescript
// components/ui/icon.tsx
'use client'
import { forwardRef } from 'react'
import { icons, type IconName, iconSizes, type IconSize } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface IconProps extends React.SVGAttributes<SVGElement> {
  name: IconName
  size?: IconSize
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 'md', className, ...props }, ref) => {
    const IconComponent = icons[name]
    
    return (
      <IconComponent
        ref={ref}
        className={cn(iconSizes[size], className)}
        {...props}
      />
    )
  }
)

Icon.displayName = 'Icon'
```

### Icon Button

```typescript
// components/ui/icon-button.tsx
'use client'
import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { icons, type IconName } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName
  label: string // Required for accessibility
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
}

const sizes = {
  sm: { button: 'w-8 h-8', icon: 'w-4 h-4' },
  md: { button: 'w-10 h-10', icon: 'w-5 h-5' },
  lg: { button: 'w-12 h-12', icon: 'w-6 h-6' },
}

const variants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  ghost: 'hover:bg-muted',
  outline: 'border hover:bg-muted',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, size = 'md', variant = 'ghost', className, ...props }, ref) => {
    const IconComponent = icons[icon]

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={label}
        className={cn(
          'inline-flex items-center justify-center rounded-lg transition-colors',
          sizes[size].button,
          variants[variant],
          className
        )}
        {...props}
      >
        <IconComponent className={sizes[size].icon} />
      </motion.button>
    )
  }
)

IconButton.displayName = 'IconButton'
```

## Animated Icons

### Spinning Loader

```typescript
// components/ui/icons/spinner.tsx
'use client'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpinnerIconProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

export function SpinnerIcon({ size = 'md', className }: SpinnerIconProps) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <Loader2 className={cn(sizes[size], className)} />
    </motion.div>
  )
}
```

### Animated Check

```typescript
// components/ui/icons/animated-check.tsx
'use client'
import { motion } from 'framer-motion'

interface AnimatedCheckProps {
  size?: number
  className?: string
}

export function AnimatedCheck({ size = 24, className }: AnimatedCheckProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        d="M8 12l2.5 2.5L16 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
    </motion.svg>
  )
}
```

### Hamburger to X Animation

```typescript
// components/ui/icons/menu-toggle.tsx
'use client'
import { motion } from 'framer-motion'

interface MenuToggleProps {
  isOpen: boolean
  size?: number
  className?: string
}

export function MenuToggle({ isOpen, size = 24, className }: MenuToggleProps) {
  const variant = isOpen ? 'opened' : 'closed'

  const top = {
    closed: { rotate: 0, translateY: 0 },
    opened: { rotate: 45, translateY: 6 },
  }

  const center = {
    closed: { opacity: 1 },
    opened: { opacity: 0 },
  }

  const bottom = {
    closed: { rotate: 0, translateY: 0 },
    opened: { rotate: -45, translateY: -6 },
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <motion.line
        x1="4" y1="6" x2="20" y2="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={top}
        animate={variant}
        transition={{ duration: 0.2 }}
      />
      <motion.line
        x1="4" y1="12" x2="20" y2="12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={center}
        animate={variant}
        transition={{ duration: 0.2 }}
      />
      <motion.line
        x1="4" y1="18" x2="20" y2="18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={bottom}
        animate={variant}
        transition={{ duration: 0.2 }}
      />
    </svg>
  )
}
```

### Bell with Notification Dot

```typescript
// components/ui/icons/notification-bell.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationBellProps {
  hasNotification?: boolean
  count?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: { icon: 'w-4 h-4', dot: 'w-2 h-2 -top-0.5 -right-0.5' },
  md: { icon: 'w-5 h-5', dot: 'w-2.5 h-2.5 -top-0.5 -right-0.5' },
  lg: { icon: 'w-6 h-6', dot: 'w-3 h-3 -top-1 -right-1' },
}

export function NotificationBell({ 
  hasNotification, count, size = 'md', className 
}: NotificationBellProps) {
  return (
    <div className={cn('relative inline-flex', className)}>
      <Bell className={sizes[size].icon} />
      <AnimatePresence>
        {hasNotification && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={cn(
              'absolute rounded-full bg-red-500 flex items-center justify-center',
              sizes[size].dot
            )}
          >
            {count && count > 0 && (
              <span className="text-[8px] text-white font-bold">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

## Icon Guidelines

### Do's and Don'ts

**Do:**
- Use consistent icon sizes within the same context
- Provide accessible labels for icon-only buttons
- Match icon weight with typography weight
- Use semantic icons (checkmark for success, X for error)

**Don't:**
- Mix icon libraries in the same project
- Use icons without text labels in complex interfaces
- Overuse animated icons (reserve for key interactions)
- Use colored icons unless for semantic meaning

### Accessibility

```typescript
// Always provide labels for icon-only buttons
<button aria-label="Close dialog">
  <X className="w-5 h-5" />
</button>

// Use aria-hidden for decorative icons
<span>
  <Star className="w-4 h-4" aria-hidden="true" />
  4.5 rating
</span>

// Include text for screen readers
<button>
  <span className="sr-only">Delete item</span>
  <Trash2 className="w-5 h-5" aria-hidden="true" />
</button>
```

### Color Guidelines

| State | Color | Usage |
|-------|-------|-------|
| Default | `text-foreground` | Primary actions |
| Muted | `text-muted-foreground` | Secondary elements |
| Success | `text-green-500` | Positive feedback |
| Warning | `text-amber-500` | Caution states |
| Error | `text-red-500` | Error states |
| Info | `text-blue-500` | Informational |