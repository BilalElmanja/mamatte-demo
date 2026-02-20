# Layout Components

## Table of Contents
- [Page Shells](#page-shells)
- [Responsive Grids](#responsive-grids)
- [Section Layouts](#section-layouts)
- [Scroll Animations](#scroll-animations)
- [Page Transitions](#page-transitions)

## Page Shells

### Dashboard Shell

```typescript
// components/layouts/dashboard-shell.tsx
'use client'
import { motion } from 'framer-motion'
import { Sidebar } from './sidebar'

interface DashboardShellProps {
  children: React.ReactNode
  title: string
  description?: string
  actions?: React.ReactNode
}

export function DashboardShell({ 
  children, title, description, actions 
}: DashboardShellProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold">{title}</h1>
              {description && (
                <p className="text-muted-foreground mt-1">{description}</p>
              )}
            </motion.div>
            
            {actions && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {actions}
              </motion.div>
            )}
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
```

### Auth Shell

```typescript
// components/layouts/auth-shell.tsx
'use client'
import { motion } from 'framer-motion'

interface AuthShellProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function AuthShell({ children, title, description }: AuthShellProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between"
      >
        <div className="text-primary-foreground">
          <h1 className="text-2xl font-bold">Acme Inc</h1>
        </div>
        <div className="text-primary-foreground/80">
          <blockquote className="text-lg italic">
            "This product has completely transformed how we work."
          </blockquote>
          <p className="mt-4 font-medium">— Jane Doe, CEO at Company</p>
        </div>
      </motion.div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">{title}</h2>
            {description && (
              <p className="text-muted-foreground mt-2">{description}</p>
            )}
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  )
}
```

## Responsive Grids

### Auto-Fit Grid

```typescript
// components/ui/grid.tsx
'use client'
import { motion } from 'framer-motion'

interface GridProps {
  children: React.ReactNode
  minWidth?: number
  gap?: number
}

export function Grid({ children, minWidth = 280, gap = 24 }: GridProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="grid"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {children}
    </motion.div>
  )
}

export function GridItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    >
      {children}
    </motion.div>
  )
}
```

### Masonry Grid

```typescript
// components/ui/masonry-grid.tsx
'use client'
import { motion } from 'framer-motion'

interface MasonryGridProps {
  children: React.ReactNode
  columns?: number
}

export function MasonryGrid({ children, columns = 3 }: MasonryGridProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
      }}
      className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4"
      style={{ columnCount: columns }}
    >
      {children}
    </motion.div>
  )
}

export function MasonryItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
      }}
      className="break-inside-avoid"
    >
      {children}
    </motion.div>
  )
}
```

## Section Layouts

### Bento Grid

```typescript
// components/ui/bento-grid.tsx
'use client'
import { motion } from 'framer-motion'

interface BentoItemProps {
  children: React.ReactNode
  className?: string
  colSpan?: 1 | 2
  rowSpan?: 1 | 2
}

export function BentoGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {children}
    </motion.div>
  )
}

export function BentoItem({ 
  children, className, colSpan = 1, rowSpan = 1 
}: BentoItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -4 }}
      className={`
        bg-card border rounded-2xl p-6
        ${colSpan === 2 ? 'md:col-span-2' : ''}
        ${rowSpan === 2 ? 'md:row-span-2' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
```

## Scroll Animations

### Scroll Reveal

```typescript
// components/ui/scroll-reveal.tsx
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function ScrollReveal({ 
  children, delay = 0, direction = 'up' 
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

### Parallax Section

```typescript
// components/ui/parallax-section.tsx
'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface ParallaxSectionProps {
  children: React.ReactNode
  speed?: number
}

export function ParallaxSection({ children, speed = 0.5 }: ParallaxSectionProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed])

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}
```

### Scroll Progress

```typescript
// components/ui/scroll-progress.tsx
'use client'
import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
      style={{ scaleX }}
    />
  )
}
```

## Page Transitions

### Fade Transition

```typescript
// components/layouts/page-transition.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

### Slide Transition

```typescript
// components/layouts/slide-transition.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function SlideTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

### Scale Transition

```typescript
// components/layouts/scale-transition.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function ScaleTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

### Usage in Layout

```typescript
// app/layout.tsx
import { PageTransition } from '@/components/layouts/page-transition'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  )
}
```