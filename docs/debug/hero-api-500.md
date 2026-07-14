# Debug Report: `GET /api/hero` → HTTP 500 (Admin Settings won't load)

**Date:** 2026-07-14 · **Status:** 🔴 **OPEN in production** — root cause identified, code
hardened, **local** DB in sync; the **production Supabase DB is still missing the column**
and `https://api.abirbarman.com/api/hero` still returns 500. Fix pending (see Production).

## Problem
Admin → Settings shows *"Failed to load settings from the server."* The browser console
shows `GET /api/hero` returning **HTTP 500 Internal Server Error**.

This is a **different** failure from the earlier port-split incident
([settings-data-loading.md](./settings-data-loading.md)). That one was a *network error*
(no HTTP response, silent empty form). This one is a real HTTP **500** — the request
reaches the Express backend and the backend **throws**.

## Root Cause
**Prisma schema ↔ database drift on `HeroContent.resumePreviewUrl`.**

1. Commit `57aee27` added `resumePreviewUrl String @default("")` to `schema.prisma` and
   regenerated the Prisma client. It added **no migration** — this project syncs schema
   with `prisma db push` (there is no `prisma/migrations` directory).
2. In the window before `prisma db push` was run against `portfolio_db`, the regenerated
   client's `prisma.heroContent.findFirst()` emitted `SELECT ..., "resumePreviewUrl" ...`
   against a table that did not yet have the column.
3. Postgres returned error `42703` (`column ... does not exist`); Prisma surfaced it as a
   `PrismaClientKnownRequestError`.
4. The `GET /api/hero` handler had **no `try/catch`**, so under Express 5 the rejected
   promise auto-forwarded to the global error handler →
   `res.status(500).json({ error: 'Internal server error' })` → the reported opaque 500.

## Evidence
| Layer | Check | Result |
|---|---|---|
| Local DB reachable | direct `pg` connect to `portfolio_db` | ✅ connects, 1 `HeroContent` row |
| Local column present | `information_schema.columns` for `HeroContent` | ✅ `resumePreviewUrl` exists (ordinal 8 — appended by a later `db push`) |
| Local row integrity | dump row | ✅ `roles` populated, `resumePreviewUrl` = `""` |
| Client in sync | `.prisma/client/schema.prisma` | ✅ has `resumePreviewUrl` |
| Local query path | `findFirst()` via the app's client/adapter (Node 22) | ✅ returns full row |
| Local endpoint | `curl :5002/api/hero` | ✅ HTTP 200 |
| **Prod `/api/health`** | `curl https://api.abirbarman.com/api/health` | ✅ 200 — Render backend up |
| **Prod `/api/settings`** | `curl …/api/settings` | ✅ 200 — Supabase reachable, `SiteSettings` fine |
| **Prod `/api/hero`** | `curl …/api/hero` | ❌ **500** `{"error":"Failed to load hero content"}` — fault isolated to `HeroContent` |
| Drift mechanism | `SELECT` a missing column via the adapter | ❌ `PrismaClientKnownRequestError`, code `42703` — reproduces the 500 trigger |
| Migrations | `prisma/migrations` | ⚠️ does not exist — schema is `db push`-only |

Ruled out: network/port split (this is a real 500, not an empty reply), auth
(`GET /api/hero` is public), response-shape mismatch, serialization, the frontend
`.catch` (it correctly reports the backend's 500).

## Local vs production
- **Local** (`portfolio_db`): the column was added by a `db push`; `/api/hero` returns 200. Resolved locally.
- **Production** (Supabase, served by Render): the column was **never applied**. `/api/settings`
  (no new column) returns 200 while `/api/hero` returns 500 — proving the DB is reachable and
  the fault is the missing `HeroContent.resumePreviewUrl` column specifically. The production
  backend already runs the hardened handler (the response carries the clean
  `Failed to load hero content` message), so the **real Prisma error is in the Render logs**
  (`Hero GET error: …`). Confirm it says `42703 / column … does not exist` (vs. a null-field
  error) before mutating the DB.

## Fix
**Code (durable) — `backend/src/routes/hero.ts`:** wrapped the `GET /`
handler in `try/catch` with `console.error('Hero GET error:', error)` and a
`500 { error: 'Failed to load hero content' }` response — mirroring the existing `PUT`
handler and satisfying AGENTS.md §4.2. This does not mask a 500, it makes the **real cause
loggable at the route** (the Prisma `42703`/`P2022` message) instead of an anonymous
"Internal server error", so any future drift is diagnosable in one log line.

**Production (still required to clear the live 500):** apply the missing column to the
Supabase DB with additive, non-destructive SQL (matches the Prisma default exactly, no data
loss) — run in the Supabase SQL editor:

```sql
ALTER TABLE "HeroContent"
  ADD COLUMN IF NOT EXISTS "resumePreviewUrl" TEXT NOT NULL DEFAULT '';
```

Do **not** use `prisma db push` against production (AGENTS.md §3.3 — it can drop/alter columns).
After the `ALTER TABLE`, `/api/hero` returns 200 immediately; no redeploy needed.

**Operational (prevents recurrence):** after **any** change to `schema.prisma`, sync the DB
**before** starting or deploying the server. Regenerating the client without syncing the DB
guarantees this class of 500. The deploy pipeline's `db push`-on-`start` (TD-07) is the
mechanism that let prod drift — track the migration adoption there.

## Verification
- `npx tsc --noEmit` clean (backend).
- `curl :5002/api/hero` → HTTP 200 with full JSON after the edit hot-reloaded.
- Drift trigger reproduced independently (`42703` → `PrismaClientKnownRequestError`),
  confirming the new `catch` now intercepts it, logs the real error, and returns the
  clean `Failed to load hero content` message.

## Follow-ups (out of scope here)
- Adopt Prisma **migrations** (`prisma/migrations`) so schema/DB sync is versioned and
  enforced rather than a manual `db push` step. AGENTS.md §3.3 already mandates migrations;
  the repo currently diverges from that rule.
- Other GET routes (`about`, `stats`, `categories`, …) share the catch-less pattern and
  would surface the same opaque 500 under drift — audit and wrap them consistently.
