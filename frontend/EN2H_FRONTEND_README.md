# EN2H Booking Platform Frontend

A complete implementation guide for building the EN2H Booking Platform frontend with **Next.js App Router**, **TypeScript**, the existing **NestJS REST API**, the **AETHER 9** design system, and animation components selected through the configured **React Bits MCP**.

This file is intended to be placed at:

```text
en2h-booking-platform/frontend/README.md
```

The frontend must be visually driven by:

```text
frontend/aether-9-1-DESIGN.md
```

Animation and background components must be discovered and integrated using:

```text
frontend/.mcp.json
```

---

# 1. Frontend Project Structure

Create and maintain the following structure.

```text
frontend/
├── public/
│   ├── brand/
│   │   ├── en2h-logo.svg
│   │   └── en2h-mark.svg
│   ├── icons/
│   └── images/
│       ├── booking-preview.webp
│       └── service-placeholder.webp
│
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── services/
│   │   │   │   └── page.tsx
│   │   │   ├── book/
│   │   │   │   └── page.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── page.tsx
│   │   │   ├── services/
│   │   │   │   └── page.tsx
│   │   │   └── bookings/
│   │   │       ├── page.tsx
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── animations/
│   │   │   ├── AmbientHero.tsx
│   │   │   ├── FadeInSection.tsx
│   │   │   ├── HoverLift.tsx
│   │   │   ├── MaskedTextReveal.tsx
│   │   │   ├── ReducedMotionBoundary.tsx
│   │   │   └── StaggeredReveal.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── AuthGate.tsx
│   │   │   ├── GuestGate.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── PasswordField.tsx
│   │   │   └── RegisterForm.tsx
│   │   │
│   │   ├── bookings/
│   │   │   ├── BookingActions.tsx
│   │   │   ├── BookingCard.tsx
│   │   │   ├── BookingDetails.tsx
│   │   │   ├── BookingFilters.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   ├── BookingStatusBadge.tsx
│   │   │   └── BookingTable.tsx
│   │   │
│   │   ├── common/
│   │   │   ├── Alert.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── FieldError.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingButton.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── TextArea.tsx
│   │   │   └── ToastProvider.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── DashboardSidebar.tsx
│   │   │   ├── MobileDashboardMenu.tsx
│   │   │   ├── RecentBookings.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── StatusSummary.tsx
│   │   │
│   │   ├── landing/
│   │   │   ├── BenefitsSection.tsx
│   │   │   ├── FinalCtaSection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── ServicesPreviewSection.tsx
│   │   │   └── StaffPortalSection.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileNavigation.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PublicShell.tsx
│   │   │   └── SkipLink.tsx
│   │   │
│   │   ├── providers/
│   │   │   ├── AppProviders.tsx
│   │   │   └── AuthProvider.tsx
│   │   │
│   │   ├── react-bits/
│   │   │   ├── README.md
│   │   │   └── generated-components/
│   │   │
│   │   └── services/
│   │       ├── ServiceCard.tsx
│   │       ├── ServiceFilters.tsx
│   │       ├── ServiceForm.tsx
│   │       ├── ServiceFormModal.tsx
│   │       └── ServiceTable.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── useReducedMotion.ts
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── api-client.ts
│   │   │   ├── api-error.ts
│   │   │   ├── auth.api.ts
│   │   │   ├── bookings.api.ts
│   │   │   ├── response-parser.ts
│   │   │   └── services.api.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── auth-events.ts
│   │   │   ├── session.ts
│   │   │   └── token-storage.ts
│   │   │
│   │   ├── config/
│   │   │   └── env.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── booking-status.ts
│   │   │   ├── navigation.ts
│   │   │   └── storage-keys.ts
│   │   │
│   │   ├── formatters/
│   │   │   ├── currency.ts
│   │   │   ├── date-time.ts
│   │   │   └── duration.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── class-names.ts
│   │   │   └── query-params.ts
│   │   │
│   │   └── validation/
│   │       ├── auth.schemas.ts
│   │       ├── booking.schema.ts
│   │       └── service.schema.ts
│   │
│   ├── styles/
│   │   ├── animations.css
│   │   ├── components.css
│   │   ├── responsive.css
│   │   └── tokens.css
│   │
│   └── types/
│       ├── api.types.ts
│       ├── auth.types.ts
│       ├── booking.types.ts
│       ├── common.types.ts
│       └── service.types.ts
│
├── tests/
│   ├── components/
│   ├── integration/
│   ├── unit/
│   └── setup.ts
│
├── .env.example
├── .env.local
├── .gitignore
├── .mcp.json
├── aether-9-1-DESIGN.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Structure rules

- Use the Next.js App Router.
- Use Server Components by default.
- Add `'use client'` only to forms, authentication providers, dialogs, browser storage, interactive navigation, and animation components.
- Keep route files small.
- Put reusable UI in `components`.
- Put all API communication in `src/lib/api`.
- Put all browser token storage in `src/lib/auth`.
- Put all validation schemas in `src/lib/validation`.
- Put all React Bits generated or adapted code in `src/components/react-bits`.
- Never hardcode the backend URL inside a page.
- Never hardcode repeated design colors inside component files.
- Do not place all landing-page sections in one large `page.tsx`.
- Do not duplicate refresh-token logic in different API files.

---

# 2. Source Priority

Before generating the frontend, inspect the following sources in this order:

1. Backend controllers, DTOs, entities, enums, and README
2. Actual Postman responses
3. `aether-9-1-DESIGN.md`
4. `.mcp.json`
5. This frontend README

When two files disagree:

- The backend source code is the API source of truth.
- Actual API responses are the response-shape source of truth.
- `aether-9-1-DESIGN.md` is the visual source of truth.
- This README is the frontend architecture and feature source of truth.

---

# 3. AETHER 9 Design System

The interface must preserve the AETHER 9 first-screen hierarchy, spacing rhythm, visual density, contrast, button hierarchy, card language, and restrained interaction tone.

## 3.1 Exact color palette

Use these exact design tokens:

| Token | Value | Purpose |
|---|---|---|
| Primary | `#000000` | Main dark brand color |
| Secondary | `#FFFFFF` | High-contrast action and content color |
| Accent | `#000000` | Dark accent role |
| Background | `#000000` | Main application background |
| Surface | `#18181B` | Cards, forms, modals, sidebar surfaces |
| Text primary | `#FFFFFF` | Main headings and body text |
| Text secondary | `#A1A1AA` | Supporting and muted text |
| Border | `#27272A` | Dividers, controls, cards, tables |

