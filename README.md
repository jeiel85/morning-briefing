# Morning Briefing Web App Design Bundle

Production-ready design bundle for a web app that collects news, trends, and priority updates during the user's inactive/sleep window and delivers a morning briefing by email and push notification.

## Product Name Candidates

- DawnBrief
- WakeBrief
- CatchUp Morning
- Overnight Briefing
- Morning Signal

This bundle uses the working name **DawnBrief**.

## Intended Outcome

Build a deployable web application that:

1. Lets users define inactive windows such as 23:30-07:00.
2. Collects news, trends, developer updates, and user keyword mentions during that window.
3. Deduplicates and clusters related items.
4. Scores items by urgency, reliability, relevance, and user preferences.
5. Generates a factual, source-linked briefing.
6. Delivers the briefing by email and/or web push at the user's chosen wake time.
7. Preserves user trust by separating verified facts, context, uncertainty, and speculation.

## Bundle Structure

```text
morning-briefing-design/
├─ README.md
├─ docs/
│  ├─ 01-product-requirements.md
│  ├─ 02-system-architecture.md
│  ├─ 03-data-source-strategy.md
│  ├─ 04-ingestion-pipeline.md
│  ├─ 05-ranking-and-deduplication.md
│  ├─ 06-llm-summarization-policy.md
│  ├─ 07-api-design.md
│  ├─ 08-frontend-design.md
│  ├─ 09-notification-and-email.md
│  ├─ 10-security-privacy-compliance.md
│  ├─ 11-deployment-observability.md
│  ├─ 12-testing-strategy.md
│  └─ 13-commercialization-roadmap.md
├─ goals/
│  ├─ goal-01-foundation.md
│  ├─ goal-02-ingestion.md
│  ├─ goal-03-briefing-engine.md
│  ├─ goal-04-delivery.md
│  ├─ goal-05-personalization.md
│  └─ goal-06-production-hardening.md
├─ schemas/
│  ├─ prisma-schema.prisma
│  ├─ api-openapi.yaml
│  ├─ briefing-json-schema.json
│  └─ env.example
├─ prompts/
│  ├─ summarizer-system-prompt.md
│  ├─ cluster-title-prompt.md
│  └─ briefing-render-prompt.md
├─ diagrams/
│  ├─ architecture.mmd
│  ├─ ingestion-pipeline.mmd
│  └─ delivery-flow.mmd
└─ checklists/
   ├─ launch-checklist.md
   ├─ legal-risk-checklist.md
   └─ qa-checklist.md
```

## Recommended Stack

| Area | Recommendation |
|---|---|
| Frontend | Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js Route Handlers for initial release; extract to NestJS if needed |
| Database | PostgreSQL + Prisma |
| Queue | BullMQ + Redis, or managed equivalent |
| Scheduler | Vercel Cron, GitHub Actions cron, Cloudflare Workers Cron, or server cron |
| Email | Resend, AWS SES, or Mailgun |
| Push | Web Push API or Firebase Cloud Messaging |
| Auth | NextAuth/Auth.js with email magic link or passkey-ready design |
| LLM | Provider abstraction: OpenAI/Gemini/Anthropic/local Ollama later |
| Search | PostgreSQL full-text initially; Meilisearch or Typesense later |
| Hosting | Vercel + Neon/Supabase + Upstash, or Docker VPS |

## Implementation Philosophy

Start with **email-only daily briefing**. Avoid overbuilding phone usage detection in the first release. True device usage detection requires native Android/iOS integration and elevated permissions. The web app should model the inactive window explicitly first.

## Non-Negotiable Trust Rules

- Every briefing item must include source links.
- The app must not claim unverified SNS rumors as facts.
- The LLM must summarize only retrieved source material and metadata.
- The app should store metadata and generated summaries, not unauthorized full article copies.
- The user must be able to see why an item appeared.
