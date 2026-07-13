# Feature: Theme System (Dark/Light Mode)

## Purpose
Lets visitors and admins toggle between dark and light color schemes, with the site owner able to set a site-wide default via the admin panel.

> This is the feature-level summary. For the full technical resolution flow (priority order, FOUC prevention, the theme-aware logo mechanism), see [`../architecture/theme-architecture.md`](../architecture/theme-architecture.md) — this doc does not duplicate that detail.

## Business Value
Dark/light preference is a baseline expectation for a modern portfolio site; getting it wrong (a visible flash on load, or a mismatched theme) reads as unpolished to the exact audience (recruiters, engineers) this site targets.

## User Flow
1. A visitor's first request hits the server, which renders `data-theme` from the database default (`SiteSettings.defaultTheme`, revalidated every 5 minutes).
2. Before first paint, an inline script checks `localStorage` — if the visitor previously toggled the theme on this browser, that preference overrides the DB default immediately, with no visible flash.
3. On mount, [`ThemeProvider`](../components/shared/ThemeProvider.md) additionally checks system preference (`prefers-color-scheme`) if no `localStorage` value exists yet, so a first-time visitor gets a theme matching their OS setting rather than always seeing the DB default.
4. The visitor can toggle the theme via a button in [`Navbar`](../components/shared/Navbar.md) (public site) or [`AdminShell`](../components/admin/AdminShell.md) (admin panel) — the choice is written to `localStorage` and persists across future visits on that browser.
5. The site owner can change the sitewide default (for visitors with no prior preference) via `/admin/settings`.

## Architecture
Three-layer resolution (server DB default → inline script + `localStorage` → React Context) — see [`../architecture/theme-architecture.md`](../architecture/theme-architecture.md) for the full diagram. No third-party theme library (`next-themes` is a listed but unused dependency — see [technical debt item #6](../appendices/technical-debt-register.md)); this is a fully custom implementation.

## Dependencies
None beyond React Context and the browser's native `matchMedia`/`localStorage` APIs.

## Components
[`ThemeProvider`](../components/shared/ThemeProvider.md) (Context + sync logic), [`ThemeLogo`](../components/shared/ThemeLogo.md) (the one component whose rendering strategy is directly shaped by this system), [`Navbar`](../components/shared/Navbar.md)/[`AdminShell`](../components/admin/AdminShell.md) (toggle UI).

## Files

| File | Role |
|---|---|
| `frontend/src/app/layout.tsx` | Server-side DB fetch + inline FOUC-prevention script |
| `frontend/src/components/ThemeProvider.tsx` | React Context, system-preference fallback, `toggleTheme()` |
| `frontend/src/components/ThemeLogo.tsx` | Theme-aware logo (dual-render + CSS visibility, not JS branching) |
| `frontend/src/app/globals.css` | CSS variables and `.theme-logo-for-dark`/`.theme-logo-for-light` visibility rules |
| `frontend/src/app/admin/settings/page.tsx` | Where the site-wide `defaultTheme` is configured |

## Edge Cases
- **New visitor, no system preference detectable:** falls through to the DB default (`dark`, unless changed in settings).
- **Backend down during initial page load:** `getDefaultTheme()` in `layout.tsx` catches any fetch failure and defaults to `'dark'` — the theme system never blocks page render on a backend outage.
- **Admin toggles theme independently of the public site:** since `admin_token`/theme preference both live in `localStorage`, an admin's theme choice while browsing `/admin/*` is the same `localStorage` key (`theme`) used by the public site — toggling theme in one context affects the other on the same browser.

## Limitations
- No "system" option exposed in the UI — the toggle is a binary dark/light switch; system-preference detection only happens once, as a fallback when no explicit choice has been stored yet, not as a persistent "auto" mode a user can select and keep.

## Future Enhancements
None tracked as a numbered roadmap item.

## Testing Strategy
Manual only — verifying no-flash behavior specifically requires manual testing across fresh browser sessions/incognito windows, since the FOUC-prevention mechanism is inherently about the very first paint.
