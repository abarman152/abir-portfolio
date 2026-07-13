# Utility: `prisma` (Prisma client singleton)

**File:** `backend/src/lib/prisma.ts`

## Purpose
Instantiates and exports the single shared Prisma client used by every route file, using the `PrismaPg` adapter for connection pooling through Supabase's pgBouncer.

## Signature

```ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

function createPrismaClient(): PrismaClient;

export const prisma: PrismaClient;
export default prisma;
```

## Parameters
None — the module reads `process.env.DATABASE_URL` internally (via `dotenv.config()`) rather than accepting configuration as arguments.

## Returns
A singleton `PrismaClient` instance, constructed once per process with the `PrismaPg` adapter (`new PrismaPg({ connectionString: process.env.DATABASE_URL! })`).

## Usage Example

```ts
import prisma from '../lib/prisma';

const projects = await prisma.project.findMany({ where: { isPublished: true } });
```

## Edge Cases / Gotchas
- **Global caching in development only.** The module stashes the client on `globalThis` (`globalForPrisma.prisma`) and reuses it across hot-reloads, but only assigns to `globalThis` `if (process.env.NODE_ENV !== 'production')`. This is the standard Next.js/Node dev-hot-reload pattern to avoid exhausting the database connection pool from repeated `tsx`/`ts-node-dev` restarts creating a new client each time — in production, a fresh singleton is created once at boot and never re-cached globally (which is correct, since production doesn't hot-reload).
- **Non-null assertion on `DATABASE_URL!`** — if the env var is missing, this throws at first use rather than at module load, and the error will surface as a generic connection failure rather than a clear "missing env var" message. There's no explicit startup validation of required env vars anywhere in the backend (see `AGENTS.md` §4.5's "fail fast" intent, which isn't actually implemented in code — see [`appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) for the broader pattern of `AGENTS.md` describing intentions not reflected in the current code).
- The `as ConstructorParameters<typeof PrismaClient>[0]` cast on the `PrismaClient` constructor argument is a type-level workaround for the adapter-based constructor overload; it doesn't change runtime behavior.

## Related
- [`../database/schema-reference.md`](../database/schema-reference.md) — the schema this client queries against
- [`../architecture/overview.md`](../architecture/overview.md) — "Database (PostgreSQL via Prisma)" layer-boundary section
- Every file under `backend/src/routes/` imports this module directly (no repository/service layer — see [`../architecture/folder-architecture.md`](../architecture/folder-architecture.md))
