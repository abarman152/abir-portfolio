# Documentation Index

This is the single source of truth for all **technical** documentation for the Abir Barman portfolio project. Project management (tasks, sprints, roadmap tracking, meeting notes) lives in Notion — see [`notion-vs-markdown.md`](./notion-vs-markdown.md) for the split.

> **Status:** complete as of the 2026-07-03 documentation audit — every directory below is populated, all 896 internal links resolve, and all pre-existing content was corrected against the real codebase (see [`appendices/technical-debt-register.md`](./appendices/technical-debt-register.md)). See [`appendices/documentation-coverage-report.md`](./appendices/documentation-coverage-report.md) for the full coverage/quality scorecard and [`appendices/README.md`](./appendices/README.md) for all health reports.

## How to navigate

| If you are... | Start here |
|---|---|
| A new contributor setting up locally | [`development/setup-and-workflow.md`](./development/setup-and-workflow.md) |
| Trying to understand the system design | [`architecture/overview.md`](./architecture/overview.md) |
| Building against the API | [`api/rest-api-reference.md`](./api/rest-api-reference.md) |
| Working on the database/content model | [`database/schema-reference.md`](./database/schema-reference.md) |
| Deploying or managing infra | [`deployment/hosting-guide.md`](./deployment/hosting-guide.md) |
| Using the CMS/admin panel | [`cms/admin-panel-reference.md`](./cms/admin-panel-reference.md) |
| Reviewing security posture | [`security/`](./security/) |
| A recruiter/client wanting the high-level picture | [`architecture/overview.md`](./architecture/overview.md) + root [`README.md`](../README.md) |

## Directory map

| Directory | Contents |
|---|---|
| [`architecture/`](./architecture/) | System design, layer boundaries, rendering strategy, auth flow, CORS, future architecture |
| [`development/`](./development/) | Local setup, workflow, coding standards, git conventions, troubleshooting |
| [`frontend/`](./frontend/) | Frontend-specific structure and conventions |
| [`backend/`](./backend/) | Backend-specific structure and conventions |
| [`pages/`](./pages/) | One doc per route — purpose, SEO, data sources, states |
| [`features/`](./features/) | One doc per product feature — contact form, notifications, theming, etc. |
| [`components/`](./components/) | One doc per reusable component, grouped by `sections/`, `admin/`, `ui/` |
| [`layouts/`](./layouts/) | Root layout, admin layout, page-transition template |
| [`hooks/`](./hooks/) | Custom hooks (currently none exist — see the gap noted there) |
| [`utilities/`](./utilities/) | `lib/api.ts`, `lib/types.ts`, `lib/date.ts`, backend `lib/` |
| [`styles/`](./styles/) | Tailwind/CSS variable conventions |
| [`design-system/`](./design-system/) | Design tokens, typography, component visual guidelines |
| [`animations/`](./animations/) | Framer Motion animation principles and timing |
| [`cms/`](./cms/) | Admin panel / custom CMS reference |
| [`deployment/`](./deployment/) | Vercel, Render, Supabase hosting, environment variables |
| [`security/`](./security/) | Auth, secrets, rate limiting, OWASP checklist |
| [`performance/`](./performance/) | Image/font optimization, code splitting, Core Web Vitals |
| [`testing/`](./testing/) | Testing strategy (currently no automated tests exist) |
| [`api/`](./api/) | Full REST API reference |
| [`database/`](./database/) | Prisma schema reference |
| [`assets/`](./assets/) | Favicon/branding asset inventory |
| [`guides/`](./guides/) | Task-oriented how-tos (e.g. "add a new content section") |
| [`tutorials/`](./tutorials/) | Step-by-step walkthroughs for newcomers |
| [`templates/`](./templates/) | Reusable templates for every doc type in this project |
| [`adr/`](./adr/) | Architecture Decision Records |
| [`standards/`](./standards/) | Style guide, markdown/naming/folder conventions, review process |
| [`roadmap/`](./roadmap/) | Future architecture and documentation roadmap |
| [`references/`](./references/) | External services, third-party libraries, glossary links |
| [`glossary/`](./glossary/) | Project-specific terminology |
| [`decisions/`](./decisions/) | Running decision log (lighter-weight than formal ADRs) |
| [`releases/`](./releases/) | Release notes index (root `CHANGELOG.md` is canonical) |
| [`diagrams/`](./diagrams/) | Mermaid diagram sources referenced by architecture docs |
| [`appendices/`](./appendices/) | Full audit report, technical debt register, documentation health reports |

## Root-level docs (outside `/docs`)

Per the documentation philosophy for this project, only these files stay at the repository root: `README.md`, `LICENSE`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`. Everything else technical lives under `/docs`.
