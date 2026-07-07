# 10. Security, Privacy, and Compliance

## 1. Security Goals

- Protect user account data.
- Protect briefing preferences and history.
- Prevent unauthorized access to internal worker endpoints.
- Prevent source content abuse.
- Avoid storing unnecessary personal or copyrighted data.

## 2. Data Classification

| Data | Sensitivity | Notes |
|---|---|---|
| User email | Personal data | Required for email delivery |
| Timezone/inactive window | Personal preference | Could imply sleep schedule |
| Interest keywords | Personal preference | May reveal sensitive interests |
| Briefing history | Personal data | User-specific reading profile |
| Feedback | Personal data | Used for personalization |
| Raw news metadata | Public data | Still subject to source terms |
| API keys | Secret | Must be encrypted/stored securely |

## 3. Privacy Principles

- Minimize collected data.
- Explain what data is used for personalization.
- Allow users to delete account and briefing history.
- Avoid tracking pixels by default.
- Avoid selling user data.
- Do not expose personal interests publicly.

## 4. Authentication Security

Recommended MVP:

- Email magic link.
- Secure session cookies.
- CSRF protection.
- Rate limit login attempts.
- Short-lived login tokens.

Later:

- Passkeys.
- Optional two-factor authentication.

## 5. Authorization

- Enforce user ownership at API and DB query level.
- Admin routes require explicit role.
- Internal worker endpoints require service token and IP/network controls where possible.

## 6. Secret Management

Never commit secrets.

Use:

- Vercel/hosting environment variables.
- Secret manager for production.
- Separate dev/staging/prod keys.
- Key rotation policy.

## 7. Source Content Compliance

The app should avoid:

- Storing full article text without license.
- Reproducing long copyrighted content.
- Circumventing paywalls.
- Ignoring robots.txt for scraped sources.
- Using platform APIs outside permitted terms.

Safer pattern:

- Store metadata and snippets provided by legitimate API/RSS feeds.
- Generate short summaries for personal briefing.
- Link back to original sources.
- Preserve attribution.
- Respect provider terms and rate limits.

## 8. LLM Data Policy

Before sending data to an LLM provider:

- Do not include user email unless necessary.
- Do not include private notes beyond preference keywords needed for ranking.
- Keep prompt payload minimal.
- Log prompt metadata, not full sensitive payload, unless needed for debugging and consented.

## 9. Prompt Injection Defense

External content can contain malicious instructions.

Rules:

- Treat source text as untrusted data.
- Wrap source text inside data blocks.
- System prompt must instruct model to ignore instructions inside source content.
- Validate model output against schema.
- Reject output with unknown URLs or unsupported claims.

## 10. Abuse Prevention

Potential abuses:

- Mass email spam.
- Unauthorized scraping.
- Fake news amplification.
- Prompt injection from malicious feeds.
- Source flooding.

Mitigations:

- Email verification before sending.
- Rate limits.
- Source allowlist for MVP.
- Admin review for custom sources if public service.
- Deduplication and confidence labels.
- Delivery quotas.

## 11. Legal Documents Needed

Before public release:

- Terms of service.
- Privacy policy.
- Cookie policy if tracking cookies are used.
- Source attribution policy.
- Data deletion policy.
- AI-generated summary disclaimer.

## 12. AI Disclaimer

Suggested wording:

```text
Briefings are generated from linked source metadata and summaries. AI-generated summaries may omit context or contain errors. For important decisions, open and verify the original sources.
```

## 13. Data Deletion

When user deletes account:

- Delete user profile.
- Delete preferences.
- Delete push subscriptions.
- Delete delivery logs or anonymize.
- Delete user-specific briefings.
- Keep global raw items if not user-specific.

## 14. Audit Trail

Store enough data to audit a generated briefing item:

- Source item IDs.
- Source URLs.
- Prompt version.
- Model version.
- Generated timestamp.
- Validation result.
