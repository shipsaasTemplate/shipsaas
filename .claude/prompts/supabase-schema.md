# Supabase Schema — ShipSaaS

> Database schema definitions, RLS policies, and RPC functions for the ShipSaaS template.

## Tables

### `users` — Synced from Auth.js on first sign-in

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  customer_id TEXT,              -- Stripe customer ID (set after first payment)
  price_id TEXT,                 -- Active Stripe price ID (set after subscription)
  has_access BOOLEAN DEFAULT false,  -- Whether user has paid access
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**How it's used:**
- `lib/auth.ts` → `getUser(email)` — looks up user by email
- `lib/auth.ts` → `createUser({ email, full_name })` — creates on first sign-in
- Stripe webhook (TODO) → updates `customer_id`, `price_id`, `has_access`

### `waiting_list` — Email signups for pre-launch

```sql
CREATE TABLE waiting_list (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**How it's used:**
- `lib/waiting-list.ts` → `joinWaitingList(email)` — inserts email
- `lib/waiting-list.ts` → `getWaitingListCount()` — calls RPC function

## RPC Functions

### `get_waiting_list_count` — Returns total signups

```sql
CREATE OR REPLACE FUNCTION get_waiting_list_count()
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM waiting_list;
$$ LANGUAGE SQL;
```

## Row Level Security (RLS)

### Recommended policies for `users` table:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow the service role (server-side) to do everything
CREATE POLICY "Service role has full access"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.email() = email);
```

### Recommended policies for `waiting_list` table:

```sql
-- Enable RLS
ALTER TABLE waiting_list ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (public signup)
CREATE POLICY "Anyone can join waiting list"
  ON waiting_list FOR INSERT
  WITH CHECK (true);

-- Only service role can read (admin dashboard)
CREATE POLICY "Service role can read"
  ON waiting_list FOR SELECT
  USING (true);
```

## Supabase Client Configuration

The Supabase client in `lib/supabase.ts` uses the **anon key** (not the service role key):

```ts
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;  // Returns null if not configured — always check!
```

**Important:** Since we use the anon key, RLS policies must allow the operations the app needs. For server-side operations that bypass RLS, consider using the service role key in a separate server-only client.

## Environment Variables

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

Get these from: `https://supabase.com/dashboard/project/_/settings/api`

## Future Tables to Consider

When building out the product, you may need:

```sql
-- Products/items table (if not using Stripe Products)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User activity / audit log
CREATE TABLE activity_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
