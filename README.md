# SaaS Boilerplate Template

A production-ready Next.js SaaS starter. Clone, configure, and ship your product in days.

## Tech Stack

- **Next.js 16** + React 19 + TypeScript
- **Tailwind CSS v4** + Radix UI
- **Auth.js v5** (NextAuth) — Google OAuth
- **Supabase** — PostgreSQL database
- **Stripe** — Payments & subscriptions
- **Framer Motion** — Animations
- **Mailgun** — Transactional emails

## ⚡ Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/your-username/your-saas.git
cd your-saas/my-app

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 📁 Project Structure

```
my-app/
├── app/
│   ├── api/auth/          # NextAuth API routes
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout + SEO
│   └── page.tsx           # Landing page
├── components/
│   ├── landing/           # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Steps.tsx
│   │   ├── Pricing.tsx
│   │   ├── WaitingList.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   ├── CTA.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── ui/                # Reusable UI (Button, Card, Badge...)
├── lib/
│   ├── config.ts          # ⭐ Single source of truth
│   ├── auth.ts            # NextAuth configuration
│   ├── supabase.ts        # Database client
│   ├── stripe.ts          # Payment helpers
│   ├── waiting-list.ts    # Waiting list server actions
│   ├── email.ts           # Mailgun email service
│   ├── seo.tsx            # SEO metadata helpers
│   └── utils.ts           # Utility functions
└── .env.example           # Environment variables template
```

## 🔧 Configuration

Everything is controlled from **one file**: `lib/config.ts`

```typescript
const config = {
  name: "YourApp",
  description: "Your app description",
  url: "https://yourapp.com",
  domainName: "yourapp.com",

  // Social links
  github: "https://github.com/...",
  twitter: "https://twitter.com/...",

  // Navigation
  navLinks: [...],

  // Auth
  auth: { loginUrl: "/login", callbackUrl: "/", providers: ["google"] },

  // Stripe pricing plans
  stripe: { plans: [...] },

  // Waiting list mode (replaces Pricing section)
  waitingList: { enabled: false, title: "...", ... },

  // Footer links, colors, Crisp chat, Mailgun, AWS...
};
```

## 🎨 Customize Landing Page

Edit components in `components/landing/`:

| Component          | What it does                         |
| ------------------ | ------------------------------------ |
| `Hero.tsx`         | Main headline & call-to-action       |
| `Features.tsx`     | Product features grid                |
| `Steps.tsx`        | How it works (step-by-step)          |
| `Pricing.tsx`      | Pricing cards (reads from config)    |
| `WaitingList.tsx`  | Email signup form (toggle in config) |
| `Testimonials.tsx` | Customer reviews                     |
| `FAQ.tsx`          | Frequently asked questions           |
| `CTA.tsx`          | Final call-to-action                 |
| `Navbar.tsx`       | Navigation bar                       |
| `Footer.tsx`       | Footer links & socials               |

## ⏳ Waiting List Mode

Replace the Pricing section with a waiting list signup form:

```typescript
// lib/config.ts
waitingList: {
  enabled: true, // ← flip this switch
  title: "Join the Waiting List",
  subtitle: "Be the first to know when we launch.",
  buttonText: "Join Now",
  successMessage: "Thank you for joining! 🚀",
  duplicateMessage: "You're already on the list!",
  showCount: true,
},
```

**Supabase setup** — run this SQL:

```sql
CREATE TABLE waiting_list (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: count function for "X+ people joined" badge
CREATE OR REPLACE FUNCTION get_waiting_list_count()
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM waiting_list;
$$ LANGUAGE SQL;
```

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Auth
AUTH_SECRET=           # openssl rand -base64 32
AUTH_GOOGLE_ID=        # Google Console → OAuth 2.0
AUTH_GOOGLE_SECRET=

# Database
SUPABASE_URL=          # Supabase → Project Settings → API
SUPABASE_KEY=

# Payments
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email (optional)
MAILGUN_API_KEY=
```

## 🗄️ Database Setup

Create a `users` table in Supabase for authentication:

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🚀 Deploy

### Vercel (Recommended)

1. Push your repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add your environment variables
4. Deploy!

### Build for Production

```bash
npm run build
npm start
```

## 📦 What's Included

- ✅ **Next.js 16** + React 19 + TypeScript
- ✅ **Tailwind CSS v4** + Radix UI components
- ✅ **Auth.js v5** — Google OAuth (easily add GitHub, Discord, etc.)
- ✅ **Supabase** — PostgreSQL database integration
- ✅ **Stripe** — Payments ready with webhook handling
- ✅ **Landing Page** — 10 animated sections with Framer Motion
- ✅ **Waiting List** — Toggle between Pricing & Waiting List in config
- ✅ **SEO** — Metadata, sitemap, Open Graph images
- ✅ **Email** — Mailgun integration
- ✅ **Dark Mode** — Theme support via next-themes
- ✅ **Responsive** — Mobile-first design
- ✅ **Analytics** — Vercel Analytics ready

## License

MIT — Use freely for personal and commercial projects.
