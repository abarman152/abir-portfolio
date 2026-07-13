# Page: `/admin/dashboard`

## Purpose
Landing page after login — shows aggregate content counts and quick links into each CRUD section.

## Business Goal
Gives the admin an at-a-glance summary (how many projects/papers/certs/achievements exist, how many contact messages are unread) without opening each section.

## Target Audience
The site owner, immediately after logging in.

## Route
- Path: `/admin/dashboard`
- File: `frontend/src/app/admin/dashboard/page.tsx`
- Dynamic segments: none

## SEO & Metadata
- No page-specific metadata; inherits `admin/layout.tsx`'s static title.
- Included in `sitemap.ts`: no.
- Structured data (JSON-LD): none, not applicable.

## Layout
Wrapped in [`AdminShell`](../components/admin/AdminShell.md), which provides the sidebar nav and (critically) the client-side auth guard — see [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md).

## Components Used
- [`AdminShell`](../components/admin/AdminShell.md)
- No `AdminTable`/`Modal` on this page — it renders its own stat cards and quick-action links inline.

## Hooks Used
None — see [`hooks/README.md`](../hooks/README.md). Uses `useState`/`useEffect` directly to load counts.

## Dependencies
`framer-motion` (card entrance/hover), `lucide-react` icons.

## Data Sources
- Endpoint: `GET /api/admin/dashboard` (note: mounted under `/admin/dashboard`, not `/dashboard` — see `backend/src/index.ts` line `app.use('/api/admin/dashboard', dashboardRoutes)`; the existing [`api/rest-api-reference.md`](../api/rest-api-reference.md) does not yet list this endpoint, a documentation gap worth fixing there). `[AUTH]` required.
- Response shape: `{ projects, papers, certs, achievements, messages, unread }` — all `prisma.count()` aggregates, computed in parallel via `Promise.all` in `backend/src/routes/dashboard.ts`. On any aggregation error, the route catches it and returns all-zero counts with a `200` rather than an error status — so a dashboard load failure is silent (all cards show `0`, not an error state).
- Fetch strategy: Client Component, `useEffect` on mount, reads `admin_token` from `localStorage` directly (no shared auth-header utility beyond `authHeader()`).

## Loading States
Each stat card shows `"—"` in place of the count while `loading` is true; no full-page skeleton.

## Error States
None distinguishable from zero-count — see the backend behavior above. A failed `.catch(console.error)` on the frontend only logs to the console; the UI still shows `0`s.

## Accessibility
Stat cards are wrapped in `<Link>` (entire card clickable, per the admin design convention). No specific ARIA beyond native link semantics.

## Performance
Single aggregate endpoint (6 parallel `count()` queries) — cheap query, no pagination or large payload concerns.

## Future Improvements
See [`../features/dashboard-analytics.md`](../features/dashboard-analytics.md) for the feature-level writeup, including the silent-zero-on-error behavior as a known gap.

## Related Pages
- [`admin-login.md`](./admin-login.md)
- [`admin-crud-pages.md`](./admin-crud-pages.md)
- [`../features/dashboard-analytics.md`](../features/dashboard-analytics.md)
