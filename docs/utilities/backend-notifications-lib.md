# Utility: `sendContactNotifications` / `sendTestEmail`

**File:** `backend/src/lib/notifications.ts`

## Purpose
Sends contact-form notification emails (and optional auto-replies) via Resend, and tracks delivery status back onto the `ContactMessage` row. Also provides an admin-facing test-send function. See [`../features/notification-system.md`](../features/notification-system.md) for the feature-level overview and [`../releases/2026-notification-system-migration.md`](../releases/2026-notification-system-migration.md) for the full migration history from the previous WhatsApp/SMTP system.

## Signature

```ts
export interface ContactPayload {
  id: string; name: string; email: string; subject: string; message: string; timestamp: Date;
}

export interface SendResult {
  emailSent: boolean;
  emailSentAt: Date | null;
  resendMessageId: string | null;
  notificationStatus: string;
  adminNotified: boolean;
}

export async function sendContactNotifications(payload: ContactPayload): Promise<SendResult>;
export async function sendTestEmail(): Promise<{ success: boolean; message: string }>;
```

## Parameters

| Param | Type | Description |
|---|---|---|
| `payload` | `ContactPayload` | The just-created `ContactMessage` row's data, passed in by `routes/contact.ts` immediately after `prisma.contactMessage.create()` |

## Returns
- `sendContactNotifications`: a `SendResult` describing what happened — whether the admin email sent, its Resend message ID, a `notificationStatus` string (`'sent'`, `'disabled'`, `'no_api_key'`, `'no_recipients'`, `'no_settings'`, `'pending'`, or `'error: <message>'`/`'error'`), and whether an admin was actually notified. The same shape is persisted back onto the `ContactMessage` row via `prisma.contactMessage.update()`.
- `sendTestEmail`: a simple `{ success, message }` pair for the admin panel's "Send Test Email" button (see [`../pages/admin-crud-pages.md`](../pages/admin-crud-pages.md), `/admin/notifications`).

## Usage Example

```ts
import { sendContactNotifications } from '../lib/notifications';

setImmediate(() => {
  sendContactNotifications({
    id: msg.id, name: msg.name, email: msg.email,
    subject: msg.subject, message: msg.message, timestamp: msg.createdAt,
  }).catch((err) => console.error('[contact] notification dispatch error:', err));
});
```

This is exactly how `routes/contact.ts` calls it — wrapped in `setImmediate()` so the HTTP response to the visitor is never blocked or failed by email delivery issues.

## Edge Cases / Gotchas
- **Recipient resolution order:** starts from `settings.emailRecipients` (array), then unshifts `notificationEmail` to the front if set and not already present, then appends `backupNotificationEmail` if set and not already present. If the resulting list is empty, `notificationStatus` becomes `'no_recipients'` and no email is sent — this is treated as a normal (non-error) outcome, not an exception.
- **No Resend API key configured** → `getResendClient()` returns `null`, logged as a `console.warn`, and the function returns early with `notificationStatus: 'no_api_key'` rather than throwing.
- **Auto-reply failures are swallowed independently** — if `settings.autoReplyEnabled` and the admin notification succeeded, the auto-reply is sent in its own `try/catch`; a failure there is logged but does not change the overall `SendResult` or `notificationStatus` (which reflects only the admin-facing email's outcome).
- **HTML escaping is manual**, not a library — `escapeHtml()` does a fixed sequence of `.replace()` calls for `& < > " '`. This is the app's only XSS mitigation for user-submitted contact-form content that gets embedded in the admin notification email's HTML body. See [`../architecture/cms-flow.md`](../architecture/cms-flow.md) and the security notes there.
- **DB update failure is caught separately** from send failure — if the outer `try` throws before reaching the final `prisma.contactMessage.update()`, the `catch` block attempts a *second*, simpler update (`{ notificationStatus: 'error' }`) so the message row always ends up with some status, even in a partial-failure scenario. If that second update also fails, it's logged and swallowed — the function never throws back to its caller.
- Email templates are inline HTML strings (`buildAdminEmailHtml`, `buildAutoReplyHtml`, `buildPlainText`) built with template literals — no separate templating engine or `.html` files.

## Related
- [`../features/notification-system.md`](../features/notification-system.md)
- [`../features/contact-form.md`](../features/contact-form.md)
- [`../releases/2026-notification-system-migration.md`](../releases/2026-notification-system-migration.md)
- `backend/src/routes/contact.ts`, `backend/src/routes/notificationSettings.ts`
