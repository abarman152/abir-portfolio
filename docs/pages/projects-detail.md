# Page: `/projects/[slug]`

## Purpose
Case-study detail page for a single project: banner, problem, result, overview, tech stack, links, and a screenshot/result-image gallery with lightbox.

## Business Goal
The primary artifact recruiters click through to — demonstrates depth of thinking (problem → result framing) rather than just a description.

## Target Audience
Recruiters/collaborators who clicked a project card from `/projects` or the homepage.

## Route
- Path: `/projects/[slug]`
- Files: `frontend/src/app/projects/[slug]/page.tsx` (Server Component, data fetch + metadata) + `frontend/src/app/projects/[slug]/ProjectDetail.tsx` (Client Component, rendering)
- Dynamic segments: `[slug]` — matches `Project.slug` (unique).

## SEO & Metadata
- `generateMetadata()` is present and dynamic: `title: "${project.title} | Abir Barman"`, `description: project.description`. Falls back to `{ title: 'Project Not Found' }` if the slug doesn't resolve.
- Included in `sitemap.ts`: yes — `sitemap.ts` fetches live project slugs to generate these entries dynamically.
- Structured data (JSON-LD): none.

## Layout
Root layout + `template.tsx`. `ProjectDetail` renders its own `Navbar`/`Footer`.

## Components Used
- [`Navbar`](../components/shared/Navbar.md), [`Footer`](../components/shared/Footer.md)
- Internal-only (not exported/reused elsewhere in this file): `Md` (react-markdown wrapper), `Lightbox` (fullscreen image viewer with keyboard nav)

## Hooks Used
None — see [`hooks/README.md`](../hooks/README.md). `ProjectDetail` uses `useState`/`useEffect`/`useCallback` directly for expand/collapse of char-limited fields and lightbox state.

## Dependencies
`react-markdown` + `remark-gfm` (renders `overviewMd`/`problem`/`result` — see [`../features/markdown-content-rendering.md`](../features/markdown-content-rendering.md)), `framer-motion`, `lucide-react`.

## Data Sources
- Endpoint: `GET /projects/:slug`
- Fetch strategy: Server Component fetch with `next: { revalidate: 60 }` (1 minute) and a 5s `AbortSignal.timeout`. On fetch failure or `404`, `getProject()` returns `null` and the page calls `notFound()`.

## Loading States
None — SSR blocks until the fetch resolves (max ~5s before timeout) or the page 404s.

## Error States
`notFound()` triggers Next.js's built-in 404 boundary when the project doesn't exist or the fetch fails/times out. No custom `error.tsx` for this route.

## Accessibility
Gallery images have `alt` text derived from title + index. Lightbox supports `Escape`/`ArrowLeft`/`ArrowRight` keyboard navigation and locks body scroll while open. The lightbox close/prev/next buttons are real `<button>` elements with icon-only content but no explicit `aria-label` on the Prev/Next/Close controls (a gap — `title` attributes exist on some inline icon links elsewhere in the app but not consistently on lightbox controls here).

## Performance
- `next/image` is **not** used for the banner, gallery, or lightbox images — they're plain `<img>` tags. This means no automatic responsive `srcset`/format optimization from Next.js for this page's images, unlike some other parts of the app. This is worth flagging as a gap (contradicts `AGENTS.md`'s stated image-optimization intent) rather than a deliberate choice documented anywhere.
- `problemCharLimit`/`resultCharLimit` truncate long Markdown fields client-side with a "Read more" expand toggle (`applyLimit()`), avoiding an oversized initial render for long problem/result write-ups.

## Future Improvements
Migrating gallery/banner images to `next/image` would be a natural improvement; not currently tracked as a numbered debt item.

## Related Pages
- [`projects.md`](./projects.md)
- [`../features/markdown-content-rendering.md`](../features/markdown-content-rendering.md)
- [`../features/image-handling-convention.md`](../features/image-handling-convention.md)
