# Component: Resume Buttons

There is no single `<ResumeButton>` component — resume actions are lightweight anchors in three places, all consuming the same centralized module ([`frontend/src/lib/resume.ts`](../../frontend/src/lib/resume.ts)). This doc covers all of them.

## The rule
**No resume button may hardcode a URL.** Every resume action either navigates to `/resume` or renders `hero.resumeUrl` through the shared helpers:

| Helper | Purpose |
|---|---|
| `isValidResumeUrl(url)` | Type-guard: non-empty + parses as http(s). Gates rendering of download links |
| `resumeDownloadUrl(url)` | Injects Cloudinary `fl_attachment` so the file downloads instead of rendering inline; passthrough for other hosts |
| `isEmbeddableResume(url)` | Whether the `/resume` preview iframe should be attempted |
| `useResume()` | Cached client hook returning `{ hero, loading, error, retry }` from `GET /api/hero` |

## Instances

### 1. Navbar — desktop button + mobile drawer (`frontend/src/components/Navbar.tsx`)
`<Link href="/resume">` (both). Navigation, not download — consistent with the navbar's page-link UX. No data fetching in the navbar (zero request overhead). The desktop button gets `aria-current="page"` + active styling when the route is `/resume`; the drawer link closes the drawer on click. Both carry `aria-label="View resume"`.

### 2. Hero CTA (`frontend/src/components/sections/Hero.tsx`)
Renders only when `isValidResumeUrl(hero.resumeUrl)` — otherwise a Contact button takes its place. Uses `resumeDownloadUrl()` for the href with `download` + `target="_blank" rel="noopener noreferrer"` (the new tab is the fallback for hosts where cross-origin `download` is ignored). Data arrives via the home page's server-side fetch — the Hero performs no client fetch of its own.

### 3. `/resume` page actions (`frontend/src/app/resume/ResumeClient.tsx`)
Primary **Download Resume** (same href strategy as the Hero) and outline **Open in New Tab** (`hero.resumeUrl` untransformed). Data via `useResume()`.

## Button states
Follows the design-system button spec: hover lift (`translateY(-1px)`) + border/opacity shift, matching focus states, accent primary / outline secondary, disabled rendering never needed because invalid/missing URLs remove the button instead of disabling it.

## Adding a new resume button elsewhere
1. If it's navigation → `<Link href="/resume">`.
2. If it's a direct download → get the URL from server data or `useResume()`, gate with `isValidResumeUrl`, href through `resumeDownloadUrl`.
3. Never store a resume URL in a component, constant, or env var.

## Related
- [`../features/resume-system.md`](../features/resume-system.md)
- [`../pages/resume-page.md`](../pages/resume-page.md)
