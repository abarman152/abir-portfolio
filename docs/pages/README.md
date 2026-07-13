# Pages

One doc per route: purpose, SEO/metadata, data sources, loading/error states, and accessibility notes. See [`../architecture/routing-architecture.md`](../architecture/routing-architecture.md) for the routing mechanism these pages sit on top of, and [`../templates/page-template.md`](../templates/page-template.md) for the structure each doc follows.

## Public site

| Route | Doc |
|---|---|
| `/` | [`home.md`](./home.md) |
| `/about` | [`about.md`](./about.md) |
| `/resume` | [`resume-page.md`](./resume-page.md) |
| `/projects` | [`projects.md`](./projects.md) |
| `/projects/[slug]` | [`projects-detail.md`](./projects-detail.md) |
| `/research` | [`research.md`](./research.md) |
| `/research/[slug]` | [`research-detail.md`](./research-detail.md) |
| `/certifications` | [`certifications.md`](./certifications.md) |
| `/certifications/[slug]` | [`certifications-detail.md`](./certifications-detail.md) |
| `/achievements` | [`achievements.md`](./achievements.md) |
| `/achievements/[slug]` | [`achievements-detail.md`](./achievements-detail.md) |

## Admin panel

| Route | Doc |
|---|---|
| `/admin/login` | [`admin-login.md`](./admin-login.md) |
| `/admin/dashboard` | [`admin-dashboard.md`](./admin-dashboard.md) |
| `/admin/about`, `/admin/achievements`, `/admin/certifications`, `/admin/hero-badges`, `/admin/messages`, `/admin/notifications`, `/admin/projects`, `/admin/research`, `/admin/settings`, `/admin/skills`, `/admin/social`, `/admin/stats` (13 CRUD sections) | [`admin-crud-pages.md`](./admin-crud-pages.md) (consolidated — see [`../cms/admin-panel-reference.md`](../cms/admin-panel-reference.md) for per-section field detail) |

## Related
- [`../architecture/routing-architecture.md`](../architecture/routing-architecture.md)
- [`../architecture/rendering-strategy.md`](../architecture/rendering-strategy.md)
- [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md)
- [`../layouts/`](../layouts/)
- [`../features/`](../features/)
