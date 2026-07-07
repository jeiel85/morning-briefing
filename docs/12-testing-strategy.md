# 12. Testing Strategy

## 1. Testing Goals

- Prevent broken daily delivery.
- Prevent incorrect user data access.
- Prevent LLM hallucination patterns as much as possible.
- Prevent duplicate and spammy emails.
- Ensure source failures degrade gracefully.

## 2. Test Types

| Type | Scope |
|---|---|
| Unit tests | Pure functions: ranking, dedupe, time window calculation |
| Integration tests | DB, API routes, source adapters |
| Contract tests | External API payload shape assumptions |
| E2E tests | Onboarding, settings, briefing view |
| Worker tests | Job retries, idempotency, partial failures |
| Prompt tests | LLM output schema and factuality constraints |
| Security tests | Authorization and internal endpoint protection |

## 3. Critical Unit Tests

### Time Window

Cases:

- Same-day window: 09:00-17:00.
- Overnight window: 23:30-07:00.
- DST region.
- User timezone Asia/Seoul.
- Missing timezone.

### Deduplication

Cases:

- Same canonical URL.
- Same title, different tracking params.
- Similar translated title.
- Same event from different sources.
- Different events with similar words.

### Ranking

Cases:

- User keyword boosts relevance.
- Blocked keyword suppresses item.
- Official source boosts confidence.
- Trend-only item stays in trend section.
- Low-confidence item not shown in main section.

## 4. API Tests

- User cannot access another user's briefing.
- User cannot update another user's preferences.
- Invalid time format rejected.
- Too many keywords rejected.
- Preview generation rate limit works.
- Push subscription requires valid shape.

## 5. Worker Tests

- Source fetch failure is recorded.
- Retryable error retries.
- Non-retryable error stops.
- Duplicate job does not duplicate raw items.
- Duplicate delivery job does not send two emails.
- Partial source failure still generates briefing with warning.

## 6. Prompt Tests

Use deterministic fixtures.

Test assertions:

- Output validates against JSON schema.
- All source URLs in output exist in input.
- Status classification follows fixture expectation.
- Trend-only input does not become confirmed fact.
- Unsupported numeric claims are rejected.

## 7. E2E Flow

### Onboarding Flow

1. Visit landing page.
2. Login.
3. Set inactive window.
4. Choose categories.
5. Add keywords.
6. Save settings.
7. Generate preview.

### Briefing Flow

1. Seed source items.
2. Run briefing generation job.
3. Visit today's briefing.
4. Expand item.
5. Click source.
6. Submit feedback.

## 8. Manual QA

- Email renders correctly in Gmail, Outlook, mobile mail.
- Korean text line breaks are readable.
- Dark mode is readable.
- Mobile card layout is comfortable.
- Unsubscribe works.
- Account deletion works.

## 9. Test Data Fixtures

Create fixtures for:

- Domestic news cluster.
- Global news cluster.
- Developer outage cluster.
- Trend-only cluster.
- Low-confidence rumor cluster.
- Duplicate article flood.

## 10. Acceptance Criteria for Release

- 90%+ unit test coverage for ranking/time/dedupe modules.
- All P0 API authorization tests pass.
- Email idempotency verified.
- Prompt output validation enforced.
- Source failure fallback verified.
