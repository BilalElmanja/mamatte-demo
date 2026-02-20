# /generate_design_system

## Command Description
Use this command to generate a complete design system skill from a screenshot. Claude will analyze the visual design and create a reusable skill folder that captures colors, typography, spacing, components, and patterns so the design can be replicated consistently.

---

## Conversation Flow

When the user types `/generate_design_system` and provides an image, respond with:

---

### Step 1: Image Analysis

> **🎨 Let me analyze this design...**
>
> *[Claude examines the screenshot in detail]*
>
> **I can see this is a:** [dashboard / landing page / app interface / marketing site / other]
>
> **Initial observations:**
> - Overall style: [modern minimal / bold colorful / corporate / playful / dark mode / etc.]
> - Primary colors I detect: [list colors]
> - Typography style: [clean sans-serif / elegant serif / monospace accents / etc.]
> - Layout approach: [card-based / sidebar + content / full-width sections / etc.]
>
> **Is this analysis correct? Any context you want to add?**
> *(e.g., "This is a fintech dashboard" or "Focus on the card components")*

Wait for response, then:

---

### Step 2: Color Extraction

> **🎨 COLOR PALETTE**
>
> Let me extract the exact colors from this design:
>
> **Primary Colors:**
> | Name | Hex | Usage |
> |------|-----|-------|
> | Primary | #___ | Main actions, links |
> | Primary Hover | #___ | Hover states |
> | Primary Light | #___ | Backgrounds, badges |
>
> **Secondary Colors:**
> | Name | Hex | Usage |
> |------|-----|-------|
> | Secondary | #___ | Secondary actions |
> | Accent | #___ | Highlights, notifications |
>
> **Neutral Colors:**
> | Name | Hex | Usage |
> |------|-----|-------|
> | Background | #___ | Page background |
> | Surface | #___ | Card backgrounds |
> | Border | #___ | Dividers, borders |
> | Text Primary | #___ | Headings, body |
> | Text Secondary | #___ | Captions, muted |
> | Text Muted | #___ | Placeholders |
>
> **Semantic Colors:**
> | Name | Hex | Usage |
> |------|-----|-------|
> | Success | #___ | Success states |
> | Warning | #___ | Warnings |
> | Error | #___ | Errors |
> | Info | #___ | Information |
>
> **Does this color palette look accurate?**
> *(I can adjust any colors you want to tweak)*

Wait for response, then:

---

### Step 3: Typography Analysis

> **🔤 TYPOGRAPHY**
>
> **Font Families:**
> | Type | Font | Fallback |
> |------|------|----------|
> | Headings | [detected or suggest] | system-ui, sans-serif |
> | Body | [detected or suggest] | system-ui, sans-serif |
> | Mono | [detected or suggest] | monospace |
>
> **Type Scale:**
> | Name | Size | Weight | Line Height | Usage |
> |------|------|--------|-------------|-------|
> | Display | ___px | ___ | ___ | Hero titles |
> | H1 | ___px | ___ | ___ | Page titles |
> | H2 | ___px | ___ | ___ | Section titles |
> | H3 | ___px | ___ | ___ | Card titles |
> | H4 | ___px | ___ | ___ | Subsections |
> | Body Large | ___px | ___ | ___ | Lead text |
> | Body | ___px | ___ | ___ | Default text |
> | Body Small | ___px | ___ | ___ | Secondary text |
> | Caption | ___px | ___ | ___ | Labels, hints |
> | Overline | ___px | ___ | ___ | Categories, tags |
>
> **Text Styles I noticed:**
> - [ ] All caps for [specific usage]
> - [ ] Letter spacing adjustments
> - [ ] Gradient text effects
> - [ ] Text shadows
>
> **Does this typography system match what you see?**

Wait for response, then:

---

### Step 4: Spacing & Layout

> **📐 SPACING SYSTEM**
>
> **Base Unit:** ___px (typically 4px or 8px)
>
> **Spacing Scale:**
> | Token | Value | Usage |
> |-------|-------|-------|
> | space-0 | 0px | - |
> | space-1 | ___px | Tight gaps |
> | space-2 | ___px | Icon gaps |
> | space-3 | ___px | Element padding |
> | space-4 | ___px | Card padding |
> | space-5 | ___px | Section gaps |
> | space-6 | ___px | Large sections |
> | space-8 | ___px | Page sections |
> | space-10 | ___px | Hero spacing |
>
> **Border Radius:**
> | Token | Value | Usage |
> |-------|-------|-------|
> | radius-none | 0px | Sharp corners |
> | radius-sm | ___px | Subtle rounding |
> | radius-md | ___px | Buttons, inputs |
> | radius-lg | ___px | Cards |
> | radius-xl | ___px | Modals |
> | radius-full | 9999px | Pills, avatars |
>
> **Shadows:**
> | Token | Value | Usage |
> |-------|-------|-------|
> | shadow-sm | ___ | Subtle elevation |
> | shadow-md | ___ | Cards |
> | shadow-lg | ___ | Dropdowns |
> | shadow-xl | ___ | Modals |
>
> **Layout Patterns I detected:**
> - Max content width: ___px
> - Sidebar width: ___px (if applicable)
> - Grid columns: ___
> - Gutter width: ___px

