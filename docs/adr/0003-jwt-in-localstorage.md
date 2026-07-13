# ADR 0003: Store the Admin JWT in `localStorage`, Not an httpOnly Cookie

**Status:** Accepted, tracked for revisit
**Date:** 2026-07-03 (retroactively documented — decision predates this ADR; status marked "tracked for revisit" as a result of the 2026-07 audit, not because it's being changed now)

## Context

The admin panel needs to attach an auth token to every authenticated API request. The two common approaches are: store the JWT in `localStorage`/`sessionStorage` and attach it manually via an `Authorization` header, or store it in an httpOnly cookie and let the browser attach it automatically.

## Decision

Store the JWT in `localStorage` (key: `admin_token`), attached manually via `Authorization: Bearer <token>` using `authHeader()` in `frontend/src/lib/api.ts`. See [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md) for the full flow.

## Alternatives Considered

| Option | Why not chosen (at the time) / why it's a real option now |
|---|---|
| httpOnly cookie | Not vulnerable to XSS-based token theft (JavaScript can't read an httpOnly cookie), but requires CSRF protection in exchange (a cookie is sent automatically on cross-origin requests unless mitigated), and requires the backend to set/manage the cookie rather than the current simple "return a token in the JSON body" pattern. This is a legitimate stronger option, not implemented because it's a coordinated change (cookie + CSRF token + backend response shape change), not a drop-in swap. |

## Consequences

**Positive:**
- Simple to implement and reason about — the token is just a string the frontend controls entirely.
- No CSRF surface today, since no cookie is involved in the auth flow at all.

**Negative / tradeoffs accepted:**
- Readable by any script that achieves XSS on the page (see [`../security/authentication.md`](../security/authentication.md) for why this is real-but-currently-low risk given the app's limited script-injection surface).
- No server-side revocation — a stolen token is valid until its 7-day expiry with no way to invalidate it early.

## Revisit Trigger

This decision should be actively revisited (not just left as accepted-by-default) if any of the following becomes true:
- A second admin user is introduced (raising the stakes of a compromised token).
- User-generated content with a raw-HTML rendering path is added (raising XSS risk).
- The project moves toward treating this as a production system with real users beyond the single site owner.

## Related
- [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md)
- [`../security/authentication.md`](../security/authentication.md)
- [`../architecture/future-architecture.md`](../architecture/future-architecture.md)
- [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #14
