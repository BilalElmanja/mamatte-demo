# Core Web Vitals Optimization

## Overview

Core Web Vitals are Google's metrics for user experience. They directly impact SEO rankings.

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **FID** (First Input Delay) | ≤ 100ms | ≤ 300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| **INP** (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |

---

## LCP (Largest Contentful Paint)

The time it takes for the main content to appear.

### Optimization Strategies

#### 1. Prioritize LCP Image

```typescript
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // Preloads the image
/>
```

#### 2. Preload Critical Assets

```typescript
// app/layout.tsx
<head>
  <link rel="preload" as="image" href="/hero.jpg" />
  <link rel="preload" as="font" type="font/woff2" href="/fonts/inter.woff2" crossOrigin="anonymous" />
</head>
```

#### 3. Use Streaming

```typescript
export default async function Page() {
  return (
    <div>
      <HeroSection />  {/* Renders immediately */}
      <Suspense fallback={<Skeleton />}>
        <DynamicContent />  {/* Streams when ready */}
      </Suspense>
    </div>
  )
}
```

---

## FID / INP (Input Delay)

Time from user interaction to browser response.

### Optimization Strategies

#### 1. Minimize JavaScript

```typescript
// Use Server Components (zero JS)
async function ProductList() {
  const products = await getProducts()
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}
```

#### 2. Debounce Heavy Operations

```typescript
const debouncedSearch = useDebouncedCallback((value) => {
  const results = items.filter(...)
  setResults(results)
}, 300)
```

#### 3. Use CSS for Animations

```css
/* GPU accelerated, doesn't block main thread */
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
```

---

## CLS (Cumulative Layout Shift)

Visual stability - content shouldn't jump around.

### Optimization Strategies

#### 1. Always Set Image Dimensions

```typescript
<Image src="/photo.jpg" width={800} height={600} alt="Photo" />

// Or use aspect ratio
<div className="aspect-video relative">
  <Image src="/photo.jpg" fill alt="Photo" />
</div>
```

#### 2. Reserve Space for Dynamic Content

```typescript
<div className="h-[250px] w-full">  {/* Fixed height */}
  {ad ? <Ad /> : <AdPlaceholder />}
</div>
```

#### 3. Use Skeleton Loaders

```typescript
function CardSkeleton() {
  return <div className="w-full h-[200px] bg-muted animate-pulse rounded-lg" />
}
```

#### 4. Prevent Font Layout Shift

```typescript
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: true,
})
```

---

## Measuring Core Web Vitals

### Next.js Built-in Reporting

```typescript
'use client'
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    console.log(metric.name, metric.value, metric.rating)
    
    // Send to analytics
    navigator.sendBeacon('/api/vitals', JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
    }))
  })
  return null
}
```

### Tools

- **Chrome DevTools** → Performance tab → Web Vitals
- **Lighthouse** → `npx lighthouse https://myapp.com`
- **PageSpeed Insights** → pagespeed.web.dev
- **Search Console** → Core Web Vitals report

---

## Quick Wins Checklist

### LCP
- [ ] Add `priority` to above-fold images
- [ ] Preload LCP image
- [ ] Use `next/image`
- [ ] Enable compression
- [ ] Use CDN

### FID / INP
- [ ] Maximize Server Components
- [ ] Code-split with `dynamic()`
- [ ] Debounce event handlers
- [ ] Use Web Workers for heavy tasks

### CLS
- [ ] Set width/height on all images
- [ ] Reserve space for dynamic content
- [ ] Use skeleton loaders
- [ ] Use `font-display: swap`
- [ ] Avoid inserting content above existing content