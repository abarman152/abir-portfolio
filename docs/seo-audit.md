# SEO Audit — Technical SEO / Metadata (Phase 7)

**Version:** 1.0
**Date:** 2026-07-06
**Scope:** Static technical-SEO audit of `frontend/src/app` (Next.js 16, App Router). No servers run, no external fetches. Keyword/competitor research intentionally skipped (personal portfolio).
**Cross-references:** [bug-audit.md](bug-audit.md) (Phase 7 entry) · [performance-audit.md](performance-audit.md) · [accessibility-audit.md](accessibility-audit.md)

---

## Executive summary

The site has a solid SEO skeleton — `metadataBase`, OG/Twitter cards, `robots.ts`, `sitemap.ts`, a root `not-found.tsx`, stable favicon setup, and exactly one `h1` per public page. However, the sitemap's dynamic-slug fetcher **silently returns zero detail URLs** because it parses a response shape (`data.data`) the backend never returns (`{ projects: [...] }` / `{ items: [...] }`), so no project/research/certification/achievement detail page is ever listed. The four listing pages are fully client-rendered with **no per-page metadata**, so five public URLs share one identical title/description. The shipped OG image is 5.06 MB at 2848×1504 while metadata declares 1200×630 — several platforms will refuse to render it. Overall assessment: **needs work** — three high-impact issues, all cheap to fix before launch.

Top 3 priorities:
1. Fix sitemap slug parsing + pagination limits (SEO-001) — currently the sitemap advertises only 6 static URLs.
2. Add metadata to the four client-rendered listing pages (SEO-002).
3. Replace/resize the 5 MB OG image (SEO-004).

---

## Findings

| ID | Severity | Location | Evidence | Recommendation |
|----|----------|----------|----------|----------------|
| SEO-001 | **Critical** | `frontend/src/app/sitemap.ts:14` | `fetchSlugs` parses `Array.isArray(data) ? data : data?.data ?? []`, but backend list endpoints return `{ projects: [...] }` (`backend/src/routes/projects.ts:64`) and `{ items: [...] }` (`research.ts:75`, `certifications.ts:101`, `achievements.ts:101`). Neither key is `data`, so every dynamic route resolves to `[]` and the silent `catch` masks it. Additionally, no `limit` param is passed, and backend defaults are `limit=9` for projects/research (`projects.ts:24`, `research.ts:25`), so even after fixing the key only 9 slugs would return. Result: **sitemap.xml contains only the 6 static URLs.** | Parse the correct keys (`data.projects ?? data.items ?? data`), request `?limit=200` (backend caps: 50 for projects/research, 200 for certs/achievements — raise if needed), and log or fail loudly when a fetch returns empty in production builds. |
| SEO-002 | High | `frontend/src/app/projects/page.tsx:1`, `research/page.tsx:1`, `certifications/page.tsx:1`, `achievements/page.tsx:1` | All four listing pages are `'use client'` — a Client Component cannot export `metadata`, and none has a server wrapper providing one. `/projects`, `/research`, `/certifications`, `/achievements` all inherit the root title `Abir — Data Scientist` and root description → 5 public URLs with duplicate titles/descriptions. | Add a thin server `page.tsx` (or `layout.tsx` per segment) exporting `metadata` with unique title/description, and move the current client page to a child component. |
| SEO-003 | High | Same four listing pages (`useEffect` + `fetch`, e.g. `projects/page.tsx:118-134`) | Listing content is fetched client-side after mount; the server HTML contains only the page header and empty skeletons. Google renders JS eventually, but indexing is delayed/lower-quality and non-Google crawlers (Bing legacy, link-preview bots) see no content. Detail pages and home/about are server-rendered — inconsistent. | Fetch the first page of data in a Server Component and pass as initial props (pattern already used on `/` and `/about`); keep filters/search client-side. |
| SEO-004 | High | `frontend/public/og-image.png`; declared at `layout.tsx:52` | File is **5,065,550 bytes (5.06 MB), 2848×1504 px**, while metadata declares `width: 1200, height: 630`. WhatsApp (~600 KB limit), Telegram, X/Twitter (~5 MB), and LinkedIn may fail or time out fetching the preview; dimension mismatch can distort validator output. | Export a true 1200×630 image, compress to <300 KB (JPEG/WebP-in-PNG-clothing not required; PNG or JPEG fine), keep the filename or update both references. |
| SEO-005 | Medium | `projects/[slug]/page.tsx:20-28`, `research/[slug]/page.tsx:20-28`, `certifications/[slug]/page.tsx:20-28`, `achievements/[slug]/page.tsx:20-28` | `generateMetadata` returns only `title` + `description`. `openGraph`/`twitter` are inherited from the root layout, so every detail page shares the generic OG title "Abir — Data Scientist" and the generic `og-image.png` — social shares of a specific project show the wrong title/image. Projects have `imageUrl`/`bannerImageUrl` (`lib/types.ts`) that go unused. | In each `generateMetadata`, set `openGraph: { title, description, type: 'article', images: [bannerImageUrl ?? imageUrl ?? '/og-image.png'] }` and matching `twitter` block. |
| SEO-006 | Medium | All public routes (no `alternates` anywhere; verified by grep) | No canonical URLs emitted on any page. Low duplicate-content risk today, but query-string variants (`?page=`, UTM tags) and any apex↔www misconfiguration will index as separate URLs. | Add `alternates: { canonical: './' }` to root metadata (Next resolves per-route against `metadataBase`), or explicit canonicals in each page/`generateMetadata`. |
| SEO-007 | Medium | `layout.tsx:36` and child pages | Root `title` is a plain string — no `title.template`. Children hand-build suffixes (`about/page.tsx:8` uses `About — Abir Barman`; detail pages use `… | Abir Barman`) → inconsistent separators (`—` vs `|`) and brand fragments. | Use `title: { default: 'Abir Barman — Data Scientist', template: '%s — Abir Barman' }` in root metadata and strip manual suffixes from children. |
| SEO-008 | Medium | `layout.tsx:34-60` vs `lib/types.ts` (`SiteSettings.metaTitle/metaDesc/ogImageUrl`), `admin/settings/page.tsx` | The CMS exposes `metaTitle`, `metaDesc`, `ogImageUrl` (editable in admin settings and fetched on `/` and `/about`), but root metadata is fully hardcoded — admin edits to SEO fields have **no effect**. Also conflicts with the AGENTS.md "no hardcoded content" rule. | Convert root `metadata` to `generateMetadata()` that fetches `/settings` (already cached 300 s for the theme) and falls back to the current strings. |
| SEO-009 | Medium | `admin/layout.tsx` (metadata = title only); `robots.ts:9` | Admin is excluded via `Disallow: /admin/` only. Disallow blocks crawling, not indexing — `/admin/login` etc. can still appear in results as URL-only entries if linked externally. No `robots` metadata anywhere in the app. | Add `robots: { index: false, follow: false }` to `admin/layout.tsx` metadata. Keep the robots.txt rule. |
| SEO-010 | Low | `sitemap.ts:34-66` | Every entry uses `lastModified: new Date()` — regenerated hourly (revalidate 3600), so every URL always claims "modified now". Google discounts unreliable lastmod signals. | Use `updatedAt` from the API for dynamic entries (field exists on all models per schema conventions); drop `lastModified` from static routes or tie it to deploy time. |
| SEO-011 | Low | `layout.tsx:35`, `sitemap.ts:3`, `robots.ts:12` | Base URL `https://www.abirbarman.com` hardcoded in three files. Currently consistent (all www), but a domain change requires three edits and staging/preview deploys advertise production URLs. | Centralize in one constant driven by `NEXT_PUBLIC_SITE_URL` with the current value as fallback; import in all three files. |
| SEO-012 | Recommendation | Site-wide (no `application/ld+json` anywhere; verified by grep) | No structured data. For a portfolio, `Person` (+ `sameAs` for GitHub/LinkedIn/LeetCode) and `WebSite` JSON-LD on the homepage improve knowledge-panel/rich-result eligibility; `ScholarlyArticle` fits research detail pages, `CreativeWork` fits projects. | Add a JSON-LD `<script>` in the root layout (Person + WebSite) sourced from `/about/profile` + `/social`; optional per-type schema on detail pages. Recommendation only — not a launch blocker. |
| SEO-013 | Low | `page.tsx:20` (`force-dynamic`, `cache: 'no-store'`), `about/page.tsx:13` | Home and About are fully dynamic with no-store fetches against a Render backend with cold starts (see bug-audit "empty homepage on cold backend start"). Slow TTFB degrades crawl budget and Core Web Vitals field data. | Consider `revalidate: 60`-style ISR for `/` and `/about` instead of `force-dynamic`; the 8 s fetch timeout already bounds the worst case. |
| SEO-014 | Info (Pass) | `layout.tsx:38-47`, `frontend/public/`, `not-found.tsx`, all public pages | **Verified healthy:** favicon set complete and consistent (favicon.ico 48x48 declared, 16/32 PNGs, apple-touch-icon, android-chrome via `site.webmanifest`; no conflicting `src/app/favicon.ico` — the "stabilize favicon URLs" commit state is intact). Root `not-found.tsx` exists and returns proper 404 UX with a single `h1`. Exactly one `h1` per public page (Hero on `/`, one `motion.h1`/`h1` on each listing and detail page, verified by grep). `robots.ts` shape valid; sitemap URL matches domain. `lang="en"` set on `<html>`. | None — keep as-is. |

