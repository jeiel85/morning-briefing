import { getVisitor } from "@/lib/visitor";
import { prisma } from "@/lib/db";
import { saveFeedback } from "@/lib/actions";
import { GenerateButton } from "@/components/GenerateButton";
import { getTranslations } from "next-intl/server";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  confirmed: { label: "confirmed", color: "bg-green-100 text-green-700 border-green-200" },
  developing: { label: "developing", color: "bg-blue-100 text-blue-700 border-blue-200" },
  trend_signal: { label: "signal", color: "bg-amber-100 text-amber-700 border-amber-200" },
  low_confidence: { label: "low", color: "bg-neutral-100 text-neutral-500 border-neutral-200" },
};

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
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100">
          <span className="text-2xl">◇</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold">{t("title")}</h1>
        <p className="mb-8 text-neutral-500">{t("empty")}</p>
        <GenerateButton label={t("generate")} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in-up">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-sm text-white shadow-sm">
            ◇
          </div>
          <div>
            <h1 className="text-xl font-bold md:text-2xl">{briefing.title}</h1>
            <p className="text-sm text-neutral-500">
              {briefing.generatedAt.toLocaleDateString()} · {briefing.items.length}{t("items", { count: briefing.items.length })} · {briefing.mode.replace(/_/g, " ")}
            </p>
          </div>
        </div>
        {briefing.summary && (
          <p className="mt-4 rounded-lg border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-800">{briefing.summary}</p>
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
              className={`group rounded-xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:p-6 animate-scale-in ${isUrgent ? "border-red-200" : "border-neutral-200"}`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-medium text-neutral-600">
                  {item.section}
                </span>
                <span className={`rounded-full border px-2 py-1 font-medium ${st.color}`}>
                  {st.label}
                </span>
                {isUrgent && (
                  <span className="rounded-full bg-red-100 px-2 py-1 font-medium text-red-600">
                    urgent
                  </span>
                )}
                <span className="ml-auto text-neutral-400">#{item.rank}</span>
                <span className="text-neutral-400">{item.finalScore.toFixed(2)}</span>
              </div>

              <h2 className="mb-3 text-lg font-semibold leading-snug">{item.title}</h2>

              {item.summaryBullets.length > 0 && (
                <ul className="mb-4 space-y-1.5">
                  {item.summaryBullets.map((bullet, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed text-neutral-700">
                      <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300 group-hover:bg-violet-400 transition-colors" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {item.validationStatus === "limited" && (
                <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  {t("limited_notice")}
                </p>
              )}

              {Array.isArray(item.sourceLinks) && item.sourceLinks.length > 0 && (
                <details className="mb-4">
                  <summary className="cursor-pointer text-xs font-medium text-neutral-400 transition-colors hover:text-neutral-600">
                    {t("sources", { count: item.sourceLinks.length })}
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {(item.sourceLinks as Array<{ title: string; url: string; sourceName: string }>).map((link, i) => (
                      <li key={i}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-600 transition-colors hover:text-violet-800 hover:underline">
                          {link.sourceName} — {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              <div className="flex flex-wrap gap-1.5 border-t border-neutral-100 pt-3">
                {(["useful", "not_useful", "duplicate", "block_source"] as const).map((type) => (
                  <form key={type} action={saveFeedback.bind(null, item.id, type)}>
                    <button
                      type="submit"
                      className="rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs text-neutral-400 transition-all hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 active:scale-95"
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
