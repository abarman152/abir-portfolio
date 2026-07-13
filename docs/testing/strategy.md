# Testing Strategy

## Current state: no automated tests exist

Confirmed by the 2026-07 audit: no test files (`*.test.ts*`, `*.spec.ts*`) anywhere in the repo, and no testing framework (`jest`, `vitest`, `playwright`, `cypress`, `@testing-library/*`) in either `package.json`. All verification today is manual (see [`manual-testing-checklist.md`](./manual-testing-checklist.md)) plus whatever the TypeScript compiler and each platform's build step catch.

This is stated plainly rather than glossed over, per [`../standards/documentation-style-guide.md`](../standards/documentation-style-guide.md) — a portfolio site without a large team can reasonably run on manual testing alone for a long time, and the goal of this doc is a realistic adoption path, not guilt about the current state.

## Recommended strategy, by type

### Unit Testing
**Not yet set up.** Highest-value first targets, if adopted: `frontend/src/lib/api.ts`, `frontend/src/lib/date.ts` (the deterministic UTC formatter — exactly the kind of pure function most worth a regression test after the hydration bug it was created to fix), and backend route handler logic in `backend/src/routes/*.ts`. Recommended tooling: **Vitest** (fast, native ESM/TS support, minimal config) over Jest for a Next.js 16 + tsx project.

### Integration Testing
**Not yet set up.** Would cover: a full request against a route file with a real (test) Prisma-connected DB — e.g., `POST /api/contact` end-to-end through validation → DB insert → notification dispatch (mockable). Requires a test database strategy first (a separate Supabase project or a local Postgres via Docker).

### End-to-End Testing
**Not yet set up.** Recommended tooling: **Playwright**. Highest-value first scenarios: admin login → create a project → verify it appears on `/projects`; submit the public contact form → verify a success state renders.

### Manual Testing
**The only testing that currently happens.** See [`manual-testing-checklist.md`](./manual-testing-checklist.md) for a checklist to run before each deploy, since there's no automated gate today.

### Regression Testing
**Not yet set up** in the automated sense. In practice, regression testing today means re-running the manual checklist after any change to a shared component (`AdminShell`, `ThemeProvider`, `api.ts`) that many pages depend on.

### Performance Testing
**Not yet set up.** No Lighthouse CI, no load testing. See [`../performance/core-web-vitals-and-checklist.md`](../performance/core-web-vitals-and-checklist.md) for the manual Lighthouse pass recommendation as a starting point.

### Accessibility Testing
**Not yet set up** in an automated sense (no `axe-core`/`jest-axe`). Manual accessibility observations from the audit are in [`../appendices/audit-report.md`](../appendices/audit-report.md) §21 — known gaps include the admin `Toggle` component lacking `aria-pressed`/`role="switch"`, and admin inputs generally lacking `htmlFor`/`id` association. Adding `eslint-plugin-jsx-a11y` to the existing ESLint config would be the lowest-effort first step (catches many issues at lint time, no new test infra required).

## Suggested adoption order

1. Add `eslint-plugin-jsx-a11y` (near-zero cost, catches real issues already documented above).
2. Set up Vitest + a handful of unit tests for `lib/date.ts` and `lib/api.ts`.
3. Add the minimal CI workflow from [`../deployment/ci-cd.md`](../deployment/ci-cd.md) so lint/typecheck at least gate PRs.
4. Add Playwright for the 2-3 highest-value E2E flows once CI exists to run them in.

## Related
- [`manual-testing-checklist.md`](./manual-testing-checklist.md)
- [`../deployment/ci-cd.md`](../deployment/ci-cd.md)
- [`../templates/testing-guide-template.md`](../templates/testing-guide-template.md)
