# Page: `/achievements/[slug]`

## Purpose
Detail page for a single achievement: description/Markdown overview, issuing organization, date, category, and an image gallery with a sticky lightbox viewer.

## Business Goal
Gives depth to a specific award/milestone (context, supporting images) beyond the timeline card summary.

## Target Audience
Recruiters/collaborators following a link from `/achievements`.

## Route
- Path: `/achievements/[slug]`
- Files: `frontend/src/app/achievements/[slug]/page.tsx` (Server Component) + `frontend/src/app/achievements/[slug]/AchievementDetail.tsx` (Client Component)
- Dynamic segments: `[slug]` — matches `Achievement.slug` (nullable/optional, same pattern as Certification).

## SEO & Metadata
- `generateMetadata()`: `title: "${item.title} | Abir Barman"`, `description: item.description || "${item.title} — ${item.issuer}"`. Falls back to `{ title: 'Achievement Not Found' }`.
- Included in `sitemap.ts`: yes, dynamic (fetched slugs, only for achievements that have one).
- Structured data (JSON-LD): none.

## Layout
Root layout + `template.tsx`. `AchievementDetail` renders its own `Navbar`/`Footer` (no `Footer` render actually present at the end of this component — see note below).

## Components Used
- [`Navbar`](../components/shared/Navbar.md) (present); `Footer` is imported but the JSX does render `<Footer />` after `<main>` — confirmed present in source.
- Internal-only: `Md` (react-markdown wrapper), `SectionLabel`, `StickyGallery` (the most complex of the four detail-page galleries — sticky-positioned main image + thumbnail grid + fullscreen lightbox with keyboard nav, reorders above content on mobile via CSS).

## Hooks Used
None — see [`hooks/README.md`](../hooks/README.md). `StickyGallery` (a sub-component, not a hook) manages its own `activeIdx`/`lightbox` state with `useState`/`useCallback`/`useEffect`.

## Dependencies
`react-markdown` + `remark-gfm` (renders `overviewMd`), `framer-motion` (incl. `AnimatePresence` for the lightbox), `lucide-react`.

## Data Sources
- Endpoint: `GET /achievements/:slug`
- Fetch strategy: Server Component fetch, `next: { revalidate: 60 }`, 5s timeout. Returns `null` → `notFound()`.

## Loading States
None — SSR blocks until fetch resolves or times out.

## Error States
`notFound()` → Next.js's built-in 404.

## Accessibility
Lightbox and thumbnail buttons have `aria-label`s (`"View fullscreen"`, `"View image ${i+1}"`). Keyboard nav (`Escape`/`ArrowLeft`/`ArrowRight`) implemented the same way as the project gallery's lightbox. Responsive CSS reorders the gallery above the text content on mobile (`order: -1`) and removes `position: sticky` below the `768px` breakpoint.

## Performance
Gallery images are plain `<img>` tags, not `next/image` — same gap as the other detail pages with image galleries. The two-column layout (content + sticky gallery) only activates `position: sticky` on viewports above `768px`.

## Future Improvements
None tracked specifically for this page beyond the general `next/image` gap noted across detail pages.

## Related Pages
- [`achievements.md`](./achievements.md)
- [`../features/image-handling-convention.md`](../features/image-handling-convention.md)
