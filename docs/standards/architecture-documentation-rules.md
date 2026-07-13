# Architecture Documentation Rules

Rules specific to writing/maintaining anything under [`architecture/`](../architecture/), [`adr/`](../adr/), and [`decisions/`](../decisions/).

## General rules

1. **Describe what is actually built, not what was planned.** If the code and an existing doc (e.g. `frontend/AGENTS.md`) disagree, the code wins — fix the doc, and log the discrepancy in [`appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) if it's worth tracking as debt.
2. **Every architectural claim must be traceable to a file.** "The frontend never imports Prisma" should be checkable by grepping `frontend/src` for `@prisma/client` imports — if you can't point to how you'd verify a claim, don't make it as fact.
3. **Boundaries over implementation detail.** Architecture docs describe layer boundaries, data flow, and why decisions were made — not a line-by-line code walkthrough. Line-by-line detail belongs in component/feature/page docs.
4. **Diagram every non-trivial flow.** Auth flow, CMS content flow, deployment topology, and rendering strategy should each have a Mermaid diagram per [`standards/markdown-and-diagram-standard.md`](./markdown-and-diagram-standard.md), not just prose.
5. **Call out what's NOT there.** This codebase's architecture docs are notably strengthened by saying "there is no `middleware.ts`" or "there are no custom hooks" as explicitly as they describe what does exist — absence-of-pattern is architecturally significant and easy to miss if unstated.

## When to write an ADR vs. update `decisions/`

| Use an ADR (`adr/NNNN-title.md`) when... | Use the `decisions/` log when... |
|---|---|
| The decision is hard to reverse (data model, auth mechanism, hosting provider, framework choice) | The decision is a smaller, easily-revisited call (e.g., "use `date.ts` helper instead of a library") |
| You want to record alternatives considered and why they were rejected | A one-line record of "we decided X because Y" is enough context |
| Future-you (or a contributor) would benefit from the full reasoning, not just the outcome | The reasoning is obvious from the decision itself |

See [`templates/adr-template.md`](../templates/adr-template.md) and [`adr/0001-record-architecture-decisions.md`](../adr/0001-record-architecture-decisions.md) (the ADR about using ADRs) for the format.

## Required sections for any new architecture doc

1. What this covers (scope, one sentence)
2. Current state (with diagram if it's a flow/structure)
3. Why it's built this way (link an ADR if one exists)
4. Known limitations / debt (link the debt register, don't duplicate it)
5. Related docs

## Review trigger

Any PR that changes `backend/prisma/schema.prisma`, adds/removes a route file, changes the auth mechanism, or changes hosting/deployment config **must** update the relevant `architecture/` doc in the same PR — this is enforced by reviewer judgment, not tooling, so reviewers should treat an architecture-affecting PR without a docs update as incomplete. See [`standards/review-and-maintenance-process.md`](./review-and-maintenance-process.md).
