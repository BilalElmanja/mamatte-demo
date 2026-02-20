# Form Components

## Table of Contents
- [Animated Inputs](#animated-inputs)
- [Select Components](#select-components)
- [Checkbox and Radio](#checkbox-and-radio)
- [Form Validation](#form-validation)
- [Multi-Step Forms](#multi-step-forms)

## Animated Inputs

### Floating Label Input

```typescript
// components/ui/floating-input.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function FloatingInput({ label, error, ...props }: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = Boolean(props.value)

  return (
    <div className="relative">
      <input
        {...props}
        onFocus={(e) => { setIsFocused(true); props.onFocus?.(e) }}
        onBlur={(e) => { setIsFocused(false); props.onBlur?.(e) }}
        className={`
          w-full px-4 py-3 pt-6 border rounded-lg bg-background outline-none transition-colors
          ${error ? 'border-red-500' : isFocused ? 'border-primary' : 'border-input'}
        `}
      />
      <motion.label
        initial={false}
        animate={{
          y: isFocused || hasValue ? -12 : 0,
          scale: isFocused || hasValue ? 0.85 : 1,
        }}
        className="absolute left-4 top-4 origin-left pointer-events-none text-muted-foreground"
      >
        {label}
      </motion.label>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-500 mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
```

### Input with Focus Ring

```typescript
// components/ui/input.tsx
'use client'
import { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
      <div className="relative">
        <input
          ref={ref}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e) }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e) }}
          className={cn(
            'w-full px-4 py-2.5 border rounded-lg bg-background outline-none transition-all',
            error ? 'border-red-500' : 'border-input',
            isFocused && !error && 'border-primary ring-2 ring-primary/20',
            className
          )}
          {...props}
        />
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-500 mt-1"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)
```

## Select Components

### Animated Select

```typescript
// components/ui/select.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface SelectProps {
  options: Option[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
}

export function Select({ options, value, onChange, placeholder }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value)

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
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
      >
        <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
          {selected?.label || placeholder || 'Select...'}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg overflow-hidden"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                type="button"
                onClick={() => { onChange(option.value); setIsOpen(false) }}
                className={`
                  w-full flex items-center justify-between px-4 py-2.5 text-left
                  hover:bg-muted transition-colors
                  ${value === option.value ? 'bg-primary/5 text-primary' : ''}
                `}
              >
                {option.label}
                {value === option.value && <Check className="w-4 h-4" />}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

## Checkbox and Radio

### Animated Checkbox

```typescript
// components/ui/checkbox.tsx
'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50' : ''}`}>
      <motion.button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        whileTap={{ scale: 0.9 }}
        className={`
          w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
          ${checked ? 'bg-primary border-primary' : 'border-input hover:border-primary/50'}
        `}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      {label && <span className="text-sm">{label}</span>}
    </label>
  )
}
```

### Animated Switch

```typescript
// components/ui/switch.tsx
'use client'
import { motion } from 'framer-motion'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative w-11 h-6 rounded-full transition-colors
          ${checked ? 'bg-primary' : 'bg-input'}
        `}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`
            absolute top-1 w-4 h-4 rounded-full bg-white shadow
            ${checked ? 'left-6' : 'left-1'}
          `}
        />
      </button>
      {label && <span className="text-sm">{label}</span>}
    </label>
  )
}
```

## Form Validation

### Form with Animated Errors

```typescript
// components/forms/login-form.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail, Lock } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginForm({ onSubmit }: { onSubmit: (data: LoginForm) => Promise<void> }) {
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onFormSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    await onSubmit(data)
    setIsLoading(false)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-4"
    >
      <div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className={`
              w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none transition-all
              ${errors.email ? 'border-red-500' : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'}
            `}
          />
        </div>
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-500 mt-1"
            >
              {errors.email.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            className={`
              w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none transition-all
              ${errors.password ? 'border-red-500' : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'}
            `}
          />
        </div>
        <AnimatePresence>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-500 mt-1"
            >
              {errors.password.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 mx-auto animate-spin" />
        ) : (
          'Sign In'
        )}
      </motion.button>
    </motion.form>
  )
}
```

## Multi-Step Forms

### Step Indicator

```typescript
// components/ui/step-indicator.tsx
'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface Step {
  id: string
  title: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: index <= currentStep ? 'var(--primary)' : 'var(--muted)',
                scale: index === currentStep ? 1.1 : 1,
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
            >
              {index < currentStep ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  <Check className="w-5 h-5 text-primary-foreground" />
                </motion.div>
              ) : (
                <span className={index <= currentStep ? 'text-primary-foreground' : 'text-muted-foreground'}>
                  {index + 1}
                </span>
              )}
            </motion.div>
            <span className={`text-xs mt-2 ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.title}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-4 bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: index < currentStep ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
                className="h-full bg-primary"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

### Multi-Step Form Container

```typescript
// components/forms/multi-step-form.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepIndicator } from '@/components/ui/step-indicator'

const steps = [
  { id: 'account', title: 'Account' },
  { id: 'profile', title: 'Profile' },
  { id: 'confirm', title: 'Confirm' },
]

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)

  const next = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1)
      setCurrentStep(s => s + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(s => s - 1)
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  }

  return (
    <div className="max-w-lg mx-auto">
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="mt-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {currentStep === 0 && <AccountStep />}
            {currentStep === 1 && <ProfileStep />}
            {currentStep === 2 && <ConfirmStep />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={prev}
          disabled={currentStep === 0}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={next}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </motion.button>
      </div>
    </div>
  )
}

function AccountStep() {
  return <div className="space-y-4">{/* Account fields */}</div>
}

function ProfileStep() {
  return <div className="space-y-4">{/* Profile fields */}</div>
}

function ConfirmStep() {
  return <div className="space-y-4">{/* Confirmation */}</div>
}
```