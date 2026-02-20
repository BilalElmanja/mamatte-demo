# Common Email Templates

## Welcome Email

```typescript
// src/emails/welcome.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
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
      <Preview>Welcome to Our Platform - Get started today!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
            width="120"
            height="40"
            alt="Logo"
            style={logo}
          />
          
          <Heading style={h1}>Welcome, {name}!</Heading>
          
          <Text style={text}>
            Thank you for signing up. We're thrilled to have you on board.
          </Text>
          
          <Text style={text}>
            Here are a few things you can do to get started:
          </Text>
          
          <ul style={list}>
            <li style={listItem}>Complete your profile</li>
            <li style={listItem}>Create your first project</li>
            <li style={listItem}>Invite your team members</li>
          </ul>
          
          <Section style={buttonContainer}>
            <Button href={loginUrl} style={button}>
              Get Started
            </Button>
          </Section>
          
          <Text style={footer}>
            If you have any questions, reply to this email or visit our{' '}
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/help`} style={link}>
              Help Center
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#f6f9fc', padding: '40px 0' }
const container = { backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }
const logo = { margin: '0 auto 24px', display: 'block' }
const h1 = { color: '#1a1a1a', fontSize: '24px', fontWeight: 'bold', margin: '0 0 24px', textAlign: 'center' as const }
const text = { color: '#4a4a4a', fontSize: '16px', lineHeight: '24px', margin: '0 0 16px' }
const list = { color: '#4a4a4a', fontSize: '16px', lineHeight: '24px', paddingLeft: '24px' }
const listItem = { marginBottom: '8px' }
const buttonContainer = { textAlign: 'center' as const, margin: '32px 0' }
const button = { backgroundColor: '#000', color: '#fff', padding: '12px 32px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }
const footer = { color: '#8898aa', fontSize: '14px', marginTop: '32px' }
const link = { color: '#000', textDecoration: 'underline' }
```

## Password Reset Email

```typescript
// src/emails/password-reset.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface PasswordResetEmailProps {
  resetUrl: string
}

export function PasswordResetEmail({ resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset Your Password</Heading>
          
          <Text style={text}>
            We received a request to reset your password. Click the button below to create a new password.
          </Text>
          
          <Section style={buttonContainer}>
            <Button href={resetUrl} style={button}>
              Reset Password
            </Button>
          </Section>
          
          <Text style={text}>
            This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
          </Text>
          
          <Text style={muted}>
            If the button doesn't work, copy and paste this link into your browser:
          </Text>
          <Text style={urlText}>{resetUrl}</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#f6f9fc', padding: '40px 0' }
const container = { backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }
const h1 = { color: '#1a1a1a', fontSize: '24px', fontWeight: 'bold', margin: '0 0 24px' }
const text = { color: '#4a4a4a', fontSize: '16px', lineHeight: '24px', margin: '0 0 16px' }
const buttonContainer = { textAlign: 'center' as const, margin: '32px 0' }
const button = { backgroundColor: '#000', color: '#fff', padding: '12px 32px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }
const muted = { color: '#8898aa', fontSize: '14px', margin: '24px 0 8px' }
const urlText = { color: '#8898aa', fontSize: '12px', wordBreak: 'break-all' as const }
```

## Team Invite Email

```typescript
// src/emails/team-invite.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface TeamInviteEmailProps {
  inviterName: string
  teamName: string
  inviteUrl: string
}

export function TeamInviteEmail({ inviterName, teamName, inviteUrl }: TeamInviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{inviterName} invited you to join {teamName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You're Invited!</Heading>
          
          <Text style={text}>
            <strong>{inviterName}</strong> has invited you to join <strong>{teamName}</strong> on our platform.
          </Text>
          
          <Section style={buttonContainer}>
            <Button href={inviteUrl} style={button}>
              Accept Invitation
            </Button>
          </Section>
          
          <Text style={muted}>
            This invitation will expire in 7 days.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```

## Invoice Email

```typescript
// src/emails/invoice.tsx
import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'

interface InvoiceEmailProps {
  id: string
  date: Date
  amount: number
  items: Array<{ description: string; amount: number }>
  customerName: string
}

export function InvoiceEmail({ id, date, amount, items, customerName }: InvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Invoice #{id} - ${amount.toFixed(2)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Invoice #{id}</Heading>
          
          <Section style={infoSection}>
            <Row>
              <Column>
                <Text style={label}>Bill To</Text>
                <Text style={value}>{customerName}</Text>
              </Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={label}>Date</Text>
                <Text style={value}>{date.toLocaleDateString()}</Text>
              </Column>
            </Row>
          </Section>
          
          <Hr style={hr} />
          
          <Section>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column>
                  <Text style={itemText}>{item.description}</Text>
                </Column>
                <Column style={{ textAlign: 'right' }}>
                  <Text style={itemText}>${item.amount.toFixed(2)}</Text>
                </Column>
              </Row>
            ))}
          </Section>
          
          <Hr style={hr} />
          
          <Section>
            <Row>
              <Column>
                <Text style={totalLabel}>Total</Text>
              </Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={totalAmount}>${amount.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>
          
          <Text style={footer}>
            Thank you for your business!
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#f6f9fc', padding: '40px 0' }
const container = { backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }
const h1 = { color: '#1a1a1a', fontSize: '24px', fontWeight: 'bold', margin: '0 0 24px' }
const infoSection = { marginBottom: '24px' }
const label = { color: '#8898aa', fontSize: '12px', textTransform: 'uppercase' as const, margin: '0 0 4px' }
const value = { color: '#1a1a1a', fontSize: '16px', margin: '0' }
const hr = { borderColor: '#e6e6e6', margin: '24px 0' }
const itemRow = { marginBottom: '8px' }
const itemText = { color: '#4a4a4a', fontSize: '14px', margin: '0' }
const totalLabel = { color: '#1a1a1a', fontSize: '16px', fontWeight: 'bold', margin: '0' }
const totalAmount = { color: '#1a1a1a', fontSize: '24px', fontWeight: 'bold', margin: '0' }
const footer = { color: '#8898aa', fontSize: '14px', textAlign: 'center' as const, marginTop: '32px' }
```

## Notification Email

```typescript
// src/emails/notification.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface NotificationEmailProps {
  title: string
  message: string
  actionUrl?: string
  actionText?: string
}

export function NotificationEmail({ 
  title, 
  message, 
  actionUrl, 
  actionText = 'View Details' 
}: NotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{title}</Heading>
          <Text style={text}>{message}</Text>
          
          {actionUrl && (
            <Section style={buttonContainer}>
              <Button href={actionUrl} style={button}>
                {actionText}
              </Button>
            </Section>
          )}
        </Container>
      </Body>
    </Html>
  )
}
```

## Payment Failed Email

```typescript
// src/emails/payment-failed.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface PaymentFailedEmailProps {
  retryUrl: string
}

export function PaymentFailedEmail({ retryUrl }: PaymentFailedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Action required: Payment failed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Failed</Heading>
          
          <Text style={text}>
            We were unable to process your payment. To avoid any interruption to your service, please update your payment method.
          </Text>
          
          <Section style={buttonContainer}>
            <Button href={retryUrl} style={button}>
              Update Payment Method
            </Button>
          </Section>
          
          <Text style={muted}>
            If you believe this is an error, please contact our support team.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```