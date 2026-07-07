# Goal 04. Delivery

## Objective

Deliver generated briefings by email and display them in the dashboard.

## Deliverables

- Email renderer.
- Email provider integration.
- Delivery logs.
- Dashboard briefing page.
- Briefing history page.
- Unsubscribe flow.

## Tasks

### 1. Email Template

Create responsive HTML and plain text template.

### 2. Email Sending

Provider options:

- Resend.
- AWS SES.
- Mailgun.

### 3. Delivery Log

Track:

- status.
- provider message ID.
- error code.
- attempted timestamp.

### 4. Dashboard

Pages:

- `/app` current briefing.
- `/app/history` past briefings.
- `/app/briefings/[id]` details.

### 5. Unsubscribe

Allow email delivery off without deleting account.

## Acceptance Criteria

- Email sends once per briefing.
- Duplicate delivery job does not send duplicate email.
- Email includes source links and settings link.
- Dashboard shows same briefing as email.
- User can unsubscribe from email.

## Suggested Commit Names

- `feat: render morning briefing email`
- `feat: add email delivery and logs`
- `feat: show briefing history in dashboard`
