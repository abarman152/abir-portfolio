# Known Issues

**Version:** 1.0 · **Date:** 2026-07-06
Cross-references: [bug-audit.md](bug-audit.md) · [technical-debt.md](technical-debt.md)

Open, verified issues that ship with the current release. None are release blockers; each has a documented rationale and owner action.

| ID | Sev | Issue | Impact | Workaround / plan |
|----|-----|-------|--------|-------------------|
| KI-01 | Med | 17 lint errors (`set-state-in-effect`) keep `npm run lint` non-clean | CI lint gates would fail if added later | Tracked as TD-01; rule-level override possible if a lint gate is introduced |
| KI-02 | Med | Public images not optimized via `next/image` (LCP cost on hero) | Slower LCP on image-heavy pages, esp. mobile | TD-02 migration pass |
| KI-03 | **High** | `--text-3` contrast **measured 2.54:1 both themes — confirmed WCAG AA failure** (A11Y-004) | Caption/muted text unreadable for low-vision users | Owner decision: adopt compliant candidates light `#6e7683` / dark `#7d8896` (computed 4.58:1 / 5.33:1) in globals.css |
| KI-04 | Low | Modal focus-trap behavior unverified (A11Y-005) | Keyboard users may escape modal context (admin only) | Runtime verification pre-launch |
| KI-05 | Low | 2 moderate FE dev-chain vulns; 4 low/moderate BE vulns need breaking upgrades | No known runtime exposure | Reassess at next dependency refresh (SEC-007) |
| KI-06 | Low | Dashboard endpoint returns 200 + zeros on DB error (BUG-020) | Admin dashboard can't distinguish empty from failed | Deliberate cold-start fallback (commit 3c78ab4 era); frontend now shows its own error banner for request failures (BUG-015 fix) |
| KI-07 | Low | No skip-to-content link (A11Y-002) | Keyboard users tab through nav on every page | Small follow-up; not blocking |
| KI-08 | Info | `/about` and `/` render dynamically (ƒ) rather than static | Slightly higher TTFB than static pages; mitigated by fetch revalidate + cold-start client recovery | Working as designed for CMS freshness |
| KI-09 | Med | `prisma generate` fails on local Node 20.16 (`ERR_REQUIRE_ESM`, BUG-025) | Fresh backend builds fail locally until Node ≥ 20.19 | `engines` field added; upgrade local Node (nvm install 22); deploy runtimes unaffected |
