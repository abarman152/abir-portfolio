# Component: `Certifications`

**File:** `frontend/src/components/sections/Certifications.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
Homepage "Professional Credentials" section — a category-filterable grid of certification cards.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `certs` | `Certification[]` | Yes | — | Full list to render/filter; category tabs are derived from this list's distinct `category` values |

## Variants
A local `active` category filter state (`useState('All')`) — this is the **only** homepage section with its own client-side filter UI; every other homepage section renders its full input list without in-section filtering.

## Composition
Internal-only `CertCard` sub-component. Cards with a `slug` wrap in `<Link>`; cards without render non-interactively, same pattern as [`Achievements`](./Achievements.md). Category tabs only render if there are more than 2 distinct categories (`categories.length > 2`, accounting for the injected `'All'` entry).

## Accessibility
Filter tab buttons are real `<button>` elements with visible text labels. `AnimatePresence mode="wait"` cross-fades the grid when the filter changes.

## Performance
Filtering is a simple `.filter()` over the already-fetched `certs` prop — no re-fetch on filter change, since the homepage passes down `GET /certifications/featured` results once.

## Example

```tsx
<Certifications certs={featuredCerts} />
```

## Best Practices
- Since this is the only homepage section with an in-section filter, be aware that adding a similar filter to another section would introduce an inconsistent UX pattern unless deliberately extended everywhere.

## Usage Guidelines
- Don't use this for `/certifications` — that page defines its own more elaborate `CertCard` with issuer/tag/advanced filters; this component is homepage-only and simpler by design.

## Future Improvements
None tracked specifically.
