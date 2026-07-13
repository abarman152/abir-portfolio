# Authorization

## Model: single-role, binary

There is exactly one role: **admin**. There is no concept of multiple permission levels, read-only admins, or per-resource access control — if you hold a valid JWT, you can mutate every resource the API exposes. This is appropriate for a single-owner portfolio site and should not be over-engineered with a roles/permissions system unless a second real admin user is ever introduced.

## Enforcement point

Every authenticated route attaches the `authenticate` middleware (`backend/src/middleware/auth.ts`), which verifies the JWT and attaches `req.adminId` — but does not check `adminId` against anything resource-specific, since there's only ever one admin. Authorization here is really just **authentication** gating all-or-nothing access; there's no separate authorization layer to document beyond "has a valid token, or doesn't."

## Public vs. protected split

See [`../api/rest-api-reference.md`](../api/rest-api-reference.md) for the full `[AUTH]` markers per endpoint. The pattern is consistent: `GET` on public-facing content is unauthenticated; `POST`/`PUT`/`PATCH`/`DELETE` and any `GET .../all` (which includes hidden/unpublished content) require auth.

## If this ever needs to change

If a second admin role (e.g., an editor who can't change site settings or the admin password) is ever introduced, this needs a real authorization layer — a `role` field on `Admin`, and per-route role checks in the `authenticate` middleware or a new one layered on top. Document that as an ADR when it happens (see [`../templates/adr-template.md`](../templates/adr-template.md)) since it's a genuine architecture change, not a quick fix.

## Related
- [`authentication.md`](./authentication.md)
- [`../api/rest-api-reference.md`](../api/rest-api-reference.md)
