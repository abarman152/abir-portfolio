# Components

One doc per component, grouped by the same subdirectories used in `frontend/src/components/` — see [`../architecture/folder-architecture.md`](../architecture/folder-architecture.md) and [`../architecture/component-hierarchy.md`](../architecture/component-hierarchy.md) for how these compose. See [`../templates/component-template.md`](../templates/component-template.md) for the structure each doc follows.

## `sections/` — full-page section components

Rendered by public pages (mostly the homepage — see [`../pages/home.md`](../pages/home.md)).

| Component | Doc |
|---|---|
| `About.tsx` | [`sections/About.md`](./sections/About.md) |
| `AboutPageContent.tsx` | [`sections/AboutPageContent.md`](./sections/AboutPageContent.md) |
| `Achievements.tsx` | [`sections/Achievements.md`](./sections/Achievements.md) |
| `Certifications.tsx` | [`sections/Certifications.md`](./sections/Certifications.md) |
| `Contact.tsx` | [`sections/Contact.md`](./sections/Contact.md) |
| `Hero.tsx` | [`sections/Hero.md`](./sections/Hero.md) |
| `Impact.tsx` | [`sections/Impact.md`](./sections/Impact.md) — **unused/dead code, not rendered anywhere** |
| `Projects.tsx` | [`sections/Projects.md`](./sections/Projects.md) |
| `Research.tsx` | [`sections/Research.md`](./sections/Research.md) |
| `Skills.tsx` | [`sections/Skills.md`](./sections/Skills.md) |
| `Stats.tsx` | [`sections/Stats.md`](./sections/Stats.md) |

## `admin/` — admin panel components

| Component | Doc |
|---|---|
| `AdminShell.tsx` | [`admin/AdminShell.md`](./admin/AdminShell.md) — where the client-side auth guard actually lives, see [`../architecture/authentication-flow.md`](../architecture/authentication-flow.md) |
| `AdminTable.tsx` | [`admin/AdminTable.md`](./admin/AdminTable.md) |
| `Modal.tsx` | [`admin/Modal.md`](./admin/Modal.md) |

## `ui/` — reusable design-system primitives

| Component | Doc |
|---|---|
| `PaperCard.tsx` | [`ui/PaperCard.md`](./ui/PaperCard.md) — **the only UI primitive in the design system** |

## `shared/` — root-level components used across public site and admin

| Component | Doc |
|---|---|
| `Footer.tsx` | [`shared/Footer.md`](./shared/Footer.md) |
| `HomePageClient.tsx` | [`shared/HomePageClient.md`](./shared/HomePageClient.md) |
| `Navbar.tsx` | [`shared/Navbar.md`](./shared/Navbar.md) |
| `ThemeLogo.tsx` | [`shared/ThemeLogo.md`](./shared/ThemeLogo.md) — the one component genuinely shared across the public/admin boundary |
| `ThemeProvider.tsx` | [`shared/ThemeProvider.md`](./shared/ThemeProvider.md) |

## Related
- [`../architecture/component-hierarchy.md`](../architecture/component-hierarchy.md)
- [`../architecture/folder-architecture.md`](../architecture/folder-architecture.md)
- [`../hooks/README.md`](../hooks/README.md) — no custom hooks exist; all component state is inlined
- [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md)
