# Feature: Resume Preview

## Purpose
The `/resume` page's inline preview is driven by a dedicated **Resume Preview URL** — independent from the Resume (download) URL. This lets the download point at a direct file (Cloudinary PDF, Drive download link) while the preview points at an embed-friendly viewer (Google Drive `/preview`).

## Data Flow

```
Admin → /admin/settings → Hero Content → "Resume Preview URL"
  → client validation + embeddability hints
  → PUT /api/hero (400 if not http(s) or empty)
  → HeroContent.resumePreviewUrl (Prisma)
      ↓
/resume → useResume() → <ResumePreview previewUrl={hero.resumePreviewUrl}>
```

Strict URL separation on the page:

| Control | URL used |
|---|---|
| Preview iframe | `resumePreviewUrl` |
| Download Resume | `resumeUrl` (via `resumeDownloadUrl()`) |
| Open in New Tab | `resumeUrl` |

## Component
`ResumePreview` (in `frontend/src/app/resume/ResumeClient.tsx`) renders the iframe with four states:

| State | Trigger | UI |
|---|---|---|
| Loading | iframe mounting | Pulse skeleton overlay on the preview card |
| Ready | iframe `load` fired | Embedded document |
| Failed | reachability probe rejects, `onerror`, or 15 s timeout | Fallback note; buttons unaffected |
| Missing / invalid | empty or non-http(s) URL | "No inline preview has been set up yet" note |

**Failure detection:** browsers fire `load` even for network-error iframe pages, so a `fetch(url, { method: 'HEAD', mode: 'no-cors' })` probe runs alongside — it rejects only on genuine network failures (DNS, refused connection) and flips the state to failed. A 15 s timeout catches hanging hosts.

## Admin Configuration
1. **/admin/settings → Hero Content → Resume Preview URL**.
2. Paste an embeddable URL. For Google Drive: open the file's share link and replace the trailing `/view?usp=…` with `/preview` (e.g. `https://drive.google.com/file/d/<id>/preview`).
3. Validation messages:
   - non-http(s) → red error, save blocked (backend also 400s);
   - Drive `/view` or `/edit` link → amber hint with the corrected `/preview` URL;
   - other valid-but-unknown hosts → amber "may not render in an embedded preview" hint (still saveable);
   - known-good URL → "Open preview ↗" check link.

## Validation Helpers (`frontend/src/lib/resume.ts`)
- `isLikelyEmbeddablePreview(url)` — known-good iframe sources: Drive `/preview`, `docs.google.com`, Cloudinary upload URLs, direct `.pdf`.
- `previewUrlHint(url)` — admin-facing guidance string or `null` when the URL looks fine.
- `isValidResumeUrl(url)` — shared http(s) gate (same as the download URL).

## Supported Providers
| Provider | Works | Notes |
|---|---|---|
| Google Drive `/preview` | ✅ | Recommended; file must be shared "Anyone with the link" |
| Direct PDF URL / Cloudinary | ✅ | Uses the browser's native PDF viewer |
| Google Docs viewer (`docs.google.com`) | ✅ | |
| Drive `/view` share links | ❌ | Blocked by Drive's `X-Frame-Options`; admin hint auto-suggests the `/preview` form |
| Arbitrary sites | ⚠️ | Render only if the host allows framing |

## Known Limitations
- A host that returns HTTP 200 but blocks framing via `X-Frame-Options`/CSP is undetectable from JavaScript — the panel can appear blank until the 15 s timeout in some browsers. The probe only catches network-level failures.
- Drive previews require the file to be publicly shared; a permission-gated file shows Drive's "request access" screen inside the frame.
- The probe's `HEAD` request is opaque (`no-cors`), so HTTP error codes (404/500) resolve successfully and can't mark the preview failed.

## Future Improvements
- Server-side embeddability check (fetch headers from the backend, where `X-Frame-Options` is readable).
- Auto-derive the preview URL from a Drive download URL (and vice versa) in the admin form.

## Related
- [`resume-system.md`](./resume-system.md)
- [`../pages/resume-page.md`](../pages/resume-page.md)
- [`../architecture/resume-architecture.md`](../architecture/resume-architecture.md)
