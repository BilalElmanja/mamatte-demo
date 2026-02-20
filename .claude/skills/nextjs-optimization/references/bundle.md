# Bundle Optimization

## Code Splitting

### Dynamic Imports

```typescript
import dynamic from 'next/dynamic'

// ✅ Lazy load heavy components
const HeavyChart = dynamic(() => import('@/components/charts/analytics-chart'), {
  loading: () => <ChartSkeleton />,
})

// ✅ Skip SSR for client-only components
const RichTextEditor = dynamic(
  () => import('@/components/editor/rich-text-editor'),
  { 
    ssr: false,
    loading: () => <EditorSkeleton />
  }
)

// ✅ Named exports
const Modal = dynamic(
  () => import('@/components/ui/modal').then(mod => mod.Modal)
)
```

### Route-Based Code Splitting

Next.js automatically code-splits by route. Enhance with:

```typescript
// app/dashboard/analytics/page.tsx
import dynamic from 'next/dynamic'

// Heavy analytics components loaded only on this route
const AnalyticsDashboard = dynamic(
  () => import('./_components/analytics-dashboard')
)

export default function AnalyticsPage() {
  return <AnalyticsDashboard />
}
```

### Component-Level Splitting

```typescript
// ✅ Split by visibility
function ProjectPage({ project }) {
  return (
    <div>
      {/* Loaded immediately - above the fold */}
      <ProjectHeader project={project} />
      <ProjectOverview project={project} />
      
      {/* Lazy loaded - below the fold */}
      <Suspense fallback={<CommentsSkeleton />}>
        <LazyComments projectId={project.id} />
      </Suspense>
      
      <Suspense fallback={<ActivitySkeleton />}>
        <LazyActivityFeed projectId={project.id} />
      </Suspense>
    </div>
  )
}

const LazyComments = dynamic(() => import('./comments'))
const LazyActivityFeed = dynamic(() => import('./activity-feed'))
```

## Tree Shaking

### Import Only What You Need

```typescript
// ❌ Bad - imports entire library
import _ from 'lodash'
_.debounce(fn, 300)

// ✅ Good - imports only needed function
import debounce from 'lodash/debounce'
debounce(fn, 300)

// ❌ Bad - imports all icons
import * as Icons from 'lucide-react'

// ✅ Good - imports only used icons
import { Search, Menu, X } from 'lucide-react'
```

### Barrel File Caution

```typescript
// ❌ Barrel files can prevent tree shaking
// components/index.ts
export * from './button'
export * from './card'
export * from './modal'
export * from './heavy-chart'  // Always bundled!

// Usage imports everything
import { Button } from '@/components'

// ✅ Import directly from source
import { Button } from '@/components/ui/button'
```

### Package.json sideEffects

```json
// package.json
{
  "sideEffects": [
    "*.css",
    "*.scss"
  ]
}
```

## Analyzing Bundle Size

### Next.js Bundle Analyzer

```bash
npm install @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // your config
})
```

```bash
# Run analysis
ANALYZE=true npm run build
```

### Build Output Analysis

```bash
# Check build output
npm run build

# Look for:
# - First Load JS shared by all: should be < 100KB
# - Individual route sizes
# - Any unexpectedly large routes
```

## Reducing Bundle Size

### Replace Heavy Dependencies

| Heavy Library | Lighter Alternative | Savings |
|---------------|---------------------|---------|
| moment.js (300KB) | date-fns (tree-shakeable) | ~250KB |
| lodash (70KB) | lodash-es (tree-shakeable) | ~50KB |
| chart.js (200KB) | recharts (tree-shakeable) | Variable |
| uuid (9KB) | nanoid (2KB) | 7KB |

### Externalize Large Libraries

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  }
}
```

### Use Native APIs

```typescript
// ❌ Don't import for simple tasks
import { v4 as uuidv4 } from 'uuid'
const id = uuidv4()

// ✅ Use native crypto
const id = crypto.randomUUID()

// ❌ Don't import for formatting
import numeral from 'numeral'
numeral(1000).format('0,0')

// ✅ Use Intl API
new Intl.NumberFormat().format(1000)
```

## Client Component Optimization

### Minimize 'use client' Scope

```typescript
// ❌ Bad - entire file is client
'use client'

