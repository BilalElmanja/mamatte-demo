# /security_audit

## Command Description
Use this command to perform a security review of your code. Claude will check for common vulnerabilities and security best practices.

---

## Conversation Flow

When the user types `/security_audit`, respond with:

---

### Step 1: Audit Scope

> **Let's do a security audit! What should I review?**
>
> - [ ] **Entire application** - Full security review
> - [ ] **Specific feature** - Name: ___
> - [ ] **Specific file(s)** - Path: ___
> - [ ] **Authentication flow** - Login, signup, sessions
> - [ ] **API endpoints** - All routes
> - [ ] **Data handling** - How user data is processed
> - [ ] **Third-party integrations** - External services

Wait for response, then:

---

### Step 2: Specific Concerns

> **Are there any specific security concerns you want me to focus on?**
>
> - [ ] **Authentication** - Login, session management
> - [ ] **Authorization** - Permissions, access control
> - [ ] **Input validation** - User input handling
> - [ ] **Data exposure** - Sensitive data leaks
> - [ ] **API security** - Endpoint protection
> - [ ] **Injection attacks** - SQL, XSS, etc.
> - [ ] **Dependencies** - Package vulnerabilities
> - [ ] **Secrets management** - API keys, credentials
> - [ ] **No specific concern** - General review

Wait for response, then:

---

### Step 3: Security Checklist

> **I'll review against this security checklist:**
>
> ## Authentication
> - [ ] Auth required on all protected routes (middleware)
> - [ ] Auth verified in server actions (not just middleware)
> - [ ] Sessions properly managed
> - [ ] Rate limiting on auth endpoints
>
> ## Authorization
> - [ ] Users can only access their own data
> - [ ] Role-based permissions enforced
> - [ ] No privilege escalation possible
>
> ## Input Validation
> - [ ] All user input validated with Zod
> - [ ] File uploads validated (type, size)
> - [ ] URL parameters validated
>
> ## Data Protection
> - [ ] Sensitive data encrypted
> - [ ] No sensitive data in URLs or logs
> - [ ] Proper error messages (no internal details)
>
> ## API Security
> - [ ] CORS configured correctly
> - [ ] Rate limiting in place
> - [ ] Webhook signatures verified
>
> ## Injection Prevention
> - [ ] SQL injection prevented (Prisma)
> - [ ] XSS prevented (React escaping)
> - [ ] CSRF protection (Next.js built-in)
>
> ## Secrets Management
> - [ ] No hardcoded secrets
> - [ ] Secrets not exposed to client
>
> *Ready to start?*

Wait for confirmation, then perform audit.

---

### Step 4: Audit Report

> **🔒 Security Audit Report**
>
> | Severity | Count |
> |----------|-------|
> | 🔴 Critical | X |
> | 🟠 High | X |
> | 🟡 Medium | X |
> | 🟢 Low | X |
>
> ---
>
> ## 🔴 Critical Issues
>
> **[Issue Title]**
> - **Location:** `file:line`
> - **Risk:** [impact]
> - **Fix:**
> ```typescript
> // Before (vulnerable)
> // After (secure)
> ```
>
> ---
>
> ## Recommendations
> 1. [Immediate action]
> 2. [Short-term improvement]
>
> **Would you like me to fix any issues?**