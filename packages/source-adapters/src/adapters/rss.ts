import type { SourceAdapter, FetchResult, SourceConfig, RawItem } from "../types";

export class RssAdapter implements SourceAdapter {
  constructor(public readonly config: SourceConfig) {}

  async fetch(_windowStart: Date, _windowEnd: Date): Promise<FetchResult> {
    const items: RawItem[] = [];
    const errors: string[] = [];

    try {
      const res = await fetch(this.config.url!, {
        headers: { "User-Agent": "DawnBrief/1.0" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        return { sourceKey: this.config.key, status: "failed", items: [], errorCode: `HTTP_${res.status}` };
      }
      const xml = await res.text();
      const parsed = parseRssXml(xml, this.config.displayName);
      items.push(...parsed);
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }

    return {
      sourceKey: this.config.key,
      status: errors.length === 0 ? "success" : "partial",
      items,
      ...(errors.length > 0 ? { errorCode: "FETCH_ERROR", errorMessage: errors.join("; ") } : {}),
    };
  }
}

function parseRssXml(xml: string, sourceName: string): RawItem[] {
  const items: RawItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const extract = (tag: string) => {
      const m = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i").exec(block);
      return m ? m[1].trim() : undefined;
    };

    const title = extract("title");
    const link = extract("link");
    const pubDate = extract("pubDate");
    const description = extract("description");

    if (title && link) {
      items.push({
        title: stripHtml(title),
        url: link,
        sourceName,
        publishedAt: pubDate ? new Date(pubDate) : undefined,
        snippet: description ? stripHtml(description).slice(0, 500) : undefined,
      });
    }
  }
  return items;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}
