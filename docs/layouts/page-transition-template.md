# Layout: Page Transition Template

**File:** `frontend/src/app/template.tsx`

> This is a Next.js **template** file, not a layout — see "Template vs. layout" below for why that distinction matters and is deliberate here.

## Purpose
Wraps every page in a Framer Motion fade + slide-up entrance animation that replays on every navigation.

```tsx
'use client';
import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
```

## Scope
Every route in the app — `template.tsx` at the `app/` root applies to all pages, same breadth as `layout.tsx`, since Next.js's App Router convention picks up a single `template.tsx` per segment and there's only one defined, at the root.

## Template vs. layout — why this file is a template
Next.js draws a specific distinction between the two special files:

- **`layout.tsx`** persists across navigations within its scope — React does not unmount/remount it when you navigate between sibling routes, which is why it's the right place for state that should survive navigation (theme, providers).
- **`template.tsx`** creates a **new instance on every navigation** — Next.js unmounts and remounts it (and everything inside it) each time the route changes, even between sibling pages.

A page-transition animation needs exactly that remount behavior: the `initial={{ opacity: 0, y: 10 }}` state has to actually re-apply on every navigation for the fade-in to replay. If this were a layout instead, React would preserve the mounted component across navigations and the entrance animation would only ever play once (on first load), never again on subsequent client-side navigations.

## Responsibilities
- Re-mounts on every route change, replaying the `opacity`/`y` entrance transition (`duration: 0.32s`, custom cubic-bezier ease matching the site's global easing convention — see [`../design-system/tokens-and-guidelines.md`](../design-system/tokens-and-guidelines.md)).
- Nothing else — no data fetching, no conditional logic, no providers.

## What it does NOT do
- Does not perform any auth gating, metadata, or provider work — purely a visual transition wrapper.
- Does not vary its animation per-route — every navigation gets the identical fade/slide, regardless of whether it's a public or admin route.

## Composition
Sits directly below the root layout's `<ThemeProvider>` in the component tree (see [`../architecture/component-hierarchy.md`](../architecture/component-hierarchy.md)): `RootLayout → ThemeProvider → Template → <page.tsx content>`.

## Data Fetching
None.

## Related
- [`../architecture/animation-architecture.md`](../architecture/animation-architecture.md) — where this fits in the overall animation system
- [`root-layout.md`](./root-layout.md)
- [`../architecture/component-hierarchy.md`](../architecture/component-hierarchy.md)
