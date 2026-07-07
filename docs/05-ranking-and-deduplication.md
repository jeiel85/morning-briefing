# 05. Ranking and Deduplication

## 1. Purpose

The ranking engine decides what deserves the user's limited morning attention. It should prioritize relevance, reliability, urgency, and novelty.

## 2. Deduplication Layers

### Layer 1: Exact URL Duplicate

Match by canonical URL hash.

### Layer 2: Source External ID

Some APIs provide stable IDs. Use them when available.

### Layer 3: Title Similarity

Use normalized title similarity.

Recommended algorithm:

- Jaccard similarity over token sets.
- Trigram similarity in PostgreSQL.
- Threshold: 0.82 for same-language titles.

### Layer 4: Semantic Similarity

Optional after MVP.

- Generate embeddings for title + snippet.
- Compare within the same time window and category.
- Threshold: tune with real data, start around 0.88 cosine similarity.

### Layer 5: Cluster Merge

Cluster related but not identical stories.

Example:

- Article A: "Major cloud provider reports outage"
- Article B: "Developers report deployment failures"
- Article C: "Status page confirms elevated error rate"

These may form one cluster if source timestamps and content align.

## 3. Topic Cluster Model

A cluster represents a story/topic, not a single article.

Fields:

- title.
- category.
- primary_region.
- language.
- first_seen_at.
- last_seen_at.
- item_count.
- source_count.
- reliability_score.
- urgency_score.
- trend_score.
- relevance_score.
- final_score.
- status: confirmed, developing, trend_signal, low_confidence.

## 4. Ranking Formula

Initial scoring formula:

```text
final_score =
  0.25 * relevance_score +
  0.20 * urgency_score +
  0.20 * source_consensus_score +
  0.15 * source_reliability_score +
  0.10 * freshness_score +
  0.05 * trend_score +
  0.05 * novelty_score
```

Weights should be configurable per user profile.

## 5. Score Definitions

### Relevance Score

Based on:

- User interest keyword match.
- Category preference.
- Click/feedback history.
- Explicit blocked keywords.
- Region/language preference.

### Urgency Score

Based on:

- Breaking/emergency labels.
- Official source status incident.
- Multiple reports in short time.
- Market/public safety relevance.
- User-configured urgent keywords.

### Source Consensus Score

Based on number and diversity of sources.

Example:

| Condition | Score |
|---|---:|
| Single low-reliability source | 0.2 |
| Single official source | 0.8 |
| Multiple independent reliable sources | 0.9 |
| Broad coverage across regions | 1.0 |

### Source Reliability Score

Source baseline reliability from configuration.

### Freshness Score

Higher when published during the user's inactive window and close to wake time.

### Trend Score

Search/social/trend signal increase. Must not override reliability for factual claims.

### Novelty Score

Rewards new topics not already shown in previous briefings.

## 6. Classification Status

| Status | Meaning | Display Rule |
|---|---|---|
| confirmed | Supported by reliable/official/multiple sources | Can appear in main section |
| developing | Credible but still evolving | Show with developing label |
| trend_signal | Trend data only, not fact confirmation | Show under trend section |
| low_confidence | Weak or single questionable source | Hide by default or show in low priority |

## 7. User Feedback Loop

Feedback actions:

- Useful.
- Not useful.
- Too many like this.
- Show more like this.
- Block this source.
- Block this keyword.
- Mark duplicate.

Impact:

- Update user preference weights.
- Reduce source/category/item type score.
- Improve deduplication examples.

## 8. Ranking Pseudocode

```ts
function rankCluster(cluster: TopicCluster, user: UserPreference): RankedCluster {
  const relevance = computeRelevance(cluster, user);
  const urgency = computeUrgency(cluster);
  const consensus = computeSourceConsensus(cluster);
  const reliability = computeSourceReliability(cluster);
  const freshness = computeFreshness(cluster, user.inactiveWindow);
  const trend = computeTrendScore(cluster);
  const novelty = computeNovelty(cluster, user.history);

  const finalScore =
    0.25 * relevance +
    0.20 * urgency +
    0.20 * consensus +
    0.15 * reliability +
    0.10 * freshness +
    0.05 * trend +
    0.05 * novelty;

  return {
    cluster,
    finalScore,
    explanation: buildRankingExplanation({ relevance, urgency, consensus, reliability, freshness, trend, novelty }),
  };
}
```

## 9. Anti-Noise Rules

- Do not include more than 5 items per category unless user chooses detailed mode.
- Suppress repeated stories already shown yesterday unless there is a material update.
- Suppress purely sensational topics unless user explicitly opts in.
- Keep low-confidence trend rumors out of main news sections.
- Collapse article floods into one cluster.

## 10. Briefing Modes

| Mode | Target Length | Use Case |
|---|---|---|
| 3-minute | 5-8 items | Default morning scan |
| 10-minute | 10-20 items | Detailed catch-up |
| Full | 30+ items | Power users |
| Developer | Prioritize outages, AI, tools, GitHub, cloud |
| Global | Prioritize international events |
