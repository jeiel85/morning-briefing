# Goal 02. Ingestion

## Objective

Implement source adapters and normalized raw item ingestion.

## Deliverables

- Source adapter interface.
- RSS adapter.
- Hacker News adapter.
- Status page RSS adapter.
- Source fetch run tracking.
- Raw item persistence.
- URL canonicalization.
- Basic deduplication.

## Tasks

### 1. Source Adapter Package

Create:

```text
packages/source-adapters/
├─ src/
│  ├─ types.ts
│  ├─ registry.ts
│  ├─ adapters/rss-adapter.ts
│  ├─ adapters/hacker-news-adapter.ts
│  └─ normalize.ts
```

### 2. Source Registry

Seed default sources:

- Hacker News.
- GitHub Blog.
- GitHub Status.
- Vercel Status.
- Cloudflare Status.
- Selected RSS feeds.

### 3. Fetch Job

Implement `source.fetch` worker job.

### 4. Normalization

Normalize fields:

- title.
- url.
- canonicalUrl.
- sourceName.
- publishedAt.
- fetchedAt.
- snippet.
- category.
- language.
- region.

### 5. Dedupe

Start with canonical URL hash and normalized title hash.

## Acceptance Criteria

- Worker can fetch at least 3 sources.
- Raw items are stored without duplicates.
- Source fetch run shows success/failure.
- Failed source does not crash all ingestion.
- Unit tests cover URL canonicalization.

## Suggested Commit Names

- `feat: add source adapter interface`
- `feat: implement rss and hacker news ingestion`
- `feat: persist normalized raw items`
