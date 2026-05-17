# Stripe Setup — ShipSaaS

> Stripe payments integration: checkout, webhooks, customer portal, and pricing plans.

## Available Functions (`lib/stripe.ts`)

### `createCheckout(options)`
Creates a Stripe Checkout Session for one-time payments or subscriptions.

```ts
const url = await createCheckout({
  priceId: "price_xxx",
  mode: "payment",            // or "subscription"
  successUrl: "https://yourapp.com/success",
  cancelUrl: "https://yourapp.com/pricing",
  user: {
    customerId: "cus_xxx",    // optional — attach to existing customer
    email: "user@example.com" // optional — pre-fill email
  },
  couponId: "LAUNCH20",       // optional — apply discount
  clientReferenceId: "user_123", // optional — track in webhook
});
// Returns: Stripe Checkout URL (redirect user here)
```

### `createCustomerPortal(options)`
Creates a Stripe Customer Portal session for subscription management.

```ts
const url = await createCustomerPortal({
  customerId: "cus_xxx",
  returnUrl: "https://yourapp.com/dashboard",
});
// Returns: Portal URL or null on error
```

### `findCheckoutSession(sessionId)`
Retrieves a Checkout Session by ID (useful in webhooks).

```ts
const session = await findCheckoutSession("cs_xxx");
// Returns: Stripe.Checkout.Session with expanded line_items, or null
```

## Pricing Plans (`lib/config.ts`)

Plans are defined in `config.stripe.plans`:

```ts
{
  plans: [
    {
      priceId: "price_dev_starter" | "price_prod_starter",
      name: "Starter",
      price: 29,
      priceAnchor: 49,        // Crossed-out original price
      isFeatured: false,
      features: [{ name: "Feature 1" }, ...],
    },
    {
      priceId: "price_dev_pro" | "price_prod_pro",
      name: "Pro",
      price: 79,
      priceAnchor: 129,
      isFeatured: true,       // Highlighted plan
      features: [{ name: "Everything in Starter" }, ...],
    },
  ],
}
```

**Important:** Replace `price_dev_*` and `price_prod_*` with real Stripe Price IDs from your [Stripe Dashboard](https://dashboard.stripe.com/products).

## Payment Flow

```
1. User clicks "Get Started" on Pricing section
     │
     ▼
2. POST /api/stripe/checkout  (API route — TODO: create this)
     │  Body: { priceId, mode }
     │  Server: auth() → get session → createCheckout()
     ▼
3. Redirect → Stripe Checkout page
     │  User enters payment details
     ▼
4. Success → redirect to successUrl
   Cancel  → redirect to cancelUrl
     │
     ▼
5. Stripe fires webhook → POST /api/stripe/webhook  (TODO: create this)
     │  Event: checkout.session.completed
     │  Server: findCheckoutSession() → update user in Supabase
     ▼
6. Update Supabase users table:
     user.customer_id = session.customer
     user.price_id = line_items[0].price.id
     user.has_access = true
```

## API Routes to Create (TODO)

### `app/api/stripe/checkout/route.ts`

```ts
import { auth } from "@/lib/auth";
import { createCheckout } from "@/lib/stripe";
import { NextResponse } from "next/server";
import config from "@/lib/config";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { priceId, mode = "payment" } = await req.json();

  const url = await createCheckout({
    priceId,
    mode,
    successUrl: `${config.url}/success`,
    cancelUrl: `${config.url}/#pricing`,
    clientReferenceId: session.user.id,
    user: { email: session.user.email! },
  });

  return NextResponse.json({ url });
}
```

### `app/api/stripe/webhook/route.ts`

```ts
import { findCheckoutSession } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body, signature, process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = await findCheckoutSession(event.data.object.id);
    const userId = session?.client_reference_id;
    const customerId = session?.customer as string;
    const priceId = session?.line_items?.data[0]?.price?.id;

    if (userId && supabase) {
      await supabase.from("users").update({
        customer_id: customerId,
        price_id: priceId,
        has_access: true,
      }).eq("id", userId);
    }
  }

  return NextResponse.json({ received: true });
}
```

## Environment Variables

```bash
STRIPE_SECRET_KEY=sk_test_...                    # Stripe secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...   # Stripe publishable key (client-side)
STRIPE_WEBHOOK_SECRET=whsec_...                  # Webhook signing secret
```

## Local Webhook Testing

```bash
# Install Stripe CLI, then:
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy the webhook signing secret it outputs → STRIPE_WEBHOOK_SECRET
```
