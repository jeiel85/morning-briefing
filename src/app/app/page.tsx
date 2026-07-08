import { getVisitor } from "@/lib/visitor";
import { prisma } from "@/lib/db";
import { saveFeedback } from "@/lib/actions";
import { GenerateButton } from "@/components/GenerateButton";
import { getTranslations } from "next-intl/server";
import { safeExternalUrl } from "@/lib/utils";
import { Sunrise, TriangleAlert } from "lucide-react";

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

export default async function DashboardPage() {
  const user = await getVisitor();
  const t = await getTranslations("dashboard");

  let briefing = null;
  if (user) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    briefing = await prisma.briefing.findFirst({
      where: { userId: user.id, briefingDate: { gte: today } },
      include: { items: { orderBy: { rank: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
  }

  if (!briefing || briefing.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in-up">
        <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-aurora/15 to-sun/15 text-aurora ring-1 ring-inset ring-aurora/20">
          <Sunrise className="h-7 w-7" />
        </span>
        <h1 className="font-display text-2xl font-medium">{t("title")}</h1>
        <p className="mt-2 text-[var(--text-secondary)]">{t("empty")}</p>
        <p className="mb-8 mt-1 max-w-sm text-sm text-[var(--text-tertiary)]">{t("empty_hint")}</p>
        <GenerateButton label={t("generate")} pendingLabel={t("generating")} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in-up">
      <div className="mb-8">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora-deep to-iris text-white shadow-glow-violet">
            <Sunrise className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-medium leading-tight md:text-3xl">{briefing.title}</h1>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">
              {briefing.generatedAt.toLocaleDateString()} · {t("items", { count: briefing.items.length })} ·{" "}
              {briefing.mode.replace(/_/g, " ")}
            </p>
          </div>
        </div>
        {briefing.summary && (
          <p className="mt-5 rounded-xl border border-aurora/15 bg-aurora/[0.06] px-4 py-3 text-sm leading-relaxed text-[var(--text)]">
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
              className={`group relative overflow-hidden rounded-2xl border bg-[var(--surface)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift md:p-6 animate-scale-in ${
                isUrgent ? "border-rose-dawn/40" : "border-[var(--border)]"
              }`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {isUrgent && (
                <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-rose-dawn to-sun" />
              )}
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
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
                    urgent
                  </span>
                )}
                <span className="ml-auto font-mono text-xs text-[var(--text-tertiary)]">{item.finalScore.toFixed(2)}</span>
              </div>

              <h2 className="mb-3 font-display text-lg font-medium leading-snug text-[var(--text)]">{item.title}</h2>

              {item.summaryBullets.length > 0 && (
                <ul className="mb-4 space-y-1.5">
                  {item.summaryBullets.map((bullet, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                      <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--border-strong)] transition-colors group-hover:bg-gradient-to-br group-hover:from-aurora group-hover:to-rose-dawn" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {item.validationStatus === "limited" && (
                <p className="mb-4 rounded-lg bg-sun/10 px-3 py-2 text-xs text-sun-deep ring-1 ring-inset ring-sun/20 dark:text-sun">
                  {t("limited_notice")}
                </p>
              )}

              {Array.isArray(item.sourceLinks) && item.sourceLinks.length > 0 && (
                <details className="mb-4">
                  <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-wide text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]">
                    {t("sources", { count: item.sourceLinks.length })}
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

              <div className="flex flex-wrap gap-1.5 border-t border-[var(--border)] pt-3">
                {(["useful", "not_useful", "duplicate", "block_source"] as const).map((type) => (
                  <form key={type} action={saveFeedback.bind(null, item.id, type)}>
                    <button
                      type="submit"
                      className="rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs text-[var(--text-tertiary)] transition-all hover:border-aurora/40 hover:bg-aurora/[0.06] hover:text-aurora active:scale-95"
                    >
                      {t(`feedback_${type}`)}
                    </button>
                  </form>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
