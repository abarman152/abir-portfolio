# State Management

## Scope
What state exists in this app and how it's managed — there is **no global state library** (no Redux/Zustand/Jotai/React Query).

## What state exists

| State | Where it lives | Mechanism |
|---|---|---|
| Theme (dark/light) | `ThemeProvider.tsx` (React Context) + `localStorage` + inline FOUC-prevention script | See [`theme-architecture.md`](./theme-architecture.md) |
| Admin auth token | `localStorage` (`admin_token` key) | Read directly via `localStorage.getItem`, no context wrapper |
| Per-page fetched data | Local component state (`useState`) set from a `fetch()`/`useEffect` or passed as server-rendered props | No caching layer (no SWR/React Query) — every mount re-fetches |
| Admin CRUD form state | Local component state per admin page, duplicated pattern across all ~13 admin sections | Not extracted into a shared hook — see [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #9 |
| Toast/notification feedback in admin | Local component state, re-implemented per page | Same debt item as above |

## Why no global store

The app's data is almost entirely **server state** (content from the database), not client-only UI state that would benefit from Redux/Zustand. The missing piece isn't a global store — it's a **data-fetching cache layer** (SWR/React Query/TanStack Query would eliminate both the homepage double-fetch and the repeated per-admin-page fetch boilerplate). This is the actual architectural gap, tracked in [`roadmap/future-architecture.md`](./future-architecture.md), not the absence of Redux.

## Theme state is the one true "global" client state

It's the only state genuinely shared across otherwise-unrelated components (`Navbar`, `AdminShell`, every section), which is why it's the one piece implemented via React Context rather than local `useState`.

## Related
- [`theme-architecture.md`](./theme-architecture.md)
- [`../hooks/README.md`](../hooks/README.md) — the missing extraction layer
- [`future-architecture.md`](./future-architecture.md)
