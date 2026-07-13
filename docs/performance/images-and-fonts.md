# Image & Font Optimization

## Images

- `next/image` is used throughout (confirmed in `ThemeLogo.tsx` and section components), not raw `<img>` — gets automatic format negotiation (WebP/AVIF), responsive `srcset`, and lazy loading by default for below-the-fold images.
- Source images can be any HTTPS URL (`next.config.ts`: `remotePatterns: [{ protocol: 'https', hostname: '**' }]`) — see [`../architecture/overview.md`](../architecture/overview.md) for why this is intentionally permissive rather than a Cloudinary-only allowlist.
- If the admin does use Cloudinary as the convention suggests, apply transformation params manually when pasting the URL (`f_auto,q_auto,w_800,c_fill` etc.) — see [`../features/image-handling-convention.md`](../features/image-handling-convention.md). Next.js's own optimization pipeline still applies on top regardless of the source URL's own transforms.
- `width`/`height`/`sizes` props are used correctly (per the design system guidelines) to prevent CLS.

## Fonts

- `next/font/google` loads Inter (`--font-inter`) and JetBrains Mono (`--font-mono`), both with `display: 'swap'`.
- `display: 'swap'` avoids render-blocking font loads — text renders immediately in a fallback font, then swaps once the webfont loads, at the cost of a brief layout shift on swap (an accepted tradeoff, not a bug).
- Single font family for body text (Inter) — no mixing, per [`../design-system/tokens-and-guidelines.md`](../design-system/tokens-and-guidelines.md).

## Related
- [`../design-system/tokens-and-guidelines.md`](../design-system/tokens-and-guidelines.md)
- [`core-web-vitals-and-checklist.md`](./core-web-vitals-and-checklist.md)
