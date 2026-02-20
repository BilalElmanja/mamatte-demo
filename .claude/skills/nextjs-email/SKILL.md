---
name: nextjs-email
description: "Transactional email for Next.js applications using React Email and Resend. Use when sending welcome emails, password resets, invoices, notifications, or any automated emails. Covers email templates, sending patterns, and email service integration."
---

# Next.js Email with React Email & Resend

## When to Read Which Reference

| Task | Read This |
|------|-----------|
| Initial setup | This file (Quick Start below) |
| Creating email templates | [references/templates.md](references/templates.md) |
| Sending emails | [references/sending.md](references/sending.md) |
| Common email templates | [references/common-templates.md](references/common-templates.md) |

## Quick Start

### 1. Install

```bash
npm install resend @react-email/components react-email
```

### 2. Environment Variables

```env
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
```

### 3. Create Resend Client

```typescript
// src/lib/email/resend.ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
```

### 4. Create Email Template

```typescript
// src/emails/welcome.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'

interface WelcomeEmailProps {
  name: string
  loginUrl: string
}

export function WelcomeEmail({ name, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome, {name}!</Heading>
          <Text style={text}>
            Thanks for signing up. We're excited to have you on board.
          </Text>
          <Link href={loginUrl} style={button}>
            Get Started
          </Link>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#f6f9fc', padding: '40px 0' }
const container = { backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px' }
const h1 = { color: '#1a1a1a', fontSize: '24px' }
const text = { color: '#4a4a4a', fontSize: '16px', lineHeight: '24px' }
const button = {
  backgroundColor: '#000',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  display: 'inline-block',
}
```

### 5. Send Email

```typescript
// src/lib/email/index.ts
import { resend } from './resend'
import { WelcomeEmail } from '@/emails/welcome'

export const emailService = {
  async sendWelcome(to: string, name: string) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject: 'Welcome to Our Platform!',
      react: WelcomeEmail({ name, loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login` }),
    })
  },
}
```

## Clean Architecture Integration

```
┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION: Email preview pages (development)             │
│ Location: src/app/(dev)/emails/                             │
├─────────────────────────────────────────────────────────────┤
│ APPLICATION: Webhook handlers trigger emails                │
│ Location: src/app/api/webhooks/                             │
├─────────────────────────────────────────────────────────────┤
│ DOMAIN: Email service (when to send, business logic)        │
│ Location: src/services/email-service.ts                     │
├─────────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE: Resend client, email templates              │
│ Location: src/lib/email/, src/emails/                       │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/
├── emails/                         # React Email templates
│   ├── components/                 # Shared email components
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   └── button.tsx
│   ├── welcome.tsx
│   ├── password-reset.tsx
│   ├── invoice.tsx
│   └── notification.tsx
├── lib/
│   └── email/
│       ├── resend.ts              # Resend client
│       └── index.ts               # Email sending functions
├── services/
│   └── notification-service.ts    # Business logic for notifications
└── app/
    └── api/webhooks/
        └── clerk/route.ts         # Trigger welcome email on signup
```

## Email Service (Infrastructure Layer)

```typescript
// src/lib/email/index.ts
import { resend } from './resend'
import { WelcomeEmail } from '@/emails/welcome'
import { PasswordResetEmail } from '@/emails/password-reset'
import { InvoiceEmail } from '@/emails/invoice'

const from = process.env.EMAIL_FROM!
const appUrl = process.env.NEXT_PUBLIC_APP_URL!

export const emailService = {
  async sendWelcome(to: string, name: string) {
    return resend.emails.send({
      from,
      to,
      subject: 'Welcome to Our Platform!',
      react: WelcomeEmail({ name, loginUrl: `${appUrl}/login` }),
    })
  },

  async sendPasswordReset(to: string, resetUrl: string) {
    return resend.emails.send({
      from,
      to,
      subject: 'Reset Your Password',
      react: PasswordResetEmail({ resetUrl }),
    })
  },

  async sendInvoice(to: string, invoice: { id: string; amount: number; date: Date }) {
    return resend.emails.send({
      from,
      to,
      subject: `Invoice #${invoice.id}`,
      react: InvoiceEmail(invoice),
    })
  },

  async sendNotification(to: string, subject: string, message: string) {
    return resend.emails.send({
      from,
      to,
      subject,
      text: message,
    })
  },
}
```

## Triggering Emails from Webhooks

```typescript
// src/app/api/webhooks/clerk/route.ts
import { emailService } from '@/lib/email'

async function handleUserCreated(data: any) {
  const { email_addresses, first_name } = data
  const email = email_addresses[0]?.email_address
  const name = first_name || 'there'

  // Send welcome email
  await emailService.sendWelcome(email, name)
}
```

## Preview Emails in Development

```json
// package.json
{
  "scripts": {
    "email:dev": "email dev --dir src/emails"
  }
}
```

```bash
npm run email:dev
# Opens http://localhost:3000 with email previews
```

## Email with Attachments

```typescript
await resend.emails.send({
  from,
  to,
  subject: 'Your Invoice',
  react: InvoiceEmail(invoice),
  attachments: [
    {
      filename: 'invoice.pdf',
      content: pdfBuffer,
    },
  ],
})
```

## Batch Sending

```typescript
// Send to multiple recipients
await resend.batch.send([
  {
    from,
    to: 'user1@example.com',
    subject: 'Newsletter',
    react: NewsletterEmail({ content }),
  },
  {
    from,
    to: 'user2@example.com',
    subject: 'Newsletter',
    react: NewsletterEmail({ content }),
  },
])
```

## Key Rules

1. **Email templates in `src/emails/`** - React components
2. **Resend client in `lib/email/`** - Infrastructure layer
3. **Trigger emails from webhooks or services** - Not from components
4. **Use React Email components** - Consistent rendering
5. **Preview in development** - Use `email dev` command