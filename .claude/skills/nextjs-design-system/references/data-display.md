# Data Display Components

## Table of Contents
- [Animated Cards](#animated-cards)
- [Stats Cards](#stats-cards)
- [Data Tables](#data-tables)
- [Lists](#lists)
- [Avatars](#avatars)
- [Badges](#badges)

## Animated Cards

### Hover Card

```typescript
// components/ui/hover-card.tsx
'use client'
import { motion } from 'framer-motion'

interface HoverCardProps {
  children: React.ReactNode
  className?: string
}

export function HoverCard({ children, className }: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.2 }}
      className={`bg-card border rounded-xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}
```

### Project Card

```typescript
// components/cards/project-card.tsx
'use client'
import { motion } from 'framer-motion'
import { MoreHorizontal, Users, Calendar } from 'lucide-react'
import Link from 'next/link'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string
    memberCount: number
    updatedAt: string
    color: string
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/projects/${project.id}`}>
        <div className="group relative bg-card border rounded-xl overflow-hidden">
          {/* Color Bar */}
          <div 
            className="h-2" 
            style={{ backgroundColor: project.color }} 
          />

          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={e => e.preventDefault()}
                className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
              >
                <MoreHorizontal className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {project.description}
            </p>

            {/* Footer */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{project.memberCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{project.updatedAt}</span>
              </div>
            </div>
          </div>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"
          />
        </div>
      </Link>
    </motion.div>
  )
}
```

## Stats Cards

### Animated Stats Card

```typescript
// components/cards/stats-card.tsx
'use client'
import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  change: number
  format?: 'number' | 'currency' | 'percentage'
  icon: React.ElementType
}

export function StatsCard({ title, value, change, format = 'number', icon: Icon }: StatsCardProps) {
  const spring = useSpring(0, { stiffness: 100, damping: 20 })
  const display = useTransform(spring, (v) => {
    if (format === 'currency') return `$${Math.round(v).toLocaleString()}`
    if (format === 'percentage') return `${Math.round(v)}%`
    return Math.round(v).toLocaleString()
  })

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  const isPositive = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-card border rounded-xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className={`
          flex items-center gap-1 text-sm font-medium
          ${isPositive ? 'text-emerald-600' : 'text-red-600'}
        `}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>

      <motion.div className="text-2xl font-bold mb-1">
        {display}
      </motion.div>
      <p className="text-sm text-muted-foreground">{title}</p>
    </motion.div>
  )
}
```

### Stats Grid

```typescript
// components/cards/stats-grid.tsx
'use client'
import { motion } from 'framer-motion'
import { StatsCard } from './stats-card'
import { DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react'

const stats = [
  { title: 'Total Revenue', value: 45231.89, change: 20.1, format: 'currency', icon: DollarSign },
  { title: 'Active Users', value: 2350, change: 10.5, format: 'number', icon: Users },
  { title: 'Sales', value: 12234, change: -3.2, format: 'number', icon: ShoppingCart },
  { title: 'Conversion', value: 3.2, change: 12.0, format: 'percentage', icon: TrendingUp },
]

export function StatsGrid() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.title}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
        >
          <StatsCard {...stat} />
        </motion.div>
      ))}
    </motion.div>
  )
}
```

## Data Tables

### Animated Table

```typescript
// components/ui/data-table.tsx
'use client'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface Column<T> {
  key: keyof T
  header: string
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
}

export function DataTable<T extends { id: string }>({ 
  columns, data, onRowClick 
}: DataTableProps<T>) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            {columns.map(col => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 -mb-1" />
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onRowClick?.(row)}
              className={`
                border-t transition-colors
                ${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
              `}
            >
              {columns.map(col => (
                <td key={String(col.key)} className="px-4 py-3 text-sm">
                  {col.render 
                    ? col.render(row[col.key], row) 
                    : String(row[col.key])
                  }
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

## Lists

### Animated List

```typescript
// components/ui/animated-list.tsx
'use client'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
}

interface ListItemProps {
  children: React.ReactNode
  onClick?: () => void
}

export function AnimatedList({ children }: { children: React.ReactNode }) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-2"
    >
      {children}
    </motion.ul>
  )
}

export function AnimatedListItem({ children, onClick }: ListItemProps) {
  return (
    <motion.li
      variants={item}
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`
        p-4 border rounded-lg transition-colors
        ${onClick ? 'cursor-pointer hover:bg-muted' : ''}
      `}
    >
      {children}
    </motion.li>
  )
}
```

### Activity Feed

```typescript
// components/ui/activity-feed.tsx
'use client'
import { motion } from 'framer-motion'

interface Activity {
  id: string
  user: { name: string; avatar: string }
  action: string
  target: string
  time: string
}

export function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex gap-3"
        >
          <img
            src={activity.user.avatar}
            alt={activity.user.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span>
              {' '}{activity.action}{' '}
              <span className="font-medium">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
```

## Avatars

### Avatar with Status

```typescript
// components/ui/avatar.tsx
'use client'
import { motion } from 'framer-motion'

interface AvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  status?: 'online' | 'offline' | 'busy' | 'away'
}

const sizes = {
  sm: { avatar: 'w-8 h-8', text: 'text-xs', status: 'w-2.5 h-2.5' },
  md: { avatar: 'w-10 h-10', text: 'text-sm', status: 'w-3 h-3' },
  lg: { avatar: 'w-12 h-12', text: 'text-base', status: 'w-3.5 h-3.5' },
}

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-amber-500',
}

export function Avatar({ src, name, size = 'md', status }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizes[size].avatar} rounded-full object-cover`}
        />
      ) : (
        <div className={`
          ${sizes[size].avatar} ${sizes[size].text}
          rounded-full bg-primary/10 text-primary
          flex items-center justify-center font-medium
        `}>
          {initials}
        </div>
      )}

      {status && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`
            absolute bottom-0 right-0 ${sizes[size].status}
            ${statusColors[status]} rounded-full ring-2 ring-background
          `}
        />
      )}
    </div>
  )
}
```

### Avatar Group

```typescript
// components/ui/avatar-group.tsx
'use client'
import { motion } from 'framer-motion'
import { Avatar } from './avatar'

interface User {
  id: string
  name: string
  avatar?: string
}

export function AvatarGroup({ users, max = 4 }: { users: User[]; max?: number }) {
  const visible = users.slice(0, max)
  const remaining = users.length - max

  return (
    <div className="flex -space-x-2">
      {visible.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="ring-2 ring-background rounded-full"
        >
          <Avatar src={user.avatar} name={user.name} size="sm" />
        </motion.div>
      ))}

      {remaining > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: max * 0.05 }}
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center
                     text-xs font-medium ring-2 ring-background"
        >
          +{remaining}
        </motion.div>
      )}
    </div>
  )
}
```

## Badges

### Animated Badge

```typescript
// components/ui/badge.tsx
'use client'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        secondary: 'bg-muted text-muted-foreground',
        success: 'bg-emerald-100 text-emerald-700',
        warning: 'bg-amber-100 text-amber-700',
        danger: 'bg-red-100 text-red-700',
        outline: 'border text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode
  animated?: boolean
}

export function Badge({ children, variant, animated = false }: BadgeProps) {
  if (animated) {
    return (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        className={badgeVariants({ variant })}
      >
        {children}
      </motion.span>
    )
  }

  return <span className={badgeVariants({ variant })}>{children}</span>
}
```

### Status Badge with Pulse

```typescript
// components/ui/status-badge.tsx
'use client'
import { motion } from 'framer-motion'

type Status = 'active' | 'pending' | 'inactive' | 'error'

const statusConfig = {
  active: { color: 'bg-emerald-500', label: 'Active' },
  pending: { color: 'bg-amber-500', label: 'Pending' },
  inactive: { color: 'bg-gray-400', label: 'Inactive' },
  error: { color: 'bg-red-500', label: 'Error' },
}

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status]

  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted">
      <span className="relative flex h-2 w-2">
        {status === 'active' && (
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`absolute inset-0 rounded-full ${config.color}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.color}`} />
      </span>
      <span className="text-xs font-medium">{config.label}</span>
    </div>
  )
}
```