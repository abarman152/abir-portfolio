# Authentication

Full flow diagrams live in [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md) — this doc is the security-specific detail and risk assessment.

## Mechanism

- Single admin account model (one `Admin` row, created via seed script or `POST /api/auth/setup` which only works when no admin exists yet).
- Password hashed with `bcryptjs`, cost factor 12.
- JWT signed with `JWT_SECRET`, 7-day expiry, payload is just `{ adminId }`.
- Token stored in `localStorage` (key: `admin_token`), attached via `Authorization: Bearer <token>` header.

## Risks and their actual severity

| Risk | Severity | Why |
|---|---|---|
| No rate limiting on `POST /api/auth/login` | **High** | Unlimited password guess attempts against a single known account. This is the single most actionable finding from the 2026-07 audit — see [`rate-limiting.md`](./rate-limiting.md). |
| JWT in `localStorage`, not httpOnly cookie | Medium | Readable by any script that achieves XSS on the page — but this app has no user-generated HTML rendering path for unauthenticated users beyond Markdown fields, which are not directly script-injectable via `react-markdown`'s defaults. Real risk, but requires a separate XSS vector first; not exploitable on its own. |
| Client-side-only route guard on `/admin/*` | Medium | Mitigated by the fact every actual mutation is independently JWT-verified server-side (see [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md)) — the guard gap only exposes the empty admin shell UI, not data. |
| 7-day token expiry with no refresh/revocation mechanism | Low–Medium | A stolen token is valid for up to 7 days with no way to revoke it early (no server-side token blocklist). Shortening expiry or adding a revocation list are both reasonable mitigations if this ever matters more (e.g. multiple admins). |

## Recommended next step

Add rate limiting to the login route (see [`rate-limiting.md`](./rate-limiting.md)) before addressing the cookie-storage question — it's a strictly smaller change with a clearer security win, whereas the cookie migration requires solving CSRF simultaneously (see [`../architecture/future-architecture.md`](../architecture/future-architecture.md)).

## Related
- [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md)
- [`authorization.md`](./authorization.md)
- [`rate-limiting.md`](./rate-limiting.md)
