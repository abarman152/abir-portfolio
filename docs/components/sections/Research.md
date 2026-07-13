# Component: `Research` (default export `ResearchSection`)

**File:** `frontend/src/components/sections/Research.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
Homepage "Academic Contributions" section — shows up to 3 research papers via [`PaperCard`](../ui/PaperCard.md), with a "View All Research" link when more exist.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `papers` | `Research[]` | Yes | — | Full featured-papers list; component slices to `HOME_LIMIT = 3` internally |

## Variants
None — a single layout. Empty state ("Research papers coming soon.") shown if `papers` is empty.

## Composition
Delegates card rendering entirely to the shared [`PaperCard`](../ui/PaperCard.md) UI primitive (passed `animate="whileInView"`), unlike `Projects`/`Certifications`/`Achievements` sections, which each define their own inline card component. This is the one section that reuses a shared card component rather than duplicating one.

## Accessibility
No section-specific accessibility beyond what `PaperCard` implements.

## Performance
Slices to 3 items client-side (`papers.slice(0, HOME_LIMIT)`) rather than relying on the API to only return 3 — the homepage's `GET /research/featured` call may return more than 3 featured papers, and this component is what enforces the 3-item cap for display purposes.

## Example

```tsx
<ResearchSection papers={featuredPapers} />
```

## Best Practices
If you need to change how many papers show on the homepage, change `HOME_LIMIT` here — don't add a `limit` query param assumption to the `/research/featured` fetch, since the slicing happens client-side regardless of how many the API returns.

## Usage Guidelines
Don't use this for `/research` — that page fetches and paginates independently; this component is homepage-only.

## Future Improvements
None tracked specifically.
