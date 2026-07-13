# ADR 0002: Build a Custom Express + Prisma CMS Instead of Adopting a Headless CMS

**Status:** Accepted
**Date:** 2026-07-03 (retroactively documented — the original decision predates this ADR's existence, inferred from the codebase during the 2026-07 audit)

## Context

The site needs admin-editable content for every section (hero, projects, research, certifications, achievements, skills, stats, social links, about page) without hardcoding text in components. Two broad approaches exist: adopt a third-party headless CMS (Contentful, Sanity, Strapi), or build a bespoke content API.

## Decision

Build a custom Express + Prisma REST API with a hand-built React admin UI (see [`../cms/admin-panel-reference.md`](../cms/admin-panel-reference.md) and [`../architecture/cms-flow.md`](../architecture/cms-flow.md)), rather than adopting a third-party headless CMS.

## Alternatives Considered

| Option | Why not chosen |
|---|---|
| Contentful / Sanity (hosted headless CMS) | Adds an external SaaS dependency and monthly cost for a single-owner portfolio site; the content model here (projects, research, etc.) is simple enough that a bespoke schema is not meaningfully harder to build than configuring a third-party content model, and this project already needed a Postgres database via Prisma for other reasons |
| Strapi (self-hosted headless CMS) | Would require running and maintaining a second backend service alongside the existing Express API — more operational surface for no clear benefit over extending the existing API with more routes |

## Consequences

**Positive:**
- Full control over the content model and admin UI/UX — matches the "premium, minimal, Apple-inspired" design language across public and admin surfaces, which a generic third-party admin UI wouldn't.
- No external CMS vendor dependency or cost.
- All content lives in the same database as everything else, queryable with the same Prisma client.

**Negative / tradeoffs accepted:**
- No built-in draft/preview workflow, versioning, or role-based permissions that a mature headless CMS would provide out of the box — the current model is a single boolean `visible`/`isPublished` flag per content type, and a single admin role (see [`../security/authorization.md`](../security/authorization.md)).
- All CMS UI (forms, validation, tables) had to be hand-built rather than generated from a schema — visible in the ~13 near-duplicate admin CRUD pages (see [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #9).

## Related
- [`../architecture/cms-flow.md`](../architecture/cms-flow.md)
- [`../cms/admin-panel-reference.md`](../cms/admin-panel-reference.md)
- [`0003-jwt-in-localstorage.md`](./0003-jwt-in-localstorage.md)
