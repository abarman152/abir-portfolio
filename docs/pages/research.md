# Page: `/research`

## Purpose
Searchable, filterable listing of published research papers, with year/tag/featured filters and client-side pagination.

## Business Goal
Showcases academic/research credibility separately from software projects — important for a Data Scientist/ML Engineer audience.

## Target Audience
Recruiters or academic collaborators evaluating research output specifically.

## Route
- Path: `/research`
- File: `frontend/src/app/research/page.tsx`
- Dynamic segments: none (see [`research-detail.md`](./research-detail.md) for `[slug]`)

## SEO & Metadata
- No `metadata` export — this is a Client Component (`'use client'`), same gap as `/projects`. Inherits root layout metadata only.
- Included in `sitemap.ts`: yes, as a static route.
- Structured data (JSON-LD): none.

## Layout
Root layout + `template.tsx`. Page renders its own `Navbar`/`Footer`.

## Components Used
- [`Navbar`](../components/shared/Navbar.md), [`Footer`](../components/shared/Footer.md)
- [`PaperCard`](../components/ui/PaperCard.md) — this listing page reuses the shared `PaperCard` UI primitive (unlike `/projects`, which defines its card inline).

## Hooks Used
None — see [`hooks/README.md`](../hooks/README.md).

## Dependencies
`framer-motion`, `lucide-react`.

## Data Sources
- Endpoint: `GET /research?limit=200` — same "fetch up to 200, filter client-side" pattern as `/projects`.
- Fetch strategy: Client Component, `useEffect` on mount, `cache: 'no-store'`. Handles both `Array.isArray(json)` and `{ items: [...] }` response shapes defensively.

## Loading States
Skeleton: 5 pulsing placeholder rows (`height: 140px`) while loading.

## Error States
No dedicated error UI — failed fetch sets `allItems` to `[]`, indistinguishable from a genuinely empty result set (same gap as `/projects`).

## Accessibility
Filter/search controls are the same pattern as `/projects` (placeholder-only search input, chip-style tag/year filters as buttons).

## Performance
Same "fetch all up front, filter in `useMemo`" strategy as `/projects` — pagination (`PER_PAGE = 9`) is a display-only slice.

## Future Improvements
None tracked specifically for this page.

## Related Pages
- [`research-detail.md`](./research-detail.md)
- [`../architecture/research-management-flow.md`](../architecture/research-management-flow.md) — full worked example of this content type end-to-end
