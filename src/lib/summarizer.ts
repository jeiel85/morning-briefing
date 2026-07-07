import { translateBullets } from "./translate";

export interface SummaryInput {
  title: string;
  category: string;
  sourceCount: number;
  items: Array<{
    title: string;
    snippet?: string | null;
    sourceName: string;
    publishedAt?: Date | null;
    url: string;
  }>;
}

export interface SummaryResult {
  summaryBullets: string[];
  whyItMatters?: string;
  confirmedFacts: string[];
  uncertainties: string[];
  modelProvider?: string;
  modelName?: string;
  validationStatus: "valid" | "limited" | "failed";
}

export async function generateSummary(input: SummaryInput): Promise<SummaryResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return generateFallback(input);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a briefing summarizer. Generate a concise factual summary.
Return JSON only: { "summaryBullets": string[], "whyItMatters": string, "confirmedFacts": string[], "uncertainties": string[] }`,
          },
          {
            role: "user",
            content: `Title: ${input.title}
Category: ${input.category}
Sources: ${input.sourceCount}

Articles:
${input.items.map((i) => `- ${i.sourceName}: ${i.title}${i.snippet ? ` — ${i.snippet.slice(0, 200)}` : ""}`).join("\n")}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 500,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) return generateFallback(input);

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    return {
      summaryBullets: content.summaryBullets ?? [],
      whyItMatters: content.whyItMatters ?? undefined,
      confirmedFacts: content.confirmedFacts ?? [],
      uncertainties: content.uncertainties ?? [],
      modelProvider: "openai",
      modelName: "gpt-4o-mini",
      validationStatus: "valid",
    };
  } catch {
    return generateFallback(input);
  }
}

async function generateFallback(input: SummaryInput): Promise<SummaryResult> {
  const bullets = input.items.slice(0, 5).map((item) => {
    const preview = item.snippet
      ? item.snippet.replace(/<[^>]*>/g, "").slice(0, 120)
      : null;
    return preview
      ? `${item.sourceName}: ${preview}…`
      : `${item.sourceName}: ${item.title}`;
  });

  const translated = await translateBullets(bullets);

  return {
    summaryBullets: translated,
    whyItMatters: undefined,
    confirmedFacts: [],
    uncertainties: [],
    validationStatus: "limited",
  };
}
