# Core Web Vitals & Optimization Checklist

## Core Web Vitals — factors present in this codebase

| Metric | Relevant factor here |
|---|---|
| **LCP** (Largest Contentful Paint) | Hero section image/text is server-rendered (SSR), which helps — but a Render cold start (see [`../architecture/deployment-architecture.md`](../architecture/deployment-architecture.md)) can add significant delay to the very first request after inactivity. The homepage's double-fetch (see [`caching-and-rendering.md`](./caching-and-rendering.md)) doesn't block LCP directly (it's a client-side re-fetch after initial paint) but does waste a network round-trip. |
| **CLS** (Cumulative Layout Shift) | `next/image` with explicit `width`/`height` prevents image-driven shift. Font `display: 'swap'` (see [`images-and-fonts.md`](./images-and-fonts.md)) can cause a small shift on font-swap — an accepted tradeoff. The FOUC-prevention inline script for theme (see [`../architecture/theme-architecture.md`](../architecture/theme-architecture.md)) specifically avoids a theme-driven flash that would otherwise look like a shift. |
| **INP** (Interaction to Next Paint) | No known heavy client-side computation blocking the main thread was found. Framer Motion animations are capped at short durations (150–500ms, see [`../design-system/tokens-and-guidelines.md`](../design-system/tokens-and-guidelines.md)) which keeps interaction feedback responsive. |

There is no real-user monitoring (RUM) or Lighthouse CI configured to actually measure these in production — see [`../deployment/rollback-monitoring-logging.md`](../deployment/rollback-monitoring-logging.md). The above is an architectural assessment, not measured field data.

## Optimization checklist

- [ ] Fix the homepage double-fetch (pass server data into `HomePageClient.tsx`'s initial state instead of re-fetching) — see [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #11
- [ ] Remove unused heavy dependencies (`three`, `@react-three/fiber`, `@react-three/drei`) to reduce install size and bundle-graph surface — item #6
- [ ] Add JSON-LD structured data for key content types — see [`seo.md`](./seo.md)
- [ ] Add Vercel Analytics (or equivalent) to get real Core Web Vitals field data instead of architectural inference — see [`../deployment/rollback-monitoring-logging.md`](../deployment/rollback-monitoring-logging.md)
- [ ] Consider a cache-invalidation strategy (on-demand ISR) to reduce per-request DB load as traffic grows — see [`caching-and-rendering.md`](./caching-and-rendering.md)
- [ ] Run a real Lighthouse/PageSpeed Insights pass against the production URL and record the baseline scores here once available

## Related
- [`images-and-fonts.md`](./images-and-fonts.md)
- [`bundle-and-code-splitting.md`](./bundle-and-code-splitting.md)
- [`caching-and-rendering.md`](./caching-and-rendering.md)
