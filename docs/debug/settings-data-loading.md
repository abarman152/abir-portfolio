# Debug Report: Admin Settings Page Not Loading Data

**Date:** 2026-07-13 · **Status:** Fixed and verified

## Problem
Opening **Admin → Settings** rendered every Hero Content field empty (Full Name, Tagline, Typing Roles, Bio, Resume URL, Resume Preview URL, Avatar URL) with no error message, despite the database containing real values.

## Root Cause
Two layers combined:

1. **Environmental trigger — IPv4/IPv6 port split on 5001.** Elmedia Player (a media app on this Mac) listens on **IPv4** `*:5001`. The Express backend, configured with `PORT=5001`, binds **IPv6** `*:5001` — Node's default `listen()` on the v6 wildcard succeeds because the v4 socket belongs to another process, so the backend prints `Server running on http://localhost:5001` and *looks* healthy. But the browser resolves `localhost` to `127.0.0.1`, so every frontend API call lands on **Elmedia**, which accepts the TCP connection and returns **no HTTP response**. `fetch()` rejects with a network error.

2. **Code defect — silent load failure.** In `frontend/src/app/admin/settings/page.tsx`, the load effect was:
   ```ts
   Promise.all([api.get('/settings'), api.get('/hero')]).then(([s, h]) => { … });
   ```
   No `.catch`, no loading state — a rejected fetch left the form in its initial empty state with zero feedback, turning an infrastructure failure into a "data loading bug".

## Evidence
| Layer | Check | Result |
|---|---|---|
| Database | `psql`: `SELECT … FROM "HeroContent"` / `"SiteSettings"` | ✅ Rows exist with real values |
| Port | `lsof -iTCP:5001` | Elmedia (IPv4) **and** node (IPv6) listening simultaneously |
| API via IPv4 | `curl -4 localhost:5001/api/hero` | ❌ Empty reply (Elmedia) |
| API via IPv6 | `curl -6 localhost:5001/api/hero` | ✅ Full hero JSON |
| ORM / route | Same request against the backend directly | ✅ Correct data, correct shape |
| Client | Settings page load effect | ❌ `Promise.all(...).then(...)` with no `.catch` — silent failure |

Not the cause (ruled out): schema/migration gaps (`resumePreviewUrl` exists in DB and API), response-shape mismatch, auth (`GET /settings` and `GET /hero` are public), serialization, caching, hydration.

## Fix
1. **Local env** (gitignored files, this machine only): `backend/.env` `PORT=5001 → 5002`; `frontend/.env.local` `NEXT_PUBLIC_API_URL → http://localhost:5002/api`. Production (Render/Vercel) has its own env and is unaffected.
2. **Code** (`frontend/src/app/admin/settings/page.tsx`): added `.catch` to the load `Promise.all` that surfaces the existing error banner: *"Failed to load settings from the server. Check that the backend is running and reachable, then refresh this page."*

## Verification
- Database row confirmed → API on 5002 returns full JSON → admin settings form populates every field → editing + saving persists to the DB → hard refresh reloads the saved values → error banner appears when the backend is stopped (previously: silent empty form).
- `tsc --noEmit` clean (frontend + backend); `next build` passes; ESLint at the pre-existing baseline.

## Regression Prevention
- The error banner now makes any future backend-unreachable situation visible immediately instead of masquerading as missing data.
- Machine note: port 5001 is permanently contested by Elmedia Player on this Mac — keep local dev on 5002 (saved to agent memory as well).
- Watch-out: the backend's "Server running" log line does **not** guarantee IPv4 reachability; a dual-stack split is invisible in the startup output. `curl -4 localhost:<port>/api/hero` is the honest smoke test.
- Known gap (out of scope here): other admin pages share the same catch-less load pattern and would fail equally silently — tracked as a follow-up.

## Architecture Notes
Data flow (all confirmed healthy once the port was fixed):
`PostgreSQL (local, portfolio_db)` → Prisma → `GET /api/settings` + `GET /api/hero` (public) → `lib/api.ts` fetcher → `Promise.all` in the settings page effect → `setSettings`/`setHero` state → controlled inputs. No React Query/SWR, no form library — plain `useState` with value-bound inputs, so populated state is immediately visible in the UI.
