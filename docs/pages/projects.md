# Page: `/projects`

## Purpose
Searchable, filterable listing of every published project, with client-side pagination.

## Business Goal
Lets a visitor browse the full project catalog beyond the homepage's featured subset, with the ability to filter by tech stack or search by keyword.

## Target Audience
Recruiters/collaborators evaluating breadth of work, or looking for a specific technology.

## Route
- Path: `/projects`
- File: `frontend/src/app/projects/page.tsx`
- Dynamic segments: none (see [`projects-detail.md`](./projects-detail.md) for `[slug]`)

## SEO & Metadata
- No `metadata` export on this file — it's a Client Component (`'use client'`), so it cannot export `generateMetadata`/`metadata` directly. It inherits whatever metadata the nearest server-rendered ancestor provides (effectively the root layout's global metadata — see [`root-layout.md`](../layouts/root-layout.md)). This is a real gap: unlike the detail pages, the listing page has no route-specific `<title>`/description.
- Included in `sitemap.ts`: yes, as a static route.
- Structured data (JSON-LD): none.

## Layout
Root layout + `template.tsx` wrap this page. Page renders its own `Navbar`/`Footer`.

## Components Used
- [`Navbar`](../components/shared/Navbar.md), [`Footer`](../components/shared/Footer.md)
- No shared card component — `ProjectCard` is defined inline in this file (not exported/reused elsewhere), unlike Research's listing page which reuses [`PaperCard`](../components/ui/PaperCard.md).

## Hooks Used
None — see [`hooks/README.md`](../hooks/README.md). Uses `useState`/`useEffect`/`useMemo` directly for search, filter, sort, and pagination state.

## Dependencies
`framer-motion` (card entrance + `AnimatePresence` for filter transitions), `lucide-react` icons, `next/navigation`'s `useRouter` (for whole-card click-to-navigate).

## Data Sources
- Endpoint: `GET /projects?limit=200` — fetches up to 200 projects in one call, then does **all filtering/search/sort/pagination client-side** in `useMemo` blocks. There is no server-side pagination or search on this page despite the API supporting `page`/`limit`/`search` query params (see [`api/rest-api-reference.md`](../api/rest-api-reference.md)).
- Fetch strategy: Client Component, `useEffect` on mount, `cache: 'no-store'`. Response shape handled defensively: `Array.isArray(json) ? json : (json.projects ?? [])` — tolerates both a raw array and the `{ projects, total, page, totalPages }` envelope.

## Loading States
Skeleton grid: 6 pulsing placeholder cards (`animation: pulse 1.5s`) shown while `loading` is true.

## Error States
No dedicated error UI — a failed fetch sets `allProjects` to `[]`, which renders the same "No projects found" empty state as a genuinely empty result set. The visitor cannot distinguish "no projects match your filter" from "the API call failed."

## Accessibility
Cards are keyboard-navigable (`tabIndex={0}`, `onKeyDown` handles Enter, `role="article"`, `aria-label`). Search input has no visible `<label>` (placeholder-only), which contradicts the admin-form convention elsewhere but matches this being a public filter UI, not a data-entry form.

## Performance
Fetching all 200 projects upfront and filtering client-side means the search/filter/sort feels instant (no network round-trip per keystroke) but front-loads a potentially large payload on first load. Pagination is purely a display slice of the already-fetched array (`PER_PAGE = 9`), not a real fetch boundary.

## Future Improvements
None tracked specifically; see [`architecture/rendering-strategy.md`](../architecture/rendering-strategy.md) for the general "no caching layer" gap this pattern shares with other pages.

## Related Pages
- [`projects-detail.md`](./projects-detail.md)
- [`home.md`](./home.md) (featured projects subset)
