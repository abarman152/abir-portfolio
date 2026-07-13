# Maintenance Guide

The operational summary of [`../standards/review-and-maintenance-process.md`](../standards/review-and-maintenance-process.md) — read that for full detail; this page is the "what do I actually do, and when" quick reference.

## Every PR that touches `frontend/`, `backend/`, or `prisma/schema.prisma`

- [ ] Update the relevant doc(s) in the same PR — architecture, API, page, feature, or component doc, whichever applies.
- [ ] Update [`technical-debt-register.md`](./technical-debt-register.md) if the PR resolves or introduces a tracked item.
- [ ] Run through [`../standards/quality-and-definition-of-done.md`](../standards/quality-and-definition-of-done.md)'s checklist for any new doc.

## Every PR that only touches `/docs`

- [ ] Verify every factual claim against the actual source file — don't propagate assumptions.
- [ ] Run the broken-link check (script in [`../standards/review-and-maintenance-process.md`](../standards/review-and-maintenance-process.md)) before merging.
- [ ] Add new top-level directories to [`../README.md`](../README.md)'s directory map.

## Quarterly (or after any major feature ships)

- [ ] Re-run a lightweight repository audit: grep for new `TODO`s, new unused dependencies, new drift between `frontend/AGENTS.md` and actual code.
- [ ] Update [`technical-debt-register.md`](./technical-debt-register.md).
- [ ] Re-run the broken-link check.
- [ ] Review [`../roadmap/future-documentation-roadmap.md`](../roadmap/future-documentation-roadmap.md) and check off/update items.

## When a tracked debt item is resolved

- [ ] Update its row in [`technical-debt-register.md`](./technical-debt-register.md) (status, not deletion — keep the historical record).
- [ ] Update the corresponding row in Notion's Technical Debt database.
- [ ] If it was significant, add a `CHANGELOG.md` entry.

## When a new architecturally-significant decision is made

- [ ] Write an ADR (see [`../adr/README.md`](../adr/README.md) and [`../templates/adr-template.md`](../templates/adr-template.md)) if it's hard to reverse.
- [ ] Otherwise, add an entry to [`../decisions/README.md`](../decisions/README.md).
- [ ] Cross-link from any architecture doc it affects.

## Who owns this

Single maintainer today (Abir Barman), for both code and docs — see [`../standards/review-and-maintenance-process.md`](../standards/review-and-maintenance-process.md) for what changes if that ever isn't true.

## Related
- [`../standards/review-and-maintenance-process.md`](../standards/review-and-maintenance-process.md)
- [`../roadmap/future-documentation-roadmap.md`](../roadmap/future-documentation-roadmap.md)
