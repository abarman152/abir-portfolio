# Component: `PaperCard`

**File:** `frontend/src/components/ui/PaperCard.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
A research-paper card: accent line, featured badge, publisher/date meta, title, abstract preview, author summary, tags, and a "Read Paper" link.

> **This is currently the only component in `frontend/src/components/ui/`** — the design system's entire reusable-primitive layer is this one card. There is no shared `Button`, `Input`, `Badge`, or generic `Card` primitive anywhere in the codebase; every other card-like UI (project cards, certification cards, achievement cards, admin table rows) is a separate, non-shared inline implementation per file. This is a real gap in the design system, not a minimalist convention — see [`../../architecture/folder-architecture.md`](../../architecture/folder-architecture.md) and [`../../appendices/technical-debt-register.md`](../../appendices/technical-debt-register.md).

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `paper` | `Research` | Yes | — | The paper data to render |
| `index` | `number` | No | `0` | Used to stagger the entrance animation delay |
| `animate` | `'whileInView' \| 'animate'` | No | `'whileInView'` | `'whileInView'` triggers on scroll (used on the homepage and `/research` listing); `'animate'` triggers immediately on mount (used by consumers that already control their own scroll-based reveal, e.g. paginated grids where `whileInView` would refire oddly on page-change re-renders) |

## Variants
Two animation modes (see `animate` prop above). Visual variant by `paper.featured`: amber accent line + "FEATURED" badge vs. the default accent/purple gradient accent line.

## Composition
Self-contained — defines its own `authorSummary()` and `pubYear()` helpers inline (also duplicated separately in `app/research/page.tsx` as a local `pubYear()`, and in `ResearchDetail.tsx` via `fmtMonthYear()` from [`date-formatting.md`](../../utilities/date-formatting.md) — three different date-formatting approaches for the same underlying `publishedAt` field across the research feature). Whole-card click-to-navigate to `/research/:slug`, guarded against clicks on inner `<a>`/`<Link>` elements, same pattern as the various `ProjectCard` implementations.

## Accessibility
`role="article"`, `aria-label={"${paper.title} — view paper"}`, keyboard-navigable (`tabIndex={0}`, `Enter` key handler).

## Performance
Hover state (`useState`) drives inline style changes (border color, shadow, `translateY`) rather than CSS `:hover` — a re-render on every mouse enter/leave, acceptable at this component's usage scale (never more than ~9 cards visible per page).

## Example

```tsx
<PaperCard paper={paper} index={i} animate="whileInView" />
```

## Best Practices
Reuse this component for any new research-paper listing UI rather than writing another inline card — it is already used by both the homepage's [`Research`](../sections/Research.md) section and the `/research` listing page, so it's the one component in this codebase that has actually achieved cross-page reuse.

## Usage Guidelines
Don't extend this component to render other content types (projects, certifications, achievements) — it's typed specifically to `Research` and its layout (publisher/abstract/authors) doesn't generalize to those shapes without significant prop surface changes.

## Future Improvements
Given this is the only UI primitive that exists, extracting a generic `Card` or `Button` primitive from the repeated patterns across `ProjectCard`/`CertCard`/`AchievementCard`/admin buttons would be the most impactful design-system improvement available; not currently tracked as a single numbered debt item but implied by [`../../appendices/technical-debt-register.md`](../../appendices/technical-debt-register.md)'s broader duplication findings.
