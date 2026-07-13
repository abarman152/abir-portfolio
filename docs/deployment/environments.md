# Environments

## Development

Local machine, both services run via `npm run dev:frontend` / `npm run dev:backend` (see [`../development/setup-and-workflow.md`](../development/setup-and-workflow.md)). Points at a local or dev Supabase database via `.env`.

## Preview

Vercel automatically creates a preview deployment for every pull request opened against `main` (Vercel's default GitHub integration behavior — no extra config in this repo enables it, it's on by default once the repo is imported). This preview:

- Builds the frontend against whatever `NEXT_PUBLIC_API_URL` is configured in the Vercel project's Preview environment variables (if different from Production, set it explicitly — Vercel does not infer this).
- **There is no equivalent preview environment for the backend.** Render (on the free/starter tiers used here) does not provide automatic per-PR preview environments the way Vercel does. This means a preview frontend deployment for a PR typically still points at the **production** backend/database unless a separate Render service is manually stood up for it. Treat this as a real gap if you need to test breaking API changes before merging — see [`../architecture/future-architecture.md`](../architecture/future-architecture.md).

## Production

`main` branch. Vercel and Render both auto-deploy on push. See [`hosting-guide.md`](./hosting-guide.md) for the full setup and [`../architecture/deployment-architecture.md`](../architecture/deployment-architecture.md) for the topology diagram.

## Related
- [`hosting-guide.md`](./hosting-guide.md)
- [`environment-variables.md`](./environment-variables.md)
- [`../architecture/deployment-architecture.md`](../architecture/deployment-architecture.md)
