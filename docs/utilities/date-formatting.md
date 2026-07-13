# Utility: `fmtMonthYear` / `fmtMonthYearShort` / `fmtFullDate`

**File:** `frontend/src/lib/date.ts`

## Purpose
Deterministic, locale-independent date formatting for content dates (research publish dates, certification issue dates, achievement dates) rendered during SSR.

## Signature

```ts
function fmtMonthYear(iso: string): string;       // "January 2025"
function fmtMonthYearShort(iso: string): string;  // "Jan 2025"
function fmtFullDate(iso: string): string;        // "January 15, 2025"
```

## Parameters

| Param | Type | Description |
|---|---|---|
| `iso` | `string` | An ISO 8601 date string (as returned by the API/Prisma, e.g. `Research.publishedAt`, `Certification.issueDate`, `Achievement.date`) |

## Returns
A formatted date string built from hardcoded `MONTHS_LONG`/`MONTHS_SHORT` arrays and `Date.getUTCMonth()`/`getUTCDate()`/`getUTCFullYear()` — **not** `Intl.DateTimeFormat` or `toLocaleDateString()`.

## Usage Example

```ts
import { fmtMonthYear, fmtFullDate } from '@/lib/date';

fmtMonthYear('2025-01-15T00:00:00.000Z');   // "January 2025"
fmtFullDate('2025-01-15T00:00:00.000Z');    // "January 15, 2025"
```

## Edge Cases / Gotchas
- **Why UTC-only, not locale-based:** these functions are called from Server Components during SSR. `toLocaleDateString()` would format according to the server's runtime locale/timezone, which can silently differ between the build environment, the Render server, and a visitor's expectations — producing a hydration mismatch if the client ever re-renders the same date differently. Reading `getUTCMonth()`/`getUTCDate()`/`getUTCFullYear()` directly sidesteps both the locale and timezone-offset problem entirely, at the cost of always rendering in English and UTC regardless of visitor locale.
- **Malformed input does not throw** — each function wraps its body in `try { ... } catch { return iso; }`, so an invalid/unparseable `iso` string is returned unchanged rather than throwing or producing `"Invalid Date"`. Callers relying on a formatted string being human-readable should be aware a bad input silently degrades to the raw ISO string instead.
- No relative-time formatting ("3 days ago") anywhere in this file or the codebase.

## Related
- Used by [`ProjectDetail`](../pages/projects-detail.md), [`ResearchDetail`](../pages/research-detail.md), [`CertDetail`](../pages/certifications-detail.md), [`AchievementDetail`](../pages/achievements-detail.md), and their respective listing pages (issue/publish date display).
- [`types-reference.md`](./types-reference.md) — the `string` (ISO date) fields these functions consume