---

## Quick wins (under ~2 hours total)

1. **SEO-001** — change two lines in `sitemap.ts` (`data.projects ?? data.items ?? data`, add `?limit=200`). Highest impact fix in the audit.
2. **SEO-004** — export a 1200×630, <300 KB `og-image.png`.
3. **SEO-009** — 3-line `robots` block in `admin/layout.tsx`.
4. **SEO-007** — title template in root layout; delete manual suffixes.
5. **SEO-002** — add `metadata` via server wrappers for the four listing pages.
6. **SEO-006** — `alternates: { canonical: './' }` in root metadata.
7. **SEO-011** — centralize the base URL constant.

## Strategic (post-launch acceptable)

- **SEO-003** — server-render initial listing data (touches component structure).
- **SEO-005** — OG/Twitter blocks in all four `generateMetadata` functions with content images.
- **SEO-008** — wire CMS `metaTitle`/`metaDesc`/`ogImageUrl` into `generateMetadata`.
- **SEO-010** — real `lastModified` from `updatedAt`.
- **SEO-012** — Person/WebSite JSON-LD.
- **SEO-013** — ISR for `/` and `/about` (coordinate with performance audit, Phase 4).

---

## Cross-reference to bug-audit.md

- Phase 7 (SEO / metadata audit) → this document; SEO-001 qualifies for the bug register (functional defect: sitemap silently drops all dynamic URLs — same silent-catch failure family as the "empty homepage on cold backend start" fix, commit `10391af`).
- SEO-013 overlaps Phase 4 (performance) — cold-start TTFB.
- SEO-003 overlaps the crawlability consequences of client-only rendering; listing pages are also where lint flagged `no-img-element` warnings (bug-audit baseline).
