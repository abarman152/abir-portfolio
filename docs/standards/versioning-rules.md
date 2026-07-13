# Versioning Rules

## Application versioning

This project does not currently use semantic version tags (`git tag -l` returns nothing) — there is a single continuously-deployed `main` branch. That's an acceptable model for a solo-maintained portfolio site, but it means:

- `CHANGELOG.md` is organized by **date**, not by version number, until/unless real version tags are introduced.
- If this project ever needs discrete releases (e.g., to support a public template/fork use case), adopt [SemVer](https://semver.org/) (`MAJOR.MINOR.PATCH`) at that point and start tagging.

## Documentation versioning

- Documentation is **not versioned separately from code**. `/docs` always describes the current state of `main`. There is no "v1 docs" vs "v2 docs" split.
- When a doc is corrected or superseded, update it in place — don't leave stale copies around "for reference." Historical context belongs in an ADR or `releases/` entry, not in a duplicated doc file.
- Every doc that reflects a specific point-in-time audit (like [`appendices/audit-report.md`](../appendices/audit-report.md)) must say so explicitly in its header, since — unlike the rest of `/docs` — it is intentionally a snapshot, not a living document.

## Changelog rules

- `CHANGELOG.md` at the repo root is the single canonical changelog. `docs/releases/` holds expanded write-ups for individual significant changes that need more space than a changelog entry — link from the changelog entry to the release note, not the other way around.
- Every entry answers: what changed, and why it matters to someone using or maintaining the project (not just "refactored X").
- Group entries by date (or version, if versioning is adopted later); within a date, prefer `feat:`/`fix:`/`chore:`/`docs:` category labels matching [Conventional Commits](https://www.conventionalcommits.org/).
- Use the template at [`templates/changelog-entry-template.md`](../templates/changelog-entry-template.md) for consistency.

## API versioning

- The REST API is currently unversioned (`/api/...`, no `/v1/` prefix). If a breaking change to a public endpoint's request/response shape is ever needed, introduce `/api/v2/...` for the changed resource rather than breaking `/api/v1/` (implicit `/api/`) consumers — there's no external API consumer today, but this app is a portfolio piece other people may reference/fork, so treat the shape as a contract.
- Document breaking API changes in both `CHANGELOG.md` and [`api/rest-api-reference.md`](../api/rest-api-reference.md) with an explicit "Breaking Change" callout.
