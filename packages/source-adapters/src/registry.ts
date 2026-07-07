import type { SourceConfig, SourceAdapter } from "./types";
import { RssAdapter } from "./adapters/rss";

export const DEFAULT_SOURCES: SourceConfig[] = [
  {
    key: "github-blog",
    displayName: "GitHub Blog",
    url: "https://github.blog/feed/",
    sourceType: "rss",
    defaultCategory: "developer",
    defaultLanguage: "en",
    defaultRegion: "global",
    rateLimitPerHour: 6,
  },
  {
    key: "github-status",
    displayName: "GitHub Status",
    url: "https://www.githubstatus.com/history.atom",
    sourceType: "rss",
    defaultCategory: "developer",
    defaultLanguage: "en",
    defaultRegion: "global",
    rateLimitPerHour: 12,
  },
  {
    key: "vercel-status",
    displayName: "Vercel Status",
    url: "https://www.vercel-status.com/history.atom",
    sourceType: "rss",
    defaultCategory: "developer",
    defaultLanguage: "en",
    defaultRegion: "global",
    rateLimitPerHour: 12,
  },
  {
    key: "hn-frontpage",
    displayName: "Hacker News",
    url: "https://hnrss.org/frontpage",
    sourceType: "rss",
    defaultCategory: "technology",
    defaultLanguage: "en",
    defaultRegion: "global",
    rateLimitPerHour: 6,
  },
  {
    key: "cloudflare-status",
    displayName: "Cloudflare Status",
    url: "https://www.cloudflarestatus.com/history.atom",
    sourceType: "rss",
    defaultCategory: "developer",
    defaultLanguage: "en",
    defaultRegion: "global",
    rateLimitPerHour: 12,
  },
  {
    key: "arstechnica",
    displayName: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    sourceType: "rss",
    defaultCategory: "technology",
    defaultLanguage: "en",
    defaultRegion: "global",
    rateLimitPerHour: 6,
  },
];

export function createAdapter(config: SourceConfig): SourceAdapter {
  switch (config.sourceType) {
    case "rss":
    case "status":
      return new RssAdapter(config);
    default:
      throw new Error(`Unsupported source type: ${config.sourceType}`);
  }
}
