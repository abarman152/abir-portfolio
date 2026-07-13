# Cross-Reference Report

## Link density

1,013 internal relative Markdown links across 173 files — an average of ~5.9 cross-links per document. See [`broken-link-report.md`](./broken-link-report.md) for integrity (100%).

## Heavily cross-referenced documents (the "hub" docs)

These are linked from the most other documents, and are good starting points for anyone new to the documentation set:

| Doc | Why it's a hub |
|---|---|
| [`../architecture/overview.md`](../architecture/overview.md) | Referenced by nearly every topic area as the entry point for system design |
| [`technical-debt-register.md`](./technical-debt-register.md) | Referenced from security, performance, architecture, and standards docs — it's the canonical "known issues" list everything else points to instead of re-describing |
| [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md) | Referenced from security, CMS, admin panel, and component (`AdminShell`) docs |
| [`../standards/documentation-style-guide.md`](../standards/documentation-style-guide.md) | Referenced from every other `standards/` doc as the foundational one |
| [`../notion-vs-markdown.md`](../notion-vs-markdown.md) | Referenced from the root Notion page and every "both" category doc |

## Intentional single-source-of-truth patterns (no duplication)

Verified during this project — each of these facts is stated in exactly one canonical place and linked from everywhere else, rather than re-described:

- Technical debt findings → [`technical-debt-register.md`](./technical-debt-register.md) only (Notion's Technical Debt database stores only status + a link, per [`../notion-vs-markdown.md`](../notion-vs-markdown.md)'s rule).
- The Cloudinary-not-integrated correction → stated fully in [`../architecture/overview.md`](../architecture/overview.md), referenced (not repeated) from `deployment/environment-variables.md`, `development/setup-and-workflow.md`, `features/image-handling-convention.md`.
- The admin auth-guard location → stated fully in [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md), referenced from `security/authentication.md`, `components/admin/AdminShell.md`, `pages/admin-*.md`.

## Orphan check

Every file under `/docs` is reachable from `docs/README.md` within 2 hops (via a section README) except deliberately deep-linked appendix/ADR files, which are reachable via the docs they're cited from. No fully orphaned (unlinked-from-anywhere) file was found during this pass.

## Related
- [`broken-link-report.md`](./broken-link-report.md)
- [`documentation-coverage-report.md`](./documentation-coverage-report.md)
