# Deployment Guide

## Live Site

| Service | URL |
|---|---|
| Public site | https://abirbarman.com |
| Frontend hosting | Vercel |
| Backend hosting | Render |
| Database | Supabase (PostgreSQL) |
| Media storage | Cloudinary |

---

## Frontend — Vercel

### First deploy

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub.
3. Set **Root Directory** to `frontend`.
4. Set **Framework Preset** to Next.js.
5. Add environment variable:

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://<your-render-app>.onrender.com/api` |

6. Deploy.

### Custom domain (abirbarman.com)

In Vercel project settings → Domains → Add `abirbarman.com`.
Update DNS at your registrar to point to Vercel's nameservers or add the required A/CNAME records.

### Subsequent deployments

Vercel auto-deploys on every push to `main`. No manual action required.

### Build settings

| Setting | Value |
|---|---|
| Build Command | `next build` (auto-detected) |
| Output Directory | `.next` (auto-detected) |
| Install Command | `npm install` |
| Node.js Version | 18.x |

---

## Backend — Render

### First deploy

1. Go to [render.com](https://render.com) → New Web Service → Connect GitHub repo.
2. Set **Root Directory** to `backend`.
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `node dist/index.js`
5. Set **Environment** to Node.
6. Add all environment variables from [environment.md](./environment.md):

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Supabase pooler URL (port 6543) |
   | `DIRECT_URL` | Supabase direct URL (port 5432) |
   | `JWT_SECRET` | 64-char random string |
   | `PORT` | 5001 |
   | `NODE_ENV` | production |
   | `FRONTEND_URL` | https://abirbarman.com |
   | `CLOUDINARY_URL` | cloudinary://key:secret@cloud |

7. Deploy.

### Subsequent deployments

Render auto-deploys on every push to `main` (configure in Render dashboard → Auto-Deploy).

### Post-deploy: run migrations

After a schema change, trigger a migration via Render Shell or a one-off job:

```bash
npx prisma migrate deploy
```

Never use `prisma db push` in production.

---

## Database — Supabase

### Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to Project Settings → Database → Connection Pooling.
3. Copy the **Transaction pooler** URL (port 6543) → `DATABASE_URL`.
4. Copy the **Direct connection** URL (port 5432) → `DIRECT_URL`.

### First-time schema setup

After configuring env vars on Render, run from local with production `DATABASE_URL`:

```bash
cd backend
DATABASE_URL="<prod-url>" DIRECT_URL="<prod-direct>" npx prisma db push
DATABASE_URL="<prod-url>" npx tsx src/seed.ts
```

Or run via Render Shell after deployment.

### Backups

Enable Point-in-Time Recovery in Supabase project settings for automated daily backups.

---

## Media — Cloudinary

### Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Go to Dashboard → API Keys.
3. Copy the `CLOUDINARY_URL` value (format: `cloudinary://api_key:api_secret@cloud_name`).
4. Add to backend `.env` and Render environment variables.

### Upload conventions

All images must use Cloudinary transformation URLs for optimal performance:

```
https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto/<public_id>
```

| Use case | Transformation |
|---|---|
| Cover / card image | `f_auto,q_auto,w_800,c_fill` |
| Hero avatar | `f_auto,q_auto,w_400,c_fill` |
| Banner image | `f_auto,q_auto,w_1200` |
| Thumbnail | `f_auto,q_auto,w_400` |

---

## Environment Checklist for Production

- [ ] `DATABASE_URL` set to Supabase pooler URL (port 6543, `pgbouncer=true`)
- [ ] `DIRECT_URL` set to Supabase direct URL (port 5432)
- [ ] `JWT_SECRET` is a strong 64-char random string
- [ ] `FRONTEND_URL` is `https://abirbarman.com`
- [ ] `CLOUDINARY_URL` is the full Cloudinary URL
- [ ] `NODE_ENV` is `production` on Render
- [ ] `NEXT_PUBLIC_API_URL` points to the Render backend URL on Vercel
- [ ] Prisma schema has been pushed/migrated to production DB
- [ ] Database has been seeded and default admin password changed
- [ ] Custom domain `abirbarman.com` is verified on Vercel
- [ ] HTTPS is enforced on all services
