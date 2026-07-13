# Component: `HomePageClient`

**File:** `frontend/src/components/HomePageClient.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
Receives server-fetched homepage data as props and renders the full homepage section stack (`Navbar` → `Hero` → `About` → `Stats` → `Projects` → `Skills` → `Research` → `Certifications` → `Achievements` → `Contact` → `Footer`). Also owns the cold-start client re-fetch logic. Full data-flow detail lives in [`../../pages/home.md`](../../pages/home.md) — this doc covers the component itself.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `serverData` | `HomePageData` | Yes | — | The 11-field bundle (`hero`, `socials`, `heroBadges`, `settings`, `projects`, `papers`, `skillsData`, `certs`, `achievements`, `stats`, `aboutSection`) fetched server-side by `app/page.tsx` |

`HomePageData` is exported from this file — `app/page.tsx` imports the type from here, meaning this component is the source of truth for the homepage's data shape, not the page file.

## Variants
None — one fixed section order (see [`../../architecture/component-hierarchy.md`](../../architecture/component-hierarchy.md); note [`Impact`](../sections/Impact.md) is not in this list and is unused).

## Composition
Renders every homepage section component directly — see [`Hero`](../sections/Hero.md), [`About`](../sections/About.md), [`Stats`](../sections/Stats.md), [`Projects`](../sections/Projects.md), [`Skills`](../sections/Skills.md), [`Research`](../sections/Research.md), [`Certifications`](../sections/Certifications.md), [`Achievements`](../sections/Achievements.md), [`Contact`](../sections/Contact.md), plus [`Navbar`](./Navbar.md)/[`Footer`](./Footer.md).

## Accessibility
No component-specific accessibility handling — landmark structure comes from the `<main>` wrapper around all sections.

## Performance
Implements the homepage's cold-start recovery re-fetch (`isDataStale()` check + 3s-delayed full re-fetch of all 11 endpoints) — see [`../../pages/home.md`](../../pages/home.md)'s Performance section for the full explanation and its relationship to [technical debt item #11](../../appendices/technical-debt-register.md).

## Example

```tsx
// app/page.tsx (Server Component)
const serverData = await fetchAllHomepageData();
return <HomePageClient serverData={serverData} />;
```

## Best Practices
Treat this component as the canonical list of which sections appear on the homepage and in what order — don't add a new section directly to `app/page.tsx`; add it here and update `app/page.tsx`'s parallel fetch if it needs new data.

## Usage Guidelines
Don't call this component with partial/mocked `HomePageData` outside of the real `app/page.tsx` fetch flow — every section expects its slice of `serverData` to be present (empty arrays are fine; `undefined` fields are not, since child components don't defensively guard against a fully missing prop object).

## Future Improvements
See [`../../pages/home.md`](../../pages/home.md) and [`../../architecture/rendering-strategy.md`](../../architecture/rendering-strategy.md) for the SWR/React Query recommendation that would replace the current fetch-fallback-refetch pattern.
