# Page: `/admin/login`

## Purpose
Admin authentication form — email + password, issues a JWT on success.

## Business Goal
Gatekeeper for the CMS; the only entry point for editing site content.

## Target Audience
The site owner (single admin account — no multi-user support).

## Route
- Path: `/admin/login`
- File: `frontend/src/app/admin/login/page.tsx`
- Dynamic segments: none

## SEO & Metadata
- No page-specific `metadata` export; inherits `admin/layout.tsx`'s static `title: 'Admin | Abir Barman'` (see [`../layouts/admin-layout.md`](../layouts/admin-layout.md)).
- Included in `sitemap.ts`: no — admin routes are excluded from the sitemap.
- Structured data (JSON-LD): none, not applicable.

## Layout
`app/admin/layout.tsx` (metadata only, no auth gating — see [`../layouts/admin-layout.md`](../layouts/admin-layout.md)). This page does **not** render inside `AdminShell` (unlike every other admin page) since `AdminShell`'s job is exactly to redirect unauthenticated visitors to this page — wrapping the login page in it would be circular.

## Components Used
None from `components/admin/` or `components/sections/` — this page is fully self-contained (its own form markup, no `AdminShell`, no `AdminTable`).

## Hooks Used
None — see [`hooks/README.md`](../hooks/README.md). Uses `useState` directly for form fields, password visibility toggle, error, and loading state.

## Dependencies
`framer-motion` (entrance animation), `lucide-react` icons, `next/navigation`'s `useRouter`.

## Data Sources
- Endpoint: `POST /auth/login` via `frontend/src/lib/api.ts`'s `api.post()`.
- Fetch strategy: Client-side, on form submit only (no data loaded on mount).

## Loading States
Submit button shows "Signing in..." text and is disabled while the request is in flight (`loading` state) — no separate skeleton needed since the page has no initial data fetch.

## Error States
Any failure (wrong credentials, network error) is caught generically and displayed as `"Invalid email or password"` — the UI does not distinguish a genuine 401 from a network/server error. Rendered as an inline red-bordered message box above the form, not a toast.

## Accessibility
Both fields have visible `<label>` elements (not placeholder-only) — this page follows the labeling convention correctly, unlike some public-site filter inputs. Password visibility toggle is a real `<button type="button">`.

## Performance
No page-specific performance concerns — minimal component, single API call.

## Future Improvements
No rate limiting exists on `POST /auth/login` — see [technical debt item #12](../appendices/technical-debt-register.md) (Medium–High security severity: brute-force risk, since `/api/contact` has rate limiting but login does not).

## Related Pages
- [`admin-dashboard.md`](./admin-dashboard.md) — redirect target on success
- [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md) — full login sequence diagram
- [`../components/admin/AdminShell.md`](../components/admin/AdminShell.md) — where the reverse guard (redirect *to* this page) lives