Create `src/styles/tokens.css`:

```css
:root {
  color-scheme: dark;

  --color-primary: #000000;
  --color-secondary: #ffffff;
  --color-accent: #000000;

  --color-background: #000000;
  --color-surface: #18181b;
  --color-surface-hover: #1f1f23;

  --color-text-primary: #ffffff;
  --color-text-secondary: #a1a1aa;

  --color-border: #27272a;
  --color-border-strong: #3f3f46;

  --color-action-bg: #ffffff;
  --color-action-text: #000000;
  --color-action-hover: #e4e4e7;

  --color-danger: #ffffff;
  --color-danger-bg: #18181b;

  --font-display: var(--font-inter), Inter, sans-serif;
  --font-body: var(--font-inter), Inter, sans-serif;
  --font-label: var(--font-jetbrains-mono), "JetBrains Mono", monospace;

  --display-lg-size: 64px;
  --display-lg-weight: 500;
  --display-lg-line-height: 1.04;
  --display-lg-letter-spacing: 0;

  --body-md-size: 16px;
  --body-md-weight: 400;
  --body-md-line-height: 1.6;

  --label-md-size: 12px;
  --label-md-weight: 600;
  --label-md-line-height: 1.2;

  --space-base: 8px;
  --space-gap: 16px;
  --space-card: 24px;
  --space-section: 80px;

  --radius-card: 16px;
  --radius-control: 8px;
  --radius-pill: 9999px;

  --container-max: 1280px;
  --header-height: 72px;
  --sidebar-width: 280px;

  --transition-fast: 160ms;
  --transition-normal: 260ms;
  --transition-slow: 520ms;
}
```

`--color-surface-hover`, `--color-border-strong`, action aliases, container size, and transition durations are implementation aliases. They must remain visually consistent with the exact AETHER palette and must not introduce a new color family.

## 3.2 Theme rule

AETHER 9 is a dark visual system.

Do not automatically add a light-theme toggle. The design source specifically requires preserving the original color mode unless the source clearly supports another one.

Therefore:

- Use one polished dark theme.
- Use the black background throughout public and dashboard areas.
- Use `#18181B` surfaces.
- Use white primary text.
- Use `#A1A1AA` supporting text.
- Use `#27272A` borders.
- Do not generate a generic white SaaS dashboard.
- Do not invert the palette on different pages.
- Do not add random gradients that introduce blue, purple, green, or orange.

A light theme may be added only after a separate approved design specification exists.

## 3.3 Typography

Use:

- `Inter` for display headings
- `Inter` for body content
- `JetBrains Mono` for labels, metadata, status labels, small navigation labels, and technical details

Load them with `next/font/google` in `src/app/layout.tsx`:

```typescript
import {
  Inter,
  JetBrains_Mono,
} from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});
```

Apply:

```tsx
<body
  className={`${inter.variable} ${jetBrainsMono.variable}`}
>
  {children}
</body>
```

Typography requirements:

```text
Display large
Font: Inter
Size: 64px
Weight: 500
Line height: 1.04
Letter spacing: 0

Body medium
Font: Inter
Size: 16px
Weight: 400
Line height: 1.6

Label medium
Font: JetBrains Mono
Size: 12px
Weight: 600
Line height: 1.2
```

Responsive display heading:

```css
.aether-display {
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 7vw, var(--display-lg-size));
  font-weight: var(--display-lg-weight);
  line-height: var(--display-lg-line-height);
  letter-spacing: var(--display-lg-letter-spacing);
}
```

The desktop maximum remains the design-specified `64px`.

## 3.4 Spacing

Use the design spacing rhythm:

```text
Base spacing: 8px
Common gap: 16px
Card padding: 24px
Section padding: 80px
```

Examples:

```css
.aether-section {
  padding-block: var(--space-section);
}

.aether-card {
  padding: var(--space-card);
  gap: var(--space-gap);
}

.aether-stack {
  display: grid;
  gap: var(--space-gap);
}
```

Do not reduce every section into a dense dashboard grid. Preserve deliberate whitespace and strong first-screen composition.

## 3.5 Radius language

Use:

```text
Cards: 16px
Controls: 8px
Pills: 9999px
```

Apply consistently:

- Service cards: `16px`
- Dashboard stat cards: `16px`
- Forms and modals: `16px`
- Inputs and standard buttons: `8px`
- Status badges and compact labels: `9999px`

## 3.6 Cards

Cards must use:

```css
.aether-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}
```

Depth should be created mainly using:

