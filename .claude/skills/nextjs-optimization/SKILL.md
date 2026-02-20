---
name: nextjs-optimization
description: "Performance optimization for Next.js SaaS applications covering fast rendering, optimal load times, Core Web Vitals (LCP, FID, CLS), efficient database queries, bundle size reduction, image/font optimization, and SEO best practices. Use when building new pages, optimizing slow pages, improving Core Web Vitals scores, reducing database query times, or preparing for production launch."
---

## Overview

This skill covers performance optimization for Next.js SaaS applications. It ensures fast rendering, optimal load times, excellent Core Web Vitals, efficient database operations, and strong SEO metrics.

## When to Use This Skill

- Building new pages or components (apply patterns from start)
- Optimizing existing slow pages
- Improving Core Web Vitals scores
- Reducing database query times
- Preparing for production launch
- SEO optimization for marketing pages

## Performance Goals

| Metric | Target | Measured By |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Core Web Vitals |
| **FID** (First Input Delay) | < 100ms | Core Web Vitals |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Core Web Vitals |
| **TTFB** (Time to First Byte) | < 200ms | Server response |
| **Bundle Size** | < 100KB initial JS | Build output |
| **Database Queries** | < 50ms avg | Query monitoring |

## Quick Reference

### Rendering Strategy Decision Tree

```
Is the content the same for all users?
├── YES → Static Generation (generateStaticParams)
│         Best for: Landing pages, blog posts, docs
│
└── NO → Does it change frequently?
         ├── YES → Server Components + Streaming
         │         Best for: Dashboards, feeds
         │
         └── NO → ISR (Incremental Static Regeneration)
                  Best for: Product pages, profiles
```

### Component Type Decision

```
Does the component need interactivity?
├── NO → Server Component (default)
│        Benefits: Zero JS, direct data access
│
└── YES → Is it a small interactive part?
          ├── YES → Server Component + Client Island
          │         Keep most logic server-side
          │
          └── NO → Client Component with lazy loading
                   Use dynamic() for code splitting
```

## Core Optimization Strategies

### 1. Server Components First

```typescript
// ✅ Server Component (default) - no JS shipped
async function ProductList() {
  const products = await productService.getAll()
  return (
    <div>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}

// ✅ Only wrap interactive parts in Client Components
'use client'
function AddToCartButton({ productId }: { productId: string }) {
  return <button onClick={() => addToCart(productId)}>Add</button>
}
```

### 2. Streaming & Suspense

```typescript
// ✅ Stream slow content, show fast content immediately
export default function DashboardPage() {
  return (
    <div>
      {/* Shows immediately */}
      <DashboardHeader />
      
      {/* Streams when ready */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>
      
      <Suspense fallback={<TableSkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  )
}
```

### 3. Data Fetching Patterns

```typescript
// ✅ Parallel fetching - don't waterfall
async function Dashboard() {
  // Start all fetches simultaneously
  const [stats, projects, activity] = await Promise.all([
    statsService.get(),
    projectService.getRecent(),
    activityService.getRecent()
  ])
  
  return <DashboardView stats={stats} projects={projects} activity={activity} />
}

// ❌ Waterfall - each waits for previous
async function DashboardBad() {
  const stats = await statsService.get()        // 100ms
  const projects = await projectService.get()   // +100ms = 200ms
  const activity = await activityService.get()  // +100ms = 300ms total
}
```

### 4. Database Optimization

```typescript
// ✅ Select only needed fields
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true }
})

// ✅ Use proper indexes
// schema.prisma
model Project {
  @@index([ownerId])
  @@index([status, createdAt])
}

// ✅ Batch related queries
const projects = await prisma.project.findMany({
  where: { ownerId: userId },
  include: { tasks: { take: 5 } }  // Single query with join
})
```

### 5. Image Optimization

```typescript
import Image from 'next/image'

// ✅ Always use next/image
<Image
  src={product.image}
  alt={product.name}
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL={product.blurHash}
  loading="lazy"  // or "eager" for above-fold
/>
```

### 6. Code Splitting

```typescript
import dynamic from 'next/dynamic'

// ✅ Lazy load heavy components
const HeavyChart = dynamic(() => import('@/components/charts/heavy-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false  // Skip SSR if not needed
})

// ✅ Lazy load below-fold content
const Comments = dynamic(() => import('./comments'))
```

## References

Detailed optimization guides:

- [rendering.md](references/rendering.md) - Server vs Client, Streaming, Suspense
- [data-fetching.md](references/data-fetching.md) - Caching, Revalidation, Parallel fetching
- [database.md](references/database.md) - Query optimization, Indexes, N+1 prevention
- [bundle.md](references/bundle.md) - Code splitting, Tree shaking, Lazy loading
- [images-fonts.md](references/images-fonts.md) - Image optimization, Font loading
- [seo.md](references/seo.md) - Metadata, Structured data, Sitemap, robots.txt
- [core-web-vitals.md](references/core-web-vitals.md) - LCP, FID, CLS optimization
- [monitoring.md](references/monitoring.md) - Performance tracking, Alerts

## Environment Variables

```env
# Caching
REVALIDATE_INTERVAL=3600

# Image Optimization
NEXT_PUBLIC_IMAGE_DOMAINS=your-cdn.com

# Database Connection Pooling
DATABASE_URL=postgresql://...?connection_limit=20&pool_timeout=10
```

## Integration with Other Skills

| Skill | Optimization Considerations |
|-------|----------------------------|
| **prisma-database** | Add indexes, use select, batch queries |
| **nextjs-auth** | Cache user data, minimize auth checks |
| **nextjs-payments** | Cache plan data, lazy load billing UI |
| **nextjs-file-upload** | Optimize images on upload, use CDN |
| **nextjs-analytics** | Defer analytics scripts, use web workers |
| **nextjs-design-system** | Minimize CSS, lazy load animations |