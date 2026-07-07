import { getVisitor } from "@/lib/visitor";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

const STATUS_LABELS: Record<string, string> = {
  confirmed: "confirmed",
  developing: "developing",
  trend_signal: "signal",
  low_confidence: "low",
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  developing: "bg-blue-100 text-blue-700",
  trend_signal: "bg-amber-100 text-amber-700",
  low_confidence: "bg-neutral-100 text-neutral-500",
};

export default async function BriefingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getVisitor();
  if (!user) notFound();
  const t = await getTranslations("history");

  const { id } = await params;

  const briefing = await prisma.briefing.findUnique({
    where: { id },
    include: { items: { orderBy: { rank: "asc" } } },
  });

  if (!briefing || briefing.userId !== user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <a href="/app/history" className="mb-4 inline-block text-sm text-blue-600 hover:underline">
        {t("back")}
      </a>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{briefing.title}</h1>
        <p className="text-sm text-neutral-500">
          {briefing.briefingDate.toLocaleDateString()} · {briefing.mode.replace("_", " ")}
        </p>
        {briefing.summary && (
          <p className="mt-2 text-sm text-neutral-600">{briefing.summary}</p>
        )}
        {briefing.coverageNote && (
          <p className="mt-1 text-xs italic text-neutral-400">{briefing.coverageNote}</p>
        )}
      </div>

      <div className="space-y-4">
        {briefing.items.map((item) => {
          const isUrgent = item.finalScore >= 0.9;
          return (
            <article key={item.id} className={`rounded-lg border p-5 ${isUrgent ? "border-red-200" : "border-neutral-200"}`}>
              <div className="mb-2 flex items-center gap-2 text-xs">
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-neutral-600">
                  {item.section}
                </span>
                <span className={`rounded-full px-2 py-0.5 font-medium ${STATUS_COLORS[item.status] ?? "bg-neutral-100 text-neutral-600"}`}>
                  {STATUS_LABELS[item.status] ?? item.status.replace(/_/g, " ")}
                </span>
                {isUrgent && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-600">
                    urgent
                  </span>
                )}
                <span className="ml-auto text-neutral-400">
                  Score: {item.finalScore.toFixed(2)}
                </span>
              </div>
              <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
              <ul className="mb-3 space-y-1">
                {item.summaryBullets.map((bullet, i) => (
                  <li key={i} className="text-sm text-neutral-700">· {bullet}</li>
                ))}
              </ul>
              {item.whyItMatters && (
                <p className="mb-3 text-sm text-neutral-600">
                  <span className="font-medium">Why it matters:</span> {item.whyItMatters}
                </p>
              )}
              {Array.isArray(item.sourceLinks) && item.sourceLinks.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs font-medium text-neutral-500 hover:text-neutral-700">
                    Sources ({item.sourceLinks.length})
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {(item.sourceLinks as Array<{ title: string; url: string; sourceName: string }>).map((link, i) => (
                      <li key={i}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                          {link.sourceName} — {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
