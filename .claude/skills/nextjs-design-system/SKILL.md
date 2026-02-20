---
name: nextjs-design-system
description: "Production-grade design system for Next.js SaaS with Framer Motion animations, micro-interactions, and enhanced UX patterns. Use when building UI components, page transitions, loading states, form interactions, toast notifications, modals, navigation patterns, or any interface requiring polished animations and delightful user experience. Integrates with Tailwind CSS and shadcn/ui."
---

# Next.js Design System with Framer Motion

## Core Philosophy

**Purposeful motion. Delightful feedback. Consistent experience.**

## Quick Start

```bash
npm install framer-motion @radix-ui/react-* class-variance-authority clsx tailwind-merge lucide-react
```

## When to Read Which Reference

### BEFORE Starting Any UI Work
**Always read first:** [references/foundations.md](references/foundations.md)
- Contains design tokens (colors, typography, spacing, shadows, borders)
- CSS custom properties setup for light/dark mode
- This establishes the visual language for everything else

### Based on What You're Building

| Building This? | Read These References |
|----------------|----------------------|
| **New component from scratch** | foundations.md → interactive-states.md → motion.md |
| **Button, input, or form** | forms.md → interactive-states.md |
| **Modal, dialog, or popup** | overlays.md → motion.md |
| **Navigation (tabs, sidebar, menu)** | navigation.md → motion.md |
| **Cards, tables, or lists** | data-display.md → motion.md |
| **Loading, toast, or feedback** | feedback.md |
| **Page layout or responsive design** | layout.md → accessibility.md |
| **Icons or animated icons** | iconography.md |
| **Dark mode or theming** | dark-mode-performance.md → foundations.md |
| **Performance optimization** | dark-mode-performance.md |
| **Accessibility compliance** | accessibility.md → interactive-states.md |

## Reference Files Overview

### 🎨 Foundations (Read First)
| File | When to Use | Key Contents |
|------|-------------|--------------|
| [foundations.md](references/foundations.md) | **Every project** - sets up design tokens | CSS variables, color palette, typography scale, spacing system, shadows, border radius |
| [iconography.md](references/iconography.md) | Adding icons to UI | Lucide setup, icon sizes, animated icons (spinner, check, menu toggle, notification bell) |
| [motion.md](references/motion.md) | Any animation work | Timing tokens, easing functions, animation variants, gesture patterns, orchestration, reduced motion |

### 🧩 Components
| File | When to Use | Key Contents |
|------|-------------|--------------|
| [feedback.md](references/feedback.md) | User feedback & loading states | Toast notifications, loading spinners, skeleton loaders, progress bars, empty states |
| [navigation.md](references/navigation.md) | Navigation UI | Animated tabs, collapsible sidebar, mobile slide-menu, breadcrumbs, sticky navbar |
| [overlays.md](references/overlays.md) | Popups & dialogs | Modal, confirmation dialog, sheet/drawer, command palette (⌘K), popover, tooltip, dropdown |
| [data-display.md](references/data-display.md) | Showing data | Hover cards, project cards, animated stats, data tables, activity feed, avatars, badges |
| [forms.md](references/forms.md) | Form inputs & validation | Floating labels, animated select, checkbox, switch, form validation, multi-step wizard |
| [layout.md](references/layout.md) | Page structure | Dashboard shell, auth shell, responsive grid, bento grid, scroll animations, page transitions |

### ⚙️ Implementation
| File | When to Use | Key Contents |
|------|-------------|--------------|
| [interactive-states.md](references/interactive-states.md) | Component states | Hover, focus, active, disabled, loading, error states; focus management; state transitions |
| [accessibility.md](references/accessibility.md) | Responsive & a11y | Breakpoints, useMediaQuery, ARIA patterns, screen reader support, keyboard navigation, focus trap |
| [dark-mode-performance.md](references/dark-mode-performance.md) | Theming & optimization | Theme provider, flash prevention, theme toggle, performance rules, bundle optimization |

## Essential Patterns

### Standard Timing (Use Everywhere)

```typescript
// lib/motion.ts
export const duration = {
  instant: 0.1,    // Micro-interactions
  fast: 0.15,      // Button feedback
  normal: 0.2,     // Standard transitions
  slow: 0.3,       // Emphasis
  slower: 0.5,     // Page transitions
} as const

export const ease = {
  default: [0.25, 0.1, 0.25, 1],
  out: [0, 0, 0.2, 1],           // Elements entering
  in: [0.4, 0, 1, 1],            // Elements exiting
  spring: { type: "spring", stiffness: 400, damping: 30 },
} as const
```

### Interactive Element Pattern

```typescript
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
>
  Click me
</motion.button>
```

### Staggered List Pattern

```typescript
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => <motion.li key={i.id} variants={item}>{i.name}</motion.li>)}
</motion.ul>
```

## Quick Reference Tables

