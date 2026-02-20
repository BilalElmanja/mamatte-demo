# SaaS Data Models

## Table of Contents
- [User Model](#user-model)
- [Team/Organization Model](#teamorganization-model)
- [Subscription Model](#subscription-model)
- [Complete SaaS Schema](#complete-saas-schema)

## User Model

### Basic User with Auth Provider

```prisma
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  name      String?
  imageUrl  String?
  role      String   @default("user")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  projects    Project[]
  memberships Membership[]
  
  @@index([clerkId])
}
```

## Team/Organization Model

### Team with Memberships

```prisma
model Team {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  imageUrl    String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  members     Membership[]
  projects    Project[]
  subscription Subscription?
  
  @@index([slug])
}

model Membership {
  id        String   @id @default(cuid())
  userId    String
  teamId    String
  role      String   @default("member")  // owner, admin, member
  
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  team      Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  
  @@unique([userId, teamId])
  @@index([userId])
  @@index([teamId])
}
```

## Subscription Model

### Stripe Integration

```prisma
model Subscription {
  id                   String    @id @default(cuid())
  teamId               String    @unique
  team                 Team      @relation(fields: [teamId], references: [id], onDelete: Cascade)
  
  // Stripe fields
  stripeCustomerId     String    @unique
  stripeSubscriptionId String?   @unique
  stripePriceId        String?
  
  // Status
  status               String    @default("inactive")  // active, canceled, past_due
  plan                 String    @default("free")      // free, pro, enterprise
  
  // Billing period
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  cancelAtPeriodEnd    Boolean   @default(false)
  
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  
  @@index([stripeCustomerId])
  @@index([status])
}
```

## Complete SaaS Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============== USERS ==============

model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  name      String?
  imageUrl  String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  memberships Membership[]
  projects    Project[]
  
  @@index([clerkId])
  @@index([email])
}

// ============== TEAMS ==============

model Team {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  imageUrl  String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  members      Membership[]
  projects     Project[]
  subscription Subscription?
  invites      Invite[]
  
  @@index([slug])
}

model Membership {
  id        String   @id @default(cuid())
  role      String   @default("member")
  
  userId    String
  teamId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  team      Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([userId, teamId])
  @@index([userId])
  @@index([teamId])
}

model Invite {
  id        String   @id @default(cuid())
  email     String
  role      String   @default("member")
  token     String   @unique @default(cuid())
  
  teamId    String
  team      Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  @@unique([teamId, email])
  @@index([token])
  @@index([email])
}

// ============== BILLING ==============

model Subscription {
  id                   String    @id @default(cuid())
  
  teamId               String    @unique
  team                 Team      @relation(fields: [teamId], references: [id], onDelete: Cascade)
  
  stripeCustomerId     String    @unique
  stripeSubscriptionId String?   @unique
  stripePriceId        String?
  
  status               String    @default("inactive")
  plan                 String    @default("free")
  
  currentPeriodStart   DateTime?
  currentPeriodEnd     DateTime?
  cancelAtPeriodEnd    Boolean   @default(false)
  
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  
  @@index([stripeCustomerId])
}

// ============== PROJECTS ==============

model Project {
  id          String    @id @default(cuid())
  name        String
  description String?
  slug        String
  
  ownerId     String
  owner       User      @relation(fields: [ownerId], references: [id])
  
  teamId      String?
  team        Team?     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?
  
  tasks       Task[]
  
  @@unique([teamId, slug])
  @@index([ownerId])
  @@index([teamId])
}

model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      String    @default("todo")
  priority    Int       @default(0)
  dueDate     DateTime?
  
  projectId   String
  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([projectId])
  @@index([status])
}
```

## Query Examples

### Get User with Teams

```typescript
const user = await prisma.user.findUnique({
  where: { clerkId },
  include: {
    memberships: {
      include: {
        team: {
          include: { subscription: true },
        },
      },
    },
  },
})
```

### Get Team with Members

```typescript
const team = await prisma.team.findUnique({
  where: { slug: teamSlug },
  include: {
    members: {
      include: {
        user: { select: { id: true, name: true, email: true, imageUrl: true } },
      },
    },
    subscription: true,
  },
})
```

### Check Team Access

```typescript
const membership = await prisma.membership.findUnique({
  where: {
    userId_teamId: { userId, teamId },
  },
})

if (!membership) throw new Error('Not a team member')
if (membership.role !== 'owner' && membership.role !== 'admin') {
  throw new Error('Insufficient permissions')
}
```