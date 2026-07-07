# Goal 03. Briefing Engine

## Objective

Build cluster, ranking, and LLM summarization pipeline.

## Deliverables

- Topic cluster creation.
- Ranking engine.
- Briefing generation job.
- LLM provider abstraction.
- JSON schema validation.
- Fallback extractive summary.

## Tasks

### 1. Cluster Builder

Group raw items by:

- Similar title.
- Same canonical URL.
- Same category/time range.
- Optional semantic similarity later.

### 2. Ranking Engine

Implement scoring:

```text
final_score =
  0.25 relevance +
  0.20 urgency +
  0.20 consensus +
  0.15 reliability +
  0.10 freshness +
  0.05 trend +
  0.05 novelty
```

### 3. Summarizer

Create LLM provider interface:

```ts
interface LlmProvider {
  generateBriefingItem(input: BriefingItemInput): Promise<BriefingItemOutput>;
}
```

### 4. Validation

Validate with `briefing-json-schema.json`.

### 5. Fallback

If LLM fails, use source titles/snippets only and mark summary as limited.

## Acceptance Criteria

- User-specific briefing can be generated from seeded raw items.
- Blocked keywords suppress items.
- Interest keywords boost items.
- Trend-only item is labeled `trend_signal`.
- Output validates against schema.
- Briefing generation is idempotent.

## Suggested Commit Names

- `feat: add topic clustering`
- `feat: implement personalized ranking engine`
- `feat: generate source-linked briefing items`
