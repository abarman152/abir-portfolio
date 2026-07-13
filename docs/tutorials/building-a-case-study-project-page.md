# Tutorial: Building a Case-Study Project Page

A narrative walkthrough of how the `/projects/[slug]` detail page's case-study layout works, useful for understanding the pattern well enough to replicate it for a new content type (Research, Certifications, and Achievements detail pages all follow the same shape).

## 1. The layout shape

Every detail page renders, in order: banner image → title + tech stack → overview (Markdown) → problem (Markdown) → result (Markdown) → gallery/screenshots → external links (GitHub, live demo). This ordering was itself the result of an iteration — see commit `f4f6250` ("reorder sections, fix markdown rendering, add gallery lightbox") in the project history.

## 2. Where the data comes from

The page (`frontend/src/app/projects/[slug]/page.tsx`) is a Server Component that fetches `GET /api/projects/:slug` and passes the result to `ProjectDetail.tsx`, a client component handling the interactive gallery lightbox. See [`../pages/projects-detail.md`](../pages/projects-detail.md) and [`../architecture/rendering-strategy.md`](../architecture/rendering-strategy.md) for why the interactive part is split into its own client component rather than making the whole page a client component.

## 3. Markdown fields

`overviewMd`, `problem`, and `result` are raw Markdown strings rendered via `react-markdown` + `remark-gfm` — see [`../features/markdown-content-rendering.md`](../features/markdown-content-rendering.md) for the shared rendering convention used across all four content types with this layout.

## 4. Replicating this pattern for a new content type

If you're building a fifth content type with a similar case-study layout, look at `research-detail.md`/`certifications-detail.md`/`achievements-detail.md` in [`../pages/`](../pages/) — all four independently implement the same shape rather than sharing a generic `CaseStudyDetail` component. This is real duplication worth being aware of (see [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #21 for the related `ProjectCard` duplication finding) — consider extracting a shared layout component rather than adding a fifth copy.

## Related
- [`../guides/adding-a-content-section.md`](../guides/adding-a-content-section.md)
- [`../pages/projects-detail.md`](../pages/projects-detail.md)
