import config from "@/lib/config";

// ===========================================
// Email Sender (Mailgun)
// ===========================================
// Add to .env.local:
//   MAILGUN_API_KEY=key-xxx
//
// Get your API key from: https://app.mailgun.com/settings/api_security
//
// Configure email settings in lib/config.ts → mailgun section
// ===========================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mg: any = null;

async function getMailgunClient() {
  if (mg) return mg;

  try {
    const formData = (await import("form-data")).default;
    const Mailgun = (await import("mailgun.js")).default;
    const mailgun = new Mailgun(formData);

    mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY || "dummy",
    });

    return mg;
  } catch {
    console.warn(
      "⚠️ Mailgun packages not installed. Run: npm install mailgun.js form-data",
    );
    return null;
  }
}

if (!process.env.MAILGUN_API_KEY && process.env.NODE_ENV === "development") {
  console.warn("⚠️ MAILGUN_API_KEY missing from .env — emails won't be sent.");
}

/**
 * Sends an email via Mailgun.
 *
 * @example
 * await sendEmail({
 *   to: "user@example.com",
 *   subject: "Welcome!",
 *   html: "<h1>Hello</h1>",
 * });
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}) => {
  const client = await getMailgunClient();
  if (!client) {
    console.error("Mailgun client not available. Email not sent.");
    return;
  }

  const domain =
    (config.mailgun.subdomain ? `${config.mailgun.subdomain}.` : "") +
    config.domainName;

  const data = {
    from: config.mailgun.fromAdmin,
    to: [to],
    subject,
    ...(text && { text }),
    ...(html && { html }),
    ...(replyTo && { "h:Reply-To": replyTo }),
  };

  await client.messages.create(domain, data);
};
