import type { SourceAdapter, FetchResult, SourceConfig, RawItem } from "../types";

const HN_TOP_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
const HN_ITEM_URL = "https://hacker-news.firebaseio.com/v0/item";

export class HackerNewsAdapter implements SourceAdapter {
  constructor(public readonly config: SourceConfig) {}

  async fetch(windowStart: Date, windowEnd: Date): Promise<FetchResult> {
    const items: RawItem[] = [];
    const errors: string[] = [];

    try {
      const res = await fetch(HN_TOP_URL, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) {
        return { sourceKey: this.config.key, status: "failed", items: [], errorCode: `HTTP_${res.status}` };
      }
      const ids: number[] = await res.json();
      const batch = ids.slice(0, 30);

      const storyResults = await Promise.allSettled(
        batch.map((id) =>
          fetch(`${HN_ITEM_URL}/${id}.json`, { signal: AbortSignal.timeout(5000) }).then((r) => r.json()),
        ),
      );

      for (const result of storyResults) {
        if (result.status === "rejected") {
          errors.push(result.reason?.message ?? "Unknown");
          continue;
        }
        const story = result.value;
        if (!story || story.type !== "story" || !story.title || !story.url) continue;

        const publishedAt = story.time ? new Date(story.time * 1000) : undefined;
        if (publishedAt && (publishedAt < windowStart || publishedAt > windowEnd)) continue;

        items.push({
          externalId: String(story.id),
          title: story.title,
          url: story.url,
          sourceName: this.config.displayName,
          publishedAt,
          snippet: story.text?.slice(0, 500),
          author: story.by,
          tags: ["hackernews"],
        });
      }
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }

    return {
      sourceKey: this.config.key,
      status: errors.length === 0 ? "success" : errors.length > 5 ? "partial" : "failed",
      items,
      ...(errors.length > 0 ? { errorCode: "FETCH_ERROR", errorMessage: errors.join("; ") } : {}),
    };
  }
}
