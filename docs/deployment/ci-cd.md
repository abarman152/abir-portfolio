# CI/CD

## Current state: none

Confirmed by the 2026-07 audit — there is no `.github/workflows/`, no other CI config, no Dockerfile, no `docker-compose.yml` anywhere in this repo. "CI/CD" today means: push to `main` → Vercel and Render each independently detect the push via their own GitHub integration and build/deploy. There is no automated test run, lint check, or type-check gate before a deploy happens.

## What this means in practice

- A broken build is caught by Vercel's/Render's build step itself (both will fail the deploy if `tsc`/`next build` fails) — so type errors don't reach production, but they're only caught at deploy time, not at PR time.
- Lint errors, if any, do **not** block a deploy — `npm run lint` is not run automatically anywhere.
- There is no automated test suite to run even if CI existed (see [`../testing/strategy.md`](../testing/strategy.md)).

## Recommended minimal CI (not yet implemented)

A single GitHub Actions workflow, triggered on PRs against `main`:

```yaml
# .github/workflows/ci.yml (proposed — does not exist yet)
name: CI
on: pull_request
jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: cd frontend && npm ci && npm run lint && npm run build
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: cd backend && npm ci && npx prisma generate && npx tsc --noEmit
```

This would catch lint and type errors at PR time instead of at deploy time, without requiring a test suite to exist first. See [`../roadmap/future-documentation-roadmap.md`](../roadmap/future-documentation-roadmap.md) and [`../architecture/future-architecture.md`](../architecture/future-architecture.md) for this as a tracked improvement.

## Related
- [`../architecture/deployment-architecture.md`](../architecture/deployment-architecture.md)
- [`../testing/strategy.md`](../testing/strategy.md)
