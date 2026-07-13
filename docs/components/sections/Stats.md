# Component: `Stats`

**File:** `frontend/src/components/sections/Stats.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
Homepage stat-strip section — a row of animated count-up numbers (e.g. "350+ LeetCode Solved") in a bordered grid.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `stats` | `Stat[]` | Yes | `[]` → falls back to `DEFAULT_STATS` (4 hardcoded stats matching the seed data) if empty | Each stat renders as one grid cell |

## Variants
None — layout is fixed; enrichment (subtitle text + accent color) is looked up from a local `ENRICHED` map keyed by exact label string match (`'LeetCode Solved'`, `'GitHub Repos'`, `'Codeforces Rating'`, `'Research Papers'`) — a stat with a different label renders without the subtitle/custom color, falling back to `var(--accent)`.

## Composition
Defines its own `Counter` sub-component (count-up-on-scroll-into-view via Framer Motion's `useInView`) — functionally near-identical to `Impact.tsx`'s unused `CountUp` sub-component; the two are separate implementations of the same pattern, one of which ([`Impact`](./Impact.md)) is currently dead code.

## Accessibility
No specific ARIA; numbers are plain text content, updated via `setInterval`-driven state (not `aria-live`, so a screen reader won't announce the count-up animation — it will read whatever final/intermediate value is in the DOM at query time).

## Performance
Each `Counter` runs its own `setInterval` (55 steps over 1800ms) gated by `useInView({ once: true })`, so the count-up only fires once per stat card, on first scroll into view.

## Example

```tsx
<Stats stats={stats} />
```

## Best Practices
If you add a new `Stat` via `/admin/stats` and want a custom subtitle/color, its `label` must exactly match one of the four keys in `ENRICHED` — otherwise it renders with default styling (still functional, just visually plainer).

## Usage Guidelines
Don't confuse this with [`Impact`](./Impact.md) — `Impact` is unused, dead code with overlapping functionality; `Stats` is the one actually rendered on the homepage.

## Future Improvements
Given the overlap with the dead [`Impact`](./Impact.md) component, resolving that duplication (delete `Impact.tsx`, or merge its achievements-timeline half into this component) is a reasonable cleanup; not currently tracked as a numbered debt item.
