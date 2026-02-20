# Server-Side Authentication

## Table of Contents
- [Server Components](#server-components)
- [Server Actions](#server-actions)
- [API Routes](#api-routes)
- [Auth Helpers](#auth-helpers)

## Server Components

### Get Current User

```typescript
// app/dashboard/page.tsx
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  return <h1>Welcome, {user.firstName}!</h1>
}
```

### Auth State Only

```typescript
import { auth } from '@clerk/nextjs/server'

export default async function Page() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const data = await fetchData(userId)
  return <div>{/* render */}</div>
}
```

## Server Actions

### Basic Pattern

```typescript
'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function createProjectAction(formData: FormData) {
  const { userId } = auth()
  if (!userId) return { error: 'Unauthorized' }

  const name = formData.get('name') as string
  
  await prisma.project.create({
    data: {
      name,
      owner: { connect: { clerkId: userId } },
    },
  })

  revalidatePath('/projects')
  return { success: true }
}
```

### With Authorization

```typescript
'use server'

import { auth } from '@clerk/nextjs/server'

export async function deleteProjectAction(projectId: string) {
  const { userId } = auth()
  if (!userId) return { error: 'Unauthorized' }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { owner: true },
  })

  if (project?.owner.clerkId !== userId) {
    return { error: 'Forbidden' }
  }

  await prisma.project.delete({ where: { id: projectId } })
  revalidatePath('/projects')
  return { success: true }
}
```

## API Routes

```typescript
// app/api/projects/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { owner: { clerkId: userId } },
  })

  return NextResponse.json(projects)
}
```

## Auth Helpers

```typescript
// lib/auth/index.ts
import { auth, currentUser } from '@clerk/nextjs/server'
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const user = await currentUser()
  if (!user) return null
  
  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
    imageUrl: user.imageUrl,
  }
})

export async function requireAuth() {
  const { userId } = auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export async function requireDbUser() {
  const userId = await requireAuth()
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!user) throw new Error('User not found')
  return user
}
```