- Surface contrast
- Thin borders
- Subtle hover lift
- Restrained opacity changes

Do not use bright colored shadows.

## 3.7 Buttons

On the black background, the main CTA should use the secondary token for clear contrast:

```css
.button-primary {
  background: var(--color-secondary);
  color: var(--color-primary);
  border: 1px solid var(--color-secondary);
  border-radius: var(--radius-control);
}

.button-secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
}

.button-pill {
  border-radius: var(--radius-pill);
}
```

Button hierarchy:

1. White filled button for the primary action
2. Dark or transparent outlined button for the secondary action
3. Text or ghost action for low-priority navigation
4. Restrained danger action using border, icon, and clear wording

Do not create several equally prominent primary buttons inside one section.

## 3.8 Inputs

Inputs should preserve a focused conversion path.

```css
.aether-input {
  min-height: 48px;
  width: 100%;
  padding-inline: 14px;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
}

.aether-input::placeholder {
  color: var(--color-text-secondary);
}

.aether-input:focus-visible {
  outline: 2px solid var(--color-secondary);
  outline-offset: 2px;
}
```

Form rules:

- Labels use JetBrains Mono when suitable.
- Error text must remain readable.
- Focus must be obvious.
- Inputs must not use a white background.
- Authentication and booking forms must remain visually simple and conversion-focused.

---

# 4. React Bits MCP Integration

The project already contains:

```text
frontend/.mcp.json
```

This file connects the coding environment to the React Bits MCP.

Do not guess React Bits APIs from memory. Use the MCP server to search for current components and installation instructions.

## 4.1 Required MCP workflow

Before writing an animation component:

1. Read `.mcp.json`.
2. Confirm the React Bits MCP server is available.
3. Search React Bits for a component matching the intended effect.
4. Inspect its required dependencies.
5. Generate or install the component locally.
6. Move or adapt it into `src/components/react-bits`.
7. Replace its default colors with AETHER tokens.
8. Add a project wrapper in `src/components/animations`.
9. Test mobile, dark contrast, pointer behavior, and reduced motion.
10. Remove unused examples and demo content.

## 4.2 Recommended React Bits use

Use React Bits for:

- Ambient hero background
- Three.js, canvas, particle, atmospheric, grid, or beam effect behind hero content
- Masked heading reveal
- Staggered supporting-copy entrance
- Scroll-triggered section entrance
- Service-card hover lift
- Final CTA ambient background
- Small dashboard statistic entrance
- Modal or toast transition

## 4.3 Motion direction

The AETHER motion language includes:

- Masked reveals
- Staggered entrances
- Hover lift
- Scroll-triggered transitions
- Ambient movement
- Smooth restrained easing

Motion should support the hierarchy, not become the main content.

## 4.4 React Bits restrictions

Do not:

- Animate every paragraph
- Add a large effect behind every form
- Use multiple WebGL canvases on one page
- Block clicks with the animation layer
- Reduce text contrast
- add unrelated bright colors
- Delay navigation for an entrance animation
- create continuous high-motion dashboard tables
- ignore mobile performance

## 4.5 Technical animation rules

- React Bits components requiring browser APIs must use `'use client'`.
- Use dynamic import with `ssr: false` only when the component truly cannot render during SSR.
- Decorative animation must use `aria-hidden="true"`.
- Decorative animation must use `pointer-events: none`.
- Content must remain above the effect with an intentional stacking context.
- Clean up animation frames, event listeners, observers, and intervals.
- Render a static fallback when reduced motion is enabled.
- Avoid hydration mismatch.
- Keep one main animated background in the first viewport.

Example layer:

```css
.hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: var(--color-background);
}

.heroEffect {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
}

.heroOverlay {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.92),
      rgba(0, 0, 0, 0.55),
      rgba(0, 0, 0, 0.28)
    );
}
```

## 4.6 Reduced motion

Add:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

The page must still be complete and visually balanced without animation.

---

# 5. Technology Stack

Use:

- Next.js App Router
- React
- TypeScript
- CSS Modules
- Global CSS design tokens
- Fetch API
- React Context
- React Hook Form
- Zod
- `@hookform/resolvers`
- Lucide React
- Sonner
- `date-fns`
- `clsx`
- React Bits through MCP
- `next/font`
- `next/image`
- `next/link`

Do not use Tailwind unless the project owner later changes this decision.

---

# 6. Create the Next.js Project

Run from:

```text
en2h-booking-platform/
```

Create the frontend:

```bash
npx create-next-app@latest frontend --typescript --eslint --app --src-dir --import-alias "@/*" --no-tailwind
```

Enter the project:

```bash
cd frontend
```

Install required packages:

```bash
npm install lucide-react react-hook-form zod @hookform/resolvers sonner clsx date-fns
```

Optional tests:

```bash
npm install -D vitest jsdom @vitejs/plugin-react vite-tsconfig-paths @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Optional end-to-end tests:

```bash
npm install -D @playwright/test
npx playwright install
```

---

# 7. Development Ports

The NestJS backend uses:

```text
http://localhost:3000
```

Run the Next.js frontend on:

```text
http://localhost:3001
```

Update `package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

---

# 8. Environment Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_NAME=EN2H Booking Platform
```

Create `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_NAME=EN2H Booking Platform
```

Create:

```text
src/lib/config/env.ts
```

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    'NEXT_PUBLIC_API_URL is not configured',
  );
}

export const env = {
  apiUrl: apiUrl.replace(/\/$/, ''),
  appName:
    process.env.NEXT_PUBLIC_APP_NAME ??
    'EN2H Booking Platform',
} as const;
```

