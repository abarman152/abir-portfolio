# Utilities

Cross-cutting helper modules used across the frontend and backend — not components or routes, but shared logic they depend on. See [`../templates/utility-template.md`](../templates/utility-template.md) for the structure each doc follows.

## Frontend (`frontend/src/lib/`)

| File | Doc | Summary |
|---|---|---|
| `api.ts` | [`api-client.md`](./api-client.md) | Typed `fetch` wrapper (`api.get/post/put/patch/delete`) + `authHeader()` |
| `date.ts` | [`date-formatting.md`](./date-formatting.md) | UTC-based, locale-independent date formatters |
| `types.ts` | [`types-reference.md`](./types-reference.md) | All shared TypeScript interfaces (hand-maintained mirror of the Prisma schema) |

## Backend (`backend/src/lib/`)

| File | Doc | Summary |
|---|---|---|
| `prisma.ts` | [`backend-prisma-client.md`](./backend-prisma-client.md) | Prisma client singleton (PrismaPg adapter, dev hot-reload caching) |
| `notifications.ts` | [`backend-notifications-lib.md`](./backend-notifications-lib.md) | Resend-based contact notification + auto-reply + test-email sending |

## Related
- [`../architecture/overview.md`](../architecture/overview.md)
- [`../architecture/folder-architecture.md`](../architecture/folder-architecture.md)
- [`../database/schema-reference.md`](../database/schema-reference.md)
- [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md)
