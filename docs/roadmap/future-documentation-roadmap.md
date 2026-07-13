# Future Documentation Roadmap

This is the roadmap for **documentation itself** — distinct from [`../architecture/future-architecture.md`](../architecture/future-architecture.md), which is the roadmap for the *product/codebase*. See [`../appendices/documentation-coverage-report.md`](../appendices/documentation-coverage-report.md) for the current coverage this roadmap builds on.

## Near-term (next pass)

- **Add real screenshots** to key pages/components docs once the UI is stable enough to be worth capturing — currently all docs are text/diagram-only, which is accurate but less immediately scannable for a recruiter/client audience.
- **Wire the broken-link check into CI** once [`../deployment/ci-cd.md`](../deployment/ci-cd.md)'s proposed workflow exists, so link rot is caught automatically instead of manually (as it was during this project — see [`../appendices/broken-link-report.md`](../appendices/broken-link-report.md)).
- **Expand `docs/guides/` and `docs/tutorials/`** — currently one of each; strong candidates for more: "deploying a schema change safely," "debugging a Render cold-start issue," "adding a new admin CRUD section from scratch with a working example."

## Medium-term

- **Revisit ADR 0003** (JWT storage) once any of its stated revisit triggers occurs — see [`../adr/0003-jwt-in-localstorage.md`](../adr/0003-jwt-in-localstorage.md).
- **Add a fourth ADR** once the Cloudinary decision (build it for real vs. formally drop it) is actually made — currently tracked as an open decision in [`../architecture/future-architecture.md`](../architecture/future-architecture.md), not yet a closed ADR.
- **Populate the Notion Roadmap/Sprint Planning/Backlog databases** with real, actively-maintained entries (they're currently seeded with the audit's findings as a starting point, not a living backlog yet) — see [`../appendices/notion-workspace-structure.md`](../appendices/notion-workspace-structure.md).

## Long-term / conditional

- **If this project gains a second contributor**: formalize the currently-informal review process in [`../standards/review-and-maintenance-process.md`](../standards/review-and-maintenance-process.md) into an actual required PR review, and add a doc-ownership model to [`../README.md`](../README.md).
- **If real automated tests are added** (see [`../testing/strategy.md`](../testing/strategy.md)): expand `docs/testing/` with actual coverage reports rather than only a strategy document.
- **If CI is added**: automate the quarterly maintenance check described in [`../standards/review-and-maintenance-process.md`](../standards/review-and-maintenance-process.md) rather than relying on a manual cadence.

## Explicitly not planned

- A documentation site generator (Docusaurus, Nextra, etc.) — plain Markdown in git, browsable directly on GitHub, is sufficient at this project's size and avoids adding a build step to maintain the docs themselves.

## Related
- [`../appendices/documentation-coverage-report.md`](../appendices/documentation-coverage-report.md)
- [`../appendices/improvement-recommendations.md`](../appendices/improvement-recommendations.md)
- [`../architecture/future-architecture.md`](../architecture/future-architecture.md)
