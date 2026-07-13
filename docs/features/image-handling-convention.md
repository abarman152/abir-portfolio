# Feature: Image Handling Convention

## Purpose
Documents how images actually work in this codebase: every image field across every content model is a plain HTTPS URL text input. There is no upload widget, no file storage integration, and — despite naming/placeholder text suggesting otherwise — no real Cloudinary integration.

## Business Value
Zero image-hosting infrastructure cost or maintenance burden; the site owner hosts images wherever they like (Cloudinary's free tier is the suggested option, but nothing enforces it) and simply pastes the resulting URL into an admin form field.

## User Flow
1. Admin uploads an image to any HTTPS-accessible host of their choice — Cloudinary is suggested by convention (placeholder text in admin forms references Cloudinary URL formats) but not required or validated.
2. Admin pastes the resulting URL into the relevant admin form field (e.g. `imageUrl`, `bannerImageUrl`, `avatarUrl`, `screenshots[]`).
3. The URL is saved to the database as a plain string — no transformation, no validation of the URL's format or reachability.
4. Public pages render the URL directly via `<img src={url}>` (most detail pages) or `next/image` (a few places, e.g. [`ThemeLogo`](../components/shared/ThemeLogo.md), [`Hero`](../components/sections/Hero.md)'s badge icons are Lucide components not images) — see the Limitations section below for which is used where.

## Architecture
`next.config.ts` sets `remotePatterns: [{ protocol: 'https', hostname: '**' }]` — this is what makes "any HTTPS host" actually work with Next.js's image pipeline (for the handful of places that do use `next/image`); for the many places using a plain `<img>` tag, this config is irrelevant since `next/image`'s domain allowlisting doesn't apply to plain `<img>` at all.

## Dependencies
None — this is the explicit absence of a dependency (no `cloudinary` SDK, no `next-cloudinary`, no upload widget package) that makes this worth documenting as its own convention rather than a wired-up integration.

## Components
Every admin form with an image field (Hero avatar, Project cover/banner/screenshots/result images, Certification image/badge, Achievement images, About profile photos) uses a plain `<input type="text">` or `<input type="url">` for the URL — not a file picker, not a drag-and-drop zone.

## Files
No dedicated files — this is a convention observed across nearly every admin form and public-facing image render, not a single feature module. Representative touchpoints:

| File | Role |
|---|---|
| `frontend/next.config.ts` | `remotePatterns: **` — allows any HTTPS image host through `next/image` |
| `backend/prisma/schema.prisma` | Every `*Url`/`images`/`screenshots` field is `String`/`String[]`, not a file/blob reference |
| `frontend/src/app/admin/*/page.tsx` | Plain text inputs for every image field, with Cloudinary-format placeholder text as a suggestion only |

## Edge Cases
- **Broken/dead URL:** no validation at write time or read time — a dead link simply renders as a broken image icon in the browser; there's no fallback/placeholder image logic beyond a few components that conditionally render an initials-avatar placeholder when the URL field is empty (e.g. [`Hero`](../components/sections/Hero.md) and [`AboutPageContent`](../components/sections/AboutPageContent.md) both show a two-letter initials circle if no image URL is set — this only triggers on an *empty* field, not a broken/unreachable one).
- **Non-HTTPS URL:** `next.config.ts` only allows `https`, so an `http://` URL pasted into an admin field will fail to load via `next/image` (where used) — but plain `<img>` tags don't enforce this at all, so the same broken-http-url could still "work" (subject to browser mixed-content blocking) in the many places using plain `<img>`.

## Limitations
- **Inconsistent image rendering between `next/image` and plain `<img>`** across the codebase — most detail-page galleries/banners (project, certification, achievement) and the [`Hero`](../components/sections/Hero.md) profile photo use plain `<img>`, forgoing Next.js's automatic responsive `srcset`/format optimization. Only [`ThemeLogo`](../components/shared/ThemeLogo.md) consistently uses `next/image`. See individual page/component docs under [`../pages/`](../pages/) and [`../components/`](../components/) for the specific choice at each location.
- **No image optimization, resizing, or format conversion happens server-side** — whatever the admin pastes is exactly what's served, at whatever resolution/format the source host provides.
- **No upload UI at all** — an admin without a separate image-hosting workflow (Cloudinary account, GitHub-hosted images, etc.) cannot add images through this admin panel alone.

## Future Enhancements
[`appendices/audit-report.md`](../appendices/audit-report.md)'s open items list this explicitly: "Decide whether to build real Cloudinary integration or formally drop it — currently it's neither built nor removed from `.env.example`." See also [`../architecture/cms-flow.md`](../architecture/cms-flow.md) and [`../architecture/overview.md`](../architecture/overview.md) for the same note.

## Testing Strategy
Manual only — there is no automated check that a pasted URL is reachable or well-formed.
