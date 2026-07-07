# 06. LLM Summarization Policy

## 1. Core Rule

The LLM must summarize retrieved source material only. It must not invent facts, numbers, quotes, causes, consequences, or timelines.

## 2. Allowed Inputs

The summarizer may use:

- Article title.
- Source name.
- URL.
- Published time.
- Snippet/description returned by source/API/RSS.
- Official status update text when license allows.
- Trend metrics returned by official APIs.
- Cluster metadata.
- Source count and reliability metadata.

The summarizer should not require full article scraping for the MVP.

## 3. Required Output Structure

Every briefing item must include:

1. Title.
2. Category.
3. Status: confirmed, developing, trend_signal, low_confidence.
4. Summary bullets.
5. Why it matters.
6. What is confirmed.
7. What is uncertain.
8. Sources.
9. Ranking explanation.

## 4. Confidence Labels

### Confirmed

Use when:

- Official source confirms it, or
- Multiple reliable independent sources report the same core fact.

### Developing

Use when:

- Reliable reporting exists but details are evolving.
- Source count is small but not weak.

### Trend Signal

Use when:

- Search/social/trend data shows attention movement.
- The system does not have independent confirmation of factual claims.

### Low Confidence

Use when:

- Single weak source.
- Unclear origin.
- Social-only rumor.
- Contradictory reports.

## 5. Hallucination Prevention

Prompt-level constraints:

- Do not introduce claims not present in input.
- Do not infer causality unless source states it.
- Do not quantify impact unless source provides numbers.
- Do not use phrases like "clearly", "definitely", or "proves" for uncertain items.
- Mention uncertainty explicitly.
- Cite source URLs in the output object.

System-level constraints:

- Validate output against JSON schema.
- Reject output if it contains source URLs not in input.
- Reject output if it includes unsupported numbers.
- Store prompt version and model version.
- Keep source snapshots sufficient for audit.

## 6. LLM Output JSON

See `schemas/briefing-json-schema.json`.

## 7. Fallback Summary

If LLM fails, generate extractive fallback:

```text
- Use cluster title.
- Include top 2-3 source titles.
- Show source links.
- Mark as "summary unavailable" or "source titles only".
```

## 8. Prompt Versioning

Every generated briefing item should store:

- prompt_version.
- model_provider.
- model_name.
- model_temperature.
- source_item_ids.
- generated_at.
- validation_status.

## 9. Temperature

Recommended:

- Summarization: 0.1-0.3.
- Title generation: 0.2.
- Personal tone rendering: 0.3.

Avoid high-temperature generation for factual news.

## 10. Example Output

```json
{
  "title": "Cloud provider reports elevated deployment errors",
  "category": "developer",
  "status": "confirmed",
  "summaryBullets": [
    "An official status page reported elevated errors during the user's inactive window.",
    "Several developer-facing sources also discussed deployment failures.",
    "The incident may affect teams deploying during the morning window."
  ],
  "whyItMatters": "This may affect project deployments, CI/CD pipelines, or production operations.",
  "confirmedFacts": [
    "The official status page reported an incident.",
    "The issue was observed during the configured inactive window."
  ],
  "uncertainties": [
    "The full root cause may not yet be published."
  ],
  "sources": [
    {
      "title": "Provider status page update",
      "url": "https://status.example.com/incidents/123",
      "sourceName": "Example Status"
    }
  ],
  "rankingExplanation": "Shown because it matched the user's developer and deployment interests and came from an official source."
}
```
