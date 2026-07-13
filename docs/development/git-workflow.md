# Git Workflow

## Branch strategy

- `main` is the single deployed branch — Vercel and Render both auto-deploy on every push to `main`.
- Feature work should happen on a short-lived branch, merged via PR — see [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md). There is no `develop`/staging branch; there's also no CI gate today (see [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) — no `.github/workflows/` exists), so a merge to `main` is the deploy.
- Historical note: an `antygravity-migration` branch exists in this repo's history (visible in `git branch -a`) — treat any long-lived non-`main` branch as a migration-in-progress, not a second permanent environment.

## Commit convention

Recent history in this repo already uses [Conventional Commits](https://www.conventionalcommits.org/)-style prefixes inconsistently but increasingly (`feat:`, `fix:`, `fix(seo):`, `chore:`). Going forward, use this consistently:

| Prefix | Use for |
|---|---|
| `feat:` | A new user-facing capability |
| `fix:` | A bug fix |
| `fix(scope):` | A bug fix scoped to a specific area (e.g. `fix(seo):`) |
| `chore:` | Dependency bumps, config changes, no user-facing behavior change |
| `docs:` | Documentation-only changes |
| `refactor:` | Code restructuring with no behavior change |

Earlier commits in this repo's history used non-descriptive messages (`update`, `fix`, `dep`) — see [`../../CHANGELOG.md`](../../CHANGELOG.md)'s notes section for how those were handled when building the changelog. Don't repeat that pattern going forward.

## Pull requests

- One concern per PR — see [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md).
- Any PR touching `frontend/`, `backend/`, or `prisma/schema.prisma` must update the relevant docs in the same PR — see [`../standards/review-and-maintenance-process.md`](../standards/review-and-maintenance-process.md).

## Tags / releases

No git tags exist currently (`git tag -l` is empty) — see [`../standards/versioning-rules.md`](../standards/versioning-rules.md) for the versioning model this project actually uses (date-based changelog, not SemVer, until real releases are needed).
