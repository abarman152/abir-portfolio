# Page: `/research/[slug]`

## Purpose
Detail page for a single research paper: abstract, Markdown overview, authors, publisher/date, and links to the publication and Google Scholar.

## Business Goal
Establishes research credibility with full context (co-authors, venue, links to verify the work externally).

## Target Audience
Recruiters or academic peers following a link from `/research` or an external citation.

## Route
- Path: `/research/[slug]`
- Files: `frontend/src/app/research/[slug]/page.tsx` (Server Component) + `frontend/src/app/research/[slug]/ResearchDetail.tsx` (Client Component)
- Dynamic segments: `[slug]` — matches `Research.slug` (unique).

## SEO & Metadata
- `generateMetadata()`: `title: "${item.title} | Abir Barman"`, `description: item.abstract`. Falls back to `{ title: 'Research Not Found' }`.
- Included in `sitemap.ts`: yes, dynamic (fetched slugs).
- Structured data (JSON-LD): none — worth noting this page is a strong candidate for `ScholarlyArticle` JSON-LD, but it isn't implemented.

## Layout
Root layout + `template.tsx`. `ResearchDetail` renders its own `Navbar`/`Footer`.

## Components Used
- [`Navbar`](../components/shared/Navbar.md), [`Footer`](../components/shared/Footer.md)
- Internal-only: `Md` (react-markdown wrapper), `AuthorBadge` (renders each author, highlighting `isPrimary`)

## Hooks Used
None — see [`hooks/README.md`](../hooks/README.md). This page has no interactive state at all (no lightbox, no expand/collapse) — it's the simplest of the four detail page types.

## Dependencies
`react-markdown` + `remark-gfm` (renders `overviewMd` — see [`../features/markdown-content-rendering.md`](../features/markdown-content-rendering.md)), `framer-motion`, `lucide-react`.

## Data Sources
- Endpoint: `GET /research/:slug`
- Fetch strategy: Server Component fetch, `next: { revalidate: 60 }`, 5s timeout. Returns `null` on failure → `notFound()`.

## Loading States
None — SSR blocks until fetch resolves or times out.

## Error States
`notFound()` → Next.js's built-in 404. No custom `error.tsx`.

## Accessibility
Static content page with clear heading hierarchy (`h1` title, section labels as visually-styled `<span>`s rather than semantic headings — the "ABSTRACT"/"AUTHORS" section labels are not `<h2>` elements, which is a minor semantic gap for screen reader navigation).

## Performance
No images on this page type (research entries have no image/gallery fields in the schema — see [`database/schema-reference.md`](../database/schema-reference.md)), so no image-optimization concerns here.

## Future Improvements
`ScholarlyArticle` JSON-LD would be a reasonable addition; not currently tracked as a numbered debt item.

## Related Pages
- [`research.md`](./research.md)
- [`../architecture/research-management-flow.md`](../architecture/research-management-flow.md)
