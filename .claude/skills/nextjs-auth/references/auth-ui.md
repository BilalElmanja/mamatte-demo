# Custom Auth UI & Styling

## Table of Contents
- [Clerk Component Styling](#clerk-component-styling)
- [Custom Sign-In Page](#custom-sign-in-page)
- [Custom Sign-Up Page](#custom-sign-up-page)
- [Auth Layout](#auth-layout)

## Clerk Component Styling

### Global Appearance in Provider

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#0ea5e9',
          colorBackground: '#09090b',
          colorInputBackground: '#18181b',
          colorInputText: '#fafafa',
          colorText: '#fafafa',
          colorTextSecondary: '#a1a1aa',
          borderRadius: '0.5rem',
        },
        elements: {
          formButtonPrimary: 
            'bg-primary text-primary-foreground hover:bg-primary/90',
          card: 'bg-card border border-border shadow-lg',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 
            'bg-background border border-border hover:bg-muted',
          formFieldLabel: 'text-foreground',
          formFieldInput: 
            'bg-background border-input focus:ring-primary',
          footerActionLink: 'text-primary hover:text-primary/80',
          identityPreview: 'bg-muted',
          identityPreviewText: 'text-foreground',
          identityPreviewEditButton: 'text-primary',
        },
      }}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### UserButton Styling

```typescript
import { UserButton } from '@clerk/nextjs'

<UserButton
  afterSignOutUrl="/"
  appearance={{
    elements: {
      avatarBox: 'w-10 h-10',
      userButtonPopoverCard: 'bg-card border shadow-xl',
      userButtonPopoverActionButton: 'hover:bg-muted',
      userButtonPopoverActionButtonText: 'text-foreground',
      userButtonPopoverFooter: 'hidden',
    },
  }}
/>
```

## Custom Sign-In Page

### Basic Custom Page

```typescript
// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: 'mx-auto',
          card: 'bg-card border-0 shadow-none',
        },
      }}
    />
  )
}
```

### Fully Custom Sign-In

```typescript
// app/(auth)/sign-in/page.tsx
'use client'

import { useSignIn } from '@clerk/nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CustomSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setLoading(true)
    setError('')

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'oauth_google' | 'oauth_github') => {
    if (!isLoaded) return

    await signIn.authenticateWithRedirect({
      strategy: provider,
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/dashboard',
    })
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to your account</p>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={() => handleOAuth('oauth_google')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg hover:bg-muted"
        >
          <GoogleIcon className="w-5 h-5" />
          Continue with Google
        </button>
        <button
          onClick={() => handleOAuth('oauth_github')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg hover:bg-muted"
        >
          <GithubIcon className="w-5 h-5" />
          Continue with GitHub
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">or</span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don't have an account?{' '}
        <Link href="/sign-up" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
```

## Custom Sign-Up Page

```typescript
// app/(auth)/sign-up/page.tsx
'use client'

import { useSignUp } from '@clerk/nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CustomSignUp() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    try {
      await signUp.create({
        emailAddress: email,
        password,
      })

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })

      setPendingVerification(true)
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Something went wrong')
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid code')
    }
  }

  if (pendingVerification) {
    return (
      <form onSubmit={handleVerify} className="w-full max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-muted-foreground mb-6">
          We sent a code to {email}
        </p>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg mb-4">
            {error}
          </div>
        )}

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
          className="w-full px-3 py-2 border rounded-lg mb-4"
        />

        <button
          type="submit"
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg"
        >
          Verify
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create an account</h1>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg"
        >
          Sign up
        </button>
      </div>
    </form>
  )
}
```

## Auth Layout

```typescript
// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between">
        <div className="text-primary-foreground">
          <h1 className="text-2xl font-bold">MyApp</h1>
        </div>
        <blockquote className="text-primary-foreground/80">
          "This product changed everything for us."
          <footer className="mt-2 font-medium">— Happy Customer</footer>
        </blockquote>
      </div>

      {/* Right - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        {children}
      </div>
    </div>
  )
}
```

### SSO Callback Page

```typescript
// app/sso-callback/page.tsx
import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

export default function SSOCallback() {
  return <AuthenticateWithRedirectCallback />
}
```