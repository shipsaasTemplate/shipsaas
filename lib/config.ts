// ===========================================
// 🔧 App Configuration — Single Source of Truth
// ===========================================
// This is the ONLY config file for your entire app.
// Update the values below to match your product.
//
// Usage:
//   import config from "@/lib/config"
//   config.name, config.stripe.plans, etc.
// ===========================================

const config = {
  // ===========================================
  // REQUIRED — Basic App Info
  // ===========================================

  // TODO: Change this to your app name
  name: "YourApp",

  // TODO: Change this to your app description (used for SEO & landing page)
  description:
    "A brief description of what your app does and the value it provides.",

  // TODO: Change this to your production domain (with https://)
  url: "https://yourapp.com",

  // TODO: Change this to your domain (no https://, no trailing slash)
  domainName: "yourapp.com",

  // OG image path (relative to public/)
  ogImage: "/og-image.png",

  // ===========================================
  // Branding & Social
  // ===========================================

  // TODO: Add your social links (leave empty string to hide)
  github: "https://github.com/your-username/your-repo",
  twitter: "https://twitter.com/",

  // ===========================================
  // SEO Keywords
  // ===========================================

  // TODO: Update with your product's keywords
  keywords: ["SaaS", "Next.js", "React", "boilerplate"],

  // ===========================================
  // Navigation Links
  // ===========================================
  navLinks: [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ],

  // ===========================================
  // Auth Configuration
  // ===========================================
  auth: {
    loginUrl: "/login",
    callbackUrl: "/",
    providers: ["google"], // TODO: Add more providers
  },

  // ===========================================
  // Stripe Pricing Plans
  // ===========================================
  // TODO: Replace price IDs with your actual Stripe price IDs
  // Get them from: https://dashboard.stripe.com/products
  stripe: {
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_dev_starter"
            : "price_prod_starter",
        name: "Starter",
        description: "Perfect for individuals getting started",
        price: 29,
        priceAnchor: 49,
        isFeatured: false,
        features: [
          { name: "Feature 1" },
          { name: "Feature 2" },
          { name: "Feature 3" },
          { name: "Email support" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_dev_pro"
            : "price_prod_pro",
        name: "Pro",
        description: "Best for growing businesses",
        price: 79,
        priceAnchor: 129,
        isFeatured: true,
        features: [
          { name: "Everything in Starter" },
          { name: "Advanced Feature 1" },
          { name: "Advanced Feature 2" },
          { name: "Priority support" },
          { name: "API access" },
        ],
      },
    ],
  },

  // ===========================================
  // OPTIONAL — Waiting List Mode
  // ===========================================
  // Set enabled to true to replace the Pricing section
  // with a waiting list signup form on your landing page.
  waitingList: {
    enabled: false,
    title: "Join the Waiting List",
    subtitle:
      "Be the first to know when we launch. Get early access and exclusive updates.",
    buttonText: "Join Now",
    placeholder: "Enter your email",
    successMessage: "Thank you for joining the waiting list! ",
    duplicateMessage: "You're already on the list! We'll notify you soon.",
    showCount: true, // Show "X+ people already joined"
  },

  // ===========================================
  // OPTIONAL — Crisp Chat Support
  // ===========================================
  crisp: {
    // Get your Crisp ID from https://crisp.chat
    id: "",
    onlyShowOnRoutes: ["/"],
  },

  // ===========================================
  // OPTIONAL — Email (Mailgun)
  // ===========================================
  mailgun: {
    subdomain: "mg",
    // TODO: Update these email addresses
    fromNoReply: "YourApp <noreply@mg.yourapp.com>",
    fromAdmin: "YourApp <admin@mg.yourapp.com>",
    supportEmail: "support@yourapp.com",
    forwardRepliesTo: "support@yourapp.com",
  },

  // ===========================================
  // OPTIONAL — AWS S3/CloudFront
  // ===========================================
  aws: {
    bucket: "your-bucket-name",
    bucketUrl: "https://your-bucket-name.s3.amazonaws.com/",
    cdn: "https://your-cdn-id.cloudfront.net/",
  },

  // ===========================================
  // Theme & Colors
  // ===========================================
  colors: {
    theme: "dark" as const,
    main: "#ffffff",
  },

  // ===========================================
  // Footer Links
  // ===========================================
  footerLinks: {
    product: [
      { href: "#features", label: "Features" },
      { href: "#pricing", label: "Pricing" },
      { href: "#faq", label: "FAQ" },
    ],
    resources: [
      { href: "#", label: "Blog" },
      { href: "#", label: "Changelog" },
      { href: "#", label: "Support" },
    ],
    legal: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
};

export default config;

// Backward-compatible named export
export const siteConfig = config;

export type AppConfig = typeof config;
