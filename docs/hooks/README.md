# Hooks

**No custom hooks exist in this codebase.** Confirmed by the 2026-07 audit: no `hooks/` directory, no `use*.ts`/`use*.tsx` files anywhere under `frontend/src`.

## Why this is documented as a gap, not just silence

All stateful logic is inlined directly in components via `useState`/`useEffect`/`useCallback`. The most visible cost of this is in the ~13 admin pages under `frontend/src/app/admin/*/page.tsx`, which each re-implement the same shape of logic independently:

- Load data on mount (`useEffect` + `fetch` + `useState`)
- Save/update handlers with loading state
- Toast/success/error feedback state
- Add/remove-from-array helpers for list fields (e.g. notification recipient emails)

This is tracked as [technical debt item #9](../appendices/technical-debt-register.md) — extracting shared hooks like `useAdminResource<T>()` (generic load/save/delete against a REST resource) and `useToast()` would remove most of this duplication.

## If/when hooks are introduced

- Create `frontend/src/hooks/`.
- One hook per file, `camelCase` starting with `use`, matching the component convention of one-export-per-file.
- Document each with [`../templates/hook-template.md`](../templates/hook-template.md).
- Update [`../architecture/state-management.md`](../architecture/state-management.md) and this file to reflect the new reality — don't let this "no hooks exist" claim go stale once it's no longer true.

## Related
- [`../architecture/state-management.md`](../architecture/state-management.md)
- [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #9
