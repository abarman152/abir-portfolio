# External Services

| Service | Role | Docs |
|---|---|---|
| [Vercel](https://vercel.com) | Frontend hosting, preview deployments | [`../deployment/hosting-guide.md`](../deployment/hosting-guide.md) |
| [Render](https://render.com) | Backend (Express API) hosting | [`../deployment/hosting-guide.md`](../deployment/hosting-guide.md) |
| [Supabase](https://supabase.com) | Managed PostgreSQL + connection pooling | [`../deployment/hosting-guide.md`](../deployment/hosting-guide.md), [`../database/schema-reference.md`](../database/schema-reference.md) |
| [Resend](https://resend.com) | Transactional email (contact form notifications) | [`../features/notification-system.md`](../features/notification-system.md) |
| Cloudinary (suggested convention only, not integrated) | Image hosting convention for admin-entered URLs | [`../features/image-handling-convention.md`](../features/image-handling-convention.md) |
| GitHub | Source control, triggers Vercel/Render auto-deploy | [`../deployment/hosting-guide.md`](../deployment/hosting-guide.md) |

No analytics, error-tracking, or monitoring service is currently integrated — see [`../deployment/rollback-monitoring-logging.md`](../deployment/rollback-monitoring-logging.md).
