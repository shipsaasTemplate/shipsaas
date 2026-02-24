import Stripe from "stripe";

// ===========================================
// Stripe Helpers
// ===========================================
// Add to .env.local:
//   STRIPE_SECRET_KEY=sk_test_...
//   STRIPE_WEBHOOK_SECRET=whsec_...
//
// Get your keys from: https://dashboard.stripe.com/apikeys
// ===========================================

/**
 * Creates a Stripe Checkout session for one-time payments or subscriptions.
 * Usually triggered via a checkout button or API route.
 *
 * @example
 * const url = await createCheckout({
 *   priceId: "price_xxx",
 *   mode: "payment",
 *   successUrl: "https://yourapp.com/success",
 *   cancelUrl: "https://yourapp.com/pricing",
 * });
 */
export const createCheckout = async ({
  priceId,
  mode = "payment",
  successUrl,
  cancelUrl,
  couponId,
  clientReferenceId,
  user,
}: {
  priceId: string;
  mode?: "payment" | "subscription";
  successUrl: string;
  cancelUrl: string;
  couponId?: string;
  clientReferenceId?: string;
  user?: { customerId?: string; email?: string };
}) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const extraParams: Record<string, unknown> = {};

  if (user?.customerId) {
    extraParams.customer = user.customerId;
  } else {
    if (mode === "payment") {
      extraParams.customer_creation = "always";
      extraParams.payment_intent_data = { setup_future_usage: "on_session" };
    }
    if (user?.email) {
      extraParams.customer_email = user.email;
    }
    extraParams.tax_id_collection = { enabled: true };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode,
    allow_promotion_codes: true,
    client_reference_id: clientReferenceId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    discounts: couponId ? [{ coupon: couponId }] : [],
    success_url: successUrl,
    cancel_url: cancelUrl,
    ...extraParams,
  });

  return stripeSession.url;
};

/**
 * Creates a Stripe Customer Portal session so users can manage
 * their subscriptions, payment methods, and invoices.
 */
export const createCustomerPortal = async ({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return portalSession.url;
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * Retrieves a Stripe Checkout session by ID.
 * Useful in webhooks to get the plan the user subscribed to.
 */
export const findCheckoutSession = async (sessionId: string) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    return session;
  } catch (e) {
    console.error(e);
    return null;
  }
};
