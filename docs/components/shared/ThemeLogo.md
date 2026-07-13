# Component: `ThemeLogo`

**File:** `frontend/src/components/ThemeLogo.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
Renders the site logo in a theme-aware way without any JS-driven conditional rendering — both the white and black logo variants are always in the DOM, and CSS visibility (keyed to the `[data-theme]` attribute) decides which one is visible. See [`../../architecture/theme-architecture.md`](../../architecture/theme-architecture.md) for the full flowchart of why this approach avoids a hydration flash.

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `width` | `number` | No | `30` | Logo width in pixels, passed to both `next/image` instances |
| `height` | `number` | No | `30` | Logo height in pixels |
| `alt` | `string` | No | `'Abir logo'` | Alt text, shared by both image variants |
| `priority` | `boolean` | No | `false` | Passed to `next/image`'s `priority` — set `true` in [`Navbar`](./Navbar.md) since the logo is above-the-fold on every page |
| `className` | `string` | No | `''` | Appended to each image's class list, alongside the theme-visibility class |

## Variants
Two `next/image` instances are always rendered: one with class `theme-logo-for-dark` (shows `logo-white.png`), one with class `theme-logo-for-light` (shows `logo-black.png`). CSS in `globals.css` toggles `display`/`visibility` for each class based on the current `[data-theme]` value on `<html>` — there is no conditional JSX branch (`theme === 'dark' ? ... : ...`) in this component at all.

## Composition
Used by both [`Navbar`](./Navbar.md) and [`AdminShell`](../admin/AdminShell.md) — the one component genuinely shared across the public/admin boundary (see [`../../architecture/component-hierarchy.md`](../../architecture/component-hierarchy.md)). Also used in [`Footer`](./Footer.md).

## Accessibility
Both images share one `alt` text — a screen reader encountering this component will announce the alt text once per visible image (in practice, only one is visible per theme, so this doesn't produce duplicate announcements in practice, though both `<img>` elements are technically present in the accessibility tree unless the hidden one is also given `aria-hidden`, which it is not explicitly — the CSS `display: none` on the hidden variant does remove it from the accessibility tree in modern browsers).

## Performance
Rendering two `next/image` instances means two image requests/decodes per logo placement rather than one — a deliberate tradeoff (see the architecture doc) to avoid a JS-driven flash, at the cost of loading both logo variants regardless of which one is shown.

## Example

```tsx
<ThemeLogo width={34} height={34} priority />
```

## Best Practices
Always use this component instead of a raw `<Image src="/branding/logo-*.png">` for the logo, anywhere in the app — it's the only correct way to render the logo without a theme-mismatch flash.

## Usage Guidelines
Don't try to "optimize" this into a single conditional `<Image>` based on `theme` from `useTheme()` — that would reintroduce the exact hydration-flash problem this component's dual-render + CSS-visibility approach was built to avoid.

## Future Improvements
None tracked specifically — this is a deliberate, documented pattern, not a gap.
