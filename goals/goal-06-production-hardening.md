# Goal 06. Production Hardening

## Objective

Prepare the app for real users beyond personal testing.

## Deliverables

- Observability.
- Admin dashboard.
- Error tracking.
- Rate limiting.
- Privacy/terms pages.
- Data deletion.
- Prompt injection guardrails.
- Backup plan.

## Tasks

### 1. Observability

Add:

- Structured logs.
- Error reporting.
- Job metrics.
- Source health dashboard.

### 2. Rate Limiting

Add rate limits for:

- Login.
- Preview generation.
- Feedback.
- Push subscription.
- Internal endpoints.

### 3. Security

- Protect internal endpoints with service token.
- Enforce authorization tests.
- Escape email content.
- Validate LLM output.

### 4. Legal Pages

Add:

- Privacy policy.
- Terms of service.
- AI summary disclaimer.
- Unsubscribe.
- Account deletion.

### 5. Data Retention

Implement cleanup jobs.

### 6. Backups

Configure automated DB backups and test restore.

## Acceptance Criteria

- All P0 tests pass.
- Source failures are visible in admin dashboard.
- Daily briefing failure alert exists.
- Account deletion works.
- Email unsubscribe works.
- Internal endpoints reject unauthenticated requests.
- No source raw HTML is rendered in email.

## Suggested Commit Names

- `chore: add observability and source health dashboard`
- `feat: add privacy controls and account deletion`
- `chore: harden internal worker endpoints`
