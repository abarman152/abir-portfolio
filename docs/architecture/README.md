# Architecture

Start with [`overview.md`](./overview.md) for the high-level picture, then go to the specific doc you need:

| Doc | Covers |
|---|---|
| [`overview.md`](./overview.md) | Stack, layer boundaries, monorepo layout, CORS |
| [`folder-architecture.md`](./folder-architecture.md) | Annotated folder structure |
| [`routing-architecture.md`](./routing-architecture.md) | Full route table |
| [`component-hierarchy.md`](./component-hierarchy.md) | Composition trees, public + admin |
| [`rendering-strategy.md`](./rendering-strategy.md) | SSR/revalidation, homepage double-fetch |
| [`state-management.md`](./state-management.md) | Why no Redux/Zustand; what state exists |
| [`theme-architecture.md`](./theme-architecture.md) | Dark/light resolution, FOUC prevention |
| [`resume-architecture.md`](./resume-architecture.md) | Centralized resume URL: single source of truth, caching, validation layers |
| [`animation-architecture.md`](./animation-architecture.md) | Framer Motion conventions |
| [`authentication-flow.md`](./authentication-flow.md) | Login, JWT verification, route guard location |
| [`cms-flow.md`](./cms-flow.md) | Content authoring → API → DB → public site |
| [`research-management-flow.md`](./research-management-flow.md) | One content type traced end-to-end |
| [`deployment-architecture.md`](./deployment-architecture.md) | Vercel + Render + Supabase topology |
| [`performance-architecture.md`](./performance-architecture.md) | Architecture-level performance characteristics |
| [`security-architecture.md`](./security-architecture.md) | Trust boundaries |
| [`future-architecture.md`](./future-architecture.md) | Every open architectural decision/improvement |

See [`../standards/architecture-documentation-rules.md`](../standards/architecture-documentation-rules.md) for how these are written and maintained, and [`../diagrams/`](../diagrams/) for the diagram-source conventions.
