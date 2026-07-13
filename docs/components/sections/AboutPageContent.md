# Component: `AboutPageContent`

**File:** `frontend/src/components/sections/AboutPageContent.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
Renders the full body of the `/about` page: header (identity, photo, contact icons), professional summary, education timeline, key achievements, featured projects, and grouped skills — each section conditionally rendered based on `profile.show*` visibility flags.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `profile` | `AboutProfile` | Yes | — | Name, title, subtitle, summary, contact links, `show*` visibility flags |
| `education` | `Education[]` | Yes | — | Rendered as a vertical timeline, only if `profile.showEducation` |
| `skillGroups` | `AboutSkillGroup[]` | Yes | — | Rendered as labeled rows, only if `profile.showSkills`; skills within each group are sorted so `highlightedSkills` appear first |
| `achievements` | `Achievement[]` | Yes | — | Pre-filtered/sliced by the caller (`page.tsx` passes `.filter(a => a.visible).slice(0, 4)`) — this component does not do its own filtering |
| `projects` | `Project[]` | Yes | — | Pre-sliced by the caller (`.slice(0, 3)`) |
| `aboutConfig` | `AboutConfig` | Yes | — | Header background type/value and profile image, independent from the homepage's `heroConfig` |

## Variants
None — each section is show/hide only, controlled by `profile.show*` booleans, not alternate layouts.

## Composition
Defines its own inline `ProjectCard` (distinct from — and not shared with — the `ProjectCard` defined inline in [`Projects`](./Projects.md) and `app/projects/page.tsx`; three separate near-duplicate implementations exist across the codebase). Renders its own copy of the GitHub/LinkedIn/LeetCode/CodeChef SVG icon components (a fourth duplication point alongside [`Hero`](./Hero.md) and [`Footer`](../shared/Footer.md), which use a slightly different icon set).

## Accessibility
Contact icon links have `aria-label` set from the link's `label` (Phone/Email/LinkedIn/etc.) via the `.about-contact-icon`/`.about-contact-tooltip` CSS classes — a tooltip-on-hover pattern. Education timeline uses semantic `<h3>` per entry.

## Performance
Profile photo and all images are plain `<img>` tags, not `next/image`. No pagination — all passed-in arrays render in full (already pre-limited by the caller).

## Example

```tsx
<AboutPageContent
  profile={profile}
  education={education}
  skillGroups={skillGroups}
  achievements={achievements.filter(a => a.visible).slice(0, 4)}
  projects={projects.slice(0, 3)}
  aboutConfig={aboutConfig}
/>
```

## Best Practices
- Filter/slice `achievements` and `projects` before passing them in — this component trusts the caller's array as-is and will render everything it receives.

## Usage Guidelines
- Don't pass the homepage's `AboutSectionData` here — this component expects the richer `AboutProfile`/`Education`/`AboutSkillGroup` shape used specifically by `/about`. See [`About`](./About.md) for the homepage-teaser counterpart.

## Future Improvements
The `ProjectCard` duplication (three near-identical implementations across this file, `Projects.tsx`, and `app/projects/page.tsx`) is a reasonable extraction candidate; not currently tracked as a numbered debt item, though it's the same category of duplication noted for admin pages in [technical debt item #9](../../appendices/technical-debt-register.md).
