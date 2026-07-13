# Layout: Root Layout

**File:** `frontend/src/app/layout.tsx`

## Purpose
Wraps every route in the app (public and admin). Sets global fonts, global `<head>` metadata, runs the FOUC-prevention theme script, and mounts `ThemeProvider`.

## Scope
Every route in `frontend/src/app/` — this is the single root layout for the entire application; there are no nested layouts for route groups (there are no route groups — see [`../architecture/routing-architecture.md`](../architecture/routing-architecture.md)).

## Responsibilities
- Loads `Inter` and `JetBrains_Mono` via `next/font/google` with `display: 'swap'`, exposing them as CSS variables (`--font-inter`, `--font-mono`).
- Exports the global `metadata` object: `metadataBase`, default title/description, favicon/icon set, Open Graph, and Twitter card config. Individual pages only override this when they export their own `metadata`/`generateMetadata` (currently: `/about` and the four `[slug]` detail pages — see [`../pages/`](../pages/)).
- Fetches `SiteSettings.defaultTheme` server-side (`GET /settings`, `next: { revalidate: 300 }`, 3s timeout, defaults to `'dark'` on any failure) and sets it as `data-theme` on `<html>` **before** any client code runs.
- Injects an inline `<script>` in `<head>` that reads `localStorage.getItem('theme')` and overrides `data-theme` synchronously, before first paint, if the user previously chose a theme different from the DB default. This is the FOUC-prevention mechanism — see [`../architecture/theme-architecture.md`](../architecture/theme-architecture.md) for the full resolution-order diagram.
- Wraps `children` in `ThemeProvider` (see [`../components/shared/ThemeProvider.md`](../components/shared/ThemeProvider.md)) so React state stays in sync with the DOM attribute the inline script set.

## What it does NOT do
- **Does not perform any auth gating or route protection.** The root layout has no knowledge of `/admin/*` versus public routes — that split happens entirely inside [`AdminShell`](../components/admin/AdminShell.md). See [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md).
- Does not render `Navbar`/`Footer` — every top-level page (public and admin) is responsible for rendering its own chrome; there's no shared "public site frame" component above the page level.
- Does not set per-route metadata beyond the global defaults.

## Composition
`<html data-theme={dbDefault}> → <head><script>theme override</script></head> → <body><ThemeProvider>{children}</ThemeProvider></body>`. `suppressHydrationWarning` is set on both `<html>` and `<body>` because the inline script may mutate `data-theme` before React hydrates, which would otherwise trigger a hydration mismatch warning.

## Data Fetching
One server-side fetch: `GET /settings` for `defaultTheme` only (not the full `SiteSettings` object is used — just the theme field), `revalidate: 300` seconds (5 minutes). This is the same 5-minute revalidation window documented in [`../architecture/rendering-strategy.md`](../architecture/rendering-strategy.md) as the sole non-per-request-SSR case in the app.

## Related
- [`../architecture/theme-architecture.md`](../architecture/theme-architecture.md) — full resolution flow this layout implements
- [`../components/shared/ThemeProvider.md`](../components/shared/ThemeProvider.md)
- [`admin-layout.md`](./admin-layout.md)
- [`page-transition-template.md`](./page-transition-template.md)
