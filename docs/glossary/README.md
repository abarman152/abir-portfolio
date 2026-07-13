# Glossary

Project-specific terms used across this documentation set.

| Term | Meaning |
|---|---|
| **Admin** | The single site-owner role; see [`../security/authorization.md`](../security/authorization.md) — there is no multi-role permission system. |
| **CMS** | The custom-built Express + Prisma admin API and React admin UI — not a third-party headless CMS. See [`../cms/`](../cms/). |
| **Content type** | A distinct kind of managed content (Project, Research, Certification, Achievement, Skill, Stat, etc.), each with its own Prisma model. |
| **Detail page** | A `[slug]`-based dynamic route showing one item of a content type in full (e.g. `/projects/[slug]`). |
| **Featured** | A boolean flag controlling whether an item appears in a homepage-level subset, independent of its full listing page visibility. |
| **Visible** | A boolean flag controlling whether an item appears in public `GET` queries at all — distinct from `featured`. |
| **Seed script** | `backend/src/seed.ts` — idempotent initial-data + admin-account creation, run via `npm run db:seed`. |
| **Pooler URL** | Supabase's pgBouncer connection string (`DATABASE_URL`, port 6543) used at runtime; distinct from the `DIRECT_URL` (port 5432) used for schema push/migrations. |
| **FOUC** | Flash of unstyled content — specifically here, a flash of the wrong theme before the inline theme script runs. See [`../architecture/theme-architecture.md`](../architecture/theme-architecture.md). |
| **ADR** | Architecture Decision Record — see [`../adr/`](../adr/). |
| **Technical debt register** | The canonical list of known code/documentation discrepancies and gaps — [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md). |
