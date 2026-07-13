# Component: `Navbar`

**File:** `frontend/src/components/Navbar.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
Site-wide fixed top navigation: logo, desktop nav links with an animated active-state "pill," theme toggle, Resume/Hire Me CTAs, and a mobile slide-in drawer.

## Props
None — self-contained, reads route state via `usePathname()`.

## Variants
None — single layout; responsive breakpoint (`md:`) toggles between desktop inline links and the mobile hamburger/drawer.

## Composition
Renders [`ThemeLogo`](./ThemeLogo.md) and reads `useTheme()`/`toggleTheme()` from [`ThemeProvider`](./ThemeProvider.md) — same theme system as [`AdminShell`](../admin/AdminShell.md). Active-link detection (`isActive()`) combines `pathname` matching for page routes with an `IntersectionObserver`-driven `activeSection` state for homepage anchor links (`/#contact`, etc.) — this is the one place in the public site using `IntersectionObserver` directly rather than Framer Motion's `whileInView`.

## Accessibility
Nav links are real `<Link>`/`<a>` elements. Mobile hamburger button toggles between `Menu`/`X` icons with no `aria-label`/`aria-expanded` — a gap for screen-reader users navigating the mobile drawer control. Mobile drawer traps scroll (`document.body.style.overflow = 'hidden'`) while open but has no JS focus trap or `Escape`-to-close handler.

## Performance
Scroll listener (`onScroll` → `setScrolled`) and `IntersectionObserver` (homepage only) both run continuously while mounted — standard for a persistent nav, no debouncing applied to the scroll handler (a single boolean flip past a 24px threshold, so the lack of debouncing has negligible practical cost).

## Example

```tsx
<Navbar />
```

## Best Practices
Keep `navLinks`/`drawerGroups` in sync with the actual route table — these are two separately-maintained arrays (desktop nav vs. mobile drawer groups) rather than one shared source, so adding a route requires updating both.

## Usage Guidelines
Don't render more than one `Navbar` per page — its `position: fixed` top bar and scroll listener assume a single instance.

## Future Improvements
`navLinks` and `drawerGroups` being separately maintained (rather than one array driving both desktop and mobile) is a minor duplication; not currently tracked as a numbered debt item.
