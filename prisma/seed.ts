import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_SOURCES = [
  {
    key: "github-blog",
    displayName: "GitHub Blog",
    sourceType: "rss" as const,
    url: "https://github.blog/feed/",
    defaultCategory: "developer",
    defaultLanguage: "en",
    defaultRegion: "global",
    reliabilityScore: 0.9,
    officialSource: true,
    rateLimitPerHour: 6,
    legalStatus: "safe",
  },
  {
    key: "github-status",
    displayName: "GitHub Status",
    sourceType: "rss" as const,
    url: "https://www.githubstatus.com/history.atom",
    defaultCategory: "developer",
    reliabilityScore: 0.95,
    officialSource: true,
    rateLimitPerHour: 12,
    legalStatus: "safe",
  },
  {
    key: "vercel-status",
    displayName: "Vercel Status",
    sourceType: "rss" as const,
    url: "https://www.vercel-status.com/history.atom",
    defaultCategory: "developer",
    reliabilityScore: 0.95,
    officialSource: true,
    rateLimitPerHour: 12,
    legalStatus: "safe",
  },
  {
    key: "cloudflare-status",
    displayName: "Cloudflare Status",
    sourceType: "rss" as const,
    url: "https://www.cloudflarestatus.com/history.atom",
    defaultCategory: "developer",
    reliabilityScore: 0.95,
    officialSource: true,
    rateLimitPerHour: 12,
    legalStatus: "safe",
  },
  {
    key: "hn-frontpage",
    displayName: "Hacker News",
    sourceType: "api" as const,
    defaultCategory: "technology",
    defaultLanguage: "en",
    defaultRegion: "global",
    reliabilityScore: 0.6,
    officialSource: false,
    rateLimitPerHour: 6,
    legalStatus: "safe",
  },
  {
    key: "arstechnica",
    displayName: "Ars Technica",
    sourceType: "rss" as const,
    url: "https://feeds.arstechnica.com/arstechnica/index",
    defaultCategory: "technology",
    defaultLanguage: "en",
    defaultRegion: "global",
    reliabilityScore: 0.8,
    officialSource: false,
    rateLimitPerHour: 6,
    legalStatus: "review_required",
  },
  {
    key: "yozm",
    displayName: "요즘IT",
    sourceType: "rss" as const,
    url: "https://yozm.wishket.com/feed/",
    defaultCategory: "technology",
    defaultLanguage: "ko",
    defaultRegion: "kr",
    reliabilityScore: 0.7,
    officialSource: false,
    rateLimitPerHour: 6,
    legalStatus: "safe",
  },
  {
    key: "itworld",
    displayName: "ITWorld Korea",
    sourceType: "rss" as const,
    url: "https://www.itworld.co.kr/rss/",
    defaultCategory: "technology",
    defaultLanguage: "ko",
    defaultRegion: "kr",
    reliabilityScore: 0.75,
    officialSource: false,
    rateLimitPerHour: 6,
    legalStatus: "safe",
  },
  {
    key: "clien-news",
    displayName: "Clien 뉴스",
    sourceType: "rss" as const,
    url: "https://www.clien.net/service/board/news/rss",
    defaultCategory: "technology",
    defaultLanguage: "ko",
    defaultRegion: "kr",
    reliabilityScore: 0.5,
    officialSource: false,
    rateLimitPerHour: 6,
    legalStatus: "review_required",
  },
];

async function main() {
  for (const source of DEFAULT_SOURCES) {
    await prisma.source.upsert({
      where: { key: source.key },
      update: source,
      create: source,
    });
    console.log(`Seeded: ${source.key}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
