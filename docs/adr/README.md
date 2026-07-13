# Architecture Decision Records

Formal records for hard-to-reverse decisions. See [`../standards/architecture-documentation-rules.md`](../standards/architecture-documentation-rules.md) for when something belongs here vs. in the lighter-weight [`../decisions/`](../decisions/) log.

| ADR | Decision |
|---|---|
| [0001](./0001-record-architecture-decisions.md) | Record architecture decisions as ADRs (this meta-decision) |
| [0002](./0002-custom-cms-over-headless-cms.md) | Build a custom CMS instead of adopting a headless CMS |
| [0003](./0003-jwt-in-localstorage.md) | Store the admin JWT in `localStorage`, not an httpOnly cookie (tracked for revisit) |

New ADRs: copy [`../templates/adr-template.md`](../templates/adr-template.md), number sequentially, add a row here.
