# Notion vs. Markdown: Where Things Live

This project maintains two separate systems of record. This document defines the split precisely, so neither system silently duplicates or drifts from the other.

## The core rule

> **Technical documentation lives in git, under `/docs`. Project management lives in Notion, under the "My Portfolio Website" workspace. Never mix responsibilities — every document has exactly one clear source of truth.**

```
Technical Documentation  →  Git Repository (/docs)
Project Management       →  Notion
```

If you're not sure where something belongs, ask: *"Does this describe how the system works, or does it describe the state of the work on the system?"* The former is Markdown; the latter is Notion.

## What belongs ONLY in Markdown (git `/docs`)

Anything that describes the system itself, is meant to be versioned alongside the code, or needs to survive a `git clone` with zero external dependencies:

| Category | Examples in this repo |
|---|---|
| Architecture | `docs/architecture/` — stack, layer boundaries, auth flow, rendering strategy |
| API | `docs/api/rest-api-reference.md` |
| Deployment | `docs/deployment/hosting-guide.md`, `environment-variables.md` |
| Setup | `docs/development/setup-and-workflow.md` |
| Technical specifications | `docs/templates/technical-specification-template.md` and any doc built from it |
| Standards | `docs/standards/` |
| Guides | `docs/guides/`, `docs/tutorials/` |
| Templates | `docs/templates/` |
| Reference documentation | `docs/database/schema-reference.md`, `docs/utilities/`, `docs/components/` |
| Decision records | `docs/adr/` (formal ADRs — hard-to-reverse architecture decisions) |
| System documentation | `docs/pages/`, `docs/features/`, `docs/layouts/` |
| Developer documentation | `docs/testing/`, `docs/security/`, `docs/performance/` |

**Why**: this content needs to be correct *at the commit it describes*, reviewable in the same PR that changes the code, and accessible to anyone who clones the repo without a Notion invite (a recruiter checking out the code, an open-source contributor, future-you on a new machine).

## What belongs ONLY in Notion

Anything that describes the *state of the work*, is inherently time-boxed, or is personal/informal in a way that would clutter a git history:

| Category | Notion location |
|---|---|
| Tasks | Roadmap & Planning → Backlog |
| Sprint planning | Roadmap & Planning → Sprint Planning |
| Kanban / progress tracking | Roadmap & Planning → Backlog (Status property) |
| Ideas | Research & Ideas → Ideas |
| Meeting notes | Meetings & Decisions → Meeting Notes |
| Daily notes | Logs & Reviews → Daily Log |
| Weekly planning | Logs & Reviews → Weekly Review |
| Roadmaps (working, evolving) | Roadmap & Planning → Roadmap |
| Project management | The whole "My Portfolio Website" Notion workspace |
| Personal notes | Knowledge Base → Learning Notes |
| Research planning | Research & Ideas → Research |

**Why**: this content changes constantly, is only useful in the moment or as a personal record, and would be pure noise in `git log` if committed as Markdown files (a "daily log" `.md` file per day is not a documentation practice anyone wants to maintain).

## What belongs in BOTH (kept intentionally thin on the Notion side)

| Category | Markdown (source of truth) | Notion (summary only, links back) |
|---|---|---|
| Overview | Root `README.md` | Root Notion page (Vision/Goals) |
| Architecture Index | `docs/architecture/README.md` | Product & Architecture Index → Architecture Index page |
| Roadmap Summary | `docs/architecture/future-architecture.md` | Roadmap & Planning → Roadmap page |
| Documentation Index | `docs/README.md` | Product & Architecture Index → Documentation Index page |
| Release Summary | Root `CHANGELOG.md` | Roadmap & Planning → Release Planning database |
| Decision Summary | `docs/adr/`, `docs/decisions/` | Meetings & Decisions → Decision Log (links back to the ADR for anything non-trivial) |

**Rule for "both" items:** the Notion side is never more than a summary or a status tracker with a link out. If you find yourself writing more than a paragraph of substantive new information directly into one of these Notion pages, that information belongs in the git doc instead — write it there and link to it.

## Single Source of Truth

Every piece of information has exactly one authoritative location. When the same fact appears in both places (e.g., "the API has no rate limiting on login"), the git doc is authoritative and the Notion entry is a pointer, not a parallel description — see the Technical Debt database in Notion, which stores only status + a link to `docs/appendices/technical-debt-register.md`, not a re-description of each finding.

## Ownership

Currently a single maintainer (Abir Barman) owns both systems. If this project ever gains contributors:
- Anyone can propose a doc change via PR against `/docs` (see [`standards/review-and-maintenance-process.md`](./standards/review-and-maintenance-process.md)).
- Notion workspace access/edit rights are a separate, simpler concern (workspace membership), since it's operational rather than reviewed like code.

## Review Process

- Markdown docs: reviewed as part of the normal PR process (see [`standards/review-and-maintenance-process.md`](./standards/review-and-maintenance-process.md)).
- Notion: no formal review — it's a working space, edited directly. The "both" items above are the only Notion content that should be treated with doc-review-level care, since they're meant to stay a thin, accurate pointer.

## Synchronization Rules

There is **no automated sync** between Notion and git — this is intentional, not a gap. Automated two-way sync between a wiki and a docs-as-code system tends to produce exactly the drift this whole documentation project was built to eliminate (see [`appendices/technical-debt-register.md`](./appendices/technical-debt-register.md) for what happens when two descriptions of the same system disagree). Instead:

- When a "both" item changes on the git side (e.g., `CHANGELOG.md` gets a new entry), manually add/update the corresponding Notion row within the same work session — don't let it queue up as a "later" task.
- When Notion planning work concludes in something code-affecting (a Backlog item ships), update its Status in Notion and, if it resolved a tracked debt item, update [`appendices/technical-debt-register.md`](./appendices/technical-debt-register.md) in the same PR that ships the fix.

## Versioning Rules

- Markdown docs are versioned implicitly by git — there is no separate doc version number; a doc is "as of" whatever commit last touched it. See [`standards/versioning-rules.md`](./standards/versioning-rules.md).
- Notion content is not versioned beyond Notion's own built-in page history. Don't rely on Notion history as a substitute for a real changelog — durable historical record belongs in `CHANGELOG.md`/`docs/releases/`.

## Documentation Lifecycle

1. A decision or piece of work starts in Notion (an Idea, a Backlog item, a Research entry).
2. If it becomes architecturally significant, it graduates to a formal ADR in `docs/adr/` — the Notion entry is updated to link to it, not to duplicate its reasoning.
3. Once implemented, the relevant git docs (`architecture/`, `api/`, `features/`, etc.) are updated in the same PR as the code change.
4. The Notion Backlog/Roadmap entry is marked Done and, if relevant, a `CHANGELOG.md` entry and/or `docs/releases/` note is added.
5. If the work resolved a tracked risk or debt item, both [`appendices/technical-debt-register.md`](./appendices/technical-debt-register.md) and the Notion Technical Debt database are updated to reflect the new status.

## Related
- [`README.md`](./README.md) — full documentation index
- [`appendices/technical-debt-register.md`](./appendices/technical-debt-register.md)
- [`standards/versioning-rules.md`](./standards/versioning-rules.md)
- [`standards/review-and-maintenance-process.md`](./standards/review-and-maintenance-process.md)
