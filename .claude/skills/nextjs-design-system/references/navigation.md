# Navigation Components

## Table of Contents
- [Animated Tabs](#animated-tabs)
- [Sidebar Navigation](#sidebar-navigation)
- [Mobile Menu](#mobile-menu)
- [Breadcrumbs](#breadcrumbs)
- [Navbar](#navbar)

## Animated Tabs

### Underline Tabs

```typescript
// components/ui/tabs.tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id)

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  return (
    <div className="relative flex gap-1 border-b">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`
            relative px-4 py-2 text-sm font-medium transition-colors
            ${activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
          `}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
```

### Pill Tabs

```typescript
// components/ui/pill-tabs.tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface Tab {
  id: string
  label: string
  count?: number
}

export function PillTabs({ tabs, defaultTab, onChange }: {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id)

  return (
    <div className="inline-flex p-1 bg-muted rounded-lg">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id)
            onChange?.(tab.id)
          }}
          className="relative px-4 py-2 text-sm font-medium rounded-md transition-colors"
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activePill"
              className="absolute inset-0 bg-background rounded-md shadow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {tab.label}
            {tab.count !== undefined && (
              <span className={`
                text-xs px-1.5 py-0.5 rounded-full
                ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/20'}
              `}>
                {tab.count}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  )
}
```

## Sidebar Navigation

### Collapsible Sidebar

```typescript
// components/layouts/sidebar.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, Home, FolderOpen, Settings, Users, 
  CreditCard, HelpCircle, LogOut 
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: FolderOpen, label: 'Projects', href: '/projects' },
  { icon: Users, label: 'Team', href: '/team' },
  { icon: CreditCard, label: 'Billing', href: '/billing' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

const bottomItems = [
  { icon: HelpCircle, label: 'Help', href: '/help' },
  { icon: LogOut, label: 'Sign Out', href: '/logout' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2 }}
      className="h-screen border-r bg-card flex flex-col"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-semibold text-lg"
            >
              Acme Inc
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
            <ChevronLeft className="w-5 h-5" />
          </motion.div>
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => (
          <NavItem
            key={item.href}
            {...item}
            collapsed={collapsed}
            active={pathname === item.href}
          />
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="p-3 border-t space-y-1">
        {bottomItems.map(item => (
          <NavItem
            key={item.href}
            {...item}
            collapsed={collapsed}
            active={pathname === item.href}
          />
        ))}
      </div>
    </motion.aside>
  )
}

function NavItem({ 
  icon: Icon, label, href, collapsed, active 
}: {
  icon: any
  label: string
  href: string
  collapsed: boolean
  active: boolean
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
          ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
        `}
      >
        {active && (
          <motion.div
            layoutId="activeNav"
            className="absolute inset-0 bg-primary/10 rounded-lg"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        <Icon className="w-5 h-5 shrink-0 relative z-10" />
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="relative z-10 text-sm font-medium"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  )
}
```

## Mobile Menu

### Slide-in Mobile Menu

```typescript
// components/layouts/mobile-menu.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-background z-50 lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-semibold">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-4">
                <motion.ul
                  initial="closed"
                  animate="open"
                  variants={{
                    open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                    closed: {},
                  }}
                  className="space-y-1"
                >
                  {menuItems.map(item => (
                    <motion.li
                      key={item.href}
                      variants={{
                        open: { opacity: 1, x: 0 },
                        closed: { opacity: 0, x: 20 },
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
```

## Breadcrumbs

### Animated Breadcrumbs

```typescript
// components/ui/breadcrumbs.tsx
'use client'
import { motion } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm">
      <Link href="/" className="p-1 rounded hover:bg-muted transition-colors">
        <Home className="w-4 h-4 text-muted-foreground" />
      </Link>

      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-1"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          {item.href ? (
            <Link
              href={item.href}
              className="px-2 py-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="px-2 py-1 font-medium">{item.label}</span>
          )}
        </motion.div>
      ))}
    </nav>
  )
}
```

## Navbar

### Sticky Navbar with Scroll Effect

```typescript
// components/layouts/navbar.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

export function Navbar() {
  const { scrollY } = useScroll()
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setHasScrolled(latest > 10)
    })
  }, [scrollY])

  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255,255,255,0)', 'rgba(255,255,255,0.9)']
  )

  const backdropBlur = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(10px)']
  )

  return (
    <motion.header
      style={{ backgroundColor, backdropFilter: backdropBlur }}
      className={`
        fixed top-0 left-0 right-0 z-50 transition-shadow
        ${hasScrolled ? 'shadow-sm border-b' : ''}
      `}
    >
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            Logo
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {['Features', 'Pricing', 'About'].map(item => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
```