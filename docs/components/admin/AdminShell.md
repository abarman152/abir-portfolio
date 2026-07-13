# Component: `AdminShell`

**File:** `frontend/src/components/admin/AdminShell.tsx`
**Type:** Client Component (`'use client'`)

## Purpose
The composition wrapper for every admin page (except `/admin/login`): renders the sidebar navigation, mobile drawer, theme toggle, logout control — and, critically, is where the client-side auth guard for `/admin/*` actually lives.

> **This is the single most important file for understanding admin route protection.** See [`../../architecture/authentication-flow.md`](../../architecture/authentication-flow.md) for the full sequence — summarized here because it's directly implemented in this component, not in `admin/layout.tsx` (see [`../../layouts/admin-layout.md`](../../layouts/admin-layout.md), which does nothing but set a page title).

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `children` | `React.ReactNode` | Yes | — | The admin page's own content, rendered inside the shell's scrollable content area |

## Variants
None — one layout, responsive via CSS (`hidden md:block`/`md:hidden` Tailwind utility classes control desktop sidebar vs. mobile hamburger + slide-in drawer).

## Composition
- **Auth guard:** a `useEffect` on mount reads `localStorage.getItem('admin_token')`; if absent, calls `router.replace('/admin/login')`. Renders `null` until `mounted` is `true` (set unconditionally at the end of the same effect, regardless of whether a token was found) — this briefly blanks the page while the check runs, then either shows the shell or has already kicked off the redirect.
- Renders 13 `NAV_ITEMS` (Dashboard + 12 content sections) as a fixed-position sidebar (desktop) or an `AnimatePresence`-driven slide-in drawer (mobile).
- Uses [`ThemeLogo`](../shared/ThemeLogo.md) and `useTheme()` from [`ThemeProvider`](../shared/ThemeProvider.md) — the same theme system as the public site's [`Navbar`](../shared/Navbar.md).
- Logout: `localStorage.removeItem('admin_token')` + redirect to `/admin/login`. No API call to invalidate the token server-side (the backend has no logout/token-revocation endpoint — a JWT remains valid until its 7-day expiry regardless of "logout").

## Accessibility
Nav items are real `<Link>` elements with icon + visible text label. Mobile drawer traps focus visually (overlay + slide-in) but does not implement a JS focus trap or `Escape`-to-close — clicking the backdrop or the X button are the only close affordances.

## Performance
The `!mounted → return null` pattern means every admin page renders nothing at all for one render cycle before the shell (or redirect) appears — this is the client-side equivalent of a loading flash, not a skeleton.

## Example

```tsx
export default function AdminSomePage() {
  return (
    <AdminShell>
      <div>page content</div>
    </AdminShell>
  );
}
```

## Best Practices
- Every admin page except `/admin/login` should wrap its content in `AdminShell` — it's the only thing standing between an admin route and being fully open to unauthenticated visitors (the shell, not the data — see the practical-consequence note below).

## Usage Guidelines
- Don't rely on this component for data security — it only gates the UI shell. Every actual data-fetching endpoint remains independently protected by the backend's `authenticate` middleware regardless of whether this component's check passes. See [technical debt item #13](../../appendices/technical-debt-register.md).
- Don't add `AdminShell` to `/admin/login` — doing so would create a redirect loop, since the guard would immediately bounce an unauthenticated visitor back to the very page it's rendering.

## Future Improvements
A `middleware.ts` edge check (e.g., reading an httpOnly cookie) would add defense-in-depth ahead of this client-side check — see [`../../architecture/future-architecture.md`](../../architecture/future-architecture.md) and [technical debt item #13](../../appendices/technical-debt-register.md).
