# Component: `Footer`

**File:** `frontend/src/components/Footer.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
Site-wide footer: identity/branding, static navigation links, dynamically-fetched social links, and a copyright bar. Rendered by every top-level public page (each page composes it directly — there's no shared layout that renders it once).

## Props
None — self-contained; fetches its own data.

## Variants
None — single layout, responsive via a `.footer-grid` CSS class that collapses to one column under `768px`.

## Composition
Renders [`ThemeLogo`](./ThemeLogo.md). Defines its own inline SVG icon set (GitHub/LinkedIn/LeetCode/Email/Twitter/generic-link, via a local `SocialIcon` component) — a fourth separate icon-definition point in the codebase alongside [`Hero`](../sections/Hero.md), `AboutPageContent`, and `Navbar` (each defines overlapping-but-not-identical brand icon sets rather than sharing one).

## Accessibility
Nav links are real `<Link>`/`<a>` elements with visible text. Social links have no explicit `aria-label` (icon + platform name text is shown together, so this is less of a gap than icon-only buttons elsewhere).

## Performance
Fetches `GET /social` client-side on every mount (`useEffect`, no caching) — since `Footer` renders on every page, this means a fresh `/social` fetch happens on every page navigation across the site, not just once. Fails silently (empty `socials` array) on fetch error, showing a "Loading…" placeholder that never resolves if the fetch never succeeds.

## Example

```tsx
<Footer />
```

## Best Practices
Since every top-level page renders its own `Footer` instance (no shared "public chrome" layout), keep this component's own data-fetching self-contained — don't assume any caller passes social links as props; none currently do.

## Usage Guidelines
Don't add props to this component expecting callers to pass data — as of now, zero callers do, and doing so would require updating every page that renders it.

## Future Improvements
Because `Footer` re-fetches `/social` on every page mount, this is a candidate for a shared caching layer (SWR/React Query) if one is ever introduced — see [`../../architecture/state-management.md`](../../architecture/state-management.md)'s note on the missing data-fetching cache layer.