Rules:

- Never put backend JWT secrets in the frontend.
- Never add database credentials to the frontend.
- Never commit `.env.local`.
- Commit `.env.example`.
- Variables beginning with `NEXT_PUBLIC_` are visible to the browser.

---

# 9. Backend CORS

The backend must allow:

```text
http://localhost:3001
```

Recommended backend configuration:

```typescript
app.enableCors({
  origin: [
    'http://localhost:3001',
  ],
  credentials: true,
});
```

Do not use unrestricted production CORS.

---

# 10. Frontend Routes

## Public routes

| Route | Purpose |
|---|---|
| `/` | Complete landing page |
| `/services` | Browse active public services |
| `/book` | Create a booking without authentication |
| `/login` | Staff login |
| `/register` | Staff registration |

## Protected routes

| Route | Purpose |
|---|---|
| `/dashboard` | Dashboard overview |
| `/dashboard/services` | Service CRUD |
| `/dashboard/bookings` | Booking list and management |
| `/dashboard/bookings/[id]` | Booking details and status actions |

## Framework routes

- `loading.tsx`
- `error.tsx`
- `not-found.tsx`

---

# 11. Landing Page

Create the complete landing page at:

```text
/
```

It must preserve the AETHER first-screen signal and must not look like a generic SaaS template.

## 11.1 Navbar

Include:

- EN2H logo
- Home
- Services
- How It Works
- Book Now
- Login
- Register

Desktop priority:

- `Book Now`: white filled CTA
- `Login`: outlined action
- `Register`: compact text or outlined action

Mobile menu:

- Accessible hamburger button
- Home
- Services
- How It Works
- Book Now
- Login
- Register
- Close after navigation
- Visible keyboard focus
- Prevent background scroll when used as a modal drawer

## 11.2 Login and registration placement

Place Login and Register in necessary locations:

1. Desktop navbar
2. Mobile menu
3. Dedicated Staff Portal section
4. Footer

The hero may include a small `Staff login` text link, but do not place two large staff buttons next to the primary customer booking CTA.

The primary landing-page goal is customer booking.

## 11.3 Hero section

Include:

- Small mono label
- Large Inter heading
- Supporting body text
- Primary `Book a Service` button
- Secondary `Explore Services` button
- Small staff login link
- React Bits ambient background
- Optional booking UI preview
- Clear foreground contrast

Suggested label:

```text
EN2H BOOKING PLATFORM
```

Suggested heading:

```text
Simple bookings.
Better service.
```

Suggested body:

```text
Explore available services, choose a convenient date and time, and submit your booking in a few simple steps.
```

Suggested actions:

```text
Book a Service
Explore Services
Staff Login
```

Composition rules:

- Keep the first viewport visually strong.
- Avoid a centered generic headline with six cards underneath.
- Use an editorial or asymmetric composition when suitable.
- Keep one clear focal object.
- Maintain high visual density without crowding the text.
- Keep animation behind the content.

## 11.4 Active services preview

Display up to six active services.

Each card:

- Title
- Short description
- Duration
- Price
- Book Now
- Optional details link

Book route:

```text
/book?serviceId=<service-id>
```

Include:

- Loading skeleton
- Empty state
- Error state
- Retry
- View All Services
- Responsive layout
- Hover lift

Do not show inactive services publicly.

## 11.5 How It Works

Show:

1. Choose a service
2. Select date and time
3. Enter customer details
4. Receive the booking result

Use simple icons, labels, and short body text.

## 11.6 Benefits

Include:

- Quick booking
- Clear pricing
- Clear duration
- Mobile-friendly flow
- Duplicate-slot protection
- Secure staff dashboard
- Simple booking-status management

## 11.7 Staff Portal section

Include:

- Staff portal heading
- Explanation of service and booking management
- `Staff Login`
- `Register Staff Account`
- Dashboard preview or compact feature list

This is the main secondary location for authentication buttons.

## 11.8 Final CTA

Include:

- Short customer-focused heading
- `Book Now`
- `Browse Services`
- Subtle React Bits ambient effect

## 11.9 Footer

Include:

- EN2H logo
- Short product summary
- Home
- Services
- Book Now
- Login
- Register
- Copyright

---

# 12. Public Services Page

Route:

```text
/services
```

Include:

- AETHER page heading
- Supporting description
- Search
- Service cards
- Duration
- Price
- Book Now
- Loading
- Empty
- Error
- Retry
- Responsive layout

The page must show active services only.

The Book Now action goes to:

```text
/book?serviceId=<service-id>
```

---

# 13. Public Booking Page

Route:

```text
/book
```

No authentication required.

## Fields

- Service
- Customer name
- Customer email
- Customer phone
- Booking date
- Booking time
- Notes

Payload:

```typescript
export interface CreateBookingInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
}
```

## Behavior

- Load active public services.
- Read `serviceId` from the URL.
- Preselect a valid service.
- Allow changing the service.
- Disable past dates.
- Keep backend validation authoritative.
- Disable duplicate submissions.
- Show `409` duplicate-slot feedback.
- Show `429` rate-limit feedback.
- Handle an inactive or removed service.
- Preserve entered values after a failed request when safe.

## Request

```http
POST /bookings
```

## Success result

Display:

- Success icon
- Booking reference
- Service title
- Date
- Time
- PENDING badge
- Create Another Booking
- Return Home

Do not promise email or SMS notifications because those are not implemented in the current backend.

---

# 14. Login Page

Route:

