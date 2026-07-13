# SEO

## What's implemented

- Root `metadata` export (`app/layout.tsx`): title, description, `metadataBase`, full favicon/icon set, Open Graph (title/description/type/1200×630 image), Twitter card (`summary_large_image`).
- `generateMetadata()` confirmed present on all four dynamic detail pages (`/projects/[slug]`, `/research/[slug]`, `/certifications/[slug]`, `/achievements/[slug]`) — each generates page-specific title/description from the fetched content.
- `app/robots.ts` — allows `/`, disallows `/admin/`, points to `/sitemap.xml`.
- `app/sitemap.ts` — dynamically built from static routes plus live slugs fetched from `/projects`, `/research`, `/certifications`, `/achievements` (filtered to `visible !== false`), `revalidate: 3600`, 5s fetch timeout with graceful fallback.
- Favicon URL stability was specifically fixed (commit `57c58f8`) after Google Search indexed a broken/inconsistent set — see [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) history.

## What's missing

- **No JSON-LD structured data** anywhere (confirmed absent by grep during the audit) — adding `Person`/`CreativeWork`/`Article` structured data for the hero/projects/research would improve rich-result eligibility in search.
- **No canonical URL tags** beyond what `metadataBase` implies by default.

## Related
- [`../pages/`](../pages/) — per-page metadata detail
- [`core-web-vitals-and-checklist.md`](./core-web-vitals-and-checklist.md)
