import { getVisitor } from "@/lib/visitor";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { safeExternalUrl } from "@/lib/utils";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import Link from "next/link";

function statusStyle(status: string): { label: string; cls: string } {
  switch (status) {
    case "confirmed":
      return { label: "confirmed", cls: "text-emerald-600 bg-emerald-500/10 ring-emerald-500/20 dark:text-emerald-400" };
    case "developing":
      return { label: "developing", cls: "text-iris bg-iris/10 ring-iris/25" };
    case "trend_signal":
      return { label: "signal", cls: "text-sun-deep bg-sun/10 ring-sun/25 dark:text-sun" };
    case "low_confidence":
      return { label: "low", cls: "text-[var(--text-tertiary)] bg-[var(--surface-2)] ring-[var(--border)]" };
    default:
      return { label: status.replace(/_/g, " "), cls: "text-[var(--text-secondary)] bg-[var(--surface-2)] ring-[var(--border)]" };
  }
}

export default async function BriefingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getVisitor();
  if (!user) notFound();
  const [th, td] = await Promise.all([getTranslations("history"), getTranslations("dashboard")]);
  const { id } = await params;

  const briefing = await prisma.briefing.findUnique({
    where: { id },
    include: { items: { orderBy: { rank: "asc" } } },
  });

  if (!briefing || briefing.userId !== user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl animate-fade-in-up">
      <Link
        href="/app/history"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-aurora transition-colors hover:text-iris"
      >
        <ArrowLeft className="h-4 w-4" /> {th("back")}
      </Link>

      <div className="mb-7">
        <h1 className="font-display text-2xl font-medium md:text-3xl">{briefing.title}</h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">
          {briefing.briefingDate.toLocaleDateString()} · {briefing.mode.replace(/_/g, " ")}
        </p>
        {briefing.summary && (
          <p className="mt-4 rounded-xl border border-aurora/15 bg-aurora/[0.06] px-4 py-3 text-sm leading-relaxed text-[var(--text)]">
            {briefing.summary}
          </p>
        )}
        {briefing.coverageNote && (
          <p className="mt-2 text-xs italic text-[var(--text-tertiary)]">{briefing.coverageNote}</p>
        )}
      </div>

      <div className="space-y-4">
        {briefing.items.map((item, idx) => {
          const isUrgent = item.finalScore >= 0.9;
          const st = statusStyle(item.status);
          return (
            <article
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl border bg-[var(--surface)] p-5 shadow-sm transition-all duration-300 hover:shadow-lift md:p-6 animate-scale-in ${
                isUrgent ? "border-rose-dawn/40" : "border-[var(--border)]"
              }`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {isUrgent && (
                <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-rose-dawn to-sun" />
              )}
              <div className="mb-2.5 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono text-sm font-medium text-[var(--text-tertiary)]">
                  {String(item.rank).padStart(2, "0")}
                </span>
                <span className="rounded-md bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">
                  {item.section}
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${st.cls}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  {st.label}
                </span>
                {isUrgent && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-dawn/10 px-2 py-0.5 text-[11px] font-medium text-rose-dawn ring-1 ring-inset ring-rose-dawn/25">
                    <TriangleAlert className="h-3 w-3" />
                    {td("urgent")}
                  </span>
                )}
                <span className="ml-auto font-mono text-xs text-[var(--text-tertiary)]">
                  {td("score")}: {item.finalScore.toFixed(2)}
                </span>
              </div>

              <h2 className="mb-3 font-display text-lg font-medium leading-snug text-[var(--text)]">{item.title}</h2>

              <ul className="mb-3 space-y-1.5">
                {item.summaryBullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--border-strong)]" /> {bullet}
                  </li>
                ))}
              </ul>

              {item.whyItMatters && (
                <p className="mb-3 rounded-lg border border-sun/20 bg-sun/[0.08] px-3 py-2 text-sm text-[var(--text)]">
                  <span className="font-medium text-sun-deep dark:text-sun">{td("why_matters")}:</span> {item.whyItMatters}
                </p>
              )}

              {Array.isArray(item.sourceLinks) && item.sourceLinks.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-wide text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]">
                    {td("sources", { count: item.sourceLinks.length })}
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {(item.sourceLinks as Array<{ title: string; url: string; sourceName: string }>).map((link, i) => {
                      const href = safeExternalUrl(link.url);
                      const label = `${link.sourceName} — ${link.title}`;
                      return (
                        <li key={i} className="text-xs">
                          {href ? (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="text-aurora transition-colors hover:text-iris hover:underline">
                              {label}
                            </a>
                          ) : (
                            <span className="text-[var(--text-tertiary)]">{label}</span>
                          )}
                        </li>
                      );
                    })}
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
