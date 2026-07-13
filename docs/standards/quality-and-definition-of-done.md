# Documentation Quality Checklist & Definition of Done

## Quality checklist (apply to any doc before considering it finished)

- [ ] Every factual claim was checked against the actual source file, not written from memory or copied from an older doc.
- [ ] No aspirational statements presented as current fact (planned features live in `roadmap/`, not in present-tense architecture/feature docs).
- [ ] All internal links are relative and resolve to a real file (see the broken-link check in [`review-and-maintenance-process.md`](./review-and-maintenance-process.md)).
- [ ] Headings follow the hierarchy rules in [`documentation-style-guide.md`](./documentation-style-guide.md) (single H1, no skipped levels).
- [ ] Code fences are language-tagged.
- [ ] Any non-trivial flow has a Mermaid diagram, per [`markdown-and-diagram-standard.md`](./markdown-and-diagram-standard.md).
- [ ] Known gaps/limitations are stated explicitly, not omitted because they're unflattering (this project's docs are stronger for saying "no hooks exist" and "no rate limiting on login" outright).
- [ ] The doc is filed in the correct `/docs` subdirectory per [`documentation-style-guide.md`](./documentation-style-guide.md)'s "what goes where" table.

## Documentation checklist (per doc type)

| Doc type | Must include |
|---|---|
| Page doc | Purpose, route, SEO/metadata, layout, components used, data sources, loading/error states, accessibility notes, related pages |
| Feature doc | Purpose, user flow, architecture, files involved, edge cases, limitations, testing strategy |
| Component doc | Purpose, props table, variants, accessibility, usage example, what NOT to do with it |
| API endpoint | Method, path, auth requirement, request/response shape (real, not idealized), error behavior |
| ADR | Context, decision, alternatives considered, consequences (see [`adr/0001-record-architecture-decisions.md`](../adr/0001-record-architecture-decisions.md)) |

## Definition of Done — for a documentation task/phase

A documentation phase (e.g., "document every page," "document every component") is **done** when:

1. Every item in scope has a corresponding doc file — verified by a literal count (N pages documented = N routes found in `frontend/src/app`), not an estimate.
2. Every doc in that phase passes the Quality Checklist above.
3. The relevant index (`docs/README.md`, or a phase-specific index like `pages/README.md`) links to every new doc — an undiscoverable doc is equivalent to a missing one.
4. Cross-references from related existing docs point at the new docs where relevant (e.g., a feature doc for "contact form" should be linked from `components/sections/Contact.md` and vice versa).
5. Nothing in the new docs contradicts [`appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) — if a new doc surfaces a new discrepancy, the register gets updated, not silently ignored.
6. The phase's coverage is reflected accurately in [`appendices/documentation-coverage-report.md`](../appendices/documentation-coverage-report.md) once that report exists (Phase 16).

## Definition of Done — for this entire documentation project

See [`appendices/documentation-coverage-report.md`](../appendices/documentation-coverage-report.md) (produced in Phase 16) for the final scorecard against this checklist across all 16 phases.
