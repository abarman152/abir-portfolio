# Layouts

Root layout, admin layout, and the page-transition template (technically a Next.js "template," not a layout — see below). See [`../templates/layout-template.md`](../templates/layout-template.md) for the structure each doc follows and [`../architecture/routing-architecture.md`](../architecture/routing-architecture.md) for how these files fit into the App Router's special-file conventions.

## Docs

| File | Scope | Doc |
|---|---|---|
| `frontend/src/app/layout.tsx` | Every route | [`root-layout.md`](./root-layout.md) |
| `frontend/src/app/admin/layout.tsx` | Every `/admin/*` route | [`admin-layout.md`](./admin-layout.md) |
| `frontend/src/app/template.tsx` | Every route (re-mounts per navigation) | [`page-transition-template.md`](./page-transition-template.md) |

## Layout vs. template, in one sentence
A layout persists across navigations within its scope; a template re-mounts on every navigation — which is exactly why the page-transition animation lives in `template.tsx` and not a layout. Full explanation in [`page-transition-template.md`](./page-transition-template.md).

## Key fact worth restating here
Neither the root layout nor the admin layout performs authentication. Route protection for `/admin/*` is implemented entirely client-side inside [`AdminShell`](../components/admin/AdminShell.md) — see [`admin-layout.md`](./admin-layout.md) and [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md).

## Related
- [`../architecture/component-hierarchy.md`](../architecture/component-hierarchy.md)
- [`../architecture/animation-architecture.md`](../architecture/animation-architecture.md)
- [`../pages/`](../pages/)
