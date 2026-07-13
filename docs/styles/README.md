# Styles

Tailwind CSS 4 + CSS custom properties. The full token/typography/animation rulebook lives in [`../design-system/tokens-and-guidelines.md`](../design-system/tokens-and-guidelines.md) — this file exists as the expected `/docs` directory name from the documentation architecture; content is not duplicated here to avoid drift between two copies of the same rules.

## Quick facts

- All colors via CSS variables defined in `frontend/src/app/globals.css` — never raw hex in component files. See [`../development/coding-standards.md`](../development/coding-standards.md).
- Tailwind utility classes for spacing/layout — no custom spacing scale.
- Public pages use Tailwind; admin pages currently use inline `style={{ }}` objects — a documented inconsistency, see [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #10.

## Related
- [`../design-system/tokens-and-guidelines.md`](../design-system/tokens-and-guidelines.md)
- [`../architecture/theme-architecture.md`](../architecture/theme-architecture.md)
- [`../architecture/animation-architecture.md`](../architecture/animation-architecture.md)
