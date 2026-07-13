# Feature: Markdown Content Rendering

## Purpose
Renders the rich-text fields of four content types — `Project.overviewMd`/`problem`/`result`, `Research.overviewMd`, `Certification.overviewMd`, `Achievement.overviewMd` — as formatted HTML on their respective public detail pages, using `react-markdown` + `remark-gfm`.

## Business Value
Lets the admin write formatted content (headings, lists, links, code blocks, tables) in admin form textareas using plain Markdown syntax, without needing a WYSIWYG editor or any HTML knowledge.

## User Flow
1. Admin types Markdown into a plain `<textarea>` in the relevant admin form (e.g. `/admin/projects`'s Overview/Problem/Result fields) — there is no live preview toggle in the admin UI despite `AGENTS.md` §10.4 stating "Markdown fields must have a live preview toggle."
2. The raw Markdown string is saved to the database as-is (`String` column, no HTML pre-conversion).
3. On the public detail page, the field is passed to a shared internal `Md` wrapper component (defined separately, near-identically, in each of the four detail page files) that renders `<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>`.
4. A shared `.md-body` CSS class (also duplicated near-identically across all four detail pages' inline `<style>` blocks) applies consistent typography to the rendered output.

## Architecture
Purely a rendering-time concern — there is no Markdown-to-HTML conversion step anywhere except at render time, in the browser, via `react-markdown`. The database always stores raw Markdown text.

## Dependencies
`react-markdown`, `remark-gfm` (frontend only). No `rehype-raw` despite `AGENTS.md` §9.2 mentioning it as an expected pairing — raw HTML embedded in a Markdown field will not be rendered as HTML by this pipeline (it'll show as escaped text), which is actually a safer default than what `AGENTS.md` describes, since `rehype-raw` would require a sanitization pass to be safe against XSS.

## Components
No shared component exists for this — each of the four detail pages ([`ProjectDetail`](../pages/projects-detail.md), [`ResearchDetail`](../pages/research-detail.md), [`CertDetail`](../pages/certifications-detail.md), [`AchievementDetail`](../pages/achievements-detail.md)) defines its own internal `Md` wrapper function and its own copy of the `.md-body` CSS block. This is a confirmed duplication, not a shared utility, despite the near-identical implementation in all four places.

## Files

| File | Role |
|---|---|
| `frontend/src/app/projects/[slug]/ProjectDetail.tsx` | Renders `overviewMd`, `problem`, `result` |
| `frontend/src/app/research/[slug]/ResearchDetail.tsx` | Renders `overviewMd` |
| `frontend/src/app/certifications/[slug]/CertDetail.tsx` | Renders `overviewMd` |
| `frontend/src/app/achievements/[slug]/AchievementDetail.tsx` | Renders `overviewMd` |

## Edge Cases
- **Empty Markdown field:** each detail page checks `.trim().length > 0` before rendering the section at all — an empty `overviewMd` simply omits that section rather than rendering an empty container.
- **`Project.problem`/`Project.result` character limits:** these two fields specifically support an admin-configured `problemCharLimit`/`resultCharLimit` — the detail page truncates the raw Markdown string at that character count (not HTML-aware truncation, so a truncation mid-Markdown-syntax is possible, e.g. cutting off mid-link-syntax) and shows a "Read more" expand toggle. No other content type/field has this truncation mechanism.

## Limitations
- **No sanitization pass beyond `react-markdown`'s own defaults** — confirmed in code; there is no `dompurify` or equivalent explicit sanitizer layer. Since raw HTML isn't rendered (no `rehype-raw`), the practical XSS surface is limited to what `remark-gfm`-parsed Markdown can express (links, emphasis, tables, etc.), not arbitrary script injection — but this hasn't been independently security-reviewed beyond that observation. See [`../architecture/cms-flow.md`](../architecture/cms-flow.md), which references this same point.
- **No live preview in the admin UI** — contradicts `AGENTS.md` §10.4's stated requirement; admins must save and view the public page to see the rendered result.
- **The `Md` wrapper and `.md-body` CSS are duplicated four times** rather than extracted into a shared component — a direct consequence of there being no shared `ui/` primitives beyond [`PaperCard`](../components/ui/PaperCard.md) (which doesn't render Markdown).

## Future Enhancements
Extracting a shared `<MarkdownBody>` component (wrapping `ReactMarkdown` + the `.md-body` styles) would remove the four-way duplication; not currently tracked as a numbered debt item, though it's the same category of gap noted for `ui/` primitives in [`../components/ui/PaperCard.md`](../components/ui/PaperCard.md).

## Testing Strategy
Manual only.
