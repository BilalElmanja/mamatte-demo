# /optimize

## Command Description
Use this command to optimize performance. Claude will help identify bottlenecks and implement improvements.

---

## Conversation Flow

When the user types `/optimize`, respond with:

---

### Step 1: Performance Issue

> **Let's optimize! What's running slow?**
>
> - [ ] **Page load** - Specific page: ___
> - [ ] **API response** - Specific endpoint: ___
> - [ ] **Database query** - Specific operation: ___
> - [ ] **Component render** - Specific component: ___
> - [ ] **Bundle size** - JS/CSS too large
> - [ ] **Background job** - Specific job: ___
> - [ ] **General** - Overall app feels slow

Wait for response, then:

---

### Step 2: Current Metrics

> **What are the current metrics?**
>
> - Response time: ___ ms *(or "unknown")*
> - Database queries: ___ *(or "unknown")*
> - Bundle size: ___ KB *(or "unknown")*
>
> *How did you measure this?*
> - [ ] Browser DevTools
> - [ ] Vercel Analytics
> - [ ] Custom logging
> - [ ] User reports
> - [ ] Just feels slow

Wait for response, then:

---

### Step 3: Target Metrics

> **What's your performance goal?**
>
> - Target response time: ___ ms
> - Target bundle size: ___ KB
> - Or: "Just make it faster"

Wait for response, then:

---

### Step 4: Investigation

> **I'll investigate the performance issue:**
>
> **For slow pages:**
> - Check data fetching patterns
> - Look for N+1 queries
> - Review component re-renders
> - Check bundle impact
>
> **For slow APIs:**
> - Profile database queries
> - Check for missing indexes
> - Review service logic
>
> **For large bundles:**
> - Analyze with `next build`
> - Check for large dependencies
> - Review dynamic imports
>
> *Investigating...*

*[Claude analyzes code]*

---

### Step 5: Findings & Recommendations

> **📊 Performance Analysis**
>
> **Issue:** [what's slow]
> **Root cause:** [why it's slow]
>
> **Optimizations to apply:**
>
> | Optimization | Impact | Effort |
> |--------------|--------|--------|
> | [optimization 1] | High | Low |
> | [optimization 2] | Medium | Medium |
>
> **Recommended changes:**
>
> 1. **[Change 1]**
>    - Current: [how it works now]
>    - Optimized: [how it should work]
>    - Expected improvement: [X% faster]
>
> 2. **[Change 2]**
>    - ...
>
> **Should I implement these optimizations?**

Wait for confirmation, then implement.

---

## Common Optimizations

### Database - Add Index
```prisma
model Project {
  // Add index for common queries
  @@index([ownerId])
  @@index([createdAt])
}
```

### Database - Select Specific Fields
```typescript
// ❌ Slow - fetches all fields
const users = await prisma.user.findMany()

// ✅ Fast - only needed fields
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true }
})
```

### Database - Avoid N+1
```typescript
// ❌ N+1 queries
const projects = await prisma.project.findMany()
for (const p of projects) {
  p.owner = await prisma.user.findUnique({ where: { id: p.ownerId }})
}

// ✅ Single query with include
const projects = await prisma.project.findMany({
  include: { owner: true }
})
```

### Component - Lazy Loading
```typescript
// ❌ Loaded immediately
import { HeavyChart } from './heavy-chart'

// ✅ Loaded when needed
const HeavyChart = dynamic(() => import('./heavy-chart'), {
  loading: () => <Skeleton />
})
```

### Component - Memoization
```typescript
// ❌ Re-renders every time
function ExpensiveList({ items }) {
  return items.map(item => <ExpensiveItem item={item} />)
}

// ✅ Only re-renders when items change
const ExpensiveList = memo(function ExpensiveList({ items }) {
  return items.map(item => <ExpensiveItem key={item.id} item={item} />)
})
```