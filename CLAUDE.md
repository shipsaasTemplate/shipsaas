# CLAUDE.md — ShipSaaS Template

> This file is auto-read by Claude when opening the project. It provides the essential context for AI-assisted development.

## Project Overview

**ShipSaaS** is a production-ready Next.js SaaS starter kit. It includes authentication, payments, database, email, SEO, and a polished landing page — all pre-configured so developers can ship fast.

## Commands

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Framework      | Next.js 16 (App Router)             |
| Language       | TypeScript (strict mode)            |
| UI             | React 19                            |
| Styling        | Tailwind CSS v4 + Shadcn UI (New York) |
| Auth           | Auth.js v5 (NextAuth) + Google OAuth |
| Database       | Supabase (PostgreSQL)               |
| Payments       | Stripe (Checkout + Customer Portal) |
| Email          | Mailgun                             |
| Animations     | Framer Motion + Magic UI            |
| Analytics      | Vercel Analytics                    |
| SEO            | next-sitemap + custom helpers       |

## Key Architecture Rules

1. **Server Components by default** — only add `"use client"` when you need interactivity (hooks, event handlers, browser APIs).
2. **Server Actions** (`"use server"`) for all database mutations and form handling.
3. **Single config file** — `lib/config.ts` is the single source of truth for app name, description, pricing, auth, email, and all settings. Always import from there.
4. **Graceful degradation** — Supabase client returns `null` if env vars are missing. Always check `if (!supabase) return null` before DB operations.
5. **Path alias** — Use `@/` prefix for imports (maps to project root). Example: `import config from "@/lib/config"`.

## File Structure Quick Reference

```
lib/config.ts       → 🔧 ALL app settings (name, pricing, auth, email, etc.)
lib/auth.ts         → Auth.js v5 config + Google OAuth + Supabase user sync
lib/supabase.ts     → Supabase client (null-safe)
lib/stripe.ts       → Stripe helpers (createCheckout, createCustomerPortal)
lib/email.ts        → Mailgun email sender
lib/seo.tsx         → SEO metadata + Schema.org helpers
lib/waiting-list.ts → Waiting list server actions

app/page.tsx        → Landing page (assembles all sections)
app/login/page.tsx  → Login page (Google OAuth via Server Action)
app/layout.tsx      → Root layout (ThemeProvider, Toaster, Analytics)
app/globals.css     → Theme tokens (Tailwind v4 oklch colors)

app/api/auth/[...nextauth]/route.ts → NextAuth route handler
app/api/api.ts      → Axios client for frontend → API communication

components/landing/  → Landing page sections (Navbar, Hero, Features, etc.)
components/ui/       → Shadcn UI primitives (Button, Card, Input, etc.)
components/magicui/  → Animation components (AuroraText, etc.)
```

## Environment Variables

All env vars go in `.env.local` (see `.env.example` for the full list):

```
AUTH_SECRET            — Required. Generate: openssl rand -base64 32
AUTH_GOOGLE_ID         — Google OAuth Client ID
AUTH_GOOGLE_SECRET     — Google OAuth Client Secret
SUPABASE_URL           — Supabase project URL
SUPABASE_KEY           — Supabase anon key
STRIPE_SECRET_KEY      — Stripe secret key
STRIPE_WEBHOOK_SECRET  — Stripe webhook signing secret
MAILGUN_API_KEY        — Mailgun API key (optional)
```

## Style & Design Rules

- **Dark theme by default** (`defaultTheme="dark"` in ThemeProvider)
- **Brand gradient**: Violet-600 → Indigo-600 (`bg-gradient-to-br from-violet-600 to-indigo-600`)
- **Color space**: oklch (defined in `globals.css`)
- **Font**: Inter (loaded via `next/font/google`)
- **Do NOT modify** theme tokens in `globals.css` unless explicitly asked
- **Shadcn style**: New York variant, use `npx shadcn@latest add <component>` to add new components

## Additional Context

For detailed context on specific topics, see:
- `project_context.md` — Full project structure and patterns
- `.claude/prompts/auth-flow.md` — Authentication flow details
- `.claude/prompts/supabase-schema.md` — Database schema
- `.claude/prompts/stripe-setup.md` — Payments integration
- `.claude/prompts/seo-guide.md` — SEO best practices
- `.claude/prompts/component-library.md` — UI component reference
