# Page: `/`

## Purpose
The public homepage — a single-page composition of every major portfolio section (hero, about, stats, projects, skills, research, certifications, achievements, contact).

## Business Goal
First impression for recruiters/clients landing on the root domain. Surfaces the highest-signal content (featured projects, featured research, stats) without requiring navigation.

## Target Audience
Recruiters, hiring managers, and collaborators visiting `abirbarman.com` directly.

## Route
- Path: `/`
- Files: `frontend/src/app/page.tsx` (Server Component, data fetch) + `frontend/src/components/HomePageClient.tsx` (Client Component, rendering + client re-fetch)
- Dynamic segments: none

## SEO & Metadata
- Metadata is set at the root layout level (`frontend/src/app/layout.tsx`), not per-page — see [`root-layout.md`](../layouts/root-layout.md).
- `export const dynamic = 'force-dynamic'` — this page is never statically generated.
- Included in `sitemap.ts`: yes, as the root `/` entry (static, not slug-derived).
- Structured data (JSON-LD): none — confirmed absent across the whole app (see [`appendices/audit-report.md`](../appendices/audit-report.md) item 18).

## Layout
Wrapped by the root layout (`app/layout.tsx`) and `app/template.tsx` (page-transition animation) — see [`layouts/root-layout.md`](../layouts/root-layout.md) and [`layouts/page-transition-template.md`](../layouts/page-transition-template.md). `HomePageClient` renders its own `Navbar` and `Footer` directly rather than relying on a shared chrome layout.

## Components Used
- [`Navbar`](../components/shared/Navbar.md), [`Footer`](../components/shared/Footer.md)
- [`Hero`](../components/sections/Hero.md), [`About`](../components/sections/About.md), [`Stats`](../components/sections/Stats.md), [`Projects`](../components/sections/Projects.md), [`Skills`](../components/sections/Skills.md), [`Research`](../components/sections/Research.md), [`Certifications`](../components/sections/Certifications.md), [`Achievements`](../components/sections/Achievements.md), [`Contact`](../components/sections/Contact.md)

## Hooks Used
None — see [`hooks/README.md`](../hooks/README.md). `HomePageClient` uses `useState`/`useEffect`/`useRef` directly, not extracted hooks.

## Dependencies
Framer Motion (via child section components), no page-level dependency beyond the standard fetch/React stack.

## Data Sources
`page.tsx` fetches 11 endpoints in parallel via `Promise.all`, each wrapped in a `fetchData()` helper that swallows errors/timeouts (8s `AbortSignal.timeout`) and falls back to a hardcoded default object:

| Endpoint | Fallback used on failure |
|---|---|
| `GET /hero` | `DEFAULT_HERO` |
| `GET /social` | `[]` |
| `GET /hero-badges` | `[]` |
| `GET /settings` | `DEFAULT_SETTINGS` (note: `id: ''`) |
| `GET /projects/featured` | `[]` |
| `GET /research/featured` | `[]` |
| `GET /skills` | `{ categories: [] }` |
| `GET /certifications/featured` | `[]` |
| `GET /achievements/featured` | `[]` |
| `GET /stats` | `[]` |
| `GET /about/section` | `DEFAULT_ABOUT_SECTION` |

- Fetch strategy: server-side `fetch(..., { cache: 'no-store' })` in the Server Component, per-request, then **the client component re-fetches the same 11 endpoints again** on mount if it detects the server data looks stale.

## Loading States
No Suspense boundary or skeleton at the page level — SSR blocks until all 11 fetches resolve or their individual 8s timeouts fire (whichever is first). Individual section components may render their own empty/skeleton states from empty arrays.

## Error States
No `error.tsx` boundary. Each fetch degrades independently to a hardcoded default rather than throwing, so a single backend outage never 500s the whole page — the visitor sees default/placeholder content for the failed section only.

## Accessibility
Landmark structure comes from child sections (`<main>` wraps all sections in `HomePageClient`). No page-specific accessibility work beyond what each section component implements — see individual component docs.

## Performance
### The homepage double-fetch (known issue)
`HomePageClient` runs a `isDataStale()` check: if the server-rendered `settings.id` is an empty string (meaning the `DEFAULT_SETTINGS` fallback was used, which only happens if the SSR fetch to `/settings` failed or timed out — typically a Render cold start), it waits 3 seconds and then **re-fetches all 11 endpoints again client-side** via `clientFetch()`, overwriting `state` with fresh data.

This is intentional cold-start recovery, not a general double-fetch bug: it only fires when `settings.id === ''`, not on every page load. However, it does mean a cold-start visitor experiences: SSR with defaults → 3s wait → full client re-fetch → re-render. See [technical debt item #11](../appendices/technical-debt-register.md) which frames this general pattern (SSR data not reused as client initial state) as a performance gap, and the `isDataStale` heuristic here as the concrete workaround already in place for the worst case (cold start), not a fix for the general one.

## Future Improvements
See [`architecture/rendering-strategy.md`](../architecture/rendering-strategy.md) and [`architecture/future-architecture.md`](../architecture/future-architecture.md) for the broader SWR/React Query recommendation that would replace this fetch-fallback-refetch pattern entirely.

## Related Pages
- [`about.md`](./about.md)
- [`projects.md`](./projects.md), [`research.md`](./research.md), [`certifications.md`](./certifications.md), [`achievements.md`](./achievements.md)
