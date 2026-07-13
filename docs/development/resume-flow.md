# Development Guide: Resume Flow

How resume data moves through the system, and how to work on it without breaking the single-source-of-truth rule.

## End-to-end flow

```
Admin edits Resume URL (/admin/settings)
  → client validation (isValidResumeUrl; save blocked if invalid)
  → PUT /api/hero (JWT) → backend validation (400 if invalid) → Prisma update
      HeroContent.resumeUrl + updatedAt persisted
          ↓ (no cache invalidation needed)
  Next visitor request:
    • Home page: server fetch /hero (no-store) → Hero props → Hero button
    • /resume: useResume() client fetch /hero (no-store) → actions (resumeUrl)
      + preview iframe (resumePreviewUrl — independent field, see
        docs/features/resume-preview.md)
    • Navbar: static <Link href="/resume"> — never fetches
```

## Files you'll touch

| Concern | File |
|---|---|
| Validation / transform / hook | `frontend/src/lib/resume.ts` |
| Resume page | `frontend/src/app/resume/page.tsx`, `frontend/src/app/resume/ResumeClient.tsx` |
| Navbar buttons | `frontend/src/components/Navbar.tsx` |
| Hero CTA | `frontend/src/components/sections/Hero.tsx` |
| Admin field | `frontend/src/app/admin/settings/page.tsx` (Hero Content card) |
| API + validation | `backend/src/routes/hero.ts` |
| Types | `frontend/src/lib/types.ts` (`HeroContent`) |
| Sitemap entry | `frontend/src/app/sitemap.ts` |

## Rules
1. **Never hardcode a resume URL** — components, constants, env vars, anywhere.
2. **Never add a second resume field** — extend `HeroContent` (or a future dedicated model) via migration if more metadata is needed.
3. **New download surfaces** must go through `isValidResumeUrl` + `resumeDownloadUrl`; new navigation surfaces link to `/resume`.
4. Keep `useResume()` the only client fetcher — it deduplicates and caches; a second fetcher reintroduces duplicate requests.

## Testing checklist
- `cd frontend && npx tsc --noEmit && npm run lint && npm run build`
- `cd backend && npx tsc --noEmit`
- Manual states on `/resume`: loading skeleton, missing (empty `resumeUrl`), network error (+ Try again recovery), populated (preview, download, open-in-tab, last-updated).
- Navbar: desktop button navigates + shows active state on `/resume`; mobile drawer link navigates and closes the drawer.
- Admin: invalid URL shows inline error and blocks save; valid URL shows "Open resume ↗".
- Duplicate-request check: exactly one `GET /api/hero` from a `/resume` page load (DevTools Network tab).

## Gotchas
- The `download` attribute silently does nothing cross-origin — that's why Cloudinary URLs are rewritten with `fl_attachment` and non-Cloudinary anchors keep `target="_blank"`.
- `HeroContent.updatedAt` changes when *any* hero field is saved, not just the resume URL — "Last updated" on `/resume` is an approximation.
- The `useResume` cache is module-scoped: an admin updating the URL won't see the change on `/resume` in the *same SPA session* until a full page load. Acceptable by design; don't "fix" it with a context unless a real use case appears.
