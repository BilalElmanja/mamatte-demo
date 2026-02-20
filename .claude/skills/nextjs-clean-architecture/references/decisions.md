# Decision Framework

## Table of Contents
- [Where Does This Code Go?](#where-does-this-code-go)
- [Server Action vs API Route](#server-action-vs-api-route)
- [Server vs Client Component](#server-vs-client-component)
- [Data Flow Patterns](#data-flow-patterns)
- [Naming Conventions](#naming-conventions)

## Where Does This Code Go?

```
Is it UI/presentation?
├── Yes → Is it page-specific?
│   ├── Yes → _components/ (co-located)
│   └── No → components/ (shared)
└── No → Is it a mutation or data operation?
    ├── Yes → Action or API Route
    └── No → Is it business rule?
        ├── Yes → Service
        └── No → Lib or Repository
```

### Quick Reference

| Code Type | Location |
|-----------|----------|
| Page-specific UI | `app/[route]/_components/` |
| Shared UI | `components/` |
| Form mutations | `actions/` or co-located `actions.ts` |
| Webhook handlers | `app/api/webhooks/` |
| Business rules | `services/` |
| Database queries | `repositories/` |
| External API wrappers | `lib/` |
| Type definitions | `types/` |
| Utility functions | `lib/utils/` |

## Server Action vs API Route

| Scenario | Server Action | API Route |
|----------|--------------|-----------|
| Form submission | ✅ | ❌ |
| Button click mutation | ✅ | ❌ |
| Optimistic update | ✅ | ❌ |
| External webhook | ❌ | ✅ |
| Public API endpoint | ❌ | ✅ |
| Third-party OAuth callback | ❌ | ✅ |
| File upload | ❌ | ✅ |
| Streaming response | ❌ | ✅ |

### Decision Logic

```
Is it triggered by user action in your app?
├── Yes → Server Action
└── No → Is it from external service?
    ├── Yes → API Route (webhook)
    └── No → Is it a public API?
        ├── Yes → API Route
        └── No → Server Action
```

## Server vs Client Component

| Scenario | Server | Client |
|----------|--------|--------|
| Static content | ✅ | ❌ |
| Data fetching | ✅ | ❌ |
| Access backend resources | ✅ | ❌ |
| Sensitive logic | ✅ | ❌ |
| SEO-critical content | ✅ | ❌ |
| Interactive UI | ❌ | ✅ |
| Event listeners (onClick, etc.) | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| useState, useEffect | ❌ | ✅ |
| Animations | ❌ | ✅ |

### Decision Logic

```
Does it need interactivity (state, events, effects)?
├── Yes → Client Component
└── No → Does it fetch data or access backend?
    ├── Yes → Server Component
    └── No → Default to Server Component
```

### Composition Pattern

```tsx
// Server Component (default)
export default async function ProjectPage({ params }) {
  const project = await projectService.getById(params.id)
  
  return (
    <div>
      <h1>{project.name}</h1>
      {/* Interactive parts are Client Components */}
      <ProjectActions projectId={project.id} />
    </div>
  )
}

// Client Component (only what needs interactivity)
'use client'
export function ProjectActions({ projectId }) {
  const [isDeleting, setIsDeleting] = useState(false)
  
  const handleDelete = async () => {
    setIsDeleting(true)
    await deleteProjectAction(projectId)
  }
  
  return <Button onClick={handleDelete} loading={isDeleting}>Delete</Button>
}
```

## Data Flow Patterns

### Read Flow (Server Component)

```
Page (Server) → Service → Repository → DB
     ↓
Component (Props)
```

### Write Flow (Server Action)

```
Component (Client) → Action → Service → Repository → DB
                       ↓
                   Validate + Auth
```

### Webhook Flow

```
External Service → API Route → Service → Repository → DB
                       ↓
                   Verify + Validate
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProjectCard.tsx` |
| Pages | lowercase | `page.tsx` |
| Hooks | camelCase with `use-` | `use-projects.ts` |
| Actions | kebab-case with `-actions` | `project-actions.ts` |
| Services | kebab-case with `-service` | `project-service.ts` |
| Repositories | kebab-case with `-repository` | `project-repository.ts` |
| Lib modules | kebab-case | `stripe.ts` |
| Types | kebab-case | `project.ts` |
| Utilities | kebab-case | `rate-limit.ts` |

### Function Naming

| Type | Pattern | Example |
|------|---------|---------|
| Action | `{verb}{Entity}Action` | `createProjectAction` |
| Service method | `{verb}` | `create`, `update`, `delete` |
| Repository query | `findBy{Criteria}` | `findByUserId` |
| Repository count | `countBy{Criteria}` | `countByUserId` |
| Authorization | `canUser{Action}` | `canUserModify` |
| Hook | `use{Entity}` | `useProjects` |