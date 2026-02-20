# Images & Fonts Optimization

## Image Optimization

### Using next/image

```typescript
import Image from 'next/image'

// ✅ Basic optimized image
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority  // For above-the-fold images
/>

// ✅ Responsive image
<Image
  src="/product.jpg"
  alt="Product"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// ✅ Fill container
<div className="relative h-64 w-full">
  <Image
    src="/banner.jpg"
    alt="Banner"
    fill
    className="object-cover"
    sizes="100vw"
  />
</div>
```

### Image Props Guide

| Prop | When to Use |
|------|-------------|
| `priority` | Above-the-fold images (LCP candidates) |
| `loading="lazy"` | Below-the-fold images (default) |
| `placeholder="blur"` | Show blur while loading |
| `sizes` | Responsive images to pick right size |
| `quality` | Adjust compression (default: 75) |

### Blur Placeholder

```typescript
// ✅ Static import - blur generated at build time
import heroImage from '@/public/hero.jpg'

<Image
  src={heroImage}
  alt="Hero"
  placeholder="blur"  // Automatic blur from static import
/>

// ✅ Dynamic images - provide blurDataURL
<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL={product.blurHash}  // Pre-generated blur hash
/>
```

### Generating Blur Hashes

```typescript
// lib/images/blur-hash.ts
import { getPlaiceholder } from 'plaiceholder'

export async function generateBlurHash(imageUrl: string) {
  const { base64 } = await getPlaiceholder(imageUrl)
  return base64
}

// Generate on upload
const blurHash = await generateBlurHash(uploadedImageUrl)
await prisma.product.update({
  where: { id: productId },
  data: { imageUrl: uploadedImageUrl, blurHash }
})
```

### Remote Image Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Optimize these formats
    formats: ['image/avif', 'image/webp'],
    
    // Device sizes for srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Icon sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

### Responsive Images Pattern

```typescript
// ✅ Art direction - different images per breakpoint
function HeroImage() {
  return (
    <picture>
      {/* Mobile */}
      <source
        media="(max-width: 768px)"
        srcSet="/hero-mobile.webp"
      />
      {/* Tablet */}
      <source
        media="(max-width: 1200px)"
        srcSet="/hero-tablet.webp"
      />
      {/* Desktop */}
      <Image
        src="/hero-desktop.webp"
        alt="Hero"
        width={1920}
        height={1080}
        priority
      />
    </picture>
  )
}
```

### Lazy Loading Images

```typescript
// ✅ Intersection Observer for image grids
'use client'

import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

function LazyImage({ src, alt, ...props }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px',  // Start loading 200px before visible
  })
  
  return (
    <div ref={ref}>
      {inView ? (
        <Image src={src} alt={alt} {...props} />
      ) : (
        <div className="bg-muted animate-pulse" style={{ aspectRatio: props.width / props.height }} />
      )}
    </div>
  )
}
```

## Font Optimization

### Using next/font

```typescript
// app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

// ✅ Variable font (smallest file size)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// ✅ Monospace for code
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
```

### Tailwind Integration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
}
```

### Local Fonts

```typescript
import localFont from 'next/font/local'

const customFont = localFont({
  src: [
    {
      path: '../fonts/custom-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/custom-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-custom',
  display: 'swap',
})
```

### Font Display Strategies

| Value | Behavior | Use Case |
|-------|----------|----------|
| `swap` | Show fallback, swap when loaded | Most cases |
| `block` | Brief invisible text | Brand-critical fonts |
| `fallback` | Short swap window | Performance-critical |
| `optional` | May not swap if slow | Non-essential fonts |

### Subset Fonts

```typescript
// ✅ Only load needed character sets
const inter = Inter({
  subsets: ['latin'],  // Don't load cyrillic, greek, etc.
  display: 'swap',
})

// ✅ For specific characters only
const inter = Inter({
  subsets: ['latin'],
  // Only load specific weights you use
  weight: ['400', '500', '600', '700'],
})
```

## Icons Optimization

### Use SVG Components

```typescript
// ✅ Import as components (tree-shakeable)
import { Search, Menu, X } from 'lucide-react'

// ✅ Use in JSX
<Search className="h-5 w-5" />

// ❌ Don't import all icons
import * as Icons from 'lucide-react'
```

### Optimize SVG Files

```typescript
// next.config.js
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}

// Usage
import Logo from '@/public/logo.svg'
<Logo className="h-8 w-auto" />
```

### Icon Sprites for Many Icons

```typescript
// For pages with many icons, use sprites
// public/icons.svg - sprite sheet

// components/icon.tsx
function Icon({ name, className }) {
  return (
    <svg className={className}>
      <use href={`/icons.svg#${name}`} />
    </svg>
  )
}

// Usage
<Icon name="search" className="h-5 w-5" />
<Icon name="menu" className="h-5 w-5" />
```

## Background Images

### CSS vs next/image

```typescript
// ✅ For decorative backgrounds - use CSS
<div 
  className="bg-cover bg-center"
  style={{ backgroundImage: 'url(/pattern.svg)' }}
>
  Content
</div>

// ✅ For content images - use next/image
<div className="relative">
  <Image
    src="/hero-bg.jpg"
    alt=""
    fill
    className="object-cover -z-10"
    priority
  />
  <div className="relative z-10">Content</div>
</div>
```

### Optimized Background Pattern

```typescript
// ✅ Inline small SVG patterns
<div 
  className="bg-repeat"
  style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23e5e7eb'/%3E%3C/svg%3E")`
  }}
/>
```

## Anti-Patterns

### ❌ Unoptimized Images

```typescript
// ❌ Bad - no optimization
<img src="/large-photo.jpg" alt="Photo" />

// ✅ Good - optimized
<Image src="/large-photo.jpg" alt="Photo" width={800} height={600} />
```

### ❌ Missing Sizes Prop

```typescript
// ❌ Bad - browser doesn't know which size to pick
<Image src="/photo.jpg" alt="Photo" fill />

// ✅ Good - browser picks optimal size
<Image 
  src="/photo.jpg" 
  alt="Photo" 
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### ❌ Priority on All Images

```typescript
// ❌ Bad - everything is priority
<Image src="/img1.jpg" priority />
<Image src="/img2.jpg" priority />
<Image src="/img3.jpg" priority />

// ✅ Good - only LCP image is priority
<Image src="/hero.jpg" priority />  {/* Above fold */}
<Image src="/img2.jpg" />            {/* Below fold - lazy */}
<Image src="/img3.jpg" />            {/* Below fold - lazy */}
```

### ❌ Loading Fonts Multiple Times

```typescript
// ❌ Bad - font loaded in multiple components
// ComponentA.tsx
const inter = Inter({ subsets: ['latin'] })

// ComponentB.tsx
const inter = Inter({ subsets: ['latin'] })  // Duplicate!

// ✅ Good - single font instance in layout
// app/layout.tsx
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

// Use via CSS variable everywhere
<div className="font-sans">...</div>
```

### ❌ Large Uncompressed Images

```typescript
// ❌ Bad - 5MB PNG
<Image src="/screenshot.png" ... />

// ✅ Good - convert to WebP, compress
// Use tools like: squoosh.app, tinypng.com
// Or let next/image handle it with quality prop
<Image src="/screenshot.png" quality={80} ... />
```