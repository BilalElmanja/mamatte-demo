# SEO Optimization

## Metadata API

### Static Metadata

```typescript
// app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home | MyApp',
  description: 'Build amazing SaaS applications with our platform.',
  keywords: ['SaaS', 'platform', 'productivity'],
  authors: [{ name: 'Your Company' }],
  creator: 'Your Company',
  publisher: 'Your Company',
  
  // Open Graph
  openGraph: {
    title: 'MyApp - Build Amazing SaaS',
    description: 'Build amazing SaaS applications with our platform.',
    url: 'https://myapp.com',
    siteName: 'MyApp',
    images: [
      {
        url: 'https://myapp.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MyApp Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'MyApp - Build Amazing SaaS',
    description: 'Build amazing SaaS applications with our platform.',
    images: ['https://myapp.com/twitter-image.jpg'],
    creator: '@yourhandle',
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  
  // Alternate languages
  alternates: {
    canonical: 'https://myapp.com',
    languages: {
      'en-US': 'https://myapp.com/en-US',
      'es-ES': 'https://myapp.com/es-ES',
    },
  },
}
```

### Dynamic Metadata

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await postRepository.findBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }
  
  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}
```

### Template Metadata

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: '%s | MyApp',  // Pages can set just the page title
    default: 'MyApp',         // Fallback
  },
  description: 'Default description',
}

// app/about/page.tsx
export const metadata: Metadata = {
  title: 'About',  // Becomes "About | MyApp"
}
```

## Structured Data (JSON-LD)

### Organization Schema

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MyApp',
    url: 'https://myapp.com',
    logo: 'https://myapp.com/logo.png',
    sameAs: [
      'https://twitter.com/myapp',
      'https://linkedin.com/company/myapp',
      'https://github.com/myapp',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-555-5555',
      contactType: 'customer service',
    },
  }
  
  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Product Schema

```typescript
// app/products/[id]/page.tsx
export default async function ProductPage({ params }) {
  const product = await productRepository.findById(params.id)
  
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: 'MyApp',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://myapp.com/products/${product.id}`,
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    } : undefined,
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetail product={product} />
    </>
  )
}
```

### Article Schema

```typescript
// app/blog/[slug]/page.tsx
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.excerpt,
  image: post.coverImage,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: {
    '@type': 'Person',
    name: post.author.name,
    url: `https://myapp.com/authors/${post.author.slug}`,
  },
  publisher: {
    '@type': 'Organization',
    name: 'MyApp',
    logo: {
      '@type': 'ImageObject',
      url: 'https://myapp.com/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://myapp.com/blog/${post.slug}`,
  },
}
```

### FAQ Schema

```typescript
// app/faq/page.tsx
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}
```

### Breadcrumb Schema

```typescript
// components/breadcrumbs.tsx
function Breadcrumbs({ items }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => (
            <li key={item.url}>
              <a href={item.url}>{item.name}</a>
              {index < items.length - 1 && <span>/</span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
```

## Sitemap

### Static Sitemap

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://myapp.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://myapp.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://myapp.com/pricing',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]
}
```

### Dynamic Sitemap

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default async function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://myapp.com'
  
  // Static pages
  const staticPages = [
    { url: baseUrl, priority: 1 },
    { url: `${baseUrl}/about`, priority: 0.8 },
    { url: `${baseUrl}/pricing`, priority: 0.9 },
    { url: `${baseUrl}/blog`, priority: 0.8 },
  ]
  
  // Dynamic blog posts
  const posts = await postRepository.getAllPublished()
  const blogPages = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))
  
  // Dynamic product pages
  const products = await productRepository.getAll()
  const productPages = products.map(product => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))
  
  return [
    ...staticPages.map(page => ({
      ...page,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
    })),
    ...blogPages,
    ...productPages,
  ]
}
```

### Large Sitemaps (Multiple Files)

```typescript
// app/sitemap/[id]/route.ts
// For sites with 50,000+ URLs

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const page = parseInt(params.id)
  const pageSize = 50000
  
  const posts = await postRepository.getPaginated(page, pageSize)
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${posts.map(post => `
        <url>
          <loc>https://myapp.com/blog/${post.slug}</loc>
          <lastmod>${post.updatedAt.toISOString()}</lastmod>
        </url>
      `).join('')}
    </urlset>`
  
  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
```

## Robots.txt

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/admin/',
          '/settings/',
        ],
      },
    ],
    sitemap: 'https://myapp.com/sitemap.xml',
  }
}
```

## Canonical URLs

```typescript
// Prevent duplicate content issues
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://myapp.com/page',  // The "main" URL
  },
}

// For paginated content
export async function generateMetadata({ searchParams }) {
  const page = searchParams.page || 1
  
  return {
    alternates: {
      canonical: page === 1 
        ? 'https://myapp.com/blog'
        : `https://myapp.com/blog?page=${page}`,
    },
  }
}
```

## Semantic HTML

```typescript
// ✅ Proper heading hierarchy
<main>
  <article>
    <h1>Main Title</h1>           {/* One h1 per page */}
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
      <h3>Subsection</h3>
      <p>More content...</p>
    </section>
  </article>
  
  <aside>
    <h2>Related Posts</h2>
    {/* ... */}
  </aside>
</main>

// ✅ Landmark elements
<header>Site header</header>
<nav>Navigation</nav>
<main>Main content</main>
<footer>Site footer</footer>

// ✅ Descriptive link text
<a href="/pricing">View pricing plans</a>  // ✅ Good
<a href="/pricing">Click here</a>           // ❌ Bad
```

## Performance for SEO

```typescript
// Core Web Vitals affect SEO rankings

// ✅ LCP - Largest Contentful Paint
// - Use priority on hero images
// - Preload critical assets

// ✅ FID - First Input Delay  
// - Minimize JavaScript
// - Use Server Components

// ✅ CLS - Cumulative Layout Shift
// - Set explicit image dimensions
// - Reserve space for dynamic content
<Image
  src={image}
  width={800}      // Prevents CLS
  height={600}     // Prevents CLS
  alt="Description"
/>
```

## Anti-Patterns

### ❌ Missing Meta Descriptions

```typescript
// ❌ Bad - no description
export const metadata = {
  title: 'About Us'
}

// ✅ Good - descriptive
export const metadata = {
  title: 'About Us',
  description: 'Learn about our mission to help developers build better SaaS applications faster.'
}
```

### ❌ Duplicate Titles

```typescript
// ❌ Bad - same title everywhere
// page1: "MyApp"
// page2: "MyApp"

// ✅ Good - unique, descriptive titles
// page1: "Home | MyApp"  
// page2: "Pricing Plans | MyApp"
```

### ❌ Blocking Important Pages

```typescript
// ❌ Bad robots.txt
User-agent: *
Disallow: /  // Blocks everything!

// ✅ Good robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/
```

### ❌ Missing Alt Text

```typescript
// ❌ Bad
<Image src={product.image} />

// ✅ Good
<Image src={product.image} alt={`${product.name} product photo`} />
```

### ❌ JavaScript-Only Content

```typescript
// ❌ Bad - content loaded client-side, not indexed
'use client'
function ProductList() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts)
  }, [])
  return <div>{products.map(...)}</div>
}

// ✅ Good - Server Component, content in HTML
async function ProductList() {
  const products = await productService.getAll()
  return <div>{products.map(...)}</div>
}
```