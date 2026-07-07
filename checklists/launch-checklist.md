# Launch Checklist

## Product

- [ ] Onboarding works end-to-end.
- [ ] User can set inactive window.
- [ ] User can choose categories and keywords.
- [ ] User can receive a test briefing.
- [ ] User can view briefing history.
- [ ] User can unsubscribe from email.
- [ ] User can delete account.

## Data Sources

- [ ] All MVP sources reviewed.
- [ ] Source terms checked.
- [ ] Rate limits documented.
- [ ] Source failures handled gracefully.
- [ ] Source health dashboard available.

## Summarization

- [ ] Prompt version recorded.
- [ ] Output JSON schema enforced.
- [ ] Trend-only items labeled as trend signals.
- [ ] Low-confidence items excluded from main sections by default.
- [ ] Source links preserved.
- [ ] Fallback summary works.

## Delivery

- [ ] Email HTML tested.
- [ ] Plain text email tested.
- [ ] Duplicate email prevention verified.
- [ ] Delivery logs saved.
- [ ] Bounce/failure handling configured.
- [ ] Unsubscribe link works.

## Security

- [ ] Auth required for app routes.
- [ ] User cannot access another user's data.
- [ ] Internal job endpoints protected.
- [ ] Secrets not committed.
- [ ] Rate limits applied.
- [ ] External source HTML escaped.

## Operations

- [ ] Production database backup enabled.
- [ ] Error tracking enabled.
- [ ] Job failure alerts configured.
- [ ] Source failure alerts configured.
- [ ] Cost metrics tracked.
- [ ] Rollback plan documented.
