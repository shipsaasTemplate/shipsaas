import config from "@/lib/config";
import type { Metadata } from "next";

// ===========================================
// SEO Helpers
// ===========================================
// Pre-fills SEO tags from your config. Use in any page:
//
//   export const metadata = getSEOTags({
//     title: "Pricing",
//     canonicalUrlRelative: "/pricing",
//   });
//
// Docs: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// ===========================================

/**
 * Generates Next.js Metadata for any page.
 * Falls back to config values for title, description, etc.
 */
export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
  };
  canonicalUrlRelative?: string;
  extraTags?: Record<string, unknown>;
} = {}): Metadata => {
  return {
    title: title || config.name,
    description: description || config.description,
    keywords: keywords || config.keywords,
    applicationName: config.name,

    // Base URL for relative OG images, canonical URLs, etc.
    metadataBase: new URL(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : config.url,
    ),

    openGraph: {
      title: openGraph?.title || config.name,
      description: openGraph?.description || config.description,
      url: openGraph?.url || config.url,
      siteName: config.name,
      locale: "en_US",
      type: "website",
    },

    twitter: {
      title: openGraph?.title || config.name,
      description: openGraph?.description || config.description,
      card: "summary_large_image",
      // TODO: Add your Twitter handle
      // creator: "@yourhandle",
    },

    // Canonical URL
    ...(canonicalUrlRelative && {
      alternates: { canonical: canonicalUrlRelative },
    }),

    ...extraTags,
  };
};

/**
 * Renders Schema.org structured data (JSON-LD) for rich results on Google.
 * Add this to your root page.tsx for better SEO:
 *
 *   export default function Page() {
 *     return (
 *       <>
 *         {renderSchemaTags()}
 *         <LandingPage />
 *       </>
 *     );
 *   }
 *
 * Test your data: https://search.google.com/test/rich-results
 */
export const renderSchemaTags = () => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "http://schema.org",
          "@type": "SoftwareApplication",
          name: config.name,
          description: config.description,
          image: `${config.url}/icon.png`,
          url: config.url,
          // TODO: Update with your own info
          author: {
            "@type": "Organization",
            name: config.name,
          },
          datePublished: new Date().toISOString().split("T")[0],
          applicationCategory: "BusinessApplication",
          offers: config.stripe.plans.map((plan) => ({
            "@type": "Offer",
            price: plan.price.toString(),
            priceCurrency: "USD",
          })),
        }),
      }}
    />
  );
};
