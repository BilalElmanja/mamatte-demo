# Data Fetching Optimization

## Caching Strategies

### Request Memoization

Next.js automatically deduplicates fetch requests in a single render pass.

```typescript
// Both components fetch same URL - only ONE request is made
async function ProductPage({ id }) {
  return (
    <>
      <ProductInfo id={id} />    {/* Fetches /api/products/123 */}
      <ProductReviews id={id} /> {/* Same URL - uses cached response */}
    </>
  )
}

// This works with fetch() automatically
async function ProductInfo({ id }) {
  const res = await fetch(`${API_URL}/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

### Data Cache

```typescript
// ✅ Cache indefinitely (until revalidated)
const data = await fetch(url, { cache: 'force-cache' })

// ✅ Revalidate after 1 hour
const data = await fetch(url, { next: { revalidate: 3600 } })

// ✅ Always fresh (no cache)
const data = await fetch(url, { cache: 'no-store' })

// ✅ Page-level revalidation
export const revalidate = 3600  // Revalidate every hour
```

### Caching Non-Fetch Data

For Prisma and other non-fetch data sources, use `unstable_cache`:

```typescript
import { unstable_cache } from 'next/cache'

// ✅ Cache database queries
const getCachedProducts = unstable_cache(
  async (category: string) => {
    return prisma.product.findMany({
      where: { category },
      select: { id: true, name: true, price: true }
    })
  },
  ['products-by-category'],  // Cache key
  { revalidate: 3600, tags: ['products'] }
)

// Usage
const products = await getCachedProducts('electronics')

// Revalidate by tag
import { revalidateTag } from 'next/cache'
revalidateTag('products')
```

### Cache with React cache()

For request-level deduplication of non-fetch functions:

```typescript
import { cache } from 'react'

// ✅ Deduplicate within single request
export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.userId) return null
  return userRepository.findById(session.userId)
})

// Called multiple times in one render - only executes once
async function Header() {
  const user = await getCurrentUser()
  return <nav>{user?.name}</nav>
}

async function Sidebar() {
  const user = await getCurrentUser()  // Uses cached result
  return <aside>{user?.email}</aside>
}
```

## Parallel Data Fetching

### Promise.all Pattern

```typescript
// ✅ Parallel - all requests start simultaneously
async function Dashboard() {
  const [user, projects, stats, notifications] = await Promise.all([
    userService.getCurrent(),
    projectService.getRecent(),
    statsService.getDashboard(),
    notificationService.getUnread()
  ])
  
  return (
    <DashboardLayout
      user={user}
      projects={projects}
      stats={stats}
      notifications={notifications}
    />
  )
}

// Total time: max(user, projects, stats, notifications) ≈ 100ms
```

### ❌ Waterfall Pattern (Avoid)

```typescript
// ❌ Waterfall - each request waits for previous
async function DashboardBad() {
  const user = await userService.getCurrent()           // 50ms
  const projects = await projectService.getRecent()     // +80ms
  const stats = await statsService.getDashboard()       // +60ms
  const notifications = await notificationService.get() // +40ms
  
  // Total time: 50 + 80 + 60 + 40 = 230ms
}
```

### Streaming with Suspense

When some data depends on other data:

```typescript
// ✅ Stream independent data while waiting for dependent data
async function ProjectPage({ id }) {
  // Start fetching immediately
  const projectPromise = projectService.getById(id)
  
  return (
    <div>
      {/* This streams first */}
      <Suspense fallback={<HeaderSkeleton />}>
        <ProjectHeader projectPromise={projectPromise} />
      </Suspense>
      
      {/* This can stream independently */}
      <Suspense fallback={<TeamSkeleton />}>
        <ProjectTeam projectId={id} />
      </Suspense>
      
      {/* This depends on project data */}
      <Suspense fallback={<TasksSkeleton />}>
        <ProjectTasks projectPromise={projectPromise} />
      </Suspense>
    </div>
  )
}

// Component that consumes promise
async function ProjectHeader({ projectPromise }) {
  const project = await projectPromise
  return <h1>{project.name}</h1>
}
```

## Preloading Data

### preload Pattern

