# Email Templates

## React Email Components

### Available Components

```typescript
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Link,
  Button,
  Img,
  Hr,
  Code,
  CodeBlock,
  CodeInline,
} from '@react-email/components'
```

## Base Template

```typescript
// src/emails/components/base-template.tsx
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from '@react-email/components'
import { Header } from './header'
import { Footer } from './footer'

interface BaseTemplateProps {
  preview: string
  children: React.ReactNode
}

export function BaseTemplate({ preview, children }: BaseTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Header />
          <Section style={content}>
            {children}
          </Section>
          <Footer />
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  padding: '20px 0 48px',
  borderRadius: '8px',
  maxWidth: '600px',
}

const content = {
  padding: '0 48px',
}
```

## Shared Components

### Header

```typescript
// src/emails/components/header.tsx
import { Img, Section } from '@react-email/components'

export function Header() {
  return (
    <Section style={header}>
      <Img
        src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
        width="120"
        height="40"
        alt="Logo"
      />
    </Section>
  )
}

const header = {
  padding: '24px 48px',
  borderBottom: '1px solid #e6e6e6',
}
```

### Footer

```typescript
// src/emails/components/footer.tsx
import { Hr, Link, Section, Text } from '@react-email/components'

export function Footer() {
  return (
    <Section style={footer}>
      <Hr style={hr} />
      <Text style={footerText}>
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </Text>
      <Text style={footerLinks}>
        <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/privacy`} style={link}>
          Privacy Policy
        </Link>
        {' • '}
        <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/terms`} style={link}>
          Terms of Service
        </Link>
        {' • '}
        <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe`} style={link}>
          Unsubscribe
        </Link>
      </Text>
    </Section>
  )
}

const footer = { padding: '0 48px' }
const hr = { borderColor: '#e6e6e6', margin: '32px 0' }
const footerText = { color: '#8898aa', fontSize: '12px', textAlign: 'center' as const }
const footerLinks = { color: '#8898aa', fontSize: '12px', textAlign: 'center' as const }
const link = { color: '#8898aa', textDecoration: 'underline' }
```

### Button

```typescript
// src/emails/components/email-button.tsx
import { Button } from '@react-email/components'

interface EmailButtonProps {
  href: string
  children: React.ReactNode
}

export function EmailButton({ href, children }: EmailButtonProps) {
  return (
    <Button href={href} style={button}>
      {children}
    </Button>
  )
}

const button = {
  backgroundColor: '#000000',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
}
```

## Styling Best Practices

### Inline Styles (Required for Email)

```typescript
// ✅ Correct - inline styles
const heading = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

// ❌ Wrong - CSS classes don't work in email
<h1 className="text-2xl font-bold">Hello</h1>
```

### Safe Fonts

```typescript
const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
```

### Safe Colors

```typescript
// Use hex colors, not CSS variables
const colors = {
  primary: '#000000',
  text: '#1a1a1a',
  muted: '#6b7280',
  background: '#f6f9fc',
  border: '#e6e6e6',
}
```

## Responsive Design

```typescript
// Two-column layout that stacks on mobile
import { Row, Column, Section } from '@react-email/components'

<Section>
  <Row>
    <Column style={{ width: '50%', paddingRight: '8px' }}>
      Left content
    </Column>
    <Column style={{ width: '50%', paddingLeft: '8px' }}>
      Right content
    </Column>
  </Row>
</Section>
```

## Dynamic Content

```typescript
// src/emails/order-confirmation.tsx
interface OrderConfirmationProps {
  customerName: string
  orderId: string
  items: Array<{ name: string; price: number; quantity: number }>
  total: number
}

export function OrderConfirmationEmail({
  customerName,
  orderId,
  items,
  total,
}: OrderConfirmationProps) {
  return (
    <BaseTemplate preview={`Order #${orderId} confirmed`}>
      <Heading style={h1}>Order Confirmed</Heading>
      <Text style={text}>Hi {customerName},</Text>
      <Text style={text}>
        Thank you for your order! Here's a summary:
      </Text>

      <Section style={orderBox}>
        <Text style={orderHeader}>Order #{orderId}</Text>
        
        {items.map((item, index) => (
          <Row key={index} style={itemRow}>
            <Column>
              <Text style={itemName}>{item.name}</Text>
              <Text style={itemQty}>Qty: {item.quantity}</Text>
            </Column>
            <Column style={{ textAlign: 'right' }}>
              <Text style={itemPrice}>${item.price.toFixed(2)}</Text>
            </Column>
          </Row>
        ))}

        <Hr style={hr} />
        
        <Row>
          <Column>
            <Text style={totalLabel}>Total</Text>
          </Column>
          <Column style={{ textAlign: 'right' }}>
            <Text style={totalAmount}>${total.toFixed(2)}</Text>
          </Column>
        </Row>
      </Section>
    </BaseTemplate>
  )
}
```

## Conditional Content

```typescript
interface NotificationEmailProps {
  type: 'success' | 'warning' | 'error'
  title: string
  message: string
}

export function NotificationEmail({ type, title, message }: NotificationEmailProps) {
  const colors = {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  }

  return (
    <BaseTemplate preview={title}>
      <Section style={{ ...alertBox, borderLeftColor: colors[type] }}>
        <Heading style={h2}>{title}</Heading>
        <Text style={text}>{message}</Text>
      </Section>
    </BaseTemplate>
  )
}

const alertBox = {
  backgroundColor: '#f9fafb',
  borderLeft: '4px solid',
  padding: '16px',
  borderRadius: '4px',
}
```

## Testing Templates

```bash
# Preview all templates
npm run email:dev

# Build for production
npm run email:build
```