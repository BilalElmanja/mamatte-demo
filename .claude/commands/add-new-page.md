# /add_page

## Command Description
Use this command to add a new page or route to the application. Claude will gather all requirements for the page structure, data, and UI.

---

## Conversation Flow

When the user types `/add_page`, respond with:

---

### Step 1: Route Path

> **Let's create a new page! What's the URL path?**
>
> *Examples:*
> - `/dashboard/settings/notifications`
> - `/dashboard/projects/[id]/analytics`
> - `/pricing`
> - `/blog/[slug]`

Wait for response, then:

---

### Step 2: Page Type

> **What type of page is this?**
>
> - [ ] **Public** - Anyone can access (marketing, docs, blog)
> - [ ] **Protected** - Requires authentication (dashboard pages)
> - [ ] **Admin only** - Requires admin role
>
> **Which route group?**
> - [ ] `(marketing)` - Public marketing pages
> - [ ] `(auth)` - Sign-in, sign-up pages
> - [ ] `(dashboard)` - Protected app pages
> - [ ] `(admin)` - Admin panel
> - [ ] Root - No group

Wait for response, then:

---

### Step 3: Page Purpose

> **What is this page for? Describe in 1-2 sentences.**
>
> *Example: "A settings page where users can configure their email notification preferences."*

Wait for response, then:

---

### Step 4: Data Requirements

> **What data does this page need?**
>
> **Server-side data to fetch:**
> *(What should be loaded when the page renders?)*
>
> *Example:*
> - *User's notification settings from `settingsService.getNotificationPrefs(userId)`*
> - *List of available notification types from config*
>
> **Does this page need:**
> - [ ] Data from database
> - [ ] Data from external API
> - [ ] No data fetching (static page)

Wait for response, then:

---

### Step 5: Loading State

> **How should the page handle loading?**
>
> - [ ] **Skeleton** - Show placeholder shapes
> - [ ] **Spinner** - Show loading indicator
> - [ ] **Streaming** - Load sections progressively
> - [ ] **Instant** - No loading state (static/fast)
>
> *For Streaming: Which sections should load independently?*

Wait for response, then:

---

### Step 6: UI Components

> **What UI elements will this page have?**
>
> - [ ] **Header/Title section**
> - [ ] **Form(s)** - *What fields?*
> - [ ] **List/Table** - *What data?*
> - [ ] **Cards/Grid** - *What content?*
> - [ ] **Tabs** - *What sections?*
> - [ ] **Charts/Graphs** - *What data?*
> - [ ] **Empty state** - *What message?*
> - [ ] **Action buttons** - *What actions?*
>
> *Describe the layout:*
> *Example: "Header with title, then a form with toggle switches for each notification type, save button at bottom."*

Wait for response, then:

---

### Step 7: Existing vs New Components

> **For the UI elements you mentioned:**
>
> **Can use existing components:**
> *(e.g., "Button, Card, Switch from shadcn/ui")*
>
> **Need to create new components:**
> *(e.g., "NotificationToggle component for each setting")*
>
> *If creating new, should they be:*
> - [ ] Page-specific (in `_components/` folder)
> - [ ] Shared (in `components/` folder)

Wait for response, then:

---

### Step 8: Actions on Page

> **What actions can users take on this page?**
>
> *List each action:*
> 1. *Example: "Save notification preferences"*
> 2. *Example: "Reset to defaults"*
> 3. *Example: "Test notification"*
>
> *For each action, what happens on success?*
> - [ ] Show toast message
> - [ ] Redirect to: ___
> - [ ] Refresh data
> - [ ] Close modal

Wait for response, then:

---

### Step 9: SEO (Public Pages Only)

> **(Skip if protected page)**
>
> **For search engine optimization:**
>
> - **Page title:** *(e.g., "Pricing - MyApp")*
> - **Meta description:** *(e.g., "Simple, transparent pricing for teams of all sizes")*
> - **Should this be indexed?** Yes / No

Wait for response or skip, then:

---

### Step 10: Mobile Considerations

> **Any specific mobile requirements?**
>
> - [ ] Same layout on mobile (responsive)
> - [ ] Different layout on mobile - *describe:*
> - [ ] Hide certain elements on mobile - *which:*
> - [ ] Mobile-specific features - *describe:*
>
> *Or just: "Standard responsive behavior"*

Wait for response, then:

---

### Step 11: Navigation

> **How do users get to and from this page?**
>
> **Links TO this page from:**
> - *(e.g., "Settings sidebar menu")*
> - *(e.g., "Header dropdown")*
>
> **Links FROM this page to:**
> - *(e.g., "Back to dashboard")*
> - *(e.g., "Related settings pages")*

Wait for response, then:

---

### Step 12: Confirmation

> **Here's the page I'll create:**
>
> **Route:** `[path]`
> **Type:** [public/protected/admin]
> **Group:** [route group]
>
> **Purpose:** [description]
>
> **Data:**
> - [data source 1]
> - [data source 2]
>
> **Loading:** [skeleton/spinner/streaming]
>
> **UI Components:**
> - [component 1]
> - [component 2]
>
> **Actions:**
> 1. [action 1]
> 2. [action 2]
>
> **Navigation:**
> - From: [sources]
> - To: [destinations]
>
> ---
>
> **Does this look correct?**
> - Type `yes` to proceed
> - Type `no` to adjust

Wait for confirmation, then proceed.

---

## Implementation Order

1. **Create page file** - `app/(group)/path/page.tsx`
2. **Create loading file** - `app/(group)/path/loading.tsx` (if needed)
3. **Create page-specific components** - `app/(group)/path/_components/`
4. **Create shared components** - `components/` (if needed)
5. **Create/update actions** - `actions/`
6. **Add navigation links** - Update sidebar/header
7. **Add metadata** - SEO tags (if public)
8. **Test** - All states and actions