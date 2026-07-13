# Component: `Impact`

**File:** `frontend/src/components/sections/Impact.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
A metrics-grid + achievements-timeline section combining count-up stat cards (LeetCode problems, research papers, Codeforces rating, GitHub repos) with a secondary achievements list.

> **This component is not currently rendered anywhere.** `HomePageClient.tsx` composes `Hero`, `About`, `Stats`, `Projects`, `Skills`, `Research`, `Certifications`, `Achievements`, and `Contact` — `Impact` does not appear in that list, and no other page imports it. It is dead code: fully built, exported, and unused. State this plainly rather than describing it as an active homepage section.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `achievements` | `Achievement[]` | Yes | — | Rendered in a secondary grid below the metrics, if non-empty |
| `stats` | `Stat[]` | Yes | — | Matched against a hardcoded `METRICS` array by substring-matching the first word of each metric's label against `stat.label` (fragile matching logic — see below) |

## Variants
None beyond the data-driven metric count/values.

## Composition
Defines its own `CountUp` sub-component (a count-up-on-scroll-into-view number animation) — functionally overlapping with `Stats.tsx`'s own `Counter` sub-component; the two are separate, near-duplicate implementations of the same animated-counter pattern.

## Accessibility
No specific ARIA beyond standard heading/text semantics.

## Performance
`mergedMetrics` recomputes on every render (not memoized) by scanning `stats` for each of the 4 hardcoded `METRICS` entries via `.find()` + substring match — cheap at this data volume but worth noting as unmemoized derived state if this component is ever wired back in.

## Example

```tsx
<Impact achievements={achievements} stats={stats} />
```

## Best Practices
If this component is reactivated, verify whether it's meant to replace or supplement [`Stats`](./Stats.md) — the two currently overlap heavily in purpose (both render animated count-up metrics from the same `Stat[]` data), and rendering both on the homepage would be redundant.

## Usage Guidelines
Do not add this to a page without first deciding whether it duplicates [`Stats`](./Stats.md)'s job. Confirm the metric-matching logic (`live.label.toLowerCase().includes(m.label.split(' ')[0])`) actually matches your real `Stat` records before relying on it — it's a fragile heuristic, not an explicit ID/key mapping.

## Future Improvements
Either wire this into a page or remove it — right now it's maintained dead code. Not currently tracked in [`../../appendices/technical-debt-register.md`](../../appendices/technical-debt-register.md); worth adding if this is confirmed unintentional.
