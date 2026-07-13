# Page: Resume (`/resume`)

## Purpose
Dedicated page where visitors can preview, open, and download the resume. Linked from the navbar Resume button (desktop and mobile drawer) and listed in the sitemap.

## Route & Files
| Path | File | Role |
|---|---|---|
| `/resume` | `frontend/src/app/resume/page.tsx` | Server component — exports page `metadata`, renders the client component |
| — | `frontend/src/app/resume/ResumeClient.tsx` | Client component — data fetching, states, preview, actions |

## Data Source
`GET /api/hero` via the shared [`useResume()`](../../frontend/src/lib/resume.ts) hook (`HeroContent.resumeUrl` + `updatedAt`). No page-specific endpoint; same record the Hero section and admin settings use. The hook caches at module level, so repeat visits within a session don't refetch and concurrent consumers share one request.

## Layout
Standard public-page shell (`Navbar` → `main` → `Footer`) with the same header pattern as `/certifications`:
1. **Header band** (`--bg-2`): eyebrow "Portfolio · Resume", h1, subtitle built from the hero name and roles.
2. **Content grid** (`.resume-grid`, 1.6fr/1fr, single column below 768px):
   - **Preview card** — `ResumePreview` component driven by the dedicated `HeroContent.resumePreviewUrl` (independent from the download URL — see [`../features/resume-preview.md`](../features/resume-preview.md)): iframe with loading skeleton, reachability probe + 15 s timeout for failure, fallback note when missing/invalid.
   - **Actions card** — primary **Download Resume** (accent, `fl_attachment` URL for Cloudinary) and outline **Open in New Tab**.
   - **Metadata card** — "Last updated {date}" from `HeroContent.updatedAt` via `fmtFullDate`.

## States
| State | Trigger | UI |
|---|---|---|
| Loading | Fetch in flight | Two pulse-skeleton blocks (`aria-busy`) |
| Error | Fetch failed / network down | Status card + **Try again** button (retries in place, no reload) |
| Missing | `resumeUrl` empty or invalid | "Resume not available yet" card + **Contact me** link to `/#contact` |
| Ready | Valid URL | Preview + actions + metadata |

## Accessibility
- Semantic structure: `main`, single `h1`, `h2` on cards; `role="status"` on state cards.
- All actions are real links/buttons with `aria-label`s ("Download resume", "Open resume in a new tab").
- Focus states mirror hover states (`onFocus`/`onBlur` handlers); everything is keyboard reachable.
- Animations use the site-wide framer-motion config, which respects `prefers-reduced-motion` via the `MotionConfig reducedMotion="user"` wrapper in `ThemeProvider`.

## Theming & Responsiveness
All colors come from CSS variables (`--bg`, `--bg-2`, `--accent`, `--border`, …), so dark/light theme works automatically. The grid collapses to one column below 768px; verified at 375×812 and desktop widths.

## SEO
- `metadata` export: title "Resume — Abir Barman" + description.
- Added to `frontend/src/app/sitemap.ts` (priority 0.8, monthly).

## Related
- [`../features/resume-system.md`](../features/resume-system.md)
- [`../components/resume-button.md`](../components/resume-button.md)
- [`../architecture/resume-architecture.md`](../architecture/resume-architecture.md)
