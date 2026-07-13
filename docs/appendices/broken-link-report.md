# Broken Link Report

**Method:** every relative Markdown link under `/docs` (any link whose target starts with `../` or `./` and ends in `.md`) was extracted and resolved relative to its source file's directory, then checked for existence on disk. See the check script in [`../standards/review-and-maintenance-process.md`](../standards/review-and-maintenance-process.md).

## Final result (2026-07-03)

**1,013 links checked — 0 broken.**

## History during this project

An initial pass mid-project found **22 broken links out of 811** (97.3% integrity at that point), caused by:
1. Six links pointing to `docs/roadmap/future-documentation-roadmap.md` before that file existed (it was a planned Phase 16 deliverable) — resolved by creating it.
2. Four links pointing to `docs/roadmap/future-architecture.md`, a path that never existed — the real file is `docs/architecture/future-architecture.md`. Corrected all four.
3. Two links to `docs/adr/0001-record-architecture-decisions.md` before the `adr/` directory had any content — resolved by writing three real ADRs.
4. Two links to `docs/appendices/documentation-coverage-report.md` before this Phase 16 report existed — resolved by creating it.
5. One link to `docs/appendices/broken-link-report.md` (this file) before it existed — resolved by creating it.
6. Assorted path mistakes: `./environment.md` instead of `./environment-variables.md` (×2), `../frontend/AGENTS.md` missing a `../` level, `../components/ThemeLogo.md` missing the `shared/` subdirectory, `../utilities/types.md` instead of `../utilities/types-reference.md`, and one illustrative (non-real) example link in the style guide that was rendered as an actual broken link — reworded to avoid that.

All were corrected in place; see `git log` / `git diff` for the exact changes if reviewing this project's history.

## Recommendation

Wire this check into CI once one exists (see [`../deployment/ci-cd.md`](../deployment/ci-cd.md)) so future link rot is caught automatically rather than requiring a manual pass like this one.

## Related
- [`../standards/review-and-maintenance-process.md`](../standards/review-and-maintenance-process.md)
- [`documentation-coverage-report.md`](./documentation-coverage-report.md)
