# Accessibility Audit (WCAG 2.2)

**Version:** 1.0 · **Date:** 2026-07-06 · Static code analysis against WCAG 2.2 AA
Cross-references: [bug-audit.md](bug-audit.md) · [fixes.md](fixes.md) · [technical-debt.md](technical-debt.md)

## Executive summary

Foundations are decent: pages use `<main>` landmarks, the contact form has real visible `<label>` elements (not placeholder-only), and 11 `aria-label` usages cover several icon controls. The notable gaps are: no skip-to-content link, only one `prefers-reduced-motion` reference across a heavily framer-motion-animated site (AGENTS.md §7.1 requires respecting it), and icon-only buttons in the admin shell and mobile navigation that lack accessible names. Two `jsx-a11y` warnings from the baseline were confirmed as false positives (lucide `Image` icon) and resolved by import aliasing (BUG-005).

## Findings

| ID | Sev | WCAG | Location | Evidence | Recommendation |
|----|-----|------|----------|----------|----------------|
| A11Y-001 | High | 2.3.3 / 2.2.2 (Animation) | Site-wide framer-motion usage; only 1 `prefers-reduced-motion`/`useReducedMotion` reference found in frontend/src | Users with vestibular disorders get full entry/hover animations regardless of OS setting | Wrap site in `<MotionConfig reducedMotion="user">` in the root layout's client tree — single-point fix |
| A11Y-002 | Med | 2.4.1 (Bypass Blocks) | `app/layout.tsx`, `components/Navbar.tsx` | No skip-to-content link found | Add visually-hidden skip link targeting `<main>` |
| A11Y-003 | Med | 4.1.2 (Name, Role, Value) | `AdminShell.tsx:196-205` (hamburger/close, theme toggle), pagination arrow buttons on list pages | Icon-only `<button>` elements without `aria-label` (11 aria-labels exist elsewhere, these sites lack them) | Add `aria-label` ("Open menu", "Toggle theme", "Next page", …) |
| A11Y-004 | **High (CONFIRMED)** | 1.4.3 (Contrast) | `globals.css:11` (light `#9ca3af` on `#ffffff`), `globals.css:32` (dark `#4b5563` on `#0b0f17`) | **Measured: 2.54:1 in both themes** — fails AA (4.5:1) and even large-text AA (3:1). Affects caption text (e.g., Contact.tsx:109 labels, empty states) | Compliant candidates preserving the muted look: light `#6e7683` (4.58:1), dark `#7d8896` (5.33:1). Design-token change — owner decision (alters site-wide aesthetics) |
| A11Y-005 | Med | 2.1.2 / 2.4.3 (Focus) | `components/admin/Modal.tsx` | AGENTS.md §8.4 requires focus trap + Escape close; needs runtime verification of both behaviors | Verify; add focus trap if absent (admin-only, lower priority than public findings) |
| A11Y-006 | Low | 3.3.1 (Error Identification) | `Contact.tsx` status messages | Success/error status set visually; no `aria-live` region announced to screen readers | Add `role="status"` / `aria-live="polite"` to the status message container |
| A11Y-007 | Low | 1.3.1 (Headings) | Public list pages | Heading structure appears consistent (h1 per page); not exhaustively verified per page | Spot-check each route in verification phase |
| A11Y-008 | Pass | 1.1.1 (Alt) | Public `<img>` usages inspected carry alt text (e.g., profile preview, project images) | BUG-005 confirmed the two flagged sites were lucide icon false positives, fixed | — |
| A11Y-009 | Pass | 1.3.5 / labels | `Contact.tsx:126-143` | Visible `<label>` elements above each input, placeholders only as hints | — |
| A11Y-010 | Pass | Landmarks | All routed pages | `<main>` present on public pages, error/loading/404 pages included | — |

## Quick wins

1. `MotionConfig reducedMotion="user"` in the root — biggest impact for one line (A11Y-001).
2. `aria-label` on the ~6 icon-only buttons (A11Y-003).
3. Skip link in layout (A11Y-002).
4. `aria-live` on the contact form status (A11Y-006).

## Not audited in this pass

Screen-reader runtime behavior, keyboard-only walkthrough, and measured contrast ratios require a running app; queued in [release-readiness.md](release-readiness.md) as pre-launch verification.
