# 03. Data Source Strategy

## 1. Strategy Summary

The app should start with API/RSS-first ingestion. Avoid unauthorized scraping as a foundational dependency.

Recommended MVP source mix:

1. RSS feeds from selected news outlets and official sources.
2. GDELT for global coverage and event discovery.
3. Hacker News API for developer/tech trends.
4. Naver DataLab for Korean search trend signals.
5. User-defined RSS feeds and keywords.

## 2. Source Categories

### Mainstream News

- Domestic news RSS.
- International news RSS.
- News APIs where licensing permits.
- GDELT event/document data.

### Developer and Tech

- Hacker News API.
- GitHub Blog RSS.
- GitHub Status RSS/API.
- Vercel Status RSS/API.
- Cloudflare Status RSS/API.
- Android Developers Blog RSS.
- OpenAI/Gemini/Anthropic official blogs if allowed by RSS or public feeds.

### Trends

- Naver DataLab.
- Google Trends if official access is available.
- Mastodon trend endpoints.
- Reddit only if terms and commercial limitations are acceptable.

### User Custom Sources

- User-added RSS feed URLs.
- User-added keywords.
- User-added domains.

## 3. Source Adapter Interface

```ts
export interface SourceAdapter {
  id: string;
  displayName: string;
  sourceType: 'rss' | 'api' | 'status' | 'trend';
  fetch(input: FetchInput): Promise<FetchResult>;
  normalize(payload: unknown): Promise<NormalizedItem[]>;
}

export interface FetchInput {
  windowStart: Date;
  windowEnd: Date;
  locale?: string;
  region?: string;
  keywords?: string[];
  cursor?: string;
}

export interface NormalizedItem {
  externalId?: string;
  title: string;
  url: string;
  canonicalUrl?: string;
  sourceName: string;
  sourceUrl?: string;
  publishedAt?: Date;
  fetchedAt: Date;
  snippet?: string;
  author?: string;
  language?: string;
  region?: string;
  category?: string;
  tags?: string[];
  rawMetadata?: Record<string, unknown>;
}
```

## 4. Source Reliability Model

Each source should have a reliability profile.

| Field | Meaning |
|---|---|
| source_reliability_score | Baseline trust score from 0 to 1 |
| official_source | Whether the source is an official organization/status page |
| primary_reporting | Whether the source tends to originate reporting |
| aggregation_only | Whether the source aggregates others |
| historical_error_rate | Internal quality metric based on corrections/feedback |
| fetch_stability | API/feed stability |

## 5. Trend Data Rules

Trend data must be labeled as trend signals, not factual events.

Example:

```text
Allowed: "This keyword showed increased search/social activity during the inactive window."
Not allowed: "This event happened" unless independently verified by news or official source.
```

## 6. Recommended Source Prioritization

### MVP

| Priority | Source Type | Reason |
|---:|---|---|
| 1 | RSS feeds | Low cost, simple, stable |
| 2 | Hacker News API | Excellent for developer audience |
| 3 | GDELT | Broad global discovery |
| 4 | Status pages | High value for developers |
| 5 | Naver DataLab | Korean trend signal |

### Later

| Source Type | Add When |
|---|---|
| Reddit | When legal/API terms are reviewed |
| Mastodon | When social trend section is stable |
| YouTube | When video/news trend use case is clear |
| Android companion app | When usage detection is needed |

## 7. Source Configuration Table

Each source should be configurable:

- enabled/disabled.
- fetch interval.
- timeout.
- retry count.
- rate limit.
- category mapping.
- locale mapping.
- legal status.
- attribution requirement.

## 8. Content Storage Policy

Store:

- Title.
- URL.
- Canonical URL.
- Source name.
- Published timestamp.
- Fetched timestamp.
- Short snippet if provided by source/feed/API.
- Generated summary.
- Classification labels.
- Source metadata required for traceability.

Avoid storing:

- Full article text unless license permits.
- Paywalled text.
- User comments from restricted platforms unless terms allow.
- Sensitive personal data extracted from articles unless strictly necessary for public-interest reporting and displayed carefully.

## 9. Source Health Monitoring

Track:

- Last successful fetch time.
- Consecutive failure count.
- Average response time.
- Items fetched per run.
- Error code distribution.
- API quota remaining if available.

Show source health in an internal admin dashboard.
