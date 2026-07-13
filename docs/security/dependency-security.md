# Dependency Security

## Current state

No automated dependency scanning is configured (no Dependabot config, no `npm audit` step in any CI — since no CI exists at all, see [`../deployment/ci-cd.md`](../deployment/ci-cd.md)).

## Recommended practice

Run manually, periodically, in both workspaces:

```bash
cd frontend && npm audit
cd backend && npm audit
```

Enabling GitHub's Dependabot (Settings → Security → Dependabot) costs nothing and requires no code changes — it will open PRs automatically for vulnerable dependencies. This is a reasonable first step before building out full CI.

## Unused dependencies are also a security surface

Every unused dependency (`three`, `@react-three/fiber`, `@react-three/drei`, `next-themes`, `axios` in frontend; `express-validator`, `multer` in backend — see [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #6) still ships in `node_modules`, still gets pulled into `npm audit`'s scan surface, and (for frontend deps) inflates the client bundle. Removing unused dependencies is a security hygiene action, not just a size optimization.

## Related
- [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md)
- [`../deployment/ci-cd.md`](../deployment/ci-cd.md)
