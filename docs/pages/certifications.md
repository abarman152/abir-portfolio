# Page: `/certifications`

## Purpose
Searchable, filterable listing of professional certifications with category chips, tag/skill/issuer advanced filters, and client-side pagination.

## Business Goal
Demonstrates verified, third-party-issued credentials distinct from self-reported skills.

## Target Audience
Recruiters checking for specific certifications (cloud, AI, data platforms) or verifying credibility via `credentialUrl`.

## Route
- Path: `/certifications`
- File: `frontend/src/app/certifications/page.tsx`
- Dynamic segments: none (see [`certifications-detail.md`](./certifications-detail.md) for `[slug]`)

## SEO & Metadata
- No `metadata` export — Client Component, same gap as `/projects` and `/research`.
- Included in `sitemap.ts`: yes, as a static route.
- Structured data (JSON-LD): none.

## Layout
Root layout + `template.tsx`. Page renders its own `Navbar`/`Footer`.

## Components Used
- [`Navbar`](../components/shared/Navbar.md), [`Footer`](../components/shared/Footer.md)
- `CertCard` defined inline in this file (not shared/reused).

## Hooks Used
None — see [`hooks/README.md`](../hooks/README.md).

## Dependencies
`framer-motion`, `lucide-react`.

## Data Sources
- Endpoint: `GET /certifications?limit=200`
- Fetch strategy: Client Component, `useEffect` on mount, `cache: 'no-store'`. Same defensive response-shape handling (`Array.isArray(json) ? json : (json.items ?? [])`).

## Loading States
Skeleton: 6 pulsing placeholder cards (`height: 240px`) while loading.

## Error States
No dedicated error UI — failed fetch yields an empty array, indistinguishable from a genuinely empty result set.

## Accessibility
Cards without a `slug` render as non-clickable (no `Link` wrapper, `tabIndex={-1}`) since `Certification.slug` is nullable in the schema — a certification created without a slug simply isn't a detail-page candidate, and the card correctly omits the "Details" affordance in that case.

## Performance
Same client-side fetch-all-then-filter pattern as `/projects`/`/research`. Notably has the most filter dimensions of any listing page: search, category (chips), tags/skills (advanced panel), issuer (advanced panel), featured toggle, and sort — all computed in `useMemo`.

## Future Improvements
None tracked specifically for this page.

## Related Pages
- [`certifications-detail.md`](./certifications-detail.md)