```text
/login
```

Include:

- EN2H brand
- Email
- Password
- Show/hide password
- Login
- Register link
- Back to Home
- Loading state
- Validation feedback
- Invalid credential feedback
- Rate-limit feedback
- React Bits restrained background

Request:

```http
POST /auth/login
```

On success:

1. Save access token.
2. Save refresh token.
3. Save user.
4. Redirect to `/dashboard`.

Authenticated users visiting `/login` should be redirected to `/dashboard`.

---

# 15. Registration Page

Route:

```text
/register
```

Include:

- Name
- Email
- Password
- Confirm password
- Password rules
- Show/hide password
- Register
- Login link
- Back to Home
- Duplicate email feedback
- Validation feedback
- Rate-limit feedback
- Loading state

Request:

```http
POST /auth/register
```

On success:

- Show success feedback.
- Redirect to `/login`.
- Optionally prefill the registered email.

Do not assume registration automatically logs in the user.

---

# 16. Authentication Provider

Create:

```text
src/components/providers/AuthProvider.tsx
```

Support:

```typescript
register(input)
login(input)
logout()
refreshSession()
restoreSession()
getProfile()
```

Expose:

```typescript
user
isAuthenticated
isInitializing
isSubmitting
login
register
logout
refreshSession
```

## Initial restoration

1. Read access token, refresh token, and user.
2. When no refresh token exists, initialize as guest.
3. Call profile using access token.
4. On `401`, call refresh.
5. Save both rotated tokens.
6. Retry once.
7. Clear invalid session when refresh fails.
8. Redirect protected pages to login.

## Storage keys

```text
en2h.accessToken
en2h.refreshToken
en2h.user
```

Keep keys in:

```text
src/lib/constants/storage-keys.ts
```

## Next.js storage rule

`localStorage` may only be used in browser-safe Client Components.

Do not:

- Read tokens in a Server Component.
- Read tokens in Next.js middleware.
- Access browser storage during server rendering.

Use a client-side `AuthGate` for protected dashboard routes.

---

# 17. Central API Client

Create:

```text
src/lib/api/api-client.ts
```

It must:

- Use `NEXT_PUBLIC_API_URL`
- Support GET, POST, PATCH, DELETE
- Add JSON headers when needed
- Add Bearer access token
- Parse success responses
- Handle empty responses
- Parse NestJS validation arrays
- Handle network errors
- Handle 400, 401, 403, 404, 409, 429, 500
- Refresh expired access token
- Save both rotated tokens
- Retry the original request once
- Avoid refreshing `/auth/refresh`
- Avoid infinite loops
- Clear invalid sessions
- Return typed data

## Shared refresh lock

Refresh-token rotation means simultaneous refresh calls can invalidate each other.

Use one refresh promise:

```typescript
let refreshPromise: Promise<void> | null = null;

async function refreshOnce(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
```

## API error class

```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

## Status handling

| Code | UI behavior |
|---:|---|
| 400 | Validation or invalid request |
| 401 | Refresh once or log out |
| 403 | Access denied |
| 404 | Not found |
| 409 | Duplicate email or duplicate booking |
| 429 | Ask user to wait |
| 500 | Generic server error and retry |

---

# 18. Backend API Contract

Base URL:

```text
http://localhost:3000/api/v1
```

## Authentication

```http
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/profile
```

## Services

```http
GET    /services
POST   /services
GET    /services/:id
PATCH  /services/:id
DELETE /services/:id
```

Queries:

```text
page
limit
search
isActive
```

## Bookings

```http
POST  /bookings
GET   /bookings
GET   /bookings/:id
PATCH /bookings/:id/status
PATCH /bookings/:id/cancel
```

Queries:

```text
page
limit
search
status
serviceId
```

---

# 19. Public Active Services Requirement

The public landing page and public booking form need active service data.

Preferred endpoint:

```http
GET /services/public/active
```

This endpoint should:

- Require no token
- Return active services only
- Support optional search and pagination
- Never expose inactive services

Alternative:

```http
GET /services?isActive=true
```

Use this only when the backend intentionally leaves this GET endpoint public.

Do not bypass backend authentication from the frontend.

If no public service endpoint exists, add one to the NestJS backend before finishing the public service and booking screens.

---

# 20. TypeScript Types

## User

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
}
```

## Auth tokens

```typescript
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}
```

## Service

```typescript
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number | string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

Verify whether the actual backend response uses `duration` or another property.

## Booking status

```typescript
export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED';
```

## Booking

```typescript
export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  service?: ServiceItem;
  bookingDate: string;
  bookingTime: string;
  status: BookingStatus;
  notes?: string | null;
  cancelledAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
