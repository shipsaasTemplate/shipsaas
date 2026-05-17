# SEO Guide — ShipSaaS

> SEO configuration, metadata helpers, Schema.org, and sitemap setup.

## SEO Helper Functions (`lib/seo.tsx`)

### `getSEOTags(options)` — Generate page metadata

Use this in any page to generate proper SEO metadata:

```tsx
// app/pricing/page.tsx
import { getSEOTags } from "@/lib/seo";

export const metadata = getSEOTags({
  title: "Pricing",
  description: "Choose the perfect plan for your needs.",
  canonicalUrlRelative: "/pricing",
  keywords: ["pricing", "plans", "SaaS"],
});
```

Falls back to `config.name` and `config.description` if not specified.

**What it generates:**
- `<title>` tag
- `<meta name="description">`
- `<meta name="keywords">`
- OpenGraph tags (title, description, url, siteName, locale)
- Twitter Card tags (summary_large_image)
- Canonical URL (via `alternates.canonical`)
- `metadataBase` (localhost in dev, `config.url` in production)

### `renderSchemaTags()` — Schema.org structured data

Add to your main page for rich results on Google:

```tsx
// app/page.tsx
import { renderSchemaTags } from "@/lib/seo";

export default function Home() {
  return (
    <>
      {renderSchemaTags()}
      <main>...</main>
    </>
  );
}
```

Generates a `SoftwareApplication` schema with:
- App name, description, image, URL
- Pricing offers from `config.stripe.plans`

## Root Layout Metadata (`app/layout.tsx`)

The root layout already defines base metadata:
- `title.default` and `title.template` (`"%s | AppName"`)
- `description` from config
- `keywords` from config
- OpenGraph with `ogImage`
- Twitter Card
- `robots` — indexing enabled with Google Bot settings

## Sitemap (`next-sitemap.config.js`)

Auto-generates `sitemap.xml` and `robots.txt` on `npm run build`.

Current config:
- `siteUrl`: from `SITE_URL` env var or `config.url`
- **Excluded routes**: `/login`, `/api/*`, OG image routes
- Runs automatically via `postbuild` script

**To customize:**
```js
// next-sitemap.config.js
module.exports = {
  siteUrl: "https://yourapp.com",
  generateRobotsTxt: true,
  exclude: ["/login", "/api/*", "/dashboard/*"],
  // Add more pages to exclude as needed
};
```

## OG Image

Place your OG image at:
```
public/og-image.png    (1200 x 630 pixels recommended)
```

Referenced in `config.ogImage` and used by `layout.tsx` metadata.

## SEO Checklist for New Pages

When creating a new page, make sure to:

1. **Add metadata** using `getSEOTags()`:
   ```tsx
   export const metadata = getSEOTags({
     title: "Page Title",
     description: "Page description for search results.",
     canonicalUrlRelative: "/page-path",
   });
   ```

2. **Use semantic HTML**: `<main>`, `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`

3. **Single `<h1>` per page** with proper heading hierarchy

4. **Add to sitemap** if it's a public page (it's automatic unless excluded)

5. **Exclude from sitemap** if it's a private/authenticated page:
   ```js
   // next-sitemap.config.js
   exclude: [...existing, "/new-private-page"],
   ```

## Environment Variables

```bash
SITE_URL=https://yourapp.com   # Used by next-sitemap (optional, falls back to config.url)
```

## Config Values to Update (`lib/config.ts`)

```ts
name: "YourApp",                    // Used in title tags
description: "Your app description", // Used in meta descriptions
url: "https://yourapp.com",         // Used for canonical URLs + OG
domainName: "yourapp.com",          // Used for sitemap
ogImage: "/og-image.png",           // Used for OG + Twitter cards
keywords: ["SaaS", "Next.js"],      // Used in meta keywords
```
