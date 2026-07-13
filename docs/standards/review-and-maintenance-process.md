# Documentation Review & Maintenance Process

## Review process

Since this is currently a solo-maintained project, "review" means a deliberate self-check before merging, not a second-approver gate. If/when this project gains other contributors, upgrade this to a required PR review.

**Before merging any PR that touches `frontend/`, `backend/`, or `prisma/schema.prisma`:**

1. Does this change anything described in `docs/architecture/`, `docs/api/`, `docs/database/`, `docs/pages/`, `docs/features/`, or `docs/components/`? If yes, the docs update is part of the PR, not a follow-up.
2. Does this introduce a new environment variable, script, or dependency? Update `docs/deployment/environment-variables.md` / `docs/development/setup-and-workflow.md` / the relevant reference doc.
3. Does this resolve or invalidate an entry in [`appendices/technical-debt-register.md`](../appendices/technical-debt-register.md)? Update its status rather than leaving it stale.
4. Run through [`standards/quality-and-definition-of-done.md`](./quality-and-definition-of-done.md)'s Documentation Checklist for anything new.

**Before merging any PR that only touches `/docs`:**

1. Every factual claim should be checked against the actual source file it describes, not written from memory — this is the single biggest failure mode this project has already experienced (see the audit's drift findings).
2. Run a broken-link check (see below) before considering the doc PR done.
3. New top-level `/docs` directories should be added to [`docs/README.md`](../README.md)'s directory map in the same PR.

## Maintenance process

- **Quarterly** (or whenever a major feature ships): re-run a lightweight version of the repository audit — grep for new `TODO`s, new unused dependencies, new drift between `frontend/AGENTS.md` and actual code. Update [`appendices/technical-debt-register.md`](../appendices/technical-debt-register.md).
- **On every dependency the audit flagged as unused** (`three`, `@react-three/fiber`, `@react-three/drei`, `next-themes`, `axios`, `express-validator`, `multer`): before removing, grep once more to confirm it's still unused, then remove it and its corresponding "removal candidate" note from [`architecture/overview.md`](../architecture/overview.md) and the debt register.
- **Ownership**: there is one maintainer (Abir Barman) for both code and docs. There's no formal doc-ownership split by section — if that changes (e.g., a contributor owns the CMS section), record it in [`docs/README.md`](../README.md).
- **Stale doc detection**: there's no automated staleness checker configured. Manually, a doc referencing a file path is a good canary — if a linked file path in a doc no longer exists, that doc is stale by definition and should be fixed immediately, not scheduled for later.

## Broken link check

Since there's no CI configured for this repo yet (see [`appendices/technical-debt-register.md`](../appendices/technical-debt-register.md)), run this manually before a docs-heavy PR:

```bash
# from repo root — flags any relative .md link target that doesn't exist on disk
grep -rEho '\]\(\.\./[^)]+\.md[^)]*\)|\]\(\./[^)]+\.md[^)]*\)' docs | \
  sed -E 's/^\]\(([^)]+)\)$/\1/' | sort -u | while read -r link; do
    target=$(echo "$link" | cut -d'#' -f1)
    [ -f "docs/$target" ] || [ -f "$target" ] || echo "BROKEN: $link"
  done
```

See [`appendices/broken-link-report.md`](../appendices/broken-link-report.md) for the last run's results. Consider wiring this into a `markdown-link-check` GitHub Action once CI is set up — tracked in [`roadmap/future-documentation-roadmap.md`](../roadmap/future-documentation-roadmap.md).
