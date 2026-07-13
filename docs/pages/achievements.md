# Page: `/achievements`

## Purpose
Timeline-style listing of awards, honors, and milestones, with category filters, search, and client-side pagination.

## Business Goal
Surfaces recognition (competition wins, academic honors) in a distinct visual format (vertical timeline) from the card-grid used for projects/certifications.

## Target Audience
Recruiters/collaborators looking for evidence of external recognition.

## Route
- Path: `/achievements`
- File: `frontend/src/app/achievements/page.tsx`
- Dynamic segments: none (see [`achievements-detail.md`](./achievements-detail.md) for `[slug]`)

## SEO & Metadata
- No `metadata` export — Client Component, same gap as the other three listing pages.
- Included in `sitemap.ts`: yes, as a static route.
- Structured data (JSON-LD): none.

## Layout
Root layout + `template.tsx`. Page renders its own `Navbar`/`Footer`.

## Components Used
- [`Navbar`](../components/shared/Navbar.md), [`Footer`](../components/shared/Footer.md)
- `AchievementCard` defined inline in this file (not shared/reused) — renders as a timeline node with a category-colored icon (`Trophy`/`GraduationCap`/`Star`/`Users`/`Zap` from `lucide-react`, keyed by `category`).

## Hooks Used
None — see [`hooks/README.md`](../hooks/README.md).

## Dependencies
`framer-motion`, `lucide-react`.

## Data Sources
- Endpoint: `GET /achievements?limit=200`
- Fetch strategy: Client Component, `useEffect` on mount, `cache: 'no-store'`. Same defensive response-shape handling as other listing pages.

## Loading States
Skeleton: 4 pulsing placeholder rows (`height: 120px`, indented to match the timeline layout) while loading.

## Error States
No dedicated error UI — failed fetch yields an empty array, indistinguishable from a genuinely empty result set.

## Accessibility
Timeline dots are purely decorative (icon + color per category) with no additional `aria-hidden` marking — screen readers will encounter the icon SVGs directly. Cards without a `slug` render non-interactively (no `Link` wrapper), matching the certifications pattern.

## Performance
`PER_PAGE = 10` (higher than the 9 used elsewhere) — same client-side fetch-all-then-filter/sort/paginate pattern.

## Future Improvements
None tracked specifically for this page.

## Related Pages
- [`achievements-detail.md`](./achievements-detail.md)
- [`about.md`](./about.md) (features a slice of featured achievements)
