# CMS Flow

## Scope
How content moves from admin authoring to the public site, for the custom-built CMS (not a third-party headless CMS — see [`../cms/`](../cms/)).

## End-to-end flow

```mermaid
flowchart LR
    Admin["Admin fills form at /admin/<section>"] --> Submit["POST/PUT/PATCH to /api/<resource>"]
    Submit --> Auth["authenticate middleware verifies JWT"]
    Auth --> Route["Route handler (routes/<resource>.ts)"]
    Route --> Prisma["Prisma client write"]
    Prisma --> DB[(PostgreSQL)]
    DB --> PublicFetch["Public page Server Component fetch() on next request"]
    PublicFetch --> Render["Rendered to visitor"]
```

## Key properties

- **No caching/revalidation trigger from admin saves.** A save doesn't call `revalidatePath`/`revalidateTag` — public pages simply pick up the change on their next per-request SSR fetch (see [`rendering-strategy.md`](./rendering-strategy.md)). `SiteSettings` is the one exception with a 5-minute revalidation window, so a settings change can take up to 5 minutes to reflect if a cached response is served in between.
- **No draft/publish distinction** beyond simple boolean flags (`isPublished` on `Project`, `visible` on most other content types) — there's no staging/preview environment for unpublished content; toggling `visible: false` just excludes it from public `GET` queries while remaining visible to admin `GET /all` endpoints.
- **Markdown fields** (`overviewMd`, `problem`, `result`, `abstract`) are stored as raw Markdown strings and rendered via `react-markdown` + `remark-gfm` on the public side — there is no sanitization pass beyond `react-markdown`'s own defaults confirmed in code; see [`../security/secure-coding-practices.md`](../security/secure-coding-practices.md).
- **Images are URLs, not uploads** — see [`../features/image-handling-convention.md`](../features/image-handling-convention.md) and [`architecture/overview.md`](./overview.md)'s Cloudinary note.

## Related
- [`../cms/admin-panel-reference.md`](../cms/admin-panel-reference.md)
- [`research-management-flow.md`](./research-management-flow.md) — one content type traced in full detail
- [`rendering-strategy.md`](./rendering-strategy.md)