export default function ProjectPage({ project }) {
  const [isEditing, setIsEditing] = useState(false)
  
  return (
    <div>
      <h1>{project.name}</h1>           {/* Could be server */}
      <p>{project.description}</p>       {/* Could be server */}
      <ProjectStats project={project} /> {/* Could be server */}
      
      <button onClick={() => setIsEditing(true)}>Edit</button>
      {isEditing && <EditModal />}
    </div>
  )
}

// ✅ Good - only interactive parts are client
// page.tsx (Server)
export default function ProjectPage({ project }) {
  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <ProjectStats project={project} />
      
      <EditButton project={project} />  {/* Only this is client */}
    </div>
  )
}

// edit-button.tsx (Client)
'use client'
export function EditButton({ project }) {
  const [isEditing, setIsEditing] = useState(false)
  return (
    <>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      {isEditing && <EditModal project={project} />}
    </>
  )
}
```

### Lazy Load Modals & Dialogs

```typescript
'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

// Only load modal when opened
const CreateProjectModal = dynamic(
  () => import('./create-project-modal'),
  { ssr: false }
)

export function CreateProjectButton() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Create Project
      </button>
      
      {/* Modal JS only loads when isOpen becomes true */}
      {isOpen && (
        <CreateProjectModal 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  )
}
```

## Third-Party Scripts

### Load Scripts Efficiently

```typescript
import Script from 'next/script'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        
        {/* Load after page is interactive */}
        <Script
          src="https://analytics.example.com/script.js"
          strategy="afterInteractive"
        />
        
        {/* Load when browser is idle */}
        <Script
          src="https://widget.example.com/widget.js"
          strategy="lazyOnload"
        />
        
        {/* Critical scripts only */}
        <Script
          src="https://critical.example.com/critical.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  )
}
```

### Self-Host Critical Scripts

```typescript
// ❌ External request
<Script src="https://cdn.example.com/analytics.js" />

// ✅ Self-hosted (faster, more reliable)
<Script src="/scripts/analytics.js" />
```

## Compression

### Enable in Next.js

```javascript
// next.config.js
module.exports = {
  compress: true,  // gzip compression (default: true)
}
```

### Verify Headers

```bash
# Check compression is working
curl -I -H "Accept-Encoding: gzip" https://yoursite.com

# Should see: content-encoding: gzip
```

## Performance Budget

### Set Limits

```javascript
// next.config.js
module.exports = {
  experimental: {
    // Warn if page exceeds limits
    largePageDataBytes: 128 * 1000,  // 128KB
  }
}
```

### CI Performance Checks

```yaml
# .github/workflows/bundle-check.yml
name: Bundle Size Check

on: [pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      
      - name: Check bundle size
        run: |
          FIRST_LOAD=$(cat .next/build-manifest.json | jq '.pages["/"].reduce(0; . + .size)')
          if [ "$FIRST_LOAD" -gt 100000 ]; then
            echo "Bundle too large: $FIRST_LOAD bytes"
            exit 1
          fi
```

## Anti-Patterns

### ❌ Importing in Loops

```typescript
// ❌ Bad - dynamic import in render
function Icons({ names }) {
  return names.map(name => {
    const Icon = dynamic(() => import(`lucide-react`).then(m => m[name]))
    return <Icon key={name} />
  })
}

// ✅ Good - static imports
import { Home, Settings, User } from 'lucide-react'

const iconMap = { Home, Settings, User }

function Icons({ names }) {
  return names.map(name => {
    const Icon = iconMap[name]
    return Icon ? <Icon key={name} /> : null
  })
}
```

### ❌ Dev Dependencies in Production

```json
// package.json
{
  "dependencies": {
    // ❌ These should be devDependencies
    "prettier": "^3.0.0",
    "eslint": "^8.0.0"
  },
  "devDependencies": {
    // ✅ Correct placement
    "prettier": "^3.0.0",
    "eslint": "^8.0.0"
  }
}
```

### ❌ Synchronous Imports for Optional Features

```typescript
// ❌ Bad - always loads heavy library
import { PDFDocument } from 'pdf-lib'

function ExportButton() {
  const handleExport = () => {
    // pdf-lib bundled even if never used
  }
}

// ✅ Good - load only when needed
function ExportButton() {
  const handleExport = async () => {
    const { PDFDocument } = await import('pdf-lib')
    // pdf-lib loaded only when export clicked
  }
}
```