Wait for response, then:

---

### Step 5: Component Inventory

> **🧩 COMPONENTS DETECTED**
>
> Let me identify the components in this design:
>
> **Navigation:**
> - [ ] Top navbar
> - [ ] Sidebar navigation
> - [ ] Breadcrumbs
> - [ ] Tabs
> - [ ] Bottom navigation
>
> **Actions:**
> - [ ] Primary button
> - [ ] Secondary button
> - [ ] Ghost/text button
> - [ ] Icon button
> - [ ] Button with icon
> - [ ] Button group
>
> **Forms:**
> - [ ] Text input
> - [ ] Select/dropdown
> - [ ] Checkbox
> - [ ] Radio
> - [ ] Toggle/switch
> - [ ] Search input
> - [ ] Date picker
> - [ ] File upload
>
> **Data Display:**
> - [ ] Card
> - [ ] Table
> - [ ] List
> - [ ] Stats/metrics
> - [ ] Charts
> - [ ] Avatar
> - [ ] Badge/tag
> - [ ] Progress bar
>
> **Feedback:**
> - [ ] Alert/banner
> - [ ] Toast
> - [ ] Empty state
> - [ ] Loading skeleton
> - [ ] Spinner
>
> **Overlay:**
> - [ ] Modal/dialog
> - [ ] Dropdown menu
> - [ ] Tooltip
> - [ ] Popover
>
> **Which components should I focus on documenting in detail?**
> *(Or say "all visible" and I'll document everything I can see)*

Wait for response, then:

---

### Step 6: Component Deep Dive

> **🔍 COMPONENT SPECIFICATIONS**
>
> For each component, I'll document:
>
> ---
>
> **BUTTON**
>
> *Variants:*
> | Variant | Background | Text | Border | Hover |
> |---------|------------|------|--------|-------|
> | Primary | #___ | #___ | none | #___ |
> | Secondary | #___ | #___ | #___ | #___ |
> | Ghost | transparent | #___ | none | #___ |
> | Destructive | #___ | #___ | none | #___ |
>
> *Sizes:*
> | Size | Height | Padding X | Font Size | Radius |
> |------|--------|-----------|-----------|--------|
> | sm | ___px | ___px | ___px | ___px |
> | md | ___px | ___px | ___px | ___px |
> | lg | ___px | ___px | ___px | ___px |
>
> *States:* default, hover, active, focus, disabled
>
> *Icon:* ___px size, ___px gap from text
>
> ---
>
> **CARD**
>
> | Property | Value |
> |----------|-------|
> | Background | #___ |
> | Border | ___px solid #___ |
> | Border Radius | ___px |
> | Padding | ___px |
> | Shadow | ___ |
> | Hover effect | [none / lift / border change] |
>
> *Card sections:*
> - Header: [padding, border-bottom]
> - Body: [padding]
> - Footer: [padding, border-top, background]
>
> ---
>
> **INPUT**
>
> | Property | Value |
> |----------|-------|
> | Height | ___px |
> | Padding | ___px |
> | Background | #___ |
> | Border | ___px solid #___ |
> | Border Radius | ___px |
> | Font Size | ___px |
> | Placeholder Color | #___ |
>
> *States:*
> - Focus: border #___, ring #___
> - Error: border #___, text #___
> - Disabled: background #___, opacity ___
>
> ---
>
> *[Continue for other selected components...]*
>
> **Should I continue with more components?**

Wait for response, then:

---

### Step 7: Animation & Interactions

> **✨ ANIMATIONS & INTERACTIONS**
>
> **Transition Defaults:**
> | Property | Duration | Easing |
> |----------|----------|--------|
> | Colors | ___ms | ease-in-out |
> | Transform | ___ms | ease-out |
> | Opacity | ___ms | ease-in-out |
>
> **Micro-interactions detected:**
> - [ ] Button hover: [scale / color shift / shadow]
> - [ ] Card hover: [lift / border glow / scale]
> - [ ] Link hover: [underline / color]
> - [ ] Input focus: [ring / border / glow]
>
> **Motion patterns:**
> - [ ] Page transitions
> - [ ] Modal enter/exit
> - [ ] Dropdown animations
> - [ ] Loading animations
> - [ ] Skeleton pulse
>
> **Hover effects summary:**
> | Element | Effect |
> |---------|--------|
> | Button | ___ |
> | Card | ___ |
> | Link | ___ |
> | Row | ___ |

Wait for response, then:

---

### Step 8: Special Patterns

> **🎯 UNIQUE PATTERNS**
>
> **I noticed these distinctive design elements:**
>
> - [ ] Gradient backgrounds: [describe]
> - [ ] Glassmorphism effects: [describe]
> - [ ] Custom illustrations style: [describe]
> - [ ] Icon style: [outline / filled / duotone]
> - [ ] Data visualization style: [colors, style]
> - [ ] Empty states approach: [illustration / icon / minimal]
> - [ ] Loading states: [skeleton / spinner / shimmer]
>
> **Brand elements:**
> - Logo placement: [describe]
> - Accent usage: [describe]
> - Imagery style: [photos / illustrations / abstract]
>
> **Any other unique patterns you want me to capture?**

Wait for response, then:

---

### Step 9: Skill Name & Metadata

> **📁 SKILL CONFIGURATION**
>
> **What should I name this design system skill?**
>
> *Suggestions based on the design:*
> - `[project-name]-design-system`
> - `[style]-ui-system` (e.g., "minimal-dark-ui-system")
> - Custom name: ___
>
> **Description for the skill:**
> *(I'll auto-generate, but you can customize)*
>
> **Should this skill include:**
> - [ ] Tailwind config preset
> - [ ] CSS variables file
> - [ ] shadcn/ui theme overrides
> - [ ] Component code examples
> - [ ] Framer Motion presets
> - [ ] All of the above

Wait for response, then:

---

### Step 10: Generation Confirmation

> **📋 DESIGN SYSTEM SUMMARY**
>
> ---
>
> **Skill Name:** `[name]`
>
> **Colors:** [X] primary, [X] neutral, [X] semantic
> **Typography:** [X] fonts, [X] sizes
> **Spacing:** [X]-point scale
> **Components:** [X] documented
>
> **Files to generate:**
>
> ```
> [skill-name]/
> ├── SKILL.md              # Main skill file
> ├── references/
> │   ├── colors.md         # Color tokens & usage
> │   ├── typography.md     # Type scale & fonts
> │   ├── spacing.md        # Spacing & layout
> │   ├── components.md     # Component specs
> │   └── animations.md     # Motion & interactions
> ├── config/
> │   ├── tailwind.preset.js    # Tailwind preset
> │   ├── css-variables.css     # CSS custom properties
> │   └── shadcn-theme.json     # shadcn/ui overrides
> └── examples/
>     ├── button.tsx        # Button variants
>     ├── card.tsx          # Card component
>     ├── input.tsx         # Input component
>     └── [other].tsx       # Other components
> ```
>
> ---
>
> **Ready to generate the skill?**
> - Type `yes` to generate all files
> - Type `adjust` to make changes first

Wait for confirmation, then generate.

---

### Step 11: Generate Skill Files

> **🏗️ Generating design system skill...**
>
> Creating:
> - [ ] SKILL.md
> - [ ] references/colors.md
> - [ ] references/typography.md
> - [ ] references/spacing.md
> - [ ] references/components.md
> - [ ] references/animations.md
> - [ ] config/tailwind.preset.js
> - [ ] config/css-variables.css
> - [ ] config/shadcn-theme.json
> - [ ] examples/[components].tsx
>
> *Generating...*

Proceed with file generation.

---

## Output Structure

### SKILL.md Template

```markdown
# [Skill Name] Design System

## Overview
[Description of the design system and its visual style]

## Quick Start

### 1. Install the Tailwind Preset
\`\`\`js
// tailwind.config.js
const preset = require('./path/to/[skill]/config/tailwind.preset')

module.exports = {
  presets: [preset],
  // ... your config
}
\`\`\`

### 2. Import CSS Variables
\`\`\`css
@import './path/to/[skill]/config/css-variables.css';
\`\`\`

### 3. Apply to shadcn/ui
Copy theme values from `config/shadcn-theme.json`

## Design Principles
- [Principle 1]
- [Principle 2]
- [Principle 3]

## References
- [colors.md](references/colors.md) - Color palette
- [typography.md](references/typography.md) - Type system
- [spacing.md](references/spacing.md) - Spacing & layout
- [components.md](references/components.md) - Component specs
- [animations.md](references/animations.md) - Motion design

## Component Examples
See the `examples/` folder for copy-paste components.
```

---

## Multiple Screenshots Support

If user provides multiple screenshots:

> **I see you've provided [X] screenshots. I'll analyze each:**
>
> 1. **Screenshot 1:** [description] - [what I'll extract]
> 2. **Screenshot 2:** [description] - [what I'll extract]
> 3. **Screenshot 3:** [description] - [what I'll extract]
>
> **I'll combine these into one cohesive design system.**
>
> *Analyzing all screenshots...*

---

## Tips for Best Results

Provide screenshots that show:
- [ ] Multiple button states/variants
- [ ] Form elements (inputs, selects, checkboxes)
- [ ] Cards with different content types
- [ ] Navigation (sidebar, header, or both)
- [ ] Data tables or lists
- [ ] Modal or dialog (if used)
- [ ] Empty or loading states
- [ ] Mobile version (if different)

Higher resolution = more accurate color extraction.