```

## Pagination

```typescript
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}
```

## Generic response

```typescript
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}
```

Always confirm actual API fields using Postman before finalizing types.

---

# 21. Dashboard Layout

All dashboard routes require authentication.

## Desktop

- Dark sidebar
- Header
- Main content
- User summary
- Logout

## Mobile

- Top bar
- Drawer sidebar
- Accessible open/close button
- Clear page title
- Touch-friendly actions

## Sidebar

- Overview
- Services
- Bookings
- Public Website

## Sidebar footer

- User name
- Email
- Logout

Use the AETHER surface, border, type, and radius language.

---

# 22. Dashboard Overview

Route:

```text
/dashboard
```

Display:

- Total services
- Active services
- Inactive services
- Total bookings
- Pending bookings
- Confirmed bookings
- Completed bookings
- Cancelled bookings
- Recent bookings
- Status summary
- Quick links

Use:

```http
GET /services
GET /bookings
```

When no dedicated analytics endpoint exists:

- Use pagination totals where possible.
- Do not assume page one contains all data.
- Clearly separate exact totals from client-calculated values.

---

# 23. Service Management

Route:

```text
/dashboard/services
```

Features:

- Search
- Active filter
- Pagination
- Create
- View
- Edit
- Delete
- Confirmation dialog
- Responsive table/cards
- Loading
- Empty
- Error
- Retry
- Success toast
- Validation feedback

Fields:

- Title
- Description
- Duration
- Price
- Active status

Delete handling:

- Show the service name.
- Explain that related bookings can prevent deletion.
- Display backend conflict messages.
- Refresh the list after success.

---

# 24. Booking Management

Route:

```text
/dashboard/bookings
```

Features:

- Search
- Status filter
- Service filter
- Pagination
- Responsive list
- Booking details link
- Valid status actions
- Confirmation dialogs
- Loading
- Empty
- Error
- Retry

Display:

- Reference
- Customer
- Email
- Phone
- Service
- Date
- Time
- Status
- Notes
- Actions

Keep filters in URL search parameters when practical.

Reset the page to `1` when filters change.

Debounce text search.

---

# 25. Booking Details

Route:

```text
/dashboard/bookings/[id]
```

Display:

- Reference
- Customer information
- Service information
- Date
- Time
- Status
- Notes
- Created time
- Updated time
- Cancelled time
- Valid actions
- Back button

Handle:

- Invalid ID
- Missing booking
- Network failure
- Unauthorized session
- Rejected transition
- Successful update

---

# 26. Booking Status Rules

Allowed:

```text
PENDING -> CONFIRMED
PENDING -> CANCELLED
CONFIRMED -> COMPLETED
CONFIRMED -> CANCELLED
```

Final:

```text
CANCELLED
COMPLETED
```

Frontend behavior:

- Hide invalid actions.
- Confirm status changes.
- Still handle a backend rejection.
- Refresh the booking after an update.

Never allow:

```text
CANCELLED -> COMPLETED
COMPLETED -> CANCELLED
```

---

# 27. Reusable UI Requirements

## Button

Variants:

- Primary
- Secondary
- Ghost
- Danger
- Pill

Support:

- Loading
- Disabled
- Icon
- Full width
- Accessible focus
- Correct `type`

## Inputs

Support:

- Label
- Required indicator
- Hint
- Error
- Disabled
- Read-only
- `aria-invalid`
- `aria-describedby`

## Modal and dialog

Support:

- Focus management
- Escape key
- Accessible title
- Accessible description
- Background scroll lock
- Mobile layout

## Pagination

Support:

- Previous
- Next
- Current page
- Total pages
- Disabled boundaries
- Filter preservation

## UI states

Every data screen must include:

- Initial loading
- Refetch loading
- Skeleton
- Empty state
- Error state
- Retry
- Success message
- Disabled submission
- Mobile layout

---

# 28. Responsive Requirements

Support:

```text
Mobile: 320px+
Tablet: 768px+
Desktop: 1024px+
Large desktop: 1440px+
```

Mobile:

- Stack forms
- Full-width main actions
- Mobile menu
- Dashboard drawer
- 44px touch targets
- Reduced animation density
- No horizontal page overflow
- Mobile cards or safe table scrolling

Desktop:

- Controlled max width
- Editorial first-screen composition
- Deliberate whitespace
- Balanced content and focal visual

---

# 29. Accessibility

Required:

- Semantic HTML
- Skip link
- One primary page heading
- Keyboard navigation
- Visible focus
- Correct labels
- Field errors connected to fields
- Accessible mobile navigation
- Accessible dialogs
- Status text, not color alone
- `aria-live` feedback
- Reduced motion
- Good contrast
- Descriptive icon buttons

Test the whole product without a mouse.

---

# 30. Performance

- Use Server Components for static sections.
- Use Client Components only when needed.
- Use `next/image`.
- Use `next/font`.
- Lazy-load heavy React Bits effects.
- Use one main hero canvas.
- Do not repeat heavy effects in dashboard pages.
- Debounce search.
- Avoid duplicate API requests.
- Avoid hydration mismatches.
- Clean up animation resources.
- Use stable data IDs as React keys.

---

# 31. User-Friendly Error Messages

Examples:

```text
Invalid email or password.
This email is already registered.
This service is no longer available.
This time slot is already booked.
Booking date and time must be in the future.
Too many requests. Please wait and try again.
Your session has expired. Please log in again.
We could not connect to the server.
```

Do not show:

- PostgreSQL errors
- TypeORM errors
- JWT stack traces
- NestJS stack traces

---

# 32. Testing Plan

## Unit

- Currency formatter
- Duration formatter
- Date formatter
- Booking transition helper
- API error parser
- Token storage
- Zod schemas

## Component

- Login form
- Registration confirmation
- Booking form
- Service form
- Status badge
- Pagination
- Confirmation dialog
- Loading and empty states

## Integration

- Login and redirect
- Access token refresh
- Failed refresh logout
- Public booking request
- Duplicate booking feedback
- Service CRUD
- Booking status update

## End-to-end

1. Register
2. Login
3. Create a service
4. Browse public services
5. Create a public booking
6. Confirm a booking
7. Complete a booking
8. Cancel a pending booking
9. Verify final bookings have no actions
10. Logout
11. Verify dashboard redirects to login

---

# 33. Implementation Order

## Phase 1: Inspect

- Backend README
- Backend controllers
- Backend DTOs
- Postman responses
- `aether-9-1-DESIGN.md`
- `.mcp.json`
- Public service endpoint

## Phase 2: Scaffold

- Create Next.js app
- Install dependencies
- Configure port 3001
- Create routes
- Create environment configuration

## Phase 3: AETHER system

- Load fonts
- Add exact tokens
- Create buttons
- Create inputs
- Create cards
- Create modal
- Create loading and error states

## Phase 4: API and authentication

- Add types
- Add API client
- Add token storage
- Add refresh lock
- Add AuthProvider
- Add AuthGate
- Add GuestGate

## Phase 5: Public product

- Navbar
- Mobile menu
- Landing page
- Services page
- Booking page
- Login
- Registration
- Footer

## Phase 6: Dashboard

- Dashboard shell
- Overview
- Service management
- Booking management
- Booking details
- Logout

## Phase 7: React Bits

- Hero background
- Heading reveal
- Section reveals
- Card lift
- Final CTA effect
- Reduced-motion fallback

## Phase 8: Quality

- Responsive tests
- Keyboard tests
- API integration tests
- Lint
- Type check
- Build
- Fix console and hydration errors

---

# 34. Commands

Install:

```bash
npm install
```

Develop:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3001
```

