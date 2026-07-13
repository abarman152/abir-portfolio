# Component: `Hero`

**File:** `frontend/src/components/sections/Hero.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
Full-viewport homepage hero: name, tagline, roles, bio, CTAs, social icons, and a theme-aware profile photo with floating badges.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `hero` | `HeroContent` | Yes | — | Name, tagline, bio, resume URL, avatar URL |
| `socials` | `SocialLink[]` | Yes | — | Rendered as icon links; falls back to 4 hardcoded generic social URLs (github.com, linkedin.com, etc., not the real profile links) if empty |
| `badges` | `HeroBadge[]` | No | `undefined` → falls back to `DEFAULT_BADGES` (3 hardcoded badges) | Floating labeled badges positioned around the photo |
| `heroConfig` | `HeroConfig` | No | `undefined` | Controls background (gradient/image) and theme-specific profile images |

## Variants
None — single layout, but the profile image and background render differently based on `heroConfig.backgroundType` (`'gradient'` vs `'image'`) and the current theme (`heroConfig.themeImages.dark`/`.light`).

## Composition
Renders inline SVG icon components for GitHub/LinkedIn/LeetCode/Codeforces (duplicated definitions also found in `AboutPageContent.tsx` and `Footer.tsx` — not shared/extracted). Reads `useTheme()` from [`ThemeProvider`](../shared/ThemeProvider.md) to resolve which theme-specific profile image to show.

## Accessibility
Social icon links have `title` attributes (tooltip on hover) but rely on the SVG's implicit content for a screen reader label rather than explicit `aria-label`. CTA buttons are real `<a>` elements with visible text.

## Performance
Profile image uses `loading="eager"` (correct for above-the-fold hero content) but via a plain `<img>` tag, not `next/image` — no automatic responsive sizing/format optimization for this particular image, unlike the design system's general expectation of `next/image` usage. Floating badges use icon components mapped by string key (`ICON_MAP`) rather than dynamic imports.

## Example

```tsx
<Hero hero={hero} socials={socials} badges={heroBadges} heroConfig={settings.heroConfig} />
```

## Best Practices
- Always pass real `socials` data from the API — the hardcoded fallback links point to generic domains (`https://github.com`, not the actual profile), which is a placeholder, not a real fallback content strategy.
- Populate `HeroBadge` records via `/admin/hero-badges` rather than relying on `DEFAULT_BADGES`.

## Usage Guidelines
- Don't reuse this component outside the homepage — it's purpose-built for the full-viewport hero section and assumes it's the first thing rendered in `<main>`.
- The theme-aware image fallback chain (`themeImages[theme] → profileImage → hero.avatarUrl`) should stay in that order if modified; changing it changes which admin-configured field takes precedence.

## Future Improvements
Migrating the profile photo to `next/image` would align with the rest of the design system's image-optimization intent; not tracked as a numbered debt item. See [`../../features/image-handling-convention.md`](../../features/image-handling-convention.md).
