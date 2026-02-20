# Rendering Optimization

## Rendering Strategies

### Static Generation (Best Performance)

Use for content that doesn't change per-user.

```typescript
// app/blog/[slug]/page.tsx

// Generate all paths at build time
export async function generateStaticParams() {
  const posts = await postRepository.getAllSlugs()
  return posts.map(post => ({ slug: post.slug }))
}

// Page is generated once, served from CDN
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await postRepository.findBySlug(params.slug)
  return <Article post={post} />
}
```

### Incremental Static Regeneration (ISR)

Static pages that update periodically.

```typescript
// app/products/[id]/page.tsx

// Revalidate every hour
export const revalidate = 3600

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await productRepository.findById(params.id)
  return <ProductDetail product={product} />
}

// Or revalidate on-demand via API
// app/api/revalidate/route.ts
export async function POST(request: Request) {
  const { path, secret } = await request.json()
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 })
  }
  
  revalidatePath(path)
  return Response.json({ revalidated: true })
}
```

### Dynamic Rendering with Streaming

For personalized content that can't be cached.

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Render immediately - no data needed */}
      <aside className="col-span-3">
        <Navigation />
      </aside>
      
      <main className="col-span-9 space-y-6">
        {/* Stream each section independently */}
        <Suspense fallback={<WelcomeSkeleton />}>
          <WelcomeBanner />
        </Suspense>
        
        <div className="grid grid-cols-3 gap-4">
          <Suspense fallback={<StatCardSkeleton />}>
            <ProjectsCount />
          </Suspense>
          <Suspense fallback={<StatCardSkeleton />}>
            <TasksCount />
          </Suspense>
          <Suspense fallback={<StatCardSkeleton />}>
            <TeamCount />
          </Suspense>
        </div>
        
        <Suspense fallback={<TableSkeleton rows={5} />}>
          <RecentProjects />
        </Suspense>
      </main>
    </div>
  )
}
```

## Server Components

### Benefits

- **Zero JavaScript** sent to client
- **Direct database access** without API layer
- **Secure** - secrets stay on server
- **Faster initial load** - HTML streamed immediately

### Server Component Patterns

```typescript
// ✅ Server Component (default - no directive needed)
async function UserProfile({ userId }: { userId: string }) {
  // Direct database access
  const user = await userRepository.findById(userId)
  
  // Server-only code is safe
  const stats = await analyticsService.getUserStats(userId)
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Projects: {stats.projectCount}</p>
      
      {/* Pass data to client component */}
      <FollowButton userId={userId} isFollowing={stats.isFollowing} />
    </div>
  )
}
```

### Composition Pattern

Keep Server Components as parents, Client Components as leaves.

```typescript
// ✅ Good - Server parent, client children
// app/projects/page.tsx (Server)
async function ProjectsPage() {
  const projects = await projectService.getAll()
  
  return (
    <div>
      <h1>Projects</h1>
      {/* Server renders list, client handles interactions */}
      {projects.map(project => (
        <ProjectCard key={project.id} project={project}>
          <ProjectActions projectId={project.id} />  {/* Client */}
        </ProjectCard>
      ))}
    </div>
  )
}

// components/project-actions.tsx (Client)
'use client'
function ProjectActions({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      {/* Interactive menu */}
    </DropdownMenu>
  )
}
```

## Client Components

### When to Use

- Event handlers (onClick, onChange)
- State (useState, useReducer)
- Effects (useEffect)
- Browser APIs (localStorage, geolocation)
- Custom hooks with state
- Third-party libraries that need browser

### Minimizing Client JavaScript

```typescript
// ❌ Bad - entire page is client
'use client'
export default function ProjectPage({ params }) {
  const [project, setProject] = useState(null)
  
  useEffect(() => {
    fetch(`/api/projects/${params.id}`)
      .then(r => r.json())
      .then(setProject)
  }, [params.id])
  
  return <div>{/* ... */}</div>
}

