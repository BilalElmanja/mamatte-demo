# Client-Side Authentication

## Clerk Hooks

### useUser

```typescript
'use client'
import { useUser } from '@clerk/nextjs'

export function UserProfile() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) return <div>Loading...</div>
  if (!isSignedIn) return <div>Please sign in</div>

  return (
    <div>
      <img src={user.imageUrl} alt="" />
      <p>{user.fullName}</p>
      <p>{user.primaryEmailAddress?.emailAddress}</p>
    </div>
  )
}
```

### useAuth

```typescript
'use client'
import { useAuth } from '@clerk/nextjs'

export function AuthStatus() {
  const { isSignedIn, userId, signOut } = useAuth()

  if (!isSignedIn) return null

  return (
    <div>
      <p>User: {userId}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}
```

## Clerk Components

### Header with Auth

```typescript
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  UserButton 
} from '@clerk/nextjs'

export function Header() {
  return (
    <header>
      <SignedOut>
        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </header>
  )
}
```

### UserButton with Custom Items

```typescript
import { UserButton } from '@clerk/nextjs'

<UserButton>
  <UserButton.MenuItems>
    <UserButton.Link label="Settings" href="/settings" />
    <UserButton.Link label="Billing" href="/billing" />
    <UserButton.Action label="signOut" />
  </UserButton.MenuItems>
</UserButton>
```

## Loading States

```typescript
'use client'
import { useUser } from '@clerk/nextjs'

export function UserCard() {
  const { isLoaded, user } = useUser()

  if (!isLoaded) {
    return <Skeleton className="w-32 h-10" />
  }

  return <div>{user?.fullName}</div>
}
```