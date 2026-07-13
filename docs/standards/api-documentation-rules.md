# API Documentation Rules

Rules for [`api/rest-api-reference.md`](../api/rest-api-reference.md) and any future API docs.

## Every endpoint entry must include

| Field | Required | Notes |
|---|---|---|
| Method + path | Yes | Exactly as mounted in `backend/src/index.ts` / route file |
| Auth requirement | Yes | Mark `[AUTH]` if it requires a JWT; state the exact middleware (`authenticate`) |
| Request body/params shape | Yes, if applicable | Show a real example, not just a type name |
| Response shape | Yes | Show the **actual** success shape and the **actual** error shape — this codebase returns raw objects/arrays on success and `{ error: "message" }` on failure; don't document an idealized envelope that doesn't match reality |
| Rate limiting | Only if applied | Most routes have none; say so explicitly for security-sensitive routes rather than letting silence imply an assumption |
| Query params | If applicable | Table of param, type, default, description |

## Accuracy rules

1. **Verify against the route file, not against memory or an older doc.** This project's prior `api.md` was largely accurate, but drift like an overstated response envelope crept in elsewhere (`AGENTS.md`) — always check `backend/src/routes/*.ts` directly before documenting a shape.
2. **Never invent a response envelope, pagination shape, or error code that isn't in the code.** If you want to recommend one, put it in [`architecture/future-architecture.md`](../architecture/future-architecture.md) as a proposal, clearly separated from current-state documentation.
3. **Show real example payloads**, using realistic but non-sensitive values (never real user data, never a real credential — see the login example already in the API reference, which appropriately uses the documented default seed account).
4. **Document what happens on error**, not just the happy path — status codes, error message shape, and any side effects (e.g., contact form: does a failed email send still return `201`? Yes — email dispatch is fire-and-forget via `setImmediate`, and that must be stated, not left implicit).

## Structure

Group endpoints by resource (matches `backend/src/routes/*.ts` one-to-one). Within a resource, order routes: public reads → public writes → authenticated reads → authenticated writes → authenticated deletes. This mirrors the actual route file ordering convention already used in this codebase.

## Review trigger

Any PR that adds, removes, or changes the request/response shape of a route **must** update [`api/rest-api-reference.md`](../api/rest-api-reference.md) in the same PR. A new route file with no corresponding docs entry should be treated as an incomplete PR in review.
