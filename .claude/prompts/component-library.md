# Component Library — ShipSaaS

> UI component reference, design tokens, and guidelines for consistent development.

## UI Components (`components/ui/`)

All UI primitives are from **Shadcn UI (New York style)**. Add new ones with:

```bash
npx shadcn@latest add <component-name>
```

### Currently Available:

| Component | File | Variants / Notes |
|-----------|------|-------------------|
| `Button` | `button.tsx` | `default`, `destructive`, `outline`, `secondary`, `ghost`, `link` — Sizes: `default`, `sm`, `lg`, `icon` |
| `Card` | `card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| `Input` | `input.tsx` | Standard input with focus ring |
| `Label` | `label.tsx` | Form label with proper styling |
| `Field` | `field.tsx` | Label + Input combo component |
| `Badge` | `badge.tsx` | `default`, `secondary`, `destructive`, `outline` |

### Usage Examples:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

<Button variant="outline" size="sm">Click me</Button>

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

## Landing Page Components (`components/landing/`)

| Component | Description | Client/Server |
|-----------|-------------|---------------|
| `Navbar.tsx` | Fixed top nav with responsive mobile menu, theme toggle | Client (`"use client"`) |
| `Hero.tsx` | Main headline, description, CTA buttons | — |
| `Features.tsx` | Feature grid with Lucide icons | — |
| `Steps.tsx` | "How it works" numbered steps | — |
| `Pricing.tsx` | Pricing cards from `config.stripe.plans` | — |
| `WaitingList.tsx` | Email signup form (toggled via `config.waitingList.enabled`) | Client (`"use client"`) |
| `Testimonials.tsx` | Social proof cards | — |
| `FAQ.tsx` | Expandable FAQ accordion | Client (`"use client"`) |
| `CTA.tsx` | Final call-to-action section | — |
| `Footer.tsx` | Links, social icons, copyright | — |

### Landing Page Assembly (`app/page.tsx`):

```tsx
<main>
  <Navbar />
  <Hero />
  <Features />
  <Steps />
  {config.waitingList.enabled ? <WaitingList /> : <Pricing />}
  <Testimonials />
  <FAQ />
  <CTA />
  <Footer />
</main>
```

## Magic UI Components (`components/magicui/`)

| Component | Description |
|-----------|-------------|
| `AuroraText` | Animated gradient text with customizable colors |

```tsx
import { AuroraText } from "@/components/magicui/aurora-text";

<AuroraText colors={["#FF6B6B", "#4ECDC4", "#45B7D1"]}>
  Animated Text
</AuroraText>
```

## Provider Components (`components/`)

| Component | Description |
|-----------|-------------|
| `providers.tsx` | Wraps app in SessionProvider (if needed) |
| `theme-provider.tsx` | next-themes ThemeProvider wrapper |

## Design Tokens

### Theme (defined in `app/globals.css`)

- **Color space**: oklch
- **CSS Framework**: Tailwind CSS v4
- **Custom variant**: `@custom-variant dark (&:is(.dark *))`
- **Default theme**: Dark (set in `layout.tsx` ThemeProvider)

### Brand Colors

```
Primary gradient: from-violet-600 to-indigo-600
Background (dark): oklch(0.145 0 0) ≈ #1a1a1a
Card (dark): oklch(0.145 0 0)
Muted text (dark): oklch(0.708 0 0) ≈ #a3a3a3
Border (dark): oklch(0.269 0 0) ≈ #404040
```

### Typography

- **Font**: Inter (loaded via `next/font/google`, variable: `--font-inter`)
- **Applied**: `font-sans antialiased` on `<body>`

### Border Radius

```
--radius: 0.625rem (10px)
sm: 6px, md: 8px, lg: 10px, xl: 14px, 2xl: 18px
```

## Guidelines for New Components

### Creating a new Landing section:

1. Create file in `components/landing/YourSection.tsx`
2. Use consistent section structure:
   ```tsx
   export default function YourSection() {
     return (
       <section id="your-section" className="py-24">
         <div className="container px-4 mx-auto">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold">Title</h2>
             <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
               Description
             </p>
           </div>
           {/* Content */}
         </div>
       </section>
     );
   }
   ```
3. Add to `app/page.tsx` in the correct order
4. If it needs a nav link, add to `config.navLinks`

### Creating a new UI primitive:

```bash
npx shadcn@latest add dialog    # Example: adding Dialog component
```

This auto-generates the component in `components/ui/` with proper styling.

### Client vs Server rule:

- **Default**: Server Component (no directive needed)
- **Add `"use client"`** only when using: `useState`, `useEffect`, `onClick`, `onChange`, or any React hook
- **Keep client components small** — extract the interactive part, keep data fetching in server components