### Animation Timing

| Pattern | Duration | Easing | Reference |
|---------|----------|--------|-----------|
| Button hover/tap | 150ms | default | interactive-states.md |
| Dropdown open | 200ms | ease-out | overlays.md |
| Modal enter | 300ms | spring | overlays.md |
| Modal exit | 200ms | ease-in | overlays.md |
| Page transition | 300ms | default | layout.md |
| Toast enter | 300ms | spring | feedback.md |
| Stagger delay | 50ms | - | motion.md |

### Component → Reference Mapping

| Component | Primary Reference | Supporting References |
|-----------|-------------------|----------------------|
| Button | interactive-states.md | motion.md |
| Input/Form | forms.md | interactive-states.md |
| Modal | overlays.md | motion.md, accessibility.md |
| Toast | feedback.md | motion.md |
| Sidebar | navigation.md | motion.md |
| Card | data-display.md | interactive-states.md |
| Table | data-display.md | accessibility.md |
| Skeleton | feedback.md | - |
| Tabs | navigation.md | motion.md |
| Dropdown | overlays.md | motion.md |

## UX Principles

1. **Immediate feedback** - Every interaction responds in < 100ms
2. **Skeleton-first** - Show structure before content loads
3. **Optimistic updates** - Update UI before server confirms
4. **Error recovery** - Clear error states with retry actions
5. **Empty states** - Helpful guidance, not blank screens
6. **Reduced motion** - Always respect `prefers-reduced-motion`

## Clean Architecture Integration

Design system components live in the **PRESENTATION layer**. Follow these rules:

```
┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION: UI Components (this skill)                    │
│ Location: src/components/, src/app/(routes)/_components/    │
├─────────────────────────────────────────────────────────────┤
│ APPLICATION: Server Actions (call from components)          │
│ Location: src/actions/                                      │
├─────────────────────────────────────────────────────────────┤
│ DOMAIN: Services & Types (not imported by components)       │
│ Location: src/services/, src/types/                         │
├─────────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE: Motion utilities, theme config              │
│ Location: src/lib/motion.ts, src/lib/utils.ts               │
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
src/
├── app/                            # PRESENTATION: Pages
│   ├── (dashboard)/
│   │   └── projects/
│   │       ├── _components/        # Page-specific animated components
│   │       │   ├── project-card.tsx
│   │       │   └── project-list.tsx
│   │       └── page.tsx
│   └── layout.tsx                  # ThemeProvider, AnimatePresence
├── components/                     # PRESENTATION: Shared components
│   ├── ui/                         # Primitives (button, card, input)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   ├── forms/                      # Form components
│   ├── feedback/                   # Toast, skeleton, loading
│   ├── navigation/                 # Tabs, sidebar, navbar
│   └── overlays/                   # Modal, sheet, popover
├── hooks/                          # PRESENTATION: UI hooks
│   ├── use-toast.ts
│   └── use-media-query.ts
├── lib/                            # INFRASTRUCTURE: Utilities
│   ├── motion.ts                   # Animation constants & variants
│   ├── utils.ts                    # cn() helper, etc.
│   └── theme/                      # Theme configuration
│       ├── provider.tsx
│       └── config.ts
└── styles/
    └── globals.css                 # CSS custom properties
```

### Component Rules

1. **Components receive data via props** - Never fetch directly
2. **Components call server actions** - For mutations only
3. **Animation logic stays in components** - Business logic in services
4. **UI state stays in hooks** - Business state in services
5. **Never import from services** - Components are presentation only

### Example: Animated Data Component

```typescript
// src/app/(dashboard)/projects/_components/project-list.tsx
'use client'

import { motion } from 'framer-motion'
import type { Project } from '@/types/project'  // Types OK to import

// ✅ Receives data via props (from Server Component or action)
interface ProjectListProps {
  projects: Project[]
  onDelete?: (id: string) => void  // Action passed as prop
}

export function ProjectList({ projects, onDelete }: ProjectListProps) {
  // ✅ Animation logic in component
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  }

  return (
    <motion.ul variants={container} initial="hidden" animate="show">
      {projects.map(project => (
        <ProjectCard 
          key={project.id} 
          project={project}
          onDelete={onDelete}  // Pass action down
        />
      ))}
    </motion.ul>
  )
}
```

### Example: Page with Data Fetching

```typescript
// src/app/(dashboard)/projects/page.tsx
import { projectService } from '@/services/project-service'
import { requireAuth } from '@/lib/auth'
import { ProjectList } from './_components/project-list'
import { deleteProjectAction } from '@/actions/project-actions'

// Server Component fetches data
export default async function ProjectsPage() {
  const user = await requireAuth()
  const projects = await projectService.getByOwner(user.id)

  return (
    <ProjectList 
      projects={projects}
      onDelete={deleteProjectAction}  // Pass action to client component
    />
  )
}
```