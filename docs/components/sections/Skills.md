# Component: `Skills`

**File:** `frontend/src/components/sections/Skills.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
Homepage "Technical Toolkit" section — renders skill categories as cards, each listing its skills as tags, with a colored dot marking `isHighlighted` skills.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `categories` | `SkillCategoryWithSkills[]` | Yes | `[]` → falls back to `DEFAULT_CATEGORIES` (3 hardcoded categories: Data Science, ML, Backend) if empty | Each category's `skills` array is sorted by `level` descending before rendering |

## Variants
None — layout is fixed; only content (category count, skill count per category) varies.

## Composition
Maps `cat.name` through a local `ICON_MAP` (`'Data Science'`, `'ML'`, `'Backend'`, `'Frontend'`, `'MLOps'` → specific icons), defaulting to `Layers` for unmapped category names — meaning custom category names created in the admin panel (`/admin/skills`) will render with the generic `Layers` icon unless they happen to match one of these 5 hardcoded strings exactly.

## Accessibility
Category headings are `<h3>`. Skill tags are plain `<span>` elements, not interactive.

## Performance
Categories/skills render in full — no virtualization needed at expected content volume.

## Example

```tsx
<Skills categories={skillsData.categories} />
```

## Best Practices
When adding a new skill category via the admin panel, be aware the icon will default to a generic `Layers` icon unless you extend `ICON_MAP` in this file to recognize the new category name — there's no admin-configurable icon field for categories.

## Usage Guidelines
This component has no listing-page counterpart (unlike Projects/Research/Certifications/Achievements) — skills are homepage-only content with no `/skills` route or detail pages, per [`../../architecture/routing-architecture.md`](../../architecture/routing-architecture.md).

## Future Improvements
None tracked specifically.
