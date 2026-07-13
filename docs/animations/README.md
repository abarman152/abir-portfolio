# Animations

Full detail lives in [`../architecture/animation-architecture.md`](../architecture/animation-architecture.md) — not duplicated here, to avoid two copies of the same rules drifting apart. This file exists so the directory named in the documentation architecture isn't empty.

## Quick facts

- Framer Motion is the entire real animation stack — `@react-three/fiber`/`@react-three/drei`/`three` are unused dependencies despite being listed in the README's tech stack table (see [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #6).
- Timing/easing rules live in [`../design-system/tokens-and-guidelines.md`](../design-system/tokens-and-guidelines.md).
- Page transitions are implemented via `app/template.tsx`, not a layout — see [`../layouts/page-transition-template.md`](../layouts/page-transition-template.md).

## Related
- [`../architecture/animation-architecture.md`](../architecture/animation-architecture.md)
- [`../design-system/tokens-and-guidelines.md`](../design-system/tokens-and-guidelines.md)