```typescript
// lib/data/projects.ts
import { cache } from 'react'

// Cached fetch function
export const getProject = cache(async (id: string) => {
  return projectRepository.findById(id)
})

// Preload function (starts fetch without await)
export const preloadProject = (id: string) => {
  void getProject(id)
}

// Usage in page
import { preloadProject, getProject } from '@/lib/data/projects'

export default async function ProjectPage({ params }) {
  // Start fetching immediately
  preloadProject(params.id)
  
  // Do other stuff...
  const user = await getCurrentUser()
  
  // By now, project is likely cached
  const project = await getProject(params.id)
  
  return <ProjectView project={project} user={user} />
}
```

### Parallel Route Preloading

```typescript
// app/dashboard/layout.tsx
import { preloadUserStats, preloadRecentProjects } from '@/lib/data'

export default function DashboardLayout({ children }) {
  // Start preloading for likely next navigations
  preloadUserStats()
  preloadRecentProjects()
  
  return <div>{children}</div>
}
```

## Server Actions Optimization

### Optimistic Updates

```typescript
'use client'

import { useOptimistic, useTransition } from 'react'
import { toggleFavorite } from '@/actions/favorites'

function FavoriteButton({ projectId, isFavorite }) {
  const [isPending, startTransition] = useTransition()
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(isFavorite)
  
  const handleClick = () => {
    startTransition(async () => {
      // Update UI immediately
      setOptimisticFavorite(!optimisticFavorite)
      
      // Then sync with server
      await toggleFavorite(projectId)
    })
  }
  
  return (
    <button 
      onClick={handleClick}
      disabled={isPending}
      className={optimisticFavorite ? 'text-yellow-500' : 'text-gray-400'}
    >
      <Star className="h-5 w-5" />
    </button>
  )
}
```

### Batch Mutations

```typescript
// ✅ Batch multiple operations in one action
export async function updateProjectAction(input: {
  projectId: string
  name?: string
  description?: string
  status?: string
  tags?: string[]
}) {
  const user = await requireAuth()
  const validated = updateProjectSchema.parse(input)
  
  // Single database transaction
  await projectService.update(validated.projectId, validated)
  
  revalidatePath(`/projects/${validated.projectId}`)
}

// ❌ Don't make separate actions for each field
// updateProjectName, updateProjectDescription, updateProjectStatus...
```

## Route Segment Config

### Static vs Dynamic

```typescript
// Force static generation
export const dynamic = 'force-static'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Set revalidation time
export const revalidate = 3600

// Control runtime
export const runtime = 'nodejs'  // or 'edge'
```

### Granular Control

```typescript
// app/blog/[slug]/page.tsx

// Static pages with ISR
export const revalidate = 3600

// Generate popular posts at build time
export async function generateStaticParams() {
  const popularPosts = await postRepository.getPopular(100)
  return popularPosts.map(post => ({ slug: post.slug }))
}

// Others generated on-demand
export const dynamicParams = true
```

## Anti-Patterns

### ❌ Fetching Same Data Multiple Times

```typescript
// ❌ Bad - duplicate fetches
async function Page() {
  const user1 = await userService.getCurrent()  // Fetch 1
  const user2 = await userService.getCurrent()  // Fetch 2 (duplicate!)
  
  return <div>{user1.name}</div>
}

// ✅ Good - use React cache
import { cache } from 'react'

const getCurrent = cache(async () => {
  return userService.getCurrent()
})

async function Page() {
  const user1 = await getCurrent()  // Fetch
  const user2 = await getCurrent()  // Cached
}
```

### ❌ Over-fetching Data

```typescript
// ❌ Bad - fetching everything
const user = await prisma.user.findUnique({
  where: { id },
  include: { 
    projects: true,          // All projects
    notifications: true,     // All notifications
    activityLogs: true       // All logs
  }
})

// ✅ Good - fetch only what you need
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    email: true,
    projects: {
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true }
    }
  }
})
```

### ❌ Not Using ISR for Semi-Static Content

```typescript
// ❌ Bad - dynamic for content that rarely changes
export const dynamic = 'force-dynamic'

async function ProductPage({ params }) {
  const product = await productService.getById(params.id)
  return <Product product={product} />
}

// ✅ Good - ISR with appropriate revalidation
export const revalidate = 3600  // Update hourly

async function ProductPage({ params }) {
  const product = await productService.getById(params.id)
  return <Product product={product} />
}
```