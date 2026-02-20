# Dark Mode & Performance

## Table of Contents
- [Dark Mode Implementation](#dark-mode-implementation)
- [Theme Provider](#theme-provider)
- [Theme Toggle](#theme-toggle)
- [Performance Guidelines](#performance-guidelines)
- [Animation Performance](#animation-performance)
- [Bundle Optimization](#bundle-optimization)

## Dark Mode Implementation

### CSS Variables Strategy

```css
/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --border: 240 5.9% 90%;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --border: 240 3.7% 15.9%;
  }
}
```

### Prevent Flash of Wrong Theme

```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.classList.toggle('dark', theme === 'dark');
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

## Theme Provider

```typescript
// components/providers/theme-provider.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
} | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) setThemeState(stored)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const applyTheme = (t: 'light' | 'dark') => {
      root.classList.remove('light', 'dark')
      root.classList.add(t)
    }

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      applyTheme(systemTheme)
    } else {
      applyTheme(theme)
    }
  }, [theme])

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem('theme', t)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
```

## Theme Toggle

```typescript
// components/ui/theme-toggle.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/components/providers/theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const icons = { light: Sun, dark: Moon, system: Monitor }
  const Icon = icons[theme]

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system']
    const next = themes[(themes.indexOf(theme) + 1) % 3]
    setTheme(next)
  }

  return (
    <motion.button
      onClick={cycleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 rounded-lg hover:bg-muted"
      aria-label={`Theme: ${theme}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}
```

## Performance Guidelines

### Component Performance Rules

```typescript
// ✅ Memoize expensive computations
const expensiveValue = useMemo(() => compute(data), [data])

// ✅ Memoize callbacks
const handleClick = useCallback(() => doSomething(), [])

// ✅ Use React.memo for pure components
const Card = memo(function Card({ title }: { title: string }) {
  return <div>{title}</div>
})

// ❌ Don't create objects in render
<Component style={{ margin: 10 }} /> // Bad

// ✅ Define outside or memoize
const style = { margin: 10 }
<Component style={style} />
```

### Image Optimization

```typescript
import Image from 'next/image'

export function OptimizedImage({ src, alt, width, height, priority = false }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
    />
  )
}
```

## Animation Performance

### GPU-Accelerated Properties Only

```typescript
// ✅ Good: transform and opacity
const good = {
  initial: { opacity: 0, x: -20, scale: 0.9 },
  animate: { opacity: 1, x: 0, scale: 1 },
}

// ❌ Bad: layout properties
const bad = {
  initial: { width: 0, height: 0 },
  animate: { width: 200, height: 200 },
}
```

### Reduced Motion Support

```typescript
'use client'
import { useReducedMotion } from 'framer-motion'

export function SafeAnimation({ children }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      animate={{ opacity: 1, y: reduce ? 0 : 20 }}
      transition={{ duration: reduce ? 0 : 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

## Bundle Optimization

### Dynamic Imports

```typescript
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('./chart'), {
  loading: () => <Skeleton className="h-64" />,
  ssr: false,
})
```

### Tree-Shake Icons

```typescript
// ✅ Good: Named imports
import { Home, Settings } from 'lucide-react'

// ❌ Bad: Namespace import
import * as Icons from 'lucide-react'
```

### Optimize Framer Motion

```typescript
import { LazyMotion, domAnimation } from 'framer-motion'

// Wrap app for smaller bundle
export function MotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
```