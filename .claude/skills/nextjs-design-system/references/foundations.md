# Design System Foundations

## Table of Contents
- [Design Tokens](#design-tokens)
- [Color System](#color-system)
- [Typography System](#typography-system)
- [Spacing and Layout](#spacing-and-layout)
- [Elevation and Shadows](#elevation-and-shadows)
- [Border and Radius System](#border-and-radius-system)

## Design Tokens

### Token Architecture

```typescript
// lib/design-tokens.ts

export const tokens = {
  colors: { /* see color system */ },
  typography: { /* see typography system */ },
  spacing: { /* see spacing system */ },
  shadows: { /* see elevation system */ },
  radii: { /* see border system */ },
  transitions: { /* see motion system */ },
} as const

export type Tokens = typeof tokens
```

### CSS Custom Properties Setup

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors - Light Mode */
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;

    /* Semantic Colors */
    --success: 142 76% 36%;
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;
    --error: 0 84% 60%;
    --error-foreground: 0 0% 100%;
    --info: 217 91% 60%;
    --info-foreground: 0 0% 100%;

    /* Spacing Scale */
    --spacing-px: 1px;
    --spacing-0: 0;
    --spacing-0-5: 0.125rem;
    --spacing-1: 0.25rem;
    --spacing-1-5: 0.375rem;
    --spacing-2: 0.5rem;
    --spacing-2-5: 0.625rem;
    --spacing-3: 0.75rem;
    --spacing-3-5: 0.875rem;
    --spacing-4: 1rem;
    --spacing-5: 1.25rem;
    --spacing-6: 1.5rem;
    --spacing-7: 1.75rem;
    --spacing-8: 2rem;
    --spacing-9: 2.25rem;
    --spacing-10: 2.5rem;
    --spacing-12: 3rem;
    --spacing-14: 3.5rem;
    --spacing-16: 4rem;
    --spacing-20: 5rem;
    --spacing-24: 6rem;
    --spacing-32: 8rem;

    /* Border Radius */
    --radius-none: 0;
    --radius-sm: 0.125rem;
    --radius-default: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-3xl: 1.5rem;
    --radius-full: 9999px;

    /* Shadows */
    --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);

    /* Typography */
    --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
    --font-display: 'Cal Sans', 'Inter', sans-serif;

    /* Transitions */
    --transition-fast: 150ms;
    --transition-normal: 200ms;
    --transition-slow: 300ms;
    --transition-slower: 500ms;
    --ease-default: cubic-bezier(0.25, 0.1, 0.25, 1);
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;

    /* Adjusted shadows for dark mode */
    --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3);
  }
}
```

## Color System

### Color Palette

```typescript
// lib/colors.ts

export const colors = {
  // Neutral Scale
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },

  // Primary Brand Color
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
} as const

// Color utility functions
export function getContrastColor(hex: string): 'white' | 'black' {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? 'black' : 'white'
}

export function hexToHSL(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}
```

### Color Usage Guidelines

| Use Case | Light Mode | Dark Mode |
|----------|------------|-----------|
| Background | `background` | `background` |
| Text Primary | `foreground` | `foreground` |
| Text Secondary | `muted-foreground` | `muted-foreground` |
| Borders | `border` | `border` |
| Interactive | `primary` | `primary` |
| Success States | `success` | `success` |
| Error States | `destructive` | `destructive` |
| Warning States | `warning` | `warning` |

## Typography System

### Font Configuration

```typescript
// lib/fonts.ts
import { Inter, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const fontDisplay = localFont({
  src: '../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-display',
  display: 'swap',
})
```

### Typography Scale

```typescript
// lib/typography.ts

export const typography = {
  // Font Sizes
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],        // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],    // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],       // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],    // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],     // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
    '5xl': ['3rem', { lineHeight: '1.16' }],        // 48px
    '6xl': ['3.75rem', { lineHeight: '1.1' }],      // 60px
    '7xl': ['4.5rem', { lineHeight: '1.1' }],       // 72px
  },

  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const
```

### Typography Components

```typescript
// components/ui/typography.tsx
import { cn } from '@/lib/utils'

interface TypographyProps {
  children: React.ReactNode
  className?: string
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn(
      'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl',
      className
    )}>
      {children}
    </h1>
  )
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn(
      'scroll-m-20 text-3xl font-semibold tracking-tight',
      className
    )}>
      {children}
    </h2>
  )
}

export function H3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn(
      'scroll-m-20 text-2xl font-semibold tracking-tight',
      className
    )}>
      {children}
    </h3>
  )
}

