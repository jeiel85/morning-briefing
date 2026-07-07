# 09. Notification and Email

## 1. Delivery Channels

### MVP

- Email briefing.

### Release Candidate

- Web push notification.
- In-app notification center.

### Later

- Android companion notification.
- Slack/Discord webhook.
- KakaoTalk channel if business requirements justify it.

## 2. Email Delivery Requirements

Email must include:

- Subject line.
- Briefing time window.
- Top summary.
- Category sections.
- Source links.
- Coverage warnings.
- Manage settings link.
- Unsubscribe link.

## 3. Subject Line Rules

Examples:

```text
Your morning briefing: 12 updates while you were away
DawnBrief: overnight news, AI, and developer updates
새벽 브리핑: 놓친 주요 소식 12건
```

For Korean users, use Korean subject by default.

## 4. Email HTML Structure

```text
Header
  - Product name
  - Date
  - Time window

Top 5
  - Highest scored items

Sections
  - Critical
  - Domestic
  - Global
  - AI/Developer
  - Trends

Footer
  - Source coverage note
  - Manage preferences
  - Unsubscribe
```

## 5. Web Push Strategy

Push should be minimal.

Default push:

```text
Morning briefing is ready: 12 updates from overnight.
```

Urgent push only if:

- User enabled urgent alerts.
- Item category is emergency/status/security.
- Score exceeds urgent threshold.
- Cooldown period has passed.

## 6. Push Subscription Storage

Store:

- endpoint.
- p256dh key.
- auth key.
- user agent.
- created_at.
- last_used_at.
- revoked_at.

Encrypt sensitive push subscription data if possible.

## 7. Delivery Idempotency

Prevent duplicate delivery with:

```text
briefing_id + channel + recipient
```

Before sending:

1. Check DeliveryLog for successful send.
2. If success exists, skip.
3. If failed and retryable, retry.
4. If permanent failure, mark failed.

## 8. Retry Policy

| Failure | Retry |
|---|---|
| Temporary email provider error | Yes |
| Network error | Yes |
| Invalid email address | No |
| User unsubscribed | No |
| Push endpoint gone | No, delete subscription |
| Rate limit | Yes with backoff |

## 9. Unsubscribe

Each email must include unsubscribe.

Unsubscribe should disable email delivery but keep account active unless user deletes account.

## 10. Delivery Logs

Fields:

- user_id.
- briefing_id.
- channel.
- recipient.
- status.
- provider_message_id.
- error_code.
- error_message.
- attempted_at.
- delivered_at.

## 11. Email Rendering Safety

- Escape all user-provided content.
- Do not render raw HTML from sources.
- Use plain text fallback.
- Keep source titles safe.
- Avoid tracking pixels unless explicitly disclosed.
