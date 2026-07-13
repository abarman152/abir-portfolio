# Rollback, Monitoring, Logging, Analytics

## Rollback

- **Vercel**: every deployment is retained and instantly promotable — go to the Vercel project → Deployments, find the last known-good deployment, and click "Promote to Production." This is immediate and requires no rebuild.
- **Render**: Render retains previous deploys per service — go to the service → Deploys tab and select "Redeploy" on a prior successful deploy, or roll back via Render's dashboard rollback action if available on your plan.
- **Database**: there is no automated migration-rollback tooling configured. Since production runs `prisma db push` on every boot (see [`../architecture/deployment-architecture.md`](../architecture/deployment-architecture.md) and [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md) item #15), a schema rollback means manually reverting `backend/prisma/schema.prisma` and redeploying — there's no `prisma migrate` history to step backward through in the current setup. Enable Supabase Point-in-Time Recovery (mentioned in [`hosting-guide.md`](./hosting-guide.md)) as the actual safety net for data-level mistakes.

## Monitoring

**None configured.** No uptime monitor, no APM, no error tracking (no Sentry or equivalent) found anywhere in dependencies or config. The only existing signal is:
- Vercel's own build/deploy status and basic request logs.
- Render's own build/deploy status and service logs.

If either service goes down or errors silently, there is currently no alert — you'd find out from a visitor report or by checking manually. Recommended minimal addition: a free uptime monitor (e.g. UptimeRobot) pinging `GET /api/health` (already exists as a public endpoint) and the public site root, tracked in [`../roadmap/future-documentation-roadmap.md`](../roadmap/future-documentation-roadmap.md).

## Logging

- **Backend**: plain `console.log`/`console.error` to stdout, visible in Render's log viewer. No structured logging (no `pino`/`winston`), no log aggregation service.
- **Frontend**: standard Vercel function/build logs only; no client-side error reporting service.
- Notification delivery status is the one thing that IS tracked durably — `ContactMessage.notificationStatus`/`emailSent`/`resendMessageId` fields persist the outcome of every email attempt in the database itself (see [`../features/notification-system.md`](../features/notification-system.md)), which functions as a lightweight audit log for that one flow.

## Analytics

**None integrated.** No Vercel Analytics, Google Analytics, Plausible, Fathom, or PostHog found in dependencies or source. There is no visibility into visitor traffic, page popularity, or conversion (contact form submission rate) today. Adding Vercel Analytics (zero-config for a Vercel-hosted Next.js app) is the lowest-effort option if this is wanted — tracked in [`../roadmap/future-documentation-roadmap.md`](../roadmap/future-documentation-roadmap.md).

## Related
- [`../architecture/deployment-architecture.md`](../architecture/deployment-architecture.md)
- [`../appendices/technical-debt-register.md`](../appendices/technical-debt-register.md)