export function H4({ children, className }: TypographyProps) {
  return (
    <h4 className={cn(
      'scroll-m-20 text-xl font-semibold tracking-tight',
      className
    )}>
      {children}
    </h4>
  )
}

export function P({ children, className }: TypographyProps) {
  return (
    <p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}>
      {children}
    </p>
  )
}

export function Lead({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-xl text-muted-foreground', className)}>
      {children}
    </p>
  )
}

export function Large({ children, className }: TypographyProps) {
  return (
    <div className={cn('text-lg font-semibold', className)}>
      {children}
    </div>
  )
}

export function Small({ children, className }: TypographyProps) {
  return (
    <small className={cn('text-sm font-medium leading-none', className)}>
      {children}
    </small>
  )
}

export function Muted({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  )
}

export function Code({ children, className }: TypographyProps) {
  return (
    <code className={cn(
      'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
      className
    )}>
      {children}
    </code>
  )
}
```

## Spacing and Layout

### Spacing Scale

```typescript
// lib/spacing.ts

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const

// Semantic spacing
export const semanticSpacing = {
  // Component internal spacing
  'component-padding-xs': spacing[2],   // 8px
  'component-padding-sm': spacing[3],   // 12px
  'component-padding-md': spacing[4],   // 16px
  'component-padding-lg': spacing[6],   // 24px
  'component-padding-xl': spacing[8],   // 32px

  // Section spacing
  'section-gap-sm': spacing[8],         // 32px
  'section-gap-md': spacing[12],        // 48px
  'section-gap-lg': spacing[16],        // 64px
  'section-gap-xl': spacing[24],        // 96px

  // Page margins
  'page-margin-mobile': spacing[4],     // 16px
  'page-margin-tablet': spacing[6],     // 24px
  'page-margin-desktop': spacing[8],    // 32px
} as const
```

### Container Widths

```typescript
// lib/layout.ts

export const containers = {
  xs: '20rem',      // 320px
  sm: '24rem',      // 384px
  md: '28rem',      // 448px
  lg: '32rem',      // 512px
  xl: '36rem',      // 576px
  '2xl': '42rem',   // 672px
  '3xl': '48rem',   // 768px
  '4xl': '56rem',   // 896px
  '5xl': '64rem',   // 1024px
  '6xl': '72rem',   // 1152px
  '7xl': '80rem',   // 1280px
  full: '100%',
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const
```

## Elevation and Shadows

### Shadow Scale

```typescript
// lib/shadows.ts

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const

// Elevation levels for components
export const elevation = {
  0: shadows.none,      // Flat elements
  1: shadows.xs,        // Subtle lift (cards at rest)
  2: shadows.sm,        // Default cards, dropdowns
  3: shadows.md,        // Hover states, active elements
  4: shadows.lg,        // Modals, popovers
  5: shadows.xl,        // Notifications, tooltips
  6: shadows['2xl'],    // Dialogs, top-level overlays
} as const

// Colored shadows for brand elements
export const coloredShadows = {
  primary: '0 4px 14px 0 rgb(var(--primary) / 0.25)',
  success: '0 4px 14px 0 rgb(34 197 94 / 0.25)',
  warning: '0 4px 14px 0 rgb(245 158 11 / 0.25)',
  error: '0 4px 14px 0 rgb(239 68 68 / 0.25)',
} as const
```

### Usage Guidelines

| Component | Resting | Hover | Active |
|-----------|---------|-------|--------|
| Card | `shadow-sm` | `shadow-md` | `shadow-sm` |
| Button | `shadow-none` | `shadow-sm` | `shadow-none` |
| Dropdown | `shadow-lg` | - | - |
| Modal | `shadow-xl` | - | - |
| Toast | `shadow-lg` | - | - |
| Tooltip | `shadow-md` | - | - |

## Border and Radius System

### Border Radius Scale

```typescript
// lib/borders.ts

export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
} as const

// Component-specific radius
export const componentRadius = {
  button: borderRadius.lg,
  input: borderRadius.lg,
  card: borderRadius.xl,
  modal: borderRadius['2xl'],
  badge: borderRadius.full,
  avatar: borderRadius.full,
  chip: borderRadius.full,
} as const
```

### Border Width and Style

```typescript
export const borderWidth = {
  0: '0px',
  DEFAULT: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const

// Border color utilities
export const borderColors = {
  default: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  focus: 'hsl(var(--ring))',
  error: 'hsl(var(--destructive))',
  success: 'hsl(var(--success))',
} as const
```