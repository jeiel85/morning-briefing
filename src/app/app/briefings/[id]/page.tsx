import { getVisitor } from "@/lib/visitor";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

const STATUS_MAP: Record<string, { label: string; light: string; dark: string }> = {
  confirmed: { label: "confirmed", light: "bg-green-100 text-green-700 border-green-200", dark: "dark:bg-green-950/40 dark:text-green-400 dark:border-green-900" },
  developing: { label: "developing", light: "bg-blue-100 text-blue-700 border-blue-200", dark: "dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900" },
  trend_signal: { label: "signal", light: "bg-amber-100 text-amber-700 border-amber-200", dark: "dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900" },
  low_confidence: { label: "low", light: "bg-neutral-100 text-neutral-500 border-neutral-200", dark: "dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700" },
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
      <a href="/app/history" className="mb-4 inline-flex items-center gap-1 text-sm text-violet-600 transition-colors hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300">
        <span>←</span> {t("back")}
      </a>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{briefing.title}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {briefing.briefingDate.toLocaleDateString()} · {briefing.mode.replace("_", " ")}
        </p>
        {briefing.summary && (
          <p className="mt-3 rounded-lg border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-800 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300">{briefing.summary}</p>
        )}
        {briefing.coverageNote && (
          <p className="mt-2 text-xs italic text-[var(--text-tertiary)]">{briefing.coverageNote}</p>
        )}
      </div>

      <div className="space-y-4">
        {briefing.items.map((item, idx) => {
          const isUrgent = item.finalScore >= 0.9;
          const s = STATUS_MAP[item.status] ?? { label: item.status.replace(/_/g, " "), light: "bg-neutral-100 text-neutral-600 border-neutral-200", dark: "dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700" };
          return (
            <article
              key={item.id}
              className={`rounded-xl border bg-[var(--surface)] p-5 shadow-sm transition-all hover:shadow-md md:p-6 animate-scale-in ${isUrgent ? "border-red-200 dark:border-red-900" : "border-[var(--border)]"}`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">{item.section}</span>
                <span className={`rounded-full border px-2 py-1 font-medium ${s.light} ${s.dark}`}>{s.label}</span>
                {isUrgent && <span className="rounded-full bg-red-100 px-2 py-1 font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">urgent</span>}
                <span className="ml-auto text-[var(--text-tertiary)]">Score: {item.finalScore.toFixed(2)}</span>
              </div>
              <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
              <ul className="mb-3 space-y-1">
                {item.summaryBullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600" /> {bullet}
                  </li>
                ))}
              </ul>
              {item.whyItMatters && (
                <p className="mb-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400">
                  <span className="font-medium">Why it matters:</span> {item.whyItMatters}
                </p>
              )}
              {Array.isArray(item.sourceLinks) && item.sourceLinks.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs font-medium text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]">
                    Sources ({item.sourceLinks.length})
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {(item.sourceLinks as Array<{ title: string; url: string; sourceName: string }>).map((link, i) => (
                      <li key={i}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-600 hover:text-violet-800 hover:underline dark:text-violet-400 dark:hover:text-violet-300">
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
