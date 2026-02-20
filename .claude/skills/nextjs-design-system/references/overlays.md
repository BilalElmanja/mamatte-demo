# Overlay Components

## Table of Contents
- [Modal Dialog](#modal-dialog)
- [Sheet (Drawer)](#sheet-drawer)
- [Command Palette](#command-palette)
- [Popover](#popover)
- [Tooltip](#tooltip)
- [Dropdown Menu](#dropdown-menu)

## Modal Dialog

### Animated Modal

```typescript
// components/ui/modal.tsx
'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export function Modal({ 
  isOpen, onClose, title, description, children, size = 'md' 
}: ModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`
              relative w-full ${sizes[size]} bg-background rounded-xl shadow-xl
              border overflow-hidden
            `}
          >
            {/* Header */}
            {(title || description) && (
              <div className="px-6 pt-6 pb-4">
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
```

### Confirmation Modal

```typescript
// components/ui/confirm-modal.tsx
'use client'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Modal } from './modal'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'default'
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
}: ConfirmModalProps) {
  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    default: 'bg-primary hover:bg-primary/90 text-primary-foreground',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className={`
            mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4
            ${variant === 'danger' ? 'bg-red-100 text-red-600' : ''}
            ${variant === 'warning' ? 'bg-amber-100 text-amber-600' : ''}
            ${variant === 'default' ? 'bg-primary/10 text-primary' : ''}
          `}
        >
          <AlertTriangle className="w-6 h-6" />
        </motion.div>

        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            {cancelLabel}
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${variantStyles[variant]}`}
          >
            {loading ? 'Loading...' : confirmLabel}
          </motion.button>
        </div>
      </div>
    </Modal>
  )
}
```

## Sheet (Drawer)

### Slide-in Sheet

```typescript
// components/ui/sheet.tsx
'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

type SheetSide = 'left' | 'right' | 'top' | 'bottom'

interface SheetProps {
  isOpen: boolean
  onClose: () => void
  side?: SheetSide
  title?: string
  children: React.ReactNode
}

const slideVariants = {
  left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
  right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
  top: { initial: { y: '-100%' }, animate: { y: 0 }, exit: { y: '-100%' } },
  bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
}

const positionStyles = {
  left: 'top-0 left-0 bottom-0 w-80',
  right: 'top-0 right-0 bottom-0 w-80',
  top: 'top-0 left-0 right-0 h-auto max-h-[50vh]',
  bottom: 'bottom-0 left-0 right-0 h-auto max-h-[50vh]',
}

export function Sheet({ isOpen, onClose, side = 'right', title, children }: SheetProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          {/* Sheet */}
          <motion.div
            {...slideVariants[side]}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`absolute ${positionStyles[side]} bg-background shadow-xl flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
```

## Command Palette

### Command Palette (⌘K)

```typescript
// components/ui/command-palette.tsx
'use client'
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileText, Settings, Users, Home, ArrowRight } from 'lucide-react'
import { createPortal } from 'react-dom'

interface CommandItem {
  id: string
  icon: React.ElementType
  label: string
  shortcut?: string
  onSelect: () => void
}

const commands: CommandItem[] = [
  { id: 'home', icon: Home, label: 'Go to Home', shortcut: 'G H', onSelect: () => {} },
  { id: 'projects', icon: FileText, label: 'Go to Projects', shortcut: 'G P', onSelect: () => {} },
  { id: 'team', icon: Users, label: 'Go to Team', shortcut: 'G T', onSelect: () => {} },
  { id: 'settings', icon: Settings, label: 'Open Settings', shortcut: '⌘ ,', onSelect: () => {} },
]

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredCommands = useMemo(() => {
    if (!search) return commands
    return commands.filter(cmd =>
      cmd.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  // Open with ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Navigate with arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].onSelect()
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex])

  // Reset on open/search change
  useEffect(() => {
    setSelectedIndex(0)
  }, [isOpen, search])

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg bg-background rounded-xl shadow-2xl border overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 border-b">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 py-4 bg-transparent outline-none placeholder:text-muted-foreground"
              />
              <kbd className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-auto p-2">
              {filteredCommands.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No results found
                </p>
              ) : (
                filteredCommands.map((cmd, index) => (
                  <motion.button
                    key={cmd.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => {
                      cmd.onSelect()
                      setIsOpen(false)
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-colors text-left
                      ${index === selectedIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}
                    `}
                  >
                    <cmd.icon className="w-5 h-5" />
                    <span className="flex-1">{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
```

## Popover

### Animated Popover

```typescript
// components/ui/popover.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function Popover({ trigger, children, side = 'bottom' }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const variants = {
    top: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } },
    bottom: { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 10 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 } },
  }

  const positions = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...variants[side]}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${positions[side]}`}
          >
            <div className="bg-popover border rounded-lg shadow-lg p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

## Tooltip

### Animated Tooltip

```typescript
// components/ui/tooltip.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function Tooltip({ content, children, side = 'top', delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay)
    setTimeoutId(id)
  }

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId)
    setIsVisible(false)
  }

  const positions = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`
              absolute z-50 ${positions[side]}
              px-2 py-1 text-xs font-medium text-popover-foreground
              bg-popover border rounded shadow-md whitespace-nowrap
            `}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

## Dropdown Menu

### Animated Dropdown

```typescript
// components/ui/dropdown-menu.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MenuItem {
  label: string
  icon?: React.ElementType
  onClick: () => void
  variant?: 'default' | 'danger'
}

interface DropdownMenuProps {
  trigger: React.ReactNode
  items: MenuItem[]
}

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-popover border rounded-lg shadow-lg overflow-hidden z-50"
          >
            {items.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => {
                  item.onClick()
                  setIsOpen(false)
                }}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                  hover:bg-muted transition-colors
                  ${item.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : ''}
                `}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```