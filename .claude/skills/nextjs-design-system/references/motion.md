# Motion & Animation System

## Table of Contents
- [Animation Principles](#animation-principles)
- [Timing Tokens](#timing-tokens)
- [Easing Functions](#easing-functions)
- [Animation Variants](#animation-variants)
- [Gesture Animations](#gesture-animations)
- [Orchestration Patterns](#orchestration-patterns)
- [Reduced Motion](#reduced-motion)
- [Performance Guidelines](#performance-guidelines)

## Animation Principles

### Purpose-Driven Motion

Every animation must serve one of these purposes:

| Purpose | Example | Duration |
|---------|---------|----------|
| **Feedback** | Button press, toggle switch | 100-200ms |
| **Guidance** | Focus indicator, highlight | 200-300ms |
| **Continuity** | Page transitions, modals | 300-500ms |
| **Delight** | Success celebration, loading | 500ms+ |

### Motion Hierarchy

```
1. Micro-interactions (fastest)
   └── Button states, toggles, checkboxes
   
2. Component animations (fast)
   └── Dropdowns, tooltips, popovers
   
3. Layout transitions (medium)
   └── List reordering, expanding panels
   
4. Page transitions (slower)
   └── Route changes, view switches
```

## Timing Tokens

### Duration Scale

```typescript
// lib/motion.ts

export const duration = {
  instant: 0.1,    // 100ms - Micro-interactions
  fast: 0.15,      // 150ms - Quick feedback
  normal: 0.2,     // 200ms - Standard transitions
  slow: 0.3,       // 300ms - Emphasis transitions
  slower: 0.5,     // 500ms - Page transitions
  slowest: 0.8,    // 800ms - Complex orchestrations
} as const

// CSS custom properties
export const durationCSS = {
  instant: '100ms',
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
  slowest: '800ms',
} as const
```

### Duration Guidelines

| Interaction Type | Duration | Use Case |
|-----------------|----------|----------|
| Hover states | 100-150ms | Color changes, shadows |
| Active/pressed | 100ms | Button depression |
| Toggle | 150-200ms | Switches, checkboxes |
| Expand/collapse | 200-300ms | Accordions, dropdowns |
| Enter/appear | 200-300ms | Modals, toasts |
| Exit/disappear | 150-200ms | Faster than enter |
| Page transition | 300-500ms | Route changes |
| Stagger delay | 30-50ms | List items |

## Easing Functions

### Framer Motion Easing

```typescript
// lib/motion.ts

export const ease = {
  // Standard easing
  linear: 'linear',
  default: [0.25, 0.1, 0.25, 1.0],      // Smooth, natural
  
  // Directional easing
  easeIn: [0.4, 0, 1, 1],               // Accelerate (for exits)
  easeOut: [0, 0, 0.2, 1],              // Decelerate (for entrances)
  easeInOut: [0.4, 0, 0.2, 1],          // Symmetric
  
  // Expressive easing
  easeOutBack: [0.34, 1.56, 0.64, 1],   // Overshoot
  easeInBack: [0.36, 0, 0.66, -0.56],   // Anticipation
  
  // Spring presets
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  },
  springBouncy: {
    type: 'spring',
    stiffness: 600,
    damping: 15,
  },
  springSoft: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
  },
  springStiff: {
    type: 'spring',
    stiffness: 700,
    damping: 35,
  },
} as const
```

### When to Use Each Easing

| Easing | Use For |
|--------|---------|
| `easeOut` | Elements entering the screen |
| `easeIn` | Elements leaving the screen |
| `easeInOut` | Elements moving on screen |
| `spring` | Interactive elements, natural feel |
| `springBouncy` | Playful interactions, celebrations |
| `linear` | Continuous animations (spinners) |

## Animation Variants

### Fade Variants

```typescript
// lib/animation-variants.ts

export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

export const fadeDownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
}

export const fadeScaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}
```

### Slide Variants

```typescript
export const slideRightVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
}

export const slideLeftVariants = {
  hidden: { x: 20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
}

export const slideUpVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
}

// Full-width slides for sheets/drawers
export const slideInRight = {
  hidden: { x: '100%' },
  visible: { x: 0 },
  exit: { x: '100%' },
}

export const slideInLeft = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
  exit: { x: '-100%' },
}

export const slideInBottom = {
  hidden: { y: '100%' },
  visible: { y: 0 },
  exit: { y: '100%' },
}
```

### Scale Variants

```typescript
export const scaleVariants = {
  hidden: { scale: 0 },
  visible: { scale: 1 },
  exit: { scale: 0 },
}

export const popVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 500, damping: 25 }
  },
  exit: { scale: 0, opacity: 0 },
}
```

### Container/Stagger Variants

```typescript
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}
```

## Gesture Animations

### Hover and Tap

```typescript
// Standard button interaction
const buttonInteraction = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
}

// Card lift on hover
const cardInteraction = {
  whileHover: { 
    y: -4, 
    boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' 
  },
  transition: { duration: 0.2 },
}

// Subtle highlight
const subtleInteraction = {
  whileHover: { backgroundColor: 'rgba(0,0,0,0.05)' },
  transition: { duration: 0.15 },
}
```

### Drag Gestures

```typescript
// components/ui/draggable-card.tsx
'use client'
import { motion, useMotionValue, useTransform } from 'framer-motion'

export function DraggableCard({ children }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-10, 10])
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 100) {
          // Handle swipe action
        }
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </motion.div>
  )
}
```

## Orchestration Patterns

### Staggered List Entry

```typescript
// components/ui/staggered-list.tsx
'use client'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from '@/lib/animation-variants'

export function StaggeredList({ 
  children,
  staggerDelay = 0.05 
}: { 
  children: React.ReactNode
  staggerDelay?: number 
}) {
  return (
    <motion.div
      variants={{
        ...containerVariants,
        visible: {
          ...containerVariants.visible,
          transition: { staggerChildren: staggerDelay }
        }
      }}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

export function StaggeredItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={itemVariants}>
      {children}
    </motion.div>
  )
}
```

### Coordinated Page Transition

```typescript
// components/layouts/orchestrated-page.tsx
'use client'
import { motion } from 'framer-motion'

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.05,
      staggerDirection: -1,
    }
  }
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0, 0, 0.2, 1] }
  },
  exit: { opacity: 0, y: -20 }
}

export function OrchestratedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

export function PageSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.section variants={sectionVariants}>
      {children}
    </motion.section>
  )
}
```

### Sequential Animation

```typescript
// components/ui/sequential-reveal.tsx
'use client'
import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

export function SequentialReveal({ items }: { items: React.ReactNode[] }) {
  const controls = useAnimation()

  useEffect(() => {
    const sequence = async () => {
      for (let i = 0; i < items.length; i++) {
        await controls.start((index) => ({
          opacity: index <= i ? 1 : 0,
          y: index <= i ? 0 : 20,
          transition: { duration: 0.3 }
        }))
      }
    }
    sequence()
  }, [items, controls])

  return (
    <div>
      {items.map((item, index) => (
        <motion.div
          key={index}
          custom={index}
          animate={controls}
          initial={{ opacity: 0, y: 20 }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  )
}
```

## Reduced Motion

### Reduced Motion Hook

```typescript
// hooks/use-reduced-motion.ts
'use client'
import { useReducedMotion } from 'framer-motion'

export function useMotionPreference() {
  const shouldReduceMotion = useReducedMotion()

  return {
    shouldReduceMotion,
    getTransition: (defaultTransition: any) => 
      shouldReduceMotion 
        ? { duration: 0 } 
        : defaultTransition,
    getVariants: (defaultVariants: any, reducedVariants?: any) =>
      shouldReduceMotion 
        ? (reducedVariants || { hidden: {}, visible: {}, exit: {} })
        : defaultVariants,
  }
}
```

### Accessible Animation Component

```typescript
// components/ui/accessible-motion.tsx
'use client'
import { motion, useReducedMotion, HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'

interface AccessibleMotionProps extends HTMLMotionProps<'div'> {
  reduceOnPreference?: boolean
}

export const AccessibleMotion = forwardRef<HTMLDivElement, AccessibleMotionProps>(
  ({ reduceOnPreference = true, animate, transition, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()

    const safeAnimate = reduceOnPreference && shouldReduceMotion
      ? { opacity: 1 }
      : animate

    const safeTransition = reduceOnPreference && shouldReduceMotion
      ? { duration: 0 }
      : transition

    return (
      <motion.div
        ref={ref}
        animate={safeAnimate}
        transition={safeTransition}
        {...props}
      />
    )
  }
)

AccessibleMotion.displayName = 'AccessibleMotion'
```

### CSS Reduced Motion

```css
/* globals.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Performance Guidelines

### Animation Performance Rules

1. **Only animate transform and opacity**
   ```typescript
   // ✅ Good - GPU accelerated
   animate={{ x: 100, opacity: 0.5, scale: 1.1, rotate: 45 }}
   
   // ❌ Avoid - triggers layout
   animate={{ width: 100, height: 100, top: 50, left: 50 }}
   ```

2. **Use `will-change` sparingly**
   ```typescript
   // Only for frequently animated elements
   <motion.div style={{ willChange: 'transform' }} />
   ```

3. **Prefer CSS for simple animations**
   ```css
   /* Simple hover states don't need JS */
   .button {
     transition: background-color 150ms ease;
   }
   .button:hover {
     background-color: var(--hover-color);
   }
   ```

4. **Use `layout` prop judiciously**
   ```typescript
   // Only when layout changes are necessary
   <motion.div layout>Content that changes size</motion.div>
   
   // Use layoutId for shared element transitions
   <motion.div layoutId="shared-element" />
   ```

5. **Debounce scroll-linked animations**
   ```typescript
   import { useScroll, useTransform, useSpring } from 'framer-motion'

   function ScrollLinked() {
     const { scrollYProgress } = useScroll()
     // Add spring for smoother performance
     const smoothProgress = useSpring(scrollYProgress, {
       stiffness: 100,
       damping: 30,
       restDelta: 0.001
     })
     
     return <motion.div style={{ scaleX: smoothProgress }} />
   }
   ```