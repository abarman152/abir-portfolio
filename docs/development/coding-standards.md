# Coding Standards

The authoritative, exhaustive rulebook for this codebase is [`frontend/AGENTS.md`](../../frontend/AGENTS.md) — written to govern both human and AI-agent contributions. This doc is a summary plus the corrections found during the 2026-07 audit (see [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) for where `AGENTS.md` and reality currently disagree).

## TypeScript

- Strict mode in both `frontend/tsconfig.json` and `backend/tsconfig.json`.
- `any` is prohibited — all props, params, and returns must be typed.
- Shared frontend types live in `frontend/src/lib/types.ts` (see [`../utilities/types-reference.md`](../utilities/types-reference.md)). The backend has no shared types file — it infers from Prisma-generated types directly.

## Component conventions

- One component per file; filename matches the default export.
- `'use client'` only on components that use browser APIs, state, or event handlers — everything else stays a Server Component by default.
- CSS variables for all colors — never raw hex values in component files (see [`../design-system/tokens-and-guidelines.md`](../design-system/tokens-and-guidelines.md)).
- All content comes from the database — never hardcode display text in components.

## Comments

Default to none. See [`../standards/comment-standards.md`](../standards/comment-standards.md) for the full rule and examples — this codebase already follows it closely (zero `TODO`/`FIXME` comments found in the audit).

## Known deviations from the documented standard (fix the doc or fix the code — tracked, not silently ignored)

- `AGENTS.md` describes Zod validation as mandatory server-side; the backend actually validates manually (regex/length checks). See [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #4.
- `AGENTS.md` describes a `{ data, error }` response envelope; routes actually return raw success payloads. See item #2.
- `AGENTS.md` says "no inline styles unless unavoidable"; admin pages use inline `style={{ }}` objects almost exclusively. See item #10.

Until one of these is resolved (either the code is changed to match `AGENTS.md`, or `AGENTS.md` is updated to match the code), follow the **actual code convention** for consistency with existing files, not the aspirational one in `AGENTS.md`.

## Linting & formatting

- Frontend: ESLint 9 with `eslint-config-next` — run `npm run lint` inside `frontend/`.
- Backend: no linter configured. This is a real gap — see [`../roadmap/future-documentation-roadmap.md`](../roadmap/future-documentation-roadmap.md).
- No Prettier config found in either workspace — formatting relies on editor defaults / ESLint's formatting rules only.

## Related
- [`frontend/AGENTS.md`](../../frontend/AGENTS.md) — full rulebook
- [`../standards/comment-standards.md`](../standards/comment-standards.md)
- [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md)