Backend:

```text
http://localhost:3000/api/v1
```

Lint:

```bash
npm run lint
```

Type check:

```bash
npm run typecheck
```

Build:

```bash
npm run build
```

Production:

```bash
npm run start
```

---

# 35. Unsupported Features

Do not present these as working without backend support:

- Customer accounts
- Email verification
- Forgot password
- Password reset
- Payments
- Email notifications
- SMS notifications
- Booking rescheduling
- Staff roles
- File upload
- Advanced analytics

List them only as future improvements.

---

# 36. Final Checklist

## Structure

- [ ] App Router used
- [ ] Required structure followed
- [ ] API code centralized
- [ ] Token code centralized
- [ ] React Bits code isolated
- [ ] Pages remain small

## AETHER design

- [ ] Background is `#000000`
- [ ] Surface is `#18181B`
- [ ] Primary text is `#FFFFFF`
- [ ] Secondary text is `#A1A1AA`
- [ ] Borders are `#27272A`
- [ ] Inter is used
- [ ] JetBrains Mono is used
- [ ] 64px display maximum preserved
- [ ] 8px base spacing used
- [ ] 16px common gap used
- [ ] 24px card padding used
- [ ] 80px section padding used
- [ ] 16px card radius used
- [ ] 8px control radius used
- [ ] Pill radius used
- [ ] No unapproved light theme
- [ ] No unrelated color family
- [ ] No generic SaaS redesign

## React Bits

- [ ] `.mcp.json` inspected
- [ ] Components found through MCP
- [ ] Hero effect works
- [ ] Masked reveal works
- [ ] Hover lift is restrained
- [ ] Animation does not block clicks
- [ ] Mobile performance checked
- [ ] Reduced motion works
- [ ] No unnecessary heavy effects

## Landing page

- [ ] Navbar
- [ ] Mobile menu
- [ ] Login in navbar
- [ ] Register in navbar
- [ ] Login/Register in mobile menu
- [ ] Staff Portal section
- [ ] Login/Register in footer
- [ ] Hero
- [ ] Active services preview
- [ ] How It Works
- [ ] Benefits
- [ ] Final CTA
- [ ] Footer

## Authentication

- [ ] Register
- [ ] Duplicate email handling
- [ ] Login
- [ ] Invalid credentials handling
- [ ] Access token storage
- [ ] Refresh token storage
- [ ] Token rotation
- [ ] Shared refresh lock
- [ ] Logout
- [ ] Protected route redirect
- [ ] Guest route redirect
- [ ] Rate-limit message

## Booking

- [ ] Active services load
- [ ] Query service preselection
- [ ] Past date blocked
- [ ] Form validation
- [ ] Correct request payload
- [ ] Duplicate slot handled
- [ ] Inactive service handled
- [ ] Success result
- [ ] PENDING status displayed

## Dashboard

- [ ] Auth loading state
- [ ] Sidebar
- [ ] Mobile drawer
- [ ] User summary
- [ ] Overview statistics
- [ ] Recent bookings
- [ ] Logout

## Service management

- [ ] List
- [ ] Search
- [ ] Filter
- [ ] Pagination
- [ ] Create
- [ ] View
- [ ] Edit
- [ ] Delete confirmation
- [ ] Delete result
- [ ] Error handling

## Booking management

- [ ] List
- [ ] Search
- [ ] Status filter
- [ ] Service filter
- [ ] Pagination
- [ ] Details
- [ ] Confirm
- [ ] Complete
- [ ] Cancel
- [ ] Final-state actions hidden

## Quality

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] No hydration warning
- [ ] No console errors
- [ ] No broken route
- [ ] No hardcoded API URL
- [ ] No frontend secrets
- [ ] Mobile works at 320px
- [ ] Keyboard navigation works
- [ ] Reduced motion works

---

# 37. Complete AI/Codex Generation Prompt

Use this after placing this README, `aether-9-1-DESIGN.md`, and `.mcp.json` in the frontend directory.

