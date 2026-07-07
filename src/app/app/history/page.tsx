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
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      {briefings.length === 0 ? (
        <p className="text-neutral-600">{t("empty")}</p>
      ) : (
        <>
          <div className="space-y-2">
            {briefings.map((b) => (
              <a
                key={b.id}
                href={`/app/briefings/${b.id}`}
                className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 hover:bg-neutral-50"
              >
                <div>
                  <p className="font-medium">{b.title}</p>
                  <p className="text-sm text-neutral-500">
                    {b.briefingDate.toLocaleDateString()} · {t("items", { count: b._count.items })}
                  </p>
                </div>
                <span className="text-xs text-neutral-400">
                  {b.mode.replace("_", " ")}
                </span>
              </a>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm">
              {page > 1 && (
                <a href={`/app/history?page=${page - 1}`} className="rounded border border-neutral-200 px-3 py-1 hover:bg-neutral-50">
                  ← Prev
                </a>
              )}
              <span className="px-2 text-neutral-500">{page} / {totalPages}</span>
              {page < totalPages && (
                <a href={`/app/history?page=${page + 1}`} className="rounded border border-neutral-200 px-3 py-1 hover:bg-neutral-50">
                  Next →
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
