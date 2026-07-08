import { getVisitor } from "@/lib/visitor";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  confirmed: { label: "confirmed", color: "bg-green-100 text-green-700 border-green-200" },
  developing: { label: "developing", color: "bg-blue-100 text-blue-700 border-blue-200" },
  trend_signal: { label: "signal", color: "bg-amber-100 text-amber-700 border-amber-200" },
  low_confidence: { label: "low", color: "bg-neutral-100 text-neutral-500 border-neutral-200" },
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
    <div className="mx-auto max-w-3xl animate-fade-in-up">
      <a href="/app/history" className="mb-4 inline-flex items-center gap-1 text-sm text-violet-600 transition-colors hover:text-violet-800">
        <span>←</span> {t("back")}
      </a>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{briefing.title}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {briefing.briefingDate.toLocaleDateString()} · {briefing.mode.replace("_", " ")}
        </p>
        {briefing.summary && (
          <p className="mt-3 rounded-lg border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-800">{briefing.summary}</p>
        )}
        {briefing.coverageNote && (
          <p className="mt-2 text-xs italic text-neutral-400">{briefing.coverageNote}</p>
        )}
      </div>

      <div className="space-y-4">
        {briefing.items.map((item, idx) => {
          const isUrgent = item.finalScore >= 0.9;
          const st = STATUS_LABELS[item.status] ?? { label: item.status.replace(/_/g, " "), color: "bg-neutral-100 text-neutral-600 border-neutral-200" };
          return (
            <article
              key={item.id}
              className={`rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md md:p-6 animate-scale-in ${isUrgent ? "border-red-200" : "border-neutral-200"}`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-medium text-neutral-600">
                  {item.section}
                </span>
                <span className={`rounded-full border px-2 py-1 font-medium ${st.color}`}>
                  {st.label}
                </span>
                {isUrgent && (
                  <span className="rounded-full bg-red-100 px-2 py-1 font-medium text-red-600">urgent</span>
                )}
                <span className="ml-auto text-neutral-400">Score: {item.finalScore.toFixed(2)}</span>
              </div>
              <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
              <ul className="mb-3 space-y-1">
                {item.summaryBullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2 text-sm text-neutral-700">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" /> {bullet}
                  </li>
                ))}
              </ul>
              {item.whyItMatters && (
                <p className="mb-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  <span className="font-medium">Why it matters:</span> {item.whyItMatters}
                </p>
              )}
              {Array.isArray(item.sourceLinks) && item.sourceLinks.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs font-medium text-neutral-400 transition-colors hover:text-neutral-600">
                    Sources ({item.sourceLinks.length})
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {(item.sourceLinks as Array<{ title: string; url: string; sourceName: string }>).map((link, i) => (
                      <li key={i}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-600 hover:text-violet-800 hover:underline">
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
