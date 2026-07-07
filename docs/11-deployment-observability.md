# 11. Deployment and Observability

## 1. Environments

Use three environments:

- Development.
- Staging.
- Production.

Each environment must have separate:

- Database.
- Redis/queue.
- API keys.
- Email sender/domain.
- LLM provider key.

## 2. Deployment Option A: Vercel-Based MVP

Components:

- Vercel: Next.js app.
- Neon/Supabase: PostgreSQL.
- Upstash: Redis.
- Vercel Cron: scheduled triggers.
- Resend: email.

Worker model:

- Serverless endpoints enqueue jobs.
- Worker can run as separate Node process on Railway/Fly.io/Render if BullMQ is used.

## 3. Deployment Option B: Docker Compose

Services:

```yaml
services:
  web:
    image: dawnbrief-web
  worker:
    image: dawnbrief-worker
  postgres:
    image: postgres:16
  redis:
    image: redis:7
  caddy:
    image: caddy:2
```

Use managed DB in production if possible.

## 4. CI/CD

Pipeline:

1. Install dependencies.
2. Typecheck.
3. Lint.
4. Unit tests.
5. Integration tests.
6. Prisma migration check.
7. Build.
8. Deploy staging.
9. Smoke test.
10. Promote to production.

## 5. Observability Stack

Minimum:

- Structured logs.
- Error tracking.
- Job dashboard.
- Database metrics.
- Email delivery metrics.

Recommended:

- Sentry for errors.
- OpenTelemetry for traces.
- Grafana/Prometheus if self-hosted.
- Provider dashboards for email and DB.

## 6. Key Metrics

### Product Metrics

- Daily generated briefings.
- Email open rate if disclosed/tracked.
- Dashboard open rate.
- Feedback ratio.
- User retention.

### Pipeline Metrics

- Source fetch success rate.
- Items fetched per source.
- Deduplication ratio.
- Cluster count per window.
- LLM success/failure count.
- Briefing generation latency.

### Delivery Metrics

- Email sent count.
- Email failure count.
- Push sent count.
- Push endpoint invalid count.

### Cost Metrics

- LLM tokens per briefing.
- LLM cost per user.
- Email cost per user.
- Source API cost.

## 7. Alerts

Set alerts for:

- Briefing generation failure rate > 5%.
- Email delivery failure rate > 5%.
- Major source fetch failure for more than 3 consecutive runs.
- LLM provider errors spike.
- Queue backlog grows beyond threshold.
- Database connection saturation.

## 8. Backups

Production DB:

- Automated daily backups.
- Point-in-time recovery if supported.
- Restore test monthly.

## 9. Migrations

Rules:

- Use Prisma migrations.
- Review destructive migrations manually.
- Apply to staging first.
- Keep rollback plan.

## 10. Release Checklist

Before each production release:

- All tests pass.
- Migrations reviewed.
- Source adapters smoke tested.
- Email template preview checked.
- LLM prompt validation checked.
- Rollback plan ready.
