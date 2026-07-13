# Future Architecture

## Scope
Every open architectural question or planned improvement surfaced by the 2026-07 audit, in one place. These are proposals/options, not committed roadmap items with dates — see [`../roadmap/`](../roadmap/) for prioritization.

## Open decisions requiring judgment (not quick fixes)

| # | Decision | Current state | Options |
|---|---|---|---|
| 1 | JWT storage: `localStorage` vs httpOnly cookie | `localStorage`, XSS-exposed but simple | Migrate to httpOnly cookie + CSRF token — a real tradeoff (adds CSRF surface, removes XSS token theft), not a strict improvement. Write an ADR before changing this. |
| 2 | Cloudinary: build it or drop it | Neither — documented but unused | Either integrate the SDK/upload widget properly, or remove `CLOUDINARY_URL` from `.env.example`/docs entirely and formally adopt "any HTTPS URL" as the convention |
| 3 | Response envelope standard | Raw success payloads, `{ error }` on failure | Adopt a consistent `{ data, error }` envelope across all routes (breaking change — needs an API version bump per [`../standards/versioning-rules.md`](../standards/versioning-rules.md)), or formally keep the current convention and fix `AGENTS.md` to stop claiming otherwise |
| 4 | Server-side validation: manual vs Zod | Manual regex/length checks | Add `zod` to backend deps and validate at the route boundary — `zod` is already a frontend dependency, so the team is already familiar with it |

## Planned/likely improvements (lower-stakes, mechanical)

- Add rate limiting to `POST /api/auth/login` (see [`security-architecture.md`](./security-architecture.md), debt item #12) — the highest-priority item on this list.
- Add a `middleware.ts` edge check for `/admin/*` as defense-in-depth alongside the existing client-side guard.
- Extract a `useAdminResource`/`useToast` hook to de-duplicate the repeated CRUD/toast pattern across ~13 admin pages (see [`state-management.md`](./state-management.md)).
- Fix the homepage double-fetch by threading server-fetched data into `HomePageClient.tsx`'s initial state (see [`rendering-strategy.md`](./rendering-strategy.md)).
- Remove confirmed-unused dependencies: `three`, `@react-three/fiber`, `@react-three/drei`, `next-themes`, `axios`, backend `express-validator`, `multer`, and `@prisma/client` from the frontend.
- Split `backend/package.json`'s `start` script so it doesn't push schema + reseed on every production boot.
- Introduce a data-fetching cache layer (SWR/TanStack Query) — this is the actual gap behind "no global state," see [`state-management.md`](./state-management.md).
- Add CI (GitHub Actions: typecheck, lint, and eventually tests) — currently none exists.
- Add IaC for the Render deployment (`render.yaml`) so the backend deploy config is reproducible from the repo, not only the dashboard.

## Explicitly out of scope for now

- Migrating off the custom CMS to a third-party headless CMS — the current bespoke Express+Prisma approach is intentional and matches the project's "all content in the database, admin-controlled" principle; there's no stated reason to change this.
- Introducing a monorepo tool (Turborepo/Nx) — two independent npm projects orchestrated by root scripts is adequate at this project's size.

## Related
- [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) — the full findings this list is drawn from
- [`../roadmap/future-architecture.md`](../roadmap/) — prioritization, if/when this is scheduled
