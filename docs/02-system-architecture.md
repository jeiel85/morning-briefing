# 02. System Architecture

## 1. Overview

DawnBrief is composed of the following subsystems:

1. Web app and user settings.
2. Source adapters.
3. Ingestion scheduler.
4. Normalization and raw item store.
5. Deduplication and clustering engine.
6. Ranking engine.
7. LLM summarization engine.
8. Briefing renderer.
9. Delivery engine.
10. Observability and admin tools.

## 2. Recommended Initial Architecture

```text
Browser/PWA
   |
   | HTTPS
   v
Next.js App Router
   |-- Dashboard UI
   |-- Settings UI
   |-- API Route Handlers
   |
   v
PostgreSQL + Prisma
   |
   +-- User settings
   +-- Source configs
   +-- Raw items
   +-- Clusters
   +-- Briefings
   +-- Delivery logs

Scheduler/Cron
   |
   v
Queue Worker
   |-- Fetch source items
   |-- Normalize
   |-- Deduplicate
   |-- Cluster
   |-- Score
   |-- Summarize
   |-- Render email
   |-- Deliver

External Services
   |-- News APIs
   |-- RSS feeds
   |-- GDELT
   |-- Hacker News API
   |-- Trend APIs
   |-- LLM provider
   |-- Email provider
   |-- Push provider
```

## 3. Deployment Options

### Option A: Fast SaaS Setup

- Vercel for Next.js.
- Neon or Supabase for PostgreSQL.
- Upstash Redis for queues/rate limiting.
- Vercel Cron for scheduled triggers.
- Resend for email.

Pros:
- Fastest to deploy.
- Low ops burden.

Cons:
- Queue workers may need separate serverless-friendly design.
- Cron duration limits may matter.

### Option B: Docker VPS Setup

- Next.js standalone build.
- PostgreSQL container or managed DB.
- Redis container or managed Redis.
- Worker process with BullMQ.
- Nginx/Caddy reverse proxy.

Pros:
- Full control.
- Long-running workers are easy.
- Cost predictable.

Cons:
- More ops responsibility.

### Option C: Hybrid

- Vercel for frontend.
- Fly.io/Render/Railway for worker.
- Managed PostgreSQL and Redis.

This is the recommended production direction if worker jobs grow.

## 4. Bounded Contexts

### Identity Context

Responsibilities:
- User account.
- Session.
- Email verification.
- Account deletion.

### Preference Context

Responsibilities:
- Inactive window.
- Briefing time.
- Interest keywords.
- Blocked keywords.
- Source preferences.
- Delivery preferences.

### Ingestion Context

Responsibilities:
- Source adapter execution.
- API rate limit control.
- Raw item normalization.
- Failure retries.

### Intelligence Context

Responsibilities:
- Deduplication.
- Clustering.
- Ranking.
- LLM summarization.
- Confidence classification.

### Delivery Context

Responsibilities:
- Email rendering.
- Push notification.
- Delivery log.
- Retry and bounce handling.

### Admin/Observability Context

Responsibilities:
- Source health.
- Job status.
- Error monitoring.
- Cost monitoring.

## 5. Key Domain Objects

| Object | Meaning |
|---|---|
| User | Account owner |
| UserPreference | Briefing and source settings |
| Source | External data provider definition |
| SourceFetchRun | One fetch execution result |
| RawItem | Normalized external content item |
| ItemEmbedding | Optional vector for semantic dedupe |
| TopicCluster | Group of related RawItems |
| Briefing | One generated briefing for a user and time window |
| BriefingSection | Category section inside a briefing |
| BriefingItem | Summarized topic shown to user |
| DeliveryLog | Email/push delivery status |
| Feedback | User feedback for personalization |

## 6. Multi-Tenant Safety

Every user-owned table must include `user_id` where applicable. Shared global raw items may be stored once, but generated briefings and feedback are user-specific.

Recommended model:

- RawItem is global.
- TopicCluster can be global for a time window.
- Briefing is user-specific.
- BriefingItem references global cluster and stores user-specific ranking/explanation.

## 7. Worker Job Types

| Job | Trigger | Purpose |
|---|---|---|
| source.fetch | Cron | Fetch external items |
| item.normalize | After fetch | Normalize raw payloads |
| item.dedupe | After normalize | Remove duplicates |
| cluster.build | After dedupe | Build topic clusters |
| briefing.generate | User schedule | Build personalized briefing |
| briefing.deliver.email | After generation | Send email |
| briefing.deliver.push | After generation | Send push |
| source.healthcheck | Periodic | Check source status |
| retention.cleanup | Daily | Delete expired data |

## 8. Failure Strategy

- Source fetch failure should not block the whole briefing.
- Briefing generation should include partial coverage warning if source groups fail.
- Email delivery should be retried with exponential backoff.
- LLM failure should fallback to extractive summaries.
- Duplicate emails must be prevented by idempotency keys.

## 9. Idempotency Rules

Use idempotency keys for:

- Source fetch run: `source_id + window_start + window_end`.
- Raw item: normalized canonical URL hash or source-specific ID.
- Cluster build: `window_start + window_end + category + algorithm_version`.
- Briefing generation: `user_id + briefing_date + window_start + window_end`.
- Email delivery: `briefing_id + delivery_channel`.

## 10. Recommended Monorepo Structure

```text
dawnbrief/
├─ apps/
│  ├─ web/
│  └─ worker/
├─ packages/
│  ├─ db/
│  ├─ source-adapters/
│  ├─ ranking/
│  ├─ summarizer/
│  ├─ email-templates/
│  ├─ shared-types/
│  └─ config/
├─ prisma/
├─ scripts/
├─ tests/
└─ docs/
```
