# Missing Documentation Report

Not "gaps in the docs describing what exists" (there are none known — see [`documentation-coverage-report.md`](./documentation-coverage-report.md)) but **things that don't exist in the codebase yet, so there's nothing to document beyond the gap itself.** Listed here so it's a single scannable list rather than scattered across every doc that mentions one.

| Missing | Where the gap is documented |
|---|---|
| Custom hooks (none exist) | [`../hooks/README.md`](../hooks/README.md) |
| Automated tests (unit/integration/E2E) | [`../testing/strategy.md`](../testing/strategy.md) |
| CI/CD pipeline | [`../deployment/ci-cd.md`](../deployment/ci-cd.md) |
| Analytics / visitor tracking | [`../deployment/rollback-monitoring-logging.md`](../deployment/rollback-monitoring-logging.md) |
| Monitoring / uptime alerting / error tracking | [`../deployment/rollback-monitoring-logging.md`](../deployment/rollback-monitoring-logging.md) |
| Structured/aggregated logging | [`../deployment/rollback-monitoring-logging.md`](../deployment/rollback-monitoring-logging.md) |
| JSON-LD structured data | [`../performance/seo.md`](../performance/seo.md) |
| Rate limiting on admin login | [`../security/rate-limiting.md`](../security/rate-limiting.md) |
| Security headers (`helmet`) | [`../security/headers-and-cors.md`](../security/headers-and-cors.md) |
| Automated dependency scanning | [`../security/dependency-security.md`](../security/dependency-security.md) |
| Real Cloudinary integration | [`../features/image-handling-convention.md`](../features/image-handling-convention.md) |
| Frontend `.env.example` | [`../deployment/environment-variables.md`](../deployment/environment-variables.md) |
| Deployment IaC (`render.yaml`, Dockerfile) | [`../architecture/deployment-architecture.md`](../architecture/deployment-architecture.md) |
| Verified database backup/restore process | Notion → Tracking → Risks database |
| Second admin role / permissions model | [`../security/authorization.md`](../security/authorization.md) |

## What this is NOT

This is not a list of undocumented existing features — [`documentation-coverage-report.md`](./documentation-coverage-report.md) confirms 100% coverage of everything found in the repository audit. This list is the inverse: capability gaps in the product itself, each already cross-referenced from the doc where it's most relevant so a reader doesn't need this page to discover them — it exists purely as a single index for planning purposes (feeds [`../roadmap/future-documentation-roadmap.md`](../roadmap/future-documentation-roadmap.md) and the product-side [`../architecture/future-architecture.md`](../architecture/future-architecture.md)).

## Related
- [`../architecture/future-architecture.md`](../architecture/future-architecture.md)
- [`technical-debt-register.md`](./technical-debt-register.md)
