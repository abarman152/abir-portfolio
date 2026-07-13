# Component: `Projects`

**File:** `frontend/src/components/sections/Projects.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
Homepage "What I've Built" section — a card grid of featured projects with a "View All Projects" link to `/projects`.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `projects` | `Project[]` | Yes | — | Rendered as a grid; shows an empty-state message ("No featured projects yet...") if empty |

## Variants
None — card appearance varies only by whether `project.problem` is set (shows a Problem/Result two-line summary) versus falling back to `project.description` (a 3-line-clamped paragraph).

## Composition
Internal-only `ProjectCard` (yet another near-duplicate of the `ProjectCard` defined in `app/projects/page.tsx` and `AboutPageContent.tsx` — three separate implementations of the same card concept across the codebase, not a shared component). Whole-card click-to-navigate via `useRouter().push()`, guarded so clicks on inner `<a>`/`<button>` elements don't also trigger the card-level navigation.

## Accessibility
Cards are keyboard-navigable (`tabIndex={0}`, `onKeyDown` Enter handler, `role="article"`, `aria-label`).

## Performance
`whileInView`/`once: true` entrance animation, staggered by `Math.min(index * 0.07, 0.28)`s (capped so later cards in a long list don't have an excessively long delay).

## Example

```tsx
<Projects projects={featuredProjects} />
```

## Best Practices
Pass only the featured/homepage subset (`GET /projects/featured`) — this component has no internal pagination and will render every item in the array it receives.

## Usage Guidelines
Don't use this for the `/projects` listing page — that page defines its own `ProjectCard` with search/filter/pagination; this component is homepage-only.

## Future Improvements
The `ProjectCard` triplication (here, `AboutPageContent.tsx`, and `app/projects/page.tsx`) is a reasonable extraction candidate; not currently tracked as a numbered debt item.
