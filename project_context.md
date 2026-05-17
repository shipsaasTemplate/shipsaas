# Project Context — ShipSaaS Template

> Detailed project architecture, patterns, and dependency map for AI-assisted development.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Next.js App Router                │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Landing   │  │ Login    │  │ Dashboard (TODO)  │  │
│  │ page.tsx  │  │ page.tsx │  │ Protected pages   │  │
│  └─────┬────┘  └─────┬────┘  └────────┬──────────┘  │
│        │             │                │              │
│  ┌─────▼─────────────▼────────────────▼──────────┐  │
│  │              lib/ (Core Logic)                 │  │
│  │  config.ts ← Single Source of Truth            │  │
│  │  auth.ts   ← Auth.js v5 + Supabase sync       │  │
│  │  stripe.ts ← Checkout + Portal + Sessions     │  │
│  │  supabase.ts ← DB client (null-safe)          │  │
│  │  email.ts  ← Mailgun sender                   │  │
│  │  seo.tsx   ← Metadata + Schema.org            │  │
│  └──────────────────┬────────────────────────────┘  │
│                     │                                │
│  ┌──────────────────▼────────────────────────────┐  │
│  │           External Services                    │  │
│  │  Supabase (DB) │ Stripe (Payments) │ Mailgun  │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Dependency Map

### `lib/config.ts` (depended on by everything)
- Used by: `auth.ts`, `stripe.ts`, `email.ts`, `seo.tsx`, `api.ts`, `Navbar`, `Hero`, `Pricing`, `Footer`, `WaitingList`, `layout.tsx`, `next-sitemap.config.js`
- Dependencies: none (pure config object)
- **This is the first file to modify when customizing the template.**

### `lib/auth.ts`
- Used by: `app/api/auth/[...nextauth]/route.ts`, `app/login/page.tsx`
- Dependencies: `next-auth`, `lib/supabase.ts`
- Exports: `auth`, `signIn`, `signOut`, `handlers`

### `lib/supabase.ts`
- Used by: `lib/auth.ts`, `lib/waiting-list.ts`
- Dependencies: `@supabase/supabase-js`
- Returns `null` if `SUPABASE_URL` or `SUPABASE_KEY` is missing

### `lib/stripe.ts`
- Used by: API routes (to be created)
- Dependencies: `stripe`
- Exports: `createCheckout`, `createCustomerPortal`, `findCheckoutSession`

### `lib/email.ts`
- Used by: API routes, server actions
- Dependencies: `mailgun.js`, `form-data`, `lib/config.ts`
- Exports: `sendEmail`

### `lib/seo.tsx`
- Used by: Any page that needs custom metadata
- Dependencies: `lib/config.ts`
- Exports: `getSEOTags`, `renderSchemaTags`

### `lib/waiting-list.ts`
- Used by: `components/landing/WaitingList.tsx`
- Dependencies: `lib/supabase.ts`
- Marked with `"use server"` (Server Actions)
- Exports: `joinWaitingList`, `getWaitingListCount`

### `app/api/api.ts` (Frontend API Client)
- Used by: Client components that call API routes
- Dependencies: `axios`, `react-hot-toast`, `lib/config.ts`
- **Note**: This is a client-side utility, NOT an API route

## Patterns & Conventions

### Server Components (default)
```tsx
// app/some-page/page.tsx — Server Component by default
import { auth } from "@/lib/auth";

export default async function SomePage() {
  const session = await auth();
  // Direct DB access, no API needed
}
```

### Client Components (when needed)
```tsx
// components/SomeInteractive.tsx
"use client";

import { useState } from "react";
// Hooks, event handlers, browser APIs
```

### Server Actions (for mutations)
```tsx
// In a server component or separate file with "use server"
async function handleSubmit() {
  "use server";
  // Direct DB writes, no API route needed
}
```

### API Client (frontend → backend)
```tsx
// For complex operations that need API routes
import apiClient from "@/app/api/api";
const data = await apiClient.get("/some-endpoint");
// Auto-handles: 401 → redirect to login, 403 → "pick a plan", errors → toast
```

### Config-Driven UI
```tsx
// Components read from config, not hardcoded values
import { siteConfig } from "@/lib/config";
// siteConfig.name, siteConfig.stripe.plans, siteConfig.navLinks, etc.
```

## Landing Page Sections (in render order)

| Component | File | Description |
|-----------|------|-------------|
| `Navbar` | `components/landing/Navbar.tsx` | Fixed top nav, responsive, theme toggle, mobile menu |
| `Hero` | `components/landing/Hero.tsx` | Main headline + CTA buttons |
| `Features` | `components/landing/Features.tsx` | Feature grid with icons |
| `Steps` | `components/landing/Steps.tsx` | "How it works" steps |
| `Pricing` or `WaitingList` | `components/landing/Pricing.tsx` / `WaitingList.tsx` | Toggled via `config.waitingList.enabled` |
| `Testimonials` | `components/landing/Testimonials.tsx` | Social proof cards |
| `FAQ` | `components/landing/FAQ.tsx` | Accordion FAQ section |
| `CTA` | `components/landing/CTA.tsx` | Final call-to-action |
| `Footer` | `components/landing/Footer.tsx` | Links, social, copyright |

## Error Handling Pattern

The template uses a consistent error handling approach:

1. **Supabase**: Check `if (!supabase) return null` before operations
2. **Auth**: `signIn` callback returns `false` on error (prevents sign-in)
3. **Stripe**: Functions wrapped in try/catch, return `null` on failure
4. **API Client**: Axios interceptor auto-displays errors via `react-hot-toast`
5. **Email**: Logs warning if Mailgun not configured, doesn't crash

## What's NOT Built Yet (TODOs)

- [ ] `middleware.ts` — Route protection (redirect unauthenticated users)
- [ ] `app/dashboard/` — Protected dashboard page
- [ ] `app/api/stripe/webhook/route.ts` — Stripe webhook handler
- [ ] `app/api/stripe/checkout/route.ts` — Stripe checkout route
- [ ] Sign Out button in Navbar (when authenticated)
