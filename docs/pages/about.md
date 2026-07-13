# Page: `/about`

## Purpose
Detailed personal/professional profile page — summary, education history, grouped skills, and a preview of achievements and projects.

## Business Goal
Gives recruiters a resume-equivalent view (education, skill breakdown, contact links) that the homepage's condensed `About` section doesn't have room for.

## Target Audience
Recruiters and collaborators who want depth beyond the homepage snapshot — often reached via the Navbar "About" link.

## Route
- Path: `/about`
- File: `frontend/src/app/about/page.tsx` (Server Component) + `frontend/src/components/sections/AboutPageContent.tsx` (rendering)
- Dynamic segments: none

## SEO & Metadata
- Static `metadata` export: title `"About — Abir Barman"`, description `"Data Analytics Professional skilled in Python, SQL, Power BI, and data-driven insights."`
- Included in `sitemap.ts`: yes, as a static route.
- Structured data (JSON-LD): none.

## Layout
Root layout wraps this page; the page renders its own `Navbar`/`Footer` directly (same pattern as the homepage — there's no shared "public page chrome" layout, each top-level page composes `Navbar`/`Footer` itself).

## Components Used
- [`Navbar`](../components/shared/Navbar.md), [`Footer`](../components/shared/Footer.md)
- [`AboutPageContent`](../components/sections/AboutPageContent.md)

## Hooks Used
None — see [`hooks/README.md`](../hooks/README.md).

## Dependencies
No page-specific dependency beyond the standard fetch/React stack.

## Data Sources
`export const dynamic = 'force-dynamic'`. Six endpoints fetched in parallel via `Promise.all`, each wrapped in a `safe()` helper (5s timeout, catches to a fallback):

| Endpoint | Fallback on failure |
|---|---|
| `GET /about/profile` | `DEFAULT_PROFILE` (full hardcoded profile incl. contact info) |
| `GET /about/education` | `DEFAULT_EDUCATION` (2 hardcoded entries: MCA at VIT Bhopal, B.Sc. at Kalyani Mahavidyalaya) |
| `GET /about/skills` | `DEFAULT_SKILL_GROUPS` (6 hardcoded groups) |
| `GET /achievements/featured` | `[]` |
| `GET /projects/featured` | `[]` |
| `GET /settings` | inline default `SiteSettings` object |

The page then filters/slices client-independent of any component: `achievements.filter(a => a.visible).slice(0, 4)` and `projects.slice(0, 3)` before passing to `AboutPageContent`. `aboutConfig` is read from `settings.aboutConfig ?? DEFAULT_ABOUT_CONFIG`.

- Fetch strategy: server Component fetch, `cache: 'no-store'`, per-request.

## Loading States
None — SSR blocks until all 6 fetches resolve or time out (5s each).

## Error States
No `error.tsx`. Every fetch degrades to a hardcoded fallback object rather than throwing, so this page never fails to render even if the backend is fully down — it just shows the hardcoded defaults (which happen to be real content, not placeholder text, since they mirror the seed data).

## Accessibility
No page-specific accessibility handling beyond what `AboutPageContent` implements.

## Performance
Single-fetch page (no known double-fetch issue like the homepage). All defaults are realistic content rather than empty states, so a backend outage degrades gracefully to what looks like a fully-rendered page.

## Future Improvements
None tracked specifically for this page; see the general SSR/caching notes in [`architecture/rendering-strategy.md`](../architecture/rendering-strategy.md).

## Related Pages
- [`home.md`](./home.md)
- [`achievements.md`](./achievements.md), [`projects.md`](./projects.md)