```text
Create the complete EN2H Booking Platform frontend inside the frontend folder using Next.js App Router, React, TypeScript, CSS Modules, global CSS variables, React Hook Form, Zod, Lucide React, Sonner, date-fns, and the existing NestJS backend.

Before writing code, inspect:
1. backend source code
2. backend README
3. actual Postman responses
4. frontend/aether-9-1-DESIGN.md
5. frontend/.mcp.json
6. frontend/README.md

Follow the exact frontend folder structure in README.md.

Treat aether-9-1-DESIGN.md as the visual source of truth.

Use this exact AETHER palette:
- primary #000000
- secondary #FFFFFF
- accent #000000
- background #000000
- surface #18181B
- text-primary #FFFFFF
- text-secondary #A1A1AA
- border #27272A

Use Inter for display and body text.
Use JetBrains Mono for labels and metadata.

Preserve:
- 64px desktop display heading
- 500 display weight
- 1.04 display line height
- 16px body text
- 1.6 body line height
- 12px mono labels
- 8px base spacing
- 16px standard gaps
- 24px card padding
- 80px section padding
- 16px card radius
- 8px control radius
- 9999px pill radius

AETHER is a dark design. Do not create an unapproved light mode. Do not replace it with a generic SaaS theme. Do not add an unrelated blue, purple, green, or orange color palette.

Read .mcp.json and use the configured React Bits MCP. Search the MCP instead of guessing React Bits APIs. Select restrained components for:
- one ambient hero background
- masked hero text reveal
- staggered entrance
- scroll section reveal
- service-card hover lift
- final CTA ambient background
- small dashboard card entrances

Place React Bits generated code in src/components/react-bits and project wrappers in src/components/animations. Replace all default effect colors with AETHER tokens. Keep effects behind content, pointer-events none, accessible, responsive, performant, and compatible with prefers-reduced-motion.

Run the frontend on port 3001.
Use NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1.
Never place backend JWT secrets or database credentials in the frontend.

Create these routes:
- /
- /services
- /book
- /login
- /register
- /dashboard
- /dashboard/services
- /dashboard/bookings
- /dashboard/bookings/[id]
- not-found route

Create a complete AETHER landing page containing:
- desktop navbar
- accessible mobile navigation
- EN2H brand
- Home
- Services
- How It Works
- Book Now
- Login
- Register
- strong first-screen hero
- ambient React Bits background
- mono label
- large editorial heading
- primary booking CTA
- secondary services CTA
- active services preview
- How It Works
- benefits
- dedicated Staff Portal section
- final CTA
- footer

Place Login and Register in:
- desktop navbar
- mobile navigation
- Staff Portal section
- footer

Keep Book Now as the primary customer action. Do not make staff actions compete equally with the main hero CTA.

Implement the public services page and public booking page. Verify the backend provides a public active-service endpoint, preferably GET /services/public/active. If it does not exist, report the backend compatibility issue instead of bypassing authentication.

The booking form must support:
- serviceId
- customerName
- customerEmail
- customerPhone
- bookingDate
- bookingTime
- notes

Support serviceId from the URL query. Block past dates in the UI. Handle backend validation, duplicate booking conflict, inactive service, missing service, network error, rate limiting, loading, disabled submission, and success confirmation with booking reference and PENDING status.

Implement:
- registration
- login
- access token
- refresh token rotation
- logout
- profile restoration
- AuthProvider
- AuthGate
- GuestGate

Because the backend returns tokens as JSON, use browser storage only from Client Components. Do not read localStorage in Server Components or Next.js middleware.

Create a centralized typed Fetch API client. It must:
- add Bearer access token
- parse NestJS validation arrays
- handle 400, 401, 403, 404, 409, 429, and 500
- refresh an expired access token
- save both rotated tokens
- retry once
- avoid refreshing the refresh endpoint
- avoid infinite loops
- use one shared refresh promise for simultaneous 401 responses
- clear invalid sessions
- return user-friendly errors

Create a protected dashboard with:
- sidebar
- mobile drawer
- user details
- logout
- service totals
- booking totals
- status summary
- recent bookings

Create service management with:
- search
- active filter
- pagination
- create
- view
- edit
- delete
- validation
- confirmation dialog
- loading
- empty
- error
- retry
- success toast

Create booking management with:
- search
- status filter
- service filter
- pagination
- details
- status badges
- confirmation dialogs
- error handling

Only expose these booking transitions:
- PENDING to CONFIRMED
- PENDING to CANCELLED
- CONFIRMED to COMPLETED
- CONFIRMED to CANCELLED

CANCELLED and COMPLETED have no actions.

Make every page responsive and accessible. Include semantic HTML, skip link, keyboard focus, labels, connected field errors, accessible dialogs, aria-live feedback, loading skeletons, empty states, retry actions, reduced motion, 44px touch targets, and no horizontal overflow.

Do not implement unsupported functionality such as email verification, forgot password, password reset, payments, notifications, customer accounts, or staff roles unless the backend provides the required endpoints.

After implementation:
1. run npm run lint
2. run npm run typecheck
3. run npm run build
4. fix every error
5. fix hydration warnings
6. test the complete frontend against the NestJS backend
7. clearly report any backend endpoint mismatch
```

---

# 38. Definition of Done

The frontend is complete only when:

- The required structure is followed.
- AETHER exact tokens are used.
- The dark color mode is preserved.
- The landing page is complete.
- Login and Register are placed correctly.
- React Bits MCP is used correctly.
- Public services work.
- Public booking works.
- Authentication and token rotation work.
- Dashboard protection works.
- Service CRUD works.
- Booking management works.
- Invalid booking actions are hidden.
- Loading, empty, error, and success states exist.
- Responsive design works.
- Accessibility works.
- Reduced motion works.
- Lint passes.
- Type check passes.
- Production build passes.
