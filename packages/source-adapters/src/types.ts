export interface SourceConfig {
  key: string;
  displayName: string;
  url?: string;
  sourceType: "rss" | "api" | "status" | "trend";
  defaultCategory?: string;
  defaultLanguage?: string;
  defaultRegion?: string;
  rateLimitPerHour?: number;
}

export interface RawItem {
  externalId?: string;
  title: string;
  url: string;
  canonicalUrl?: string;
  sourceName: string;
  publishedAt?: Date;
  snippet?: string;
  author?: string;
  language?: string;
  region?: string;
  category?: string;
  tags?: string[];
  rawMetadata?: Record<string, unknown>;
}

export interface FetchResult {
  sourceKey: string;
  status: "success" | "failed" | "partial";
  items: RawItem[];
  errorCode?: string;
  errorMessage?: string;
}

export interface SourceAdapter {
  readonly config: SourceConfig;
  fetch(windowStart: Date, windowEnd: Date): Promise<FetchResult>;
}
