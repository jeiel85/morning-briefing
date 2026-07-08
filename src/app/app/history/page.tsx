import { getVisitor } from "@/lib/visitor";
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";

const PAGE_SIZE = 20;

export default async function HistoryPage(props: { searchParams: Promise<{ page?: string }> }) {
  const user = await getVisitor();
  const t = await getTranslations("history");
  const searchParams = await props.searchParams;
  const page = Math.max(1, Number(searchParams.page) || 1);

  let briefings: Array<{ id: string; title: string; briefingDate: Date; mode: string; _count: { items: number } }> = [];
  let total = 0;

  if (user) {
    [briefings, total] = await Promise.all([
      prisma.briefing.findMany({
        where: { userId: user.id },
        include: { _count: { select: { items: true } } },
        orderBy: { briefingDate: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.briefing.count({ where: { userId: user.id } }),
    ]);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-sm text-white shadow-sm">
          ◈
        </div>
        <h1 className="text-xl font-bold md:text-2xl">{t("title")}</h1>
      </div>

      {briefings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-[var(--text-tertiary)]">{t("empty")}</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {briefings.map((b, idx) => (
              <a
                key={b.id}
                href={`/app/briefings/${b.id}`}
                className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md animate-scale-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div>
                  <p className="font-medium text-[var(--text)] transition-colors group-hover:text-violet-700 dark:group-hover:text-violet-400">{b.title}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {b.briefingDate.toLocaleDateString()} · {t("items", { count: b._count.items })}
                  </p>
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-[var(--text-secondary)] dark:bg-neutral-800">
                  {b.mode.replace("_", " ")}
                </span>
              </a>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3 text-sm">
              {page > 1 ? (
                <a href={`/app/history?page=${page - 1}`} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-[var(--text-secondary)] transition-all hover:bg-neutral-50 hover:text-violet-700 active:scale-95 dark:hover:bg-neutral-800 dark:hover:text-violet-400">
                  ← Prev
                </a>
              ) : (
                <span className="px-3 py-1.5 text-[var(--text-tertiary)]">← Prev</span>
              )}
              <span className="text-[var(--text-secondary)]">{page} / {totalPages}</span>
              {page < totalPages ? (
                <a href={`/app/history?page=${page + 1}`} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-[var(--text-secondary)] transition-all hover:bg-neutral-50 hover:text-violet-700 active:scale-95 dark:hover:bg-neutral-800 dark:hover:text-violet-400">
                  Next →
                </a>
              ) : (
                <span className="px-3 py-1.5 text-[var(--text-tertiary)]">Next →</span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
