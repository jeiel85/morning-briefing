# 04. Ingestion Pipeline

## 1. Pipeline Goals

The ingestion pipeline must transform heterogeneous external data into reliable, normalized, deduplicated, and rankable content items.

## 2. Pipeline Stages

```text
Schedule Window
  -> Source Fetch
  -> Raw Payload Validation
  -> Normalization
  -> Canonical URL Resolution
  -> Language/Region/Category Classification
  -> Duplicate Detection
  -> Cluster Candidate Creation
  -> Persist Raw Items
  -> Emit Cluster Build Job
```

## 3. Fetch Windows

For each user's inactive window, the system needs relevant items from that time range.

However, fetching per user is inefficient. Use shared global fetch windows:

- Hourly source ingestion.
- Store normalized items globally.
- Generate user-specific briefings by filtering global items against user windows and preferences.

Example:

```text
Global fetch every 30 or 60 minutes.
User briefing at 07:00 queries items where:
  published_at >= user.window_start
  published_at <= user.window_end
```

## 4. Source Fetch Run

Each fetch creates a `SourceFetchRun` record.

Fields:

- source_id.
- started_at.
- completed_at.
- status.
- window_start.
- window_end.
- fetched_count.
- normalized_count.
- skipped_count.
- error_code.
- error_message.
- retry_count.

## 5. Normalization Rules

### Required Fields

- title.
- url.
- source_name.
- fetched_at.

### Optional but Strongly Recommended

- published_at.
- snippet.
- category.
- language.
- region.

### URL Canonicalization

Apply:

- Lowercase host.
- Remove tracking parameters such as `utm_*`, `fbclid`, `gclid`.
- Normalize trailing slash.
- Resolve known AMP URLs if possible.
- Hash canonical URL.

## 6. Language Detection

Use a lightweight language detector or source-level default.

Rules:

- If source has known locale, use it as default.
- If title/snippet language conflicts, run detector.
- Store confidence.

## 7. Category Classification

Initial approach:

- Source-level category mapping.
- Keyword rules.
- LLM classifier only as fallback for ambiguous items.

Categories:

- domestic_news.
- global_news.
- economy.
- technology.
- ai.
- developer.
- social_trend.
- emergency.
- status_outage.
- user_keyword.

## 8. Duplicate Detection

Use layered dedupe:

1. Exact canonical URL hash.
2. Source external ID.
3. Title normalized hash.
4. Similarity check using title/snippet.
5. Optional embedding similarity for high volume.

Normalized title:

- Lowercase.
- Remove punctuation.
- Remove source suffixes.
- Collapse whitespace.
- Remove bracketed tags such as `[속보]`, `[Breaking]` but preserve urgency metadata.

## 9. Retry Policy

| Error Type | Retry? | Notes |
|---|---|---|
| Network timeout | Yes | Exponential backoff |
| 429 rate limit | Yes | Respect retry-after |
| 4xx auth error | No | Mark source unhealthy |
| Malformed payload | No | Save sample payload hash |
| 5xx provider error | Yes | Retry limited times |

## 10. Partial Failure Policy

A source failure should never block the entire briefing.

If key sources fail, briefing should include a coverage note:

```text
Coverage note: Some configured sources could not be fetched during this run. The affected categories may be incomplete.
```

## 11. Ingestion Pseudocode

```ts
async function runSourceFetch(source: Source, window: TimeWindow) {
  const run = await createFetchRun(source, window);

  try {
    const adapter = adapterRegistry.get(source.type);
    const payload = await adapter.fetch({
      windowStart: window.start,
      windowEnd: window.end,
      locale: source.locale,
      region: source.region,
    });

    const normalized = await adapter.normalize(payload);
    const cleaned = normalized.map(normalizeItem);
    const unique = await dedupeItems(cleaned);

    await db.rawItem.createMany({ data: unique, skipDuplicates: true });
    await completeFetchRun(run.id, { fetchedCount: payload.count, normalizedCount: unique.length });

    await queue.add('cluster.build', { window });
  } catch (error) {
    await failFetchRun(run.id, error);
    if (isRetryable(error)) throw error;
  }
}
```

## 12. Data Retention

Recommended defaults:

- Raw source metadata: 90 days.
- Generated briefings: user-controlled, default 365 days.
- Delivery logs: 90 days.
- Error logs: 30-90 days.
- Full raw payload samples: avoid storing; if needed, redact and retain briefly.
