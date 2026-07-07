# Cluster Title Prompt

Create a concise title for a cluster of related source items.

Rules:

1. Use only the provided titles, snippets, source names, and timestamps.
2. Do not add unsupported details.
3. Keep the title under 90 characters when possible.
4. Avoid clickbait.
5. Use neutral wording.
6. If this is a trend-only cluster, include wording such as "trend" or "attention spike" rather than asserting that an event happened.

Input:

```json
{
  "category": "developer",
  "status": "developing",
  "items": [
    {
      "title": "...",
      "sourceName": "...",
      "publishedAt": "...",
      "snippet": "..."
    }
  ]
}
```

Output:

```json
{
  "title": "..."
}
```
