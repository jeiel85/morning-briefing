import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateBriefing, saveFeedback } from "@/lib/actions";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const t = await getTranslations("dashboard");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const briefing = await prisma.briefing.findFirst({
    where: { userId: session.user.id, briefingDate: { gte: today } },
    include: { items: { orderBy: { rank: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  if (!briefing || briefing.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="mb-2 text-2xl font-bold">{t("title")}</h1>
        <p className="mb-8 text-neutral-500">{t("empty")}</p>
        <form action={generateBriefing}>
          <button type="submit" className="rounded-lg bg-neutral-900 px-8 py-3 text-sm font-medium text-white hover:bg-neutral-800">
            {t("generate")}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      <div className="mb-8 flex items-end justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold">{briefing.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {briefing.generatedAt.toLocaleDateString()} · {briefing.items.length}{t("items", { count: briefing.items.length })} · {briefing.mode.replace(/_/g, " ")}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {briefing.items.map((item) => (
          <article key={item.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm md:p-6">
            <div className="mb-3 flex items-center gap-3 text-xs">
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 font-medium text-neutral-600">
                {item.section}
              </span>
              <span className="text-neutral-400">#{item.rank}</span>
              <span className="ml-auto text-neutral-400">{t("score")} {item.finalScore.toFixed(2)}</span>
            </div>

            <h2 className="mb-3 text-lg font-semibold leading-snug">{item.title}</h2>

            {item.summaryBullets.length > 0 && (
              <ul className="mb-4 space-y-1.5">
                {item.summaryBullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-neutral-700">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
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
                <summary className="cursor-pointer text-xs font-medium text-neutral-500 hover:text-neutral-700">
                  {t("sources", { count: item.sourceLinks.length })}
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

            <div className="flex flex-wrap gap-1.5 border-t border-neutral-100 pt-3">
              {(["useful", "not_useful", "duplicate", "block_source"] as const).map((type) => (
                <form key={type} action={saveFeedback.bind(null, item.id, type)}>
                  <button type="submit" className="rounded-md border border-neutral-200 px-2.5 py-1 text-xs text-neutral-500 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-700">
                    {t(`feedback_${type}`)}
                  </button>
                </form>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
