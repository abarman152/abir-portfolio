# REST API Reference

Base URL: `http://localhost:5001/api` (development) / `https://<your-render-app>.onrender.com/api` (production)

Auth-required routes are marked with `[AUTH]`. They require `Authorization: Bearer <token>` header.

---

## Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | — | Returns `{ status: "ok", timestamp }` |

---

## Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | — | Login with email + password, returns JWT |
| `POST` | `/auth/setup` | — | First-time admin account creation (only works if no admin exists) |

### POST /auth/login

Request:
```json
{ "email": "admin@abirbarman.dev", "password": "Admin@123" }
```

Response:
```json
{ "token": "<jwt>" }
```

---

## Hero

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/hero` | — | Get hero content (name, tagline, roles, bio, resumeUrl, avatarUrl) |
| `PUT` | `/hero` | [AUTH] | Update hero content |

---

## Hero Badges

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/hero-badges` | — | Get all active badges |
| `GET` | `/hero-badges/all` | [AUTH] | Get all badges including inactive |
| `POST` | `/hero-badges` | [AUTH] | Create a badge |
| `PUT` | `/hero-badges/:id` | [AUTH] | Update a badge |
| `PATCH` | `/hero-badges/:id/toggle` | [AUTH] | Toggle badge active state |
| `DELETE` | `/hero-badges/:id` | [AUTH] | Delete a badge |

---

## Social Links

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/social` | — | Get all visible social links |
| `POST` | `/social` | [AUTH] | Create a social link |
| `PUT` | `/social/:id` | [AUTH] | Update a social link |
| `DELETE` | `/social/:id` | [AUTH] | Delete a social link |

---

## Projects

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/projects` | — | List published projects (paginated, filterable) |
| `GET` | `/projects/featured` | — | Get featured projects only |
| `GET` | `/projects/:slug` | — | Get a single project by slug |
| `POST` | `/projects` | [AUTH] | Create a project |
| `PUT` | `/projects/:id` | [AUTH] | Update a project |
| `DELETE` | `/projects/:id` | [AUTH] | Delete a project |

### Query params for GET /projects

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 9) |
| `featured` | boolean | Filter featured only |
| `search` | string | Search in title and description |

### Response for GET /projects

```json
{
  "projects": [ ...Project ],
  "total": 12,
  "page": 1,
  "totalPages": 2
}
```

---

## Research

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/research` | — | List research papers (paginated, filterable) |
| `GET` | `/research/featured` | — | Get featured papers only |
| `GET` | `/research/:slug` | — | Get a single paper by slug |
| `POST` | `/research` | [AUTH] | Create a research paper |
| `PUT` | `/research/:id` | [AUTH] | Update a paper |
| `DELETE` | `/research/:id` | [AUTH] | Delete a paper |

---

## Certifications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/certifications` | — | List visible certifications (paginated, filterable) |
| `GET` | `/certifications/featured` | — | Get featured certifications only |
| `GET` | `/certifications/all` | [AUTH] | Get all including hidden |
| `GET` | `/certifications/:slug` | — | Get a single certification by slug |
| `POST` | `/certifications` | [AUTH] | Create a certification |
| `PUT` | `/certifications/:id` | [AUTH] | Update a certification |
| `PATCH` | `/certifications/:id/visibility` | [AUTH] | Toggle visibility |
| `DELETE` | `/certifications/:id` | [AUTH] | Delete a certification |

---

## Achievements

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/achievements` | — | List visible achievements (paginated, filterable) |
| `GET` | `/achievements/featured` | — | Get featured achievements only |
| `GET` | `/achievements/all` | [AUTH] | Get all including hidden |
| `GET` | `/achievements/:slug` | — | Get a single achievement by slug |
| `POST` | `/achievements` | [AUTH] | Create an achievement |
| `PUT` | `/achievements/:id` | [AUTH] | Update an achievement |
| `PATCH` | `/achievements/:id/visibility` | [AUTH] | Toggle visibility |
| `DELETE` | `/achievements/:id` | [AUTH] | Delete an achievement |

---

## Skills

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/skills` | — | Get all skills (ordered) |
| `POST` | `/skills` | [AUTH] | Create a skill |
| `PUT` | `/skills/:id` | [AUTH] | Update a skill |
| `DELETE` | `/skills/:id` | [AUTH] | Delete a skill |

---

## Stats

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/stats` | — | Get all stats (ordered) |
| `POST` | `/stats` | [AUTH] | Create a stat |
| `PUT` | `/stats/:id` | [AUTH] | Update a stat |
| `DELETE` | `/stats/:id` | [AUTH] | Delete a stat |

---

## Contact

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/contact` | — | Submit a contact message |
| `GET` | `/contact` | [AUTH] | Get all messages |
| `PATCH` | `/contact/:id/read` | [AUTH] | Mark message as read |
| `DELETE` | `/contact/:id` | [AUTH] | Delete a message |

### POST /contact body

```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

---

## Site Settings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/settings` | — | Get site settings (theme, accent, meta, hero config) |
| `PUT` | `/settings` | [AUTH] | Update site settings |

---

## About

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/about/profile` | — | Get about profile |
| `PUT` | `/about/profile` | [AUTH] | Update about profile |
| `GET` | `/about/education` | — | Get visible education entries |
| `GET` | `/about/education/all` | [AUTH] | Get all education entries |
| `POST` | `/about/education` | [AUTH] | Create an education entry |
| `PUT` | `/about/education/:id` | [AUTH] | Update an education entry |
| `PATCH` | `/about/education/:id/visibility` | [AUTH] | Toggle visibility |
| `DELETE` | `/about/education/:id` | [AUTH] | Delete an education entry |
| `GET` | `/about/skills` | — | Get visible about skill groups |
| `GET` | `/about/skills/all` | [AUTH] | Get all about skill groups |
| `POST` | `/about/skills` | [AUTH] | Create a skill group |
| `PUT` | `/about/skills/:id` | [AUTH] | Update a skill group |
| `PATCH` | `/about/skills/:id/visibility` | [AUTH] | Toggle visibility |
| `DELETE` | `/about/skills/:id` | [AUTH] | Delete a skill group |

---

## Frontend API Client

All frontend calls go through `src/lib/api.ts`:

```typescript
import { api, authHeader } from '@/lib/api';

// Public
const hero = await api.get<HeroContent>('/hero');

// Admin (authenticated)
const token = localStorage.getItem('token');
await api.put('/hero', payload, authHeader(token!));
```

The base URL is controlled by `NEXT_PUBLIC_API_URL` env variable.
