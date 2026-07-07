import type { SourceConfig, SourceAdapter } from "./types";
import { RssAdapter } from "./adapters/rss";
import { HackerNewsAdapter } from "./adapters/hackernews";

export function createAdapter(config: SourceConfig): SourceAdapter {
  switch (config.key) {
    case "hn-frontpage":
      return new HackerNewsAdapter(config);
    default:
      return new RssAdapter(config);
  }
}
