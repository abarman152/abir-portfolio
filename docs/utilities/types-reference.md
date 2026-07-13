# Utility: Shared Types Reference

**File:** `frontend/src/lib/types.ts` (296 lines)

## Purpose
Central location for every TypeScript interface shared across the frontend — content models (`Project`, `Research`, `Certification`, `Achievement`, `Skill`, `Stat`, etc.), their list-response envelopes, and admin-only models (`ContactMessage`, `NotificationSettings`).

This doc summarizes the interfaces rather than reproducing all 296 lines — read the file directly for exact field lists when writing code against it.

## Signature
Not a function — a pure type-definition module. No runtime code, no default export; every type is a named `export interface`.

## Contents (grouped)

| Group | Interfaces |
|---|---|
| Hero | `HeroContent`, `HeroBadge`, `HeroConfig` |
| Social | `SocialLink` |
| Projects | `Project`, `ProjectsResponse` |
| Research | `Research`, `ResearchAuthor`, `ResearchListResponse` |
| Certifications | `Certification`, `CertificationListResponse` |
| Achievements | `Achievement` |
| Skills | `Skill`, `SkillCategory`, `SkillCategoryWithSkills`, `SkillsResponse` |
| Stats | `Stat` |
| Site settings | `SiteSettings`, `AboutConfig` |
| About page | `AboutProfile`, `Education`, `AboutSkillGroup`, `AboutCategory`, `AboutSectionData` |
| Contact / admin | `ContactMessage`, `NotificationSettings` |

## Relationship to the database schema
Every interface here is **hand-maintained** to mirror a Prisma model in `backend/prisma/schema.prisma` — see [`../database/schema-reference.md`](../database/schema-reference.md) for the canonical schema. There is no code generation step (no `prisma-client-js` type reuse, no OpenAPI/GraphQL codegen) linking the two; a developer must manually keep this file in sync whenever the Prisma schema changes.

This is a **confirmed drift risk**, not a stable convention — see [`appendices/audit-report.md`](../appendices/audit-report.md) item 9 ("Centralized in `frontend/src/lib/types.ts`... Hand-maintained and duplicates the Prisma schema rather than being generated from it — drift risk"). When adding or changing a database field, both files must be updated together; nothing enforces this automatically.

A few interfaces already show signs of this drift in practice — e.g. `Skill` includes `categoryId`/`isHighlighted` fields and a separate `SkillCategory`/`SkillCategoryWithSkills` model that represent a category-grouped skills structure, which is a richer shape than the flat `Skill` table documented in [`../database/schema-reference.md`](../database/schema-reference.md). Treat any such mismatch as a signal to verify against the live Prisma schema before relying on either document alone.

## Usage Example

```ts
import type { Project, ProjectsResponse } from '@/lib/types';

async function getProjects(): Promise<ProjectsResponse> {
  const res = await fetch('/api/projects');
  return res.json(); // asserted as ProjectsResponse, not validated at runtime
}
```

## Edge Cases / Gotchas
- No runtime validation (no Zod schemas mirroring these interfaces on the frontend) — a backend response that doesn't match the declared shape will not throw a type error at runtime; it will simply produce `undefined` field access downstream.
- Several fields are optional/nullable in ways that must match the database exactly (e.g. `Certification.slug: string | null`, `Achievement.slug: string | null`) — both content types support slug-less records, and their listing-page cards render non-interactively when `slug` is absent (see [`../pages/certifications.md`](../pages/certifications.md), [`../pages/achievements.md`](../pages/achievements.md)).

## Related
- [`../database/schema-reference.md`](../database/schema-reference.md) — the canonical source of truth these types should mirror
- [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md)
- [`api-client.md`](./api-client.md) — where these types are used as fetch generics
