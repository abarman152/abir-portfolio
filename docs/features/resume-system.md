# Feature: Resume System (Centralized Download)

## Purpose
One admin-managed resume URL powers every resume touchpoint on the site — the Hero CTA, the navbar button, and the dedicated `/resume` page. There is exactly one source of truth (`HeroContent.resumeUrl` in the database) and zero hardcoded resume links anywhere in the codebase.

## Business Value
Recruiters reach the resume from wherever they land — top navigation, hero, or a direct `/resume` link — and always get the current file. Updating the resume is a single admin field edit; nothing else needs to change or be redeployed.

## User Flow
1. The site owner sets **Resume URL** in `/admin/settings` → Hero Content (validated client- and server-side as an http(s) URL).
2. A visitor clicks **Resume** in the navbar (desktop button or mobile drawer) → navigates to `/resume`.
3. `/resume` fetches the hero record client-side, shows the resume preview (PDF iframe when embeddable), last-updated date, a primary **Download Resume** button, and an **Open in New Tab** button.
4. Alternatively, the visitor clicks **Resume** in the Hero section → direct download of the same file (Cloudinary `fl_attachment` variant when applicable).
5. If no resume URL is set, `/resume` shows a friendly empty state with a contact CTA, and the Hero swaps its Resume button for a Contact button.

## Architecture
- **Data source:** `HeroContent.resumeUrl` (+ `updatedAt` for metadata), served by `GET /api/hero` — the same record the Hero section already uses.
- **Shared module:** [`frontend/src/lib/resume.ts`](../../frontend/src/lib/resume.ts) — URL validation, Cloudinary download-URL transform, embeddability check, and a cached `useResume()` hook (module-level cache + in-flight deduplication so concurrent consumers trigger at most one request).
- **No new backend surface:** the existing `/api/hero` endpoint is reused; the `PUT /api/hero` route gained `resumeUrl` format validation (400 on invalid).

See [`../architecture/resume-architecture.md`](../architecture/resume-architecture.md) for the full diagram and [`../development/resume-flow.md`](../development/resume-flow.md) for the data flow.

## Components
- [`/resume` page](../pages/resume-page.md) — server wrapper (`page.tsx`, metadata) + `ResumeClient.tsx` (states, preview, actions).
- [Resume buttons](../components/resume-button.md) — navbar (desktop + mobile drawer), Hero CTA, and the `/resume` action buttons.
- Admin: the existing **Resume URL** field in `/admin/settings` (Hero Content card), now with inline validation and an "Open resume ↗" preview link.

## Dependencies
None new. Uses existing `fetch`, framer-motion, lucide-react, and the design-system CSS variables.

## Edge Cases Handled
| Case | Behavior |
|---|---|
| Empty resume URL | `/resume` shows "Resume not available yet" + contact CTA; Hero shows Contact button |
| Invalid URL (non-http(s)) | Treated as missing on the public site; admin form blocks save with inline error; backend returns 400 |
| Network failure | `/resume` shows an error card with a working **Try again** retry (no page reload) |
| Non-embeddable file (Drive links etc.) | Preview panel shows a fallback note; Download/Open buttons still work |
| Cross-origin download | Cloudinary URLs get `fl_attachment` injected so the browser downloads instead of rendering inline |

## Known Limitations
- No resume *version* field in the schema — `/resume` shows `updatedAt` of the hero record (which also changes when other hero fields change).
- The `download` attribute is ignored cross-origin for non-Cloudinary hosts; those open in a new tab instead of force-downloading.
- Preview embeds rely on the browser's native PDF viewer; hosts that send `X-Frame-Options: DENY` fall back to the buttons (Google Drive share links are not embedded by design).

## Future Improvements
- Dedicated resume metadata (version label, file size) in the schema.
- Direct file upload to Cloudinary from the admin form instead of pasting a URL.
- Download analytics (count clicks on the download action).