// ✅ Good - only interactive parts are client
// Server Component (page.tsx)
export default async function ProjectPage({ params }) {
  const project = await projectService.getById(params.id)
  
  return (
    <div>
      {/* Static content rendered on server */}
      <ProjectHeader project={project} />
      <ProjectDetails project={project} />
      
      {/* Only this is client */}
      <ProjectEditor projectId={project.id} initialContent={project.content} />
    </div>
  )
}
```

### Client Component Islands

```typescript
// ✅ Small interactive "islands" in server content
// components/copy-button.tsx
'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <button onClick={copy} className="p-2 hover:bg-muted rounded">
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  )
}

// Usage in Server Component
function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative">
      <pre>{code}</pre>
      <CopyButton text={code} />  {/* Tiny client island */}
    </div>
  )
}
```

## Suspense Boundaries

### Strategic Placement

```typescript
// ✅ Wrap slow components individually
export default function Dashboard() {
  return (
    <div>
      {/* Fast - no suspense needed */}
      <Header />
      
      {/* Slow API call - wrap it */}
      <Suspense fallback={<StatsSkeleton />}>
        <SlowStatsComponent />
      </Suspense>
      
      {/* Another slow component */}
      <Suspense fallback={<ChartSkeleton />}>
        <SlowChartComponent />
      </Suspense>
    </div>
  )
}

// ❌ Don't wrap everything in one Suspense
export default function DashboardBad() {
  return (
    <Suspense fallback={<FullPageSkeleton />}>
      <Header />  {/* Fast but waits */}
      <Stats />   {/* Slow */}
      <Chart />   {/* Slow */}
    </Suspense>
  )
}
```

### Loading UI Best Practices

```typescript
// ✅ Skeleton that matches final layout
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  )
}

// ✅ Use loading.tsx for route-level loading
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return <DashboardSkeleton />
}
```

## Partial Prerendering (PPR)

Next.js 14+ experimental feature for best of both worlds.

```typescript
// next.config.js
module.exports = {
  experimental: {
    ppr: true
  }
}

// app/product/[id]/page.tsx
import { Suspense } from 'react'

export default async function ProductPage({ params }) {
  // This is prerendered (static shell)
  const product = await productRepository.findById(params.id)
  
  return (
    <div>
      {/* Static - prerendered at build */}
      <ProductInfo product={product} />
      <ProductImages images={product.images} />
      
      {/* Dynamic - rendered at request time */}
      <Suspense fallback={<PriceSkeleton />}>
        <DynamicPrice productId={params.id} />
      </Suspense>
      
      <Suspense fallback={<ReviewsSkeleton />}>
        <DynamicReviews productId={params.id} />
      </Suspense>
    </div>
  )
}
```

## Anti-Patterns

### ❌ Unnecessary Client Components

```typescript
// ❌ Bad - no interactivity needed
'use client'
function UserCard({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}

// ✅ Good - Server Component
function UserCard({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}
```

### ❌ Prop Drilling Through Client Boundary

```typescript
// ❌ Bad - passing server data through client
'use client'
function ClientWrapper({ serverData }) {
  return <ServerChild data={serverData} />  // Serialization overhead
}

// ✅ Good - keep server data in server components
function ServerParent() {
  const data = await getData()
  return (
    <>
      <ServerChild data={data} />
      <ClientInteractive id={data.id} />  {/* Pass only what's needed */}
    </>
  )
}
```

### ❌ Fetching in useEffect

```typescript
// ❌ Bad - client-side fetch creates waterfall
'use client'
function Projects() {
  const [projects, setProjects] = useState([])
  
  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(setProjects)
  }, [])
  
  return <ProjectList projects={projects} />
}

// ✅ Good - Server Component fetches directly
async function Projects() {
  const projects = await projectService.getAll()
  return <ProjectList projects={projects} />
}
```