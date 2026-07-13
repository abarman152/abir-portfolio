# Component: `About`

**File:** `frontend/src/components/sections/About.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
Homepage "About Me" section — a two-column layout with a short narrative (headline + paragraphs + skill tags) on the left and dynamic "pillar" category cards (e.g. Machine Learning, Data Engineering, Research) on the right.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `section` | `AboutSectionData` | Yes | — | `{ headline, highlight, paragraphs, skills, categories }` — the entire section content, admin-editable via `GET /about/section` (see `app/page.tsx`'s `DEFAULT_ABOUT_SECTION` for the fallback shape) |

## Variants
None — single layout. The number of "pillar" cards on the right is data-driven (`section.categories.length`), not a fixed set.

## Composition
Maps `category.icon` (a string, e.g. `"Brain"`, `"Database"`) through a local `ICON_MAP` to a `lucide-react` icon component, defaulting to `Brain` if the string doesn't match. Each category card's accent color comes from `cat.color` (a hex string stored per-category), not a fixed palette.

## Accessibility
Heading hierarchy: `<h2>` for the section title, `<h3>` per pillar card — correctly nested. "View Full Profile" is a real `<Link>` with visible text, not icon-only.

## Performance
All entrance animations use `whileInView`/`viewport={{ once: true }}` (Framer Motion), consistent with the project-wide scroll-animation convention — see [`../../architecture/animation-architecture.md`](../../architecture/animation-architecture.md).

## Example

```tsx
<About section={aboutSectionData} />
```

## Best Practices
- Keep `categories` to 2–4 entries — the right column is a simple vertical stack, not a grid, so too many entries pushes the section very tall on desktop where it sits beside a much shorter left column.

## Usage Guidelines
- Don't confuse this with [`AboutPageContent`](./AboutPageContent.md) — this component is the condensed homepage teaser; `AboutPageContent` is the full `/about` page with education, skill groups, and more. They render different data shapes (`AboutSectionData` vs `AboutProfile`/`Education`/etc.) and are not interchangeable.

## Future Improvements
None tracked specifically.
