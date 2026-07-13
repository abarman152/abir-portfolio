# Feature: CMS Content Management

## Purpose
The general capability that lets the site owner manage every piece of portfolio content (projects, research, certifications, achievements, skills, stats, hero content, about page, site settings, social links) through a custom-built admin panel, without touching code or the database directly.

> This is the umbrella feature-level doc. For the full end-to-end data flow diagram, see [`../architecture/cms-flow.md`](../architecture/cms-flow.md). For per-section field reference (exact fields, business rules per content type), see [`../cms/admin-panel-reference.md`](../cms/admin-panel-reference.md) — both are thorough already; this doc doesn't duplicate either.

## Business Value
Lets the site owner update content (add a new project, mark a certification featured, edit the bio) without a deploy — the entire portfolio is database-backed, not hardcoded into components.

## User Flow
See [`../architecture/cms-flow.md`](../architecture/cms-flow.md)'s flowchart: admin fills a form at `/admin/<section>` → `POST`/`PUT`/`PATCH` to `/api/<resource>` → JWT verified → Prisma write → public pages pick up the change on their next per-request SSR fetch.

## Architecture
Custom-built, not a third-party headless CMS (no Contentful/Sanity/Strapi) — a bespoke Express + Prisma admin API paired with a hand-built React admin UI. See [`../architecture/overview.md`](../architecture/overview.md). No formal ADR exists recording this choice, though it's the foundational architectural decision behind the entire admin panel.

## Dependencies
No CMS-specific package — this is directly Express routes + Prisma + a React admin UI, no intermediate CMS SDK.

## Components
[`AdminShell`](../components/admin/AdminShell.md), [`AdminTable`](../components/admin/AdminTable.md), [`Modal`](../components/admin/Modal.md) — see [`../pages/admin-crud-pages.md`](../pages/admin-crud-pages.md) for the shared pattern across all ~13 content sections.

## Files
See [`../cms/admin-panel-reference.md`](../cms/admin-panel-reference.md) for the full per-section file/field breakdown; see [`../api/rest-api-reference.md`](../api/rest-api-reference.md) for every backend route involved.

## Edge Cases
- **No draft/publish distinction** beyond simple boolean flags (`isPublished` on `Project`, `visible` on most other content types) — see [`../architecture/cms-flow.md`](../architecture/cms-flow.md). Toggling `visible: false` excludes content from public `GET` queries while it remains visible to admin `GET /all` endpoints; there's no staging/preview environment for unpublished content.
- **No caching/revalidation trigger from admin saves** — a save doesn't call `revalidatePath`/`revalidateTag`; public pages pick up changes on their next per-request SSR fetch. `SiteSettings` is the one exception (5-minute revalidation window), so a settings change can take up to 5 minutes to fully propagate.

## Limitations
- Single admin account only — no multi-user roles/permissions; whoever holds the one JWT can edit everything.
- No content versioning/undo — an edit or delete is immediate and permanent (aside from the browser's native `confirm()` dialog before delete, see [`AdminTable`](../components/admin/AdminTable.md)).
- No audit log of who changed what and when (moot with a single admin account, but worth noting if multi-user support is ever added).

## Future Enhancements
None tracked as a numbered roadmap item beyond the general items in [`../architecture/future-architecture.md`](../architecture/future-architecture.md).

## Testing Strategy
Manual only — no automated tests exist for any admin CRUD flow.
