# 07. API Design

## 1. API Style

Use REST-style JSON APIs for MVP. Server Actions can be used internally, but public-facing contracts should remain explicit.

Base path:

```text
/api/v1
```

## 2. Authentication

Recommended:

- Auth.js / NextAuth session.
- Email magic link for initial release.
- Add passkeys later.

API requests require authenticated session except public health endpoints.

## 3. Endpoints

### User Preferences

#### GET /api/v1/preferences

Returns current user's briefing preferences.

#### PUT /api/v1/preferences

Updates preferences.

Request:

```json
{
  "timezone": "Asia/Seoul",
  "inactiveWindowStart": "23:30",
  "inactiveWindowEnd": "07:00",
  "briefingDeliveryTime": "07:05",
  "briefingMode": "three_minute",
  "categories": ["domestic_news", "global_news", "ai", "developer"],
  "interestKeywords": ["Android", "Kotlin", "LLM", "GitHub", "Vercel"],
  "blockedKeywords": ["celebrity_gossip"],
  "emailEnabled": true,
  "pushEnabled": false
}
```

### Briefings

#### GET /api/v1/briefings

Query params:

- from.
- to.
- limit.
- cursor.

#### GET /api/v1/briefings/{briefingId}

Returns full briefing.

#### POST /api/v1/briefings/generate-preview

Generates a preview for current settings. Rate-limited.

### Feedback

#### POST /api/v1/briefing-items/{itemId}/feedback

Request:

```json
{
  "type": "useful",
  "note": "Good developer relevance"
}
```

Feedback types:

- useful.
- not_useful.
- duplicate.
- too_many_like_this.
- show_more_like_this.
- block_source.
- block_keyword.

### Sources

#### GET /api/v1/sources

Lists available source presets.

#### PUT /api/v1/sources/{sourceId}/preference

Enables/disables source for current user.

### Push Subscription

#### POST /api/v1/push/subscribe

Stores push subscription.

#### DELETE /api/v1/push/subscribe

Removes push subscription.

### Internal Worker APIs

These should be protected by signed tokens or internal network rules.

#### POST /api/internal/jobs/source-fetch

Triggers source fetch.

#### POST /api/internal/jobs/generate-briefings

Triggers briefing generation for due users.

#### POST /api/internal/jobs/deliver-briefing

Triggers email/push delivery.

## 4. Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid inactive window",
    "details": {
      "field": "inactiveWindowStart"
    }
  }
}
```

## 5. API Error Codes

| Code | Meaning |
|---|---|
| UNAUTHORIZED | Session required |
| FORBIDDEN | User cannot access resource |
| VALIDATION_ERROR | Invalid input |
| RATE_LIMITED | Too many requests |
| NOT_FOUND | Resource not found |
| BRIEFING_NOT_READY | Requested briefing is still processing |
| SOURCE_UNAVAILABLE | External source failed |
| INTERNAL_ERROR | Unexpected server error |

## 6. Rate Limits

| Endpoint | Limit |
|---|---|
| Generate preview | 5/hour/user |
| Preference update | 60/hour/user |
| Feedback | 300/hour/user |
| Push subscribe | 20/day/user |

## 7. Input Validation

Use Zod schemas on all mutation endpoints.

Example:

```ts
const UpdatePreferenceSchema = z.object({
  timezone: z.string().min(1),
  inactiveWindowStart: z.string().regex(/^\d{2}:\d{2}$/),
  inactiveWindowEnd: z.string().regex(/^\d{2}:\d{2}$/),
  briefingDeliveryTime: z.string().regex(/^\d{2}:\d{2}$/),
  briefingMode: z.enum(['three_minute', 'ten_minute', 'full', 'developer', 'global']),
  categories: z.array(z.string()).max(20),
  interestKeywords: z.array(z.string()).max(100),
  blockedKeywords: z.array(z.string()).max(200),
  emailEnabled: z.boolean(),
  pushEnabled: z.boolean(),
});
```

## 8. Authorization Rules

- Users can only read their own briefings.
- Users can only update their own preferences.
- Internal job endpoints require service token.
- Source definitions are globally readable if enabled.
- Admin-only source health endpoints require admin role.
