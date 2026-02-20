# Clerk Webhooks - Syncing Users to Database

## Table of Contents
- [Setup](#setup)
- [Webhook Handler](#webhook-handler)
- [User Events](#user-events)
- [Database Schema](#database-schema)
- [Testing Webhooks](#testing-webhooks)

## Setup

### 1. Install Svix (Webhook Verification)

```bash
npm install svix
```

### 2. Get Webhook Secret

1. Go to Clerk Dashboard → Webhooks
2. Create new endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy the signing secret

### 3. Add Environment Variable

```env
# .env.local
CLERK_WEBHOOK_SECRET=whsec_...
```

### 4. Add to Public Routes (Middleware)

```typescript
// middleware.ts
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',  // Important: webhooks must be public
])
```

## Webhook Handler

### Complete Handler

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env')
  }

  // Get headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  // Handle events
  try {
    switch (evt.type) {
      case 'user.created':
        await handleUserCreated(evt.data)
        break
      case 'user.updated':
        await handleUserUpdated(evt.data)
        break
      case 'user.deleted':
        await handleUserDeleted(evt.data)
        break
      default:
        console.log(`Unhandled event type: ${evt.type}`)
    }

    return new Response('Webhook processed', { status: 200 })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return new Response('Webhook handler failed', { status: 500 })
  }
}

// Event handlers
async function handleUserCreated(data: any) {
  const { id, email_addresses, first_name, last_name, image_url } = data

  await prisma.user.create({
    data: {
      clerkId: id,
      email: email_addresses[0]?.email_address ?? '',
      name: `${first_name ?? ''} ${last_name ?? ''}`.trim() || null,
      imageUrl: image_url,
    },
  })

  console.log(`User created: ${id}`)
}

async function handleUserUpdated(data: any) {
  const { id, email_addresses, first_name, last_name, image_url } = data

  await prisma.user.update({
    where: { clerkId: id },
    data: {
      email: email_addresses[0]?.email_address ?? '',
      name: `${first_name ?? ''} ${last_name ?? ''}`.trim() || null,
      imageUrl: image_url,
    },
  })

  console.log(`User updated: ${id}`)
}

async function handleUserDeleted(data: any) {
  const { id } = data

  // Option 1: Hard delete
  await prisma.user.delete({
    where: { clerkId: id },
  })

  // Option 2: Soft delete (recommended)
  // await prisma.user.update({
  //   where: { clerkId: id },
  //   data: { deletedAt: new Date() },
  // })

  console.log(`User deleted: ${id}`)
}
```

## User Events

### Available Events

| Event | Trigger |
|-------|---------|
| `user.created` | New user signs up |
| `user.updated` | User updates profile |
| `user.deleted` | User deletes account |

### Event Data Structure

```typescript
// user.created / user.updated
interface UserEventData {
  id: string                    // Clerk user ID
  first_name: string | null
  last_name: string | null
  image_url: string
  email_addresses: Array<{
    id: string
    email_address: string
  }>
  public_metadata: Record<string, any>
  private_metadata: Record<string, any>
  created_at: number            // Unix timestamp
  updated_at: number
}
```

## Database Schema

### Prisma Schema

```prisma
// prisma/schema.prisma

model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  name      String?
  imageUrl  String?
  role      String   @default("user")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?  // For soft delete
  
  // Relations
  projects     Project[]
  
  @@index([clerkId])
  @@index([email])
}
```

## Testing Webhooks

### Local Development with ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start your Next.js app
npm run dev

# In another terminal, expose localhost
ngrok http 3000
```

Use the ngrok URL in Clerk Dashboard: `https://abc123.ngrok.io/api/webhooks/clerk`

### Clerk Dashboard Testing

1. Go to Clerk Dashboard → Webhooks
2. Select your endpoint
3. Click "Send test webhook"
4. Select event type and send