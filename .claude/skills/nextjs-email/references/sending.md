# Sending Emails

## Basic Sending

```typescript
import { resend } from '@/lib/email/resend'
import { WelcomeEmail } from '@/emails/welcome'

await resend.emails.send({
  from: 'Your App <noreply@yourapp.com>',
  to: 'user@example.com',
  subject: 'Welcome!',
  react: WelcomeEmail({ name: 'John' }),
})
```

## Email Service Pattern

```typescript
// src/lib/email/index.ts
import { resend } from './resend'
import { WelcomeEmail } from '@/emails/welcome'
import { PasswordResetEmail } from '@/emails/password-reset'
import { InvoiceEmail } from '@/emails/invoice'
import { TeamInviteEmail } from '@/emails/team-invite'

const from = process.env.EMAIL_FROM!
const appUrl = process.env.NEXT_PUBLIC_APP_URL!

export const emailService = {
  // Authentication emails
  async sendWelcome(to: string, name: string) {
    return resend.emails.send({
      from,
      to,
      subject: 'Welcome to Our Platform!',
      react: WelcomeEmail({ name, loginUrl: `${appUrl}/login` }),
    })
  },

  async sendPasswordReset(to: string, token: string) {
    const resetUrl = `${appUrl}/reset-password?token=${token}`
    return resend.emails.send({
      from,
      to,
      subject: 'Reset Your Password',
      react: PasswordResetEmail({ resetUrl }),
    })
  },

  async sendEmailVerification(to: string, token: string) {
    const verifyUrl = `${appUrl}/verify-email?token=${token}`
    return resend.emails.send({
      from,
      to,
      subject: 'Verify Your Email',
      react: EmailVerificationEmail({ verifyUrl }),
    })
  },

  // Team emails
  async sendTeamInvite(to: string, inviterName: string, teamName: string, inviteUrl: string) {
    return resend.emails.send({
      from,
      to,
      subject: `${inviterName} invited you to join ${teamName}`,
      react: TeamInviteEmail({ inviterName, teamName, inviteUrl }),
    })
  },

  // Billing emails
  async sendInvoice(to: string, invoice: InvoiceData) {
    return resend.emails.send({
      from,
      to,
      subject: `Invoice #${invoice.id}`,
      react: InvoiceEmail(invoice),
    })
  },

  async sendPaymentFailed(to: string, retryUrl: string) {
    return resend.emails.send({
      from,
      to,
      subject: 'Payment Failed - Action Required',
      react: PaymentFailedEmail({ retryUrl }),
    })
  },

  // Generic notification
  async sendNotification(to: string, subject: string, message: string, actionUrl?: string) {
    return resend.emails.send({
      from,
      to,
      subject,
      react: NotificationEmail({ message, actionUrl }),
    })
  },
}
```

## Sending from Server Actions

```typescript
// src/actions/auth-actions.ts
'use server'

import { emailService } from '@/lib/email'
import { userRepository } from '@/repositories/user-repository'
import { generateResetToken } from '@/lib/auth/tokens'

export async function requestPasswordResetAction(email: string) {
  const user = await userRepository.findByEmail(email)
  
  // Don't reveal if user exists
  if (!user) {
    return { success: true }
  }

  const token = await generateResetToken(user.id)
  await emailService.sendPasswordReset(email, token)

  return { success: true }
}
```

## Sending from Webhooks

```typescript
// src/app/api/webhooks/clerk/route.ts
import { emailService } from '@/lib/email'

async function handleUserCreated(data: ClerkUserData) {
  await emailService.sendWelcome(
    data.email_addresses[0].email_address,
    data.first_name || 'there'
  )
}
```

```typescript
// src/app/api/webhooks/stripe/route.ts
import { emailService } from '@/lib/email'

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (invoice.customer_email) {
    await emailService.sendInvoice(invoice.customer_email, {
      id: invoice.number!,
      amount: invoice.amount_paid / 100,
      date: new Date(invoice.created * 1000),
      items: invoice.lines.data.map(line => ({
        description: line.description!,
        amount: line.amount / 100,
      })),
    })
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (invoice.customer_email) {
    const retryUrl = `${process.env.NEXT_PUBLIC_APP_URL}/billing`
    await emailService.sendPaymentFailed(invoice.customer_email, retryUrl)
  }
}
```

## Multiple Recipients

```typescript
// CC and BCC
await resend.emails.send({
  from,
  to: 'primary@example.com',
  cc: ['cc1@example.com', 'cc2@example.com'],
  bcc: 'admin@yourapp.com',
  subject: 'Important Update',
  react: UpdateEmail({ content }),
})
```

## Reply-To

```typescript
await resend.emails.send({
  from: 'Your App <noreply@yourapp.com>',
  replyTo: 'support@yourapp.com',
  to: 'user@example.com',
  subject: 'Your Support Ticket',
  react: SupportTicketEmail({ ticketId }),
})
```

## Attachments

```typescript
// PDF attachment
await resend.emails.send({
  from,
  to,
  subject: 'Your Invoice',
  react: InvoiceEmail(invoice),
  attachments: [
    {
      filename: `invoice-${invoice.id}.pdf`,
      content: pdfBuffer, // Buffer
    },
  ],
})

// From URL
await resend.emails.send({
  from,
  to,
  subject: 'Your Report',
  react: ReportEmail({ reportId }),
  attachments: [
    {
      filename: 'report.pdf',
      path: 'https://yourapp.com/reports/123.pdf',
    },
  ],
})
```

## Batch Sending

```typescript
// Send to multiple recipients with personalization
const emails = users.map(user => ({
  from,
  to: user.email,
  subject: 'Weekly Digest',
  react: WeeklyDigestEmail({ 
    name: user.name,
    stats: user.weeklyStats,
  }),
}))

await resend.batch.send(emails)
```

## Scheduled Sending

```typescript
// Send at specific time (Resend feature)
await resend.emails.send({
  from,
  to,
  subject: 'Reminder',
  react: ReminderEmail({ event }),
  scheduledAt: new Date('2024-12-25T09:00:00Z').toISOString(),
})
```

## Error Handling

```typescript
export const emailService = {
  async sendWelcome(to: string, name: string) {
    try {
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject: 'Welcome!',
        react: WelcomeEmail({ name }),
      })

      if (error) {
        console.error('Failed to send welcome email:', error)
        // Don't throw - email failure shouldn't block signup
        return { success: false, error }
      }

      return { success: true, messageId: data?.id }
    } catch (error) {
      console.error('Email service error:', error)
      return { success: false, error }
    }
  },
}
```

## Testing in Development

```typescript
// src/lib/email/index.ts
const isDev = process.env.NODE_ENV === 'development'

export const emailService = {
  async sendWelcome(to: string, name: string) {
    if (isDev) {
      console.log('📧 Would send welcome email to:', to)
      console.log('   Name:', name)
      return { success: true, messageId: 'dev-mode' }
    }

    return resend.emails.send({
      from,
      to,
      subject: 'Welcome!',
      react: WelcomeEmail({ name }),
    })
  },
}
```

## Rate Limiting

```typescript
// Resend has built-in rate limits
// Free: 100 emails/day, 1 email/second
// Pro: 50,000 emails/month

// For high-volume, use queue (see background-jobs skill)
import { inngest } from '@/lib/inngest'

export const emailService = {
  async sendBulkEmails(emails: EmailData[]) {
    // Queue each email as a background job
    for (const email of emails) {
      await inngest.send({
        name: 'email/send',
        data: email,
      })
    }
  },
}
```