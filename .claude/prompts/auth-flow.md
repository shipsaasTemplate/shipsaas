# Auth Flow — ShipSaaS

> Complete authentication flow using Auth.js v5, Google OAuth, and Supabase user sync.

## Flow Diagram

```
User clicks "Continue with Google" (app/login/page.tsx)
  │
  ▼
Server Action: signIn("google", { redirectTo: "/" })
  │                              (from lib/auth.ts)
  ▼
Redirect → Google OAuth Consent Screen
  │
  ▼
Google redirects back → /api/auth/callback/google
  │                      (handled by app/api/auth/[...nextauth]/route.ts)
  ▼
┌─────────────────────────────────────────┐
│  signIn callback (lib/auth.ts)          │
│                                         │
│  1. getUser(user.email) from Supabase   │
│  2. If user doesn't exist:              │
│     → createUser({ email, full_name })  │
│  3. Return true (allow sign-in)         │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  session callback (lib/auth.ts)         │
│                                         │
│  1. getUser(session.user.email)         │
│  2. Attach Supabase user.id to session  │
│     → session.user.id = dbUser.id       │
│  3. Return enriched session             │
└────────────────┬────────────────────────┘
                 │
                 ▼
Redirect → config.auth.callbackUrl ("/")
           User is now authenticated ✓
```

## Key Files

| File | Purpose |
|------|---------|
| `lib/auth.ts` | Auth.js v5 configuration, providers, callbacks |
| `app/api/auth/[...nextauth]/route.ts` | Route handler (`export { GET, POST }`) |
| `app/login/page.tsx` | Login page UI with Google button |
| `lib/supabase.ts` | Database client for user sync |
| `lib/config.ts` | `auth.loginUrl`, `auth.callbackUrl`, `auth.providers` |

## Environment Variables Required

```bash
AUTH_SECRET=           # Required. Generate: openssl rand -base64 32
AUTH_GOOGLE_ID=        # Google OAuth Client ID
AUTH_GOOGLE_SECRET=    # Google OAuth Client Secret
```

## How to Protect a Page (Server-Side)

```tsx
// app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <div>Welcome, {session.user.name}!</div>;
}
```

## How to Add a New Provider

1. Install the provider (usually included in `next-auth`).
2. Add to `lib/auth.ts`:

```ts
import GitHub from "next-auth/providers/github";

providers: [
  Google({ ... }),
  GitHub({
    clientId: process.env.AUTH_GITHUB_ID,
    clientSecret: process.env.AUTH_GITHUB_SECRET,
  }),
],
```

3. Add env vars to `.env.local`:
```bash
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
```

4. Add a new button in `app/login/page.tsx`.

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
6. Copy Client ID → `AUTH_GOOGLE_ID`
7. Copy Client Secret → `AUTH_GOOGLE_SECRET`

## Supabase Users Table

The auth flow expects this table structure in Supabase:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

The `signIn` callback automatically creates users on first login.
