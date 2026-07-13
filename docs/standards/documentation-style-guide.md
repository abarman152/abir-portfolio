# Documentation Style Guide

Covers: writing style, tone, naming conventions, folder conventions. This is the guide to follow before writing any new doc in this repository — see [`templates/`](../templates/) for ready-made structures per doc type.

## Voice and tone

- Write for a competent developer who has never touched this codebase, not for the person who just wrote the code.
- State facts plainly. Don't hedge ("might", "could potentially") unless something is genuinely uncertain — if it's uncertain, say so explicitly and say why (see [`appendices/audit-report.md`](../appendices/audit-report.md) for examples of flagged uncertainty).
- Prefer active voice and short sentences over long compound ones.
- No marketing language in technical docs ("blazing fast", "seamless", "cutting-edge"). Save that tone for the root `README.md`'s public-facing sections only.
- Say what's true now, not what's aspirational. If something is planned but not built, it belongs in [`roadmap/`](../roadmap/), not described as current behavior.

## Writing guidelines

- Lead with the answer, then the explanation. Don't make the reader scroll past three paragraphs of context to find the fact they came for.
- One concept per heading. If a section is doing two jobs, split it.
- Use tables for anything enumerable (props, env vars, endpoints, fields) — they're scannable in a way prose isn't.
- Cross-link liberally with relative Markdown links (e.g. `[architecture overview](../architecture/overview.md)`), never bare paths or absolute URLs into this same repo.
- When documenting behavior you're not 100% sure of, verify against the actual source file before writing it down — don't propagate assumptions. This documentation set exists specifically to fix drift that happens when docs are written from memory instead of from the code.
- Every doc should say when it was last verified against the code, if that's not obvious from git history.

## Naming conventions

| Item | Convention | Example |
|---|---|---|
| Doc file names | `kebab-case.md` | `rest-api-reference.md` |
| Directory names | `kebab-case/`, plural for collections | `components/`, `templates/` |
| Doc titles (H1) | Title Case, matches sidebar/index label | `# REST API Reference` |
| ADR files | `NNNN-short-title.md`, zero-padded, sequential | `0001-use-custom-cms-over-headless.md` |
| Component doc files | Match the component's actual filename | `PaperCard.md` for `PaperCard.tsx` |

## Folder conventions

- Every top-level `/docs` subdirectory should have a purpose describable in one sentence — if you can't describe it in one sentence, the structure is wrong, not the sentence.
- Don't create a new top-level directory for a single file. If you only have one doc for a topic, put it in the closest existing directory and split later if it grows.
- Directories mirror the codebase's own organization where one exists (`components/sections/`, `components/admin/`, `components/ui/` mirror `frontend/src/components/`) so a reader can find a doc by guessing the code's location.
- See [`docs/README.md`](../README.md) for the full current directory map — update it whenever you add a new top-level directory.

## What goes where (quick reference)

| Content type | Location |
|---|---|
| "How does the system work" | `architecture/` |
| "How do I do X locally" | `development/` or `guides/` |
| "What does this route/component/feature do" | `pages/`, `components/`, `features/` |
| "Why did we decide X" | `adr/` (formal) or `decisions/` (lightweight running log) |
| "What changed in version/date Y" | root `CHANGELOG.md` (canonical) + `releases/` (detailed notes) |
| Fill-in-the-blank starting point for a new doc | `templates/` |
