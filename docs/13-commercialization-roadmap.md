# 13. Commercialization Roadmap

## 1. Product Positioning

DawnBrief should be positioned as a **personal morning intelligence briefing**, not just a news summary service.

Possible positioning:

```text
Wake up to what matters. DawnBrief summarizes the important news, trends, and technical updates that happened while you were away.
```

Korean positioning:

```text
자는 동안 놓친 세상 변화를 아침에 한 번에 정리해드립니다.
```

## 2. Differentiation

| Generic News App | DawnBrief |
|---|---|
| Constant alerts | One controlled morning briefing |
| Broad headlines | Personalized relevance |
| Weak source transparency | Source-linked summaries |
| Same for everyone | User-specific inactive window |
| Factual/trend mix unclear | Confirmed vs developing vs trend signal labels |

## 3. Monetization Models

### Individual Subscription

- Free: 1 daily briefing, limited categories.
- Plus: more sources, custom keywords, history, push alerts.
- Pro: advanced filters, multiple briefing schedules, export.

### Professional Profiles

Paid templates:

- Developer briefing.
- Investor briefing.
- Founder briefing.
- Local operator briefing.
- Church/community operator briefing.

### Team Briefing

- Shared team topics.
- Slack/Discord delivery.
- Admin-managed sources.
- Team-level digest.

## 4. Pricing Hypothesis

Korean market test:

- Free.
- Personal Plus: 2,900-5,900 KRW/month.
- Pro: 9,900-14,900 KRW/month.
- Team: per-seat or per-workspace.

Do not finalize pricing until cost per briefing is measured.

## 5. Cost Drivers

- LLM usage.
- Email delivery.
- Source API subscriptions.
- Database and queue.
- Search/vector storage.

Control cost by:

- Global ingestion, user-specific ranking.
- Cluster-first summarization instead of article-by-article summarization.
- Cache generated cluster summaries.
- Use cheaper/smaller models for classification.
- Use LLM only after rule-based filtering.

## 6. Roadmap

### Phase 1: Private Alpha

- Email-only.
- Limited sources.
- Manual source allowlist.
- 10-50 users.

### Phase 2: Public Beta

- Push notifications.
- More source presets.
- Feedback loop.
- Better dashboard.
- Korean/English support.

### Phase 3: Paid Personal

- Billing.
- Custom keywords.
- Multiple briefing modes.
- History search.
- Urgent alerts.

### Phase 4: Professional/Team

- Team briefings.
- Slack/Discord delivery.
- Shared sources.
- Admin dashboard.
- Export API.

### Phase 5: Native Companion

- Android app for true device inactivity detection.
- Morning first-unlock trigger.
- Optional lockscreen notification.

## 7. Risks

| Risk | Mitigation |
|---|---|
| News copyright issues | API/RSS-first, source links, no full article storage |
| LLM hallucination | Schema validation, source-only prompts, confidence labels |
| API cost | Cache, cluster-first summarization, quotas |
| Low retention | Strong personalization and feedback loop |
| Too much noise | Strict ranking and category caps |
| Social rumor amplification | Trend-signal labeling and main-section exclusion |

## 8. Launch Strategy

Start with a narrow user group:

- Developers who want AI/dev/cloud morning briefings.
- Korean users who want domestic/global/tech overnight summary.

Launch copy:

```text
Every morning, get a source-linked summary of what happened while you were offline: news, global events, AI updates, developer tools, and the trends that matter to you.
```
