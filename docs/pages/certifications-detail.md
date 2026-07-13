# Page: `/certifications/[slug]`

## Purpose
Detail page for a single certification: certificate image, badge, issuer, issue date, credential ID, verification link, and Markdown overview/skills covered.

## Business Goal
Lets a recruiter verify a specific credential without leaving the site (external `credentialUrl` link) while presenting the supporting context (skills covered, category).

## Target Audience
Recruiters verifying a specific credential, or visitors browsing from `/certifications`.

## Route
- Path: `/certifications/[slug]`
- Files: `frontend/src/app/certifications/[slug]/page.tsx` (Server Component) + `frontend/src/app/certifications/[slug]/CertDetail.tsx` (Client Component)
- Dynamic segments: `[slug]` — matches `Certification.slug` (nullable/optional in the schema; a certification without a slug has no detail page and its listing card is non-clickable, see [`certifications.md`](./certifications.md)).

## SEO & Metadata
- `generateMetadata()`: `title: "${cert.title} | Abir Barman"`, `description: cert.description || "${cert.title} — issued by ${cert.issuer}"`. Falls back to `{ title: 'Certification Not Found' }`.
- Included in `sitemap.ts`: yes, dynamic (fetched slugs, only for certs that have one).
- Structured data (JSON-LD): none — this page is a candidate for `EducationalOccupationalCredential` JSON-LD, not implemented.

## Layout
Root layout + `template.tsx`. `CertDetail` renders its own `Navbar`/`Footer`.

## Components Used
- [`Navbar`](../components/shared/Navbar.md), [`Footer`](../components/shared/Footer.md)
- Internal-only: `Md` (react-markdown wrapper), `SectionLabel` (small styled section divider)

## Hooks Used
None — see [`hooks/README.md`](../hooks/README.md). No interactive state on this page (no lightbox — the certificate image is displayed inline, not in a gallery).

## Dependencies
`react-markdown` + `remark-gfm` (renders `overviewMd`), `framer-motion`, `lucide-react`.

## Data Sources
- Endpoint: `GET /certifications/:slug`
- Fetch strategy: Server Component fetch, `next: { revalidate: 60 }`, 5s timeout. Returns `null` → `notFound()`.

## Loading States
None — SSR blocks until fetch resolves or times out.

## Error States
`notFound()` → Next.js's built-in 404.

## Accessibility
Certificate/badge images have descriptive `alt` text (`"${cert.title} certificate"`, `"${cert.issuer} badge"`). No lightbox on this page, so no keyboard-nav concerns like the project gallery.

## Performance
Certificate/badge images are plain `<img>` tags, not `next/image` — same gap noted on the project detail page.

## Future Improvements
`EducationalOccupationalCredential` JSON-LD would be a reasonable addition; not currently tracked as a numbered debt item.

## Related Pages
- [`certifications.md`](./certifications.md)
- [`../features/image-handling-convention.md`](../features/image-handling-convention.md)
