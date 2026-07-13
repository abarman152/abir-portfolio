# Bug Report — Consolidated

**Version:** 1.0 · **Date:** 2026-07-06
This is the summary view; full per-bug detail (evidence, root cause, verification) lives in [bug-audit.md](bug-audit.md), fixes in [fixes.md](fixes.md).

## Totals

| Status | Count |
|--------|-------|
| Fixed + verified | 16 (BUG-001, 003–016, 018 + a11y quick wins A11Y-001/003/006) |
| False positives closed | 2 (BUG-005 root-cause corrected, BUG-017) |
| Open — accepted as known issues | 8 (KI-01…KI-08) |
| Open — technical debt | 10 (TD-01…TD-10) |

## By severity (discovered)

| Severity | Found | Fixed | Remaining |
|----------|-------|-------|-----------|
| Critical | 1 (BUG-010 port mismatch) | 1 | 0 |
| High | 8 | 8 (BUG-001, 008, 009, 011, 012, 013, 015, 016) | 0 |
| Medium | ~12 | 4 | 8 (documented KI/TD) |
| Low | ~10 | 3 | 7 (documented KI/TD) |

## By category

- **Security:** brute-force exposure, setup validation, error-handler leak, 12 dependency vulns → all fixed; 0 high-severity vulns remain. See [security-audit.md](security-audit.md).
- **Correctness/state:** Sidebar remount bug, dashboard silent failure, timer leaks, port mismatch → fixed.
- **UX/error states:** missing 404/500/loading pages → added.
- **Accessibility:** reduced-motion, icon labels, live region → fixed; contrast + focus-trap verification pending runtime. See [accessibility-audit.md](accessibility-audit.md).
- **Performance:** 13 unused deps removed; image pipeline is the main open item. See [performance-audit.md](performance-audit.md).
- **SEO:** see [seo-audit.md](seo-audit.md).

## Notable corrections made during triage

Two subagent findings were rejected after evidence checks (Express 5 async semantics; HomePageClient cleanup) and one lint finding was reclassified as a false positive (lucide `Image` icon). Details in [docs/memory/](memory/).
