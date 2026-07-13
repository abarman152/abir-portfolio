# Guide: Adding a New Content Section

Step-by-step for adding a new admin-editable content type (e.g., a "Talks" section) end to end. This is the promoted, detailed version of the workflow summarized in [`../development/setup-and-workflow.md`](../development/setup-and-workflow.md).

1. **Add the model** to `backend/prisma/schema.prisma`, following the field conventions in [`../database/schema-reference.md`](../database/schema-reference.md) (`id`, `createdAt`, `updatedAt`, plus `slug`/`order`/`visible`/`featured` as applicable).
2. **Sync the schema**: `npm run db:push` (development only — see [`../database/schema-reference.md`](../database/schema-reference.md) for the production `prisma migrate deploy` path).
3. **Create the route file** `backend/src/routes/<section>.ts` with CRUD endpoints, following the existing pattern in any sibling route file (e.g. `stats.ts` for a simple list, `projects.ts` for a richer content type with a detail view). Attach the `authenticate` middleware to every mutating route.
4. **Mount the router** in `backend/src/index.ts`.
5. **Add the TypeScript interface** to `frontend/src/lib/types.ts` — see [`../utilities/types-reference.md`](../utilities/types-reference.md) for the existing pattern and the drift risk of hand-maintaining this against the Prisma schema.
6. **Add API calls** to a new admin page under `frontend/src/app/admin/<section>/`, following the shared pattern documented in [`../pages/admin-crud-pages.md`](../pages/admin-crud-pages.md).
7. **Add the nav entry** in `AdminShell.tsx`'s `NAV_ITEMS` array — see [`../components/admin/AdminShell.md`](../components/admin/AdminShell.md).
8. **Build the public-facing component** in `frontend/src/components/sections/`, following the conventions in [`../design-system/tokens-and-guidelines.md`](../design-system/tokens-and-guidelines.md).
9. **Wire it into a page** (`app/page.tsx` for the homepage, or a new dedicated route — see [`../templates/page-template.md`](../templates/page-template.md)).
10. **Document it**: add a doc under [`../features/`](../features/) or [`../pages/`](../pages/) using the matching template, and update [`../api/rest-api-reference.md`](../api/rest-api-reference.md).

## Related
- [`../development/setup-and-workflow.md`](../development/setup-and-workflow.md)
- [`../templates/feature-template.md`](../templates/feature-template.md)
