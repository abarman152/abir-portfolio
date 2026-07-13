# Component: `Achievements`

**File:** `frontend/src/components/sections/Achievements.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
Homepage "Recognition & Milestones" section — renders a vertical timeline of achievement cards, each keyed by category to a `lucide-react` icon and color.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `achievements` | `Achievement[]` | Yes | — | List to render as timeline items; shows an empty-state message ("Achievements coming soon.") if empty |

## Variants
Card appearance varies by `category` (`Award`/`Academic`/`Competition`/`Professional`/`Other`, each mapped to a distinct icon + color via `TYPE_ICON`/`TYPE_COLOR`) and by `featured` (adds a colored left border and a "Featured" badge).

## Composition
Internal-only `AchievementCard` sub-component (not exported). Cards with a `slug` wrap in `<Link>` to `/achievements/[slug]`; cards without one render non-interactively (`href = null`) — same pattern as the certifications section.

## Accessibility
`Link`-wrapped cards have `aria-label={"${item.title} — view details"}`. Timeline dot icons are decorative (`<Icon color="white" />` inside a colored circle) with no additional `aria-hidden`.

## Performance
`whileInView`/`once: true` entrance animation, staggered by `i * 0.07`s per card — consistent with the site-wide animation convention.

## Example

```tsx
<Achievements achievements={achievements} />
```

## Best Practices
- This component always renders every item passed to it (no internal pagination/limiting) — the caller (`HomePageClient`) is responsible for only passing the "featured" subset fetched from `GET /achievements/featured`.

## Usage Guidelines
- Don't use this for the full `/achievements` listing page — that page (`app/achievements/page.tsx`) defines its own `AchievementCard` inline with pagination/filtering; this component is homepage-only.

## Future Improvements
None tracked specifically.
