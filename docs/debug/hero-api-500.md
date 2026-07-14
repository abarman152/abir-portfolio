# Debug Report: `GET /api/hero` → HTTP 500 (Admin Settings won't load)

**Date:** 2026-07-14 · **Status:** Root cause identified · code hardened · DB verified in sync

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
| Database reachable | direct `pg` connect to `portfolio_db` | ✅ connects, 1 `HeroContent` row |
| Column present now | `information_schema.columns` for `HeroContent` | ✅ `resumePreviewUrl` exists (ordinal 8 — appended by a later `db push`) |
| Row integrity | dump row | ✅ `roles` populated, `resumePreviewUrl` = `""` |
| Client in sync | `.prisma/client/schema.prisma` | ✅ has `resumePreviewUrl` |
| Query path | `findFirst()` via the app's client/adapter (Node 22) | ✅ returns full row |
| Live endpoint | `curl :5002/api/hero` | ✅ HTTP 200 today |
| Drift mechanism | `SELECT` a missing column via the adapter | ❌ `PrismaClientKnownRequestError`, code `42703` — reproduces the 500 trigger |
| Migrations | `prisma/migrations` | ⚠️ does not exist — schema is `db push`-only |

Ruled out: network/port split (this is a real 500, not an empty reply), auth
(`GET /api/hero` is public), response-shape mismatch, serialization, the frontend
`.catch` (it correctly reports the backend's 500).

## Why it returns 200 now
The missing column has since been added to the DB (a `db push` was run — the column sits at
ordinal 8, appended after `updatedAt`, which is exactly how `db push` adds a new field
non-destructively). The acute condition is resolved; the endpoint returns 200.

## Fix
**Code (durable) — `backend/src/routes/hero.ts`:** wrapped the `GET /`
handler in `try/catch` with `console.error('Hero GET error:', error)` and a
`500 { error: 'Failed to load hero content' }` response — mirroring the existing `PUT`
handler and satisfying AGENTS.md §4.2. This does not mask a 500, it makes the **real cause
loggable at the route** (the Prisma `42703`/`P2022` message) instead of an anonymous
"Internal server error", so any future drift is diagnosable in one log line.

**Operational (prevents recurrence):** after **any** change to `schema.prisma`, run
`prisma db push` (dev) / `prisma migrate deploy` (prod) **before** starting or deploying the
server. Regenerating the client without syncing the DB guarantees this class of 500.

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
