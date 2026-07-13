# ADR 0001: Record Architecture Decisions as ADRs

**Status:** Accepted
**Date:** 2026-07-03

## Context

Prior to the 2026-07 documentation audit, this project had no record of *why* certain architectural choices were made — only what the code currently does. This made it impossible to distinguish a deliberate tradeoff (e.g., JWT in `localStorage`) from an oversight, and meant every new contributor (including an AI agent) had to re-derive intent from the code alone.

## Decision

Use lightweight Architecture Decision Records (ADRs) for any decision that is hard to reverse, involves a real tradeoff between alternatives, or would otherwise need to be re-litigated from scratch by whoever encounters it next. Store them in `docs/adr/`, numbered sequentially, using [`../templates/adr-template.md`](../templates/adr-template.md). Smaller, easily-revisited decisions go in [`../decisions/`](../decisions/) instead — see [`../standards/architecture-documentation-rules.md`](../standards/architecture-documentation-rules.md) for the exact line between the two.

## Alternatives Considered

| Option | Why not chosen |
|---|---|
| No formal decision record — rely on commit messages and memory | Already proven insufficient; this is the exact gap the 2026-07 audit found and is trying to close |
| Record decisions only in Notion | Violates the project's own documentation philosophy (see [`../notion-vs-markdown.md`](../notion-vs-markdown.md)) — architectural decisions are technical documentation, not project management, and need to live with the code they govern |

## Consequences

**Positive:**
- Future contributors (human or AI) can see *why*, not just *what*, for major decisions.
- Reduces the risk of accidentally reversing a deliberate tradeoff without realizing it was deliberate.

**Negative / tradeoffs accepted:**
- Adds a small amount of process overhead to decisions that qualify as ADR-worthy — mitigated by keeping the bar reasonably high (see the table above) so trivial decisions don't require this ceremony.

## Related
- [`../standards/architecture-documentation-rules.md`](../standards/architecture-documentation-rules.md)
- [`../templates/adr-template.md`](../templates/adr-template.md)
- [`0002-custom-cms-over-headless-cms.md`](./0002-custom-cms-over-headless-cms.md)
