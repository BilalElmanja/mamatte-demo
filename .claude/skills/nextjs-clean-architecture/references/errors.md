# Error Handling Strategy

## Table of Contents
- [Custom Error Classes](#custom-error-classes)
- [Error Handling by Layer](#error-handling-by-layer)
- [Action Error Handler](#action-error-handler)
- [Action Result Type](#action-result-type)

## Custom Error Classes

```typescript
// src/lib/utils/errors.ts

// Base error class
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

// Layer-specific errors
export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super('VALIDATION_ERROR', message, 400)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super('UNAUTHORIZED', message, 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Permission denied') {
    super('FORBIDDEN', message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super('NOT_FOUND', `${resource} not found`, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', message, 409)
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super('RATE_LIMITED', message, 429)
  }
}

// Service layer errors
export class ServiceError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 400)
  }
}

// Action layer errors
export class ActionError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 400)
  }
}
```

## Error Handling by Layer

| Layer | Error Type | Handling |
|-------|------------|----------|
| **Pages** | Let errors bubble to error.tsx | Catch known errors for UX |
| **Components** | Display error states via props | Never throw |
| **Actions** | Return `ActionResult` | Never throw to client |
| **Services** | Throw `ServiceError` | Catch in actions |
| **Repositories** | Throw database errors | Catch in services |
| **Lib** | Throw specific errors | Catch in services |

## Action Error Handler

```typescript
// src/lib/utils/errors.ts

import { z } from 'zod'
import { logger } from './logger'

export function handleActionError(error: unknown): ActionResult {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    }
  }

  if (error instanceof z.ZodError) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: error.flatten().fieldErrors,
      },
    }
  }

  // Log unexpected errors
  logger.error('Unexpected error in action', { error })

  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  }
}
```

## Action Result Type

```typescript
// src/lib/utils/errors.ts

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: ActionErrorResponse }

export interface ActionErrorResponse {
  code: string
  message: string
  details?: Record<string, string[]>
}
```

## Usage Example

```typescript
// In component
const result = await createProjectAction(formData)

if (!result.success) {
  if (result.error.code === 'VALIDATION_ERROR' && result.error.details) {
    // Show field-level errors
    setFieldErrors(result.error.details)
  } else {
    // Show general error toast
    toast.error(result.error.message)
  }
  return
}

// Success - use result.data
toast.success('Project created!')
router.push(`/projects/${result.data.id}`)
```