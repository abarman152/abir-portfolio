# Bundle Optimization, Lazy Loading & Code Splitting

## Current state: none implemented

A full grep of `frontend/src` during the 2026-07 audit found **zero** uses of `next/dynamic` or `React.lazy`. There is no code-splitting beyond what Next.js's App Router does automatically per-route (each route already gets its own chunk by default — that part is "free" and already working).

## The actual problem: unused heavy dependencies, not missing lazy-loading

The more urgent issue isn't that something should be lazy-loaded — it's that `@react-three/fiber`, `@react-three/drei`, and `three` are shipped in `frontend/package.json` and (per the README's tech stack table) presented as part of the stack, but **zero components import them anywhere**. If they're truly unused:

- **Correct fix**: remove them from `package.json` entirely. They cost nothing at runtime today (dead code elimination / tree-shaking should drop unused imports — but since nothing imports them at all, they're not even entering the bundle graph, so this is purely a `package.json`/install-size and maintenance-surface issue, not a shipped-bytes issue).
- **Wrong fix**: wrap a "3D scene" component that doesn't exist in `next/dynamic` — that would be solving a problem that isn't there.

See [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #6.

## Where dynamic imports would actually help, if this app grows

- The admin panel's ~13 CRUD pages are only ever loaded by an authenticated admin, never by public visitors — Next.js's automatic per-route code-splitting already isolates these from the public bundle, so no additional `next/dynamic` wrapping is needed there either.
- If a genuinely heavy, rarely-used component is added in the future (e.g., a real chart library for the dashboard), that's the concrete case for `next/dynamic` with `ssr: false` — not a preemptive optimization to do now.

## Related
- [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #6
- [`core-web-vitals-and-checklist.md`](./core-web-vitals-and-checklist.md)
