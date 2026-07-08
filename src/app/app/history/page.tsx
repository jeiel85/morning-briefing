import { getVisitor } from "@/lib/visitor";
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { History, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

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
    <div className="mx-auto max-w-3xl animate-fade-in-up">
      <div className="mb-8 flex items-center gap-3.5">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora-deep to-iris text-white shadow-glow-violet">
          <History className="h-5 w-5" />
        </span>
        <h1 className="font-display text-2xl font-medium md:text-3xl">{t("title")}</h1>
      </div>

      {briefings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] py-20 text-center">
          <p className="text-[var(--text-tertiary)]">{t("empty")}</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {briefings.map((b, idx) => (
              <Link
                key={b.id}
                href={`/app/briefings/${b.id}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-aurora/40 hover:shadow-lift animate-scale-in"
                style={{ animationDelay: `${idx * 45}ms` }}
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-medium text-[var(--text)] transition-colors group-hover:text-aurora">
                    {b.title}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-[var(--text-tertiary)]">
                    {b.briefingDate.toLocaleDateString()} · {t("items", { count: b._count.items })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 font-mono text-[11px] text-[var(--text-secondary)]">
                    {b.mode.replace(/_/g, " ")}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[var(--text-tertiary)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-aurora" />
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3 text-sm">
              {page > 1 ? (
                <Link
                  href={`/app/history?page=${page - 1}`}
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3.5 py-1.5 text-[var(--text-secondary)] transition-all hover:border-aurora/40 hover:text-aurora active:scale-95"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3.5 py-1.5 text-[var(--text-tertiary)] opacity-50">
                  <ChevronLeft className="h-4 w-4" /> Prev
                </span>
              )}
              <span className="font-mono text-xs text-[var(--text-secondary)]">
                {page} / {totalPages}
              </span>
              {page < totalPages ? (
                <Link
                  href={`/app/history?page=${page + 1}`}
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3.5 py-1.5 text-[var(--text-secondary)] transition-all hover:border-aurora/40 hover:text-aurora active:scale-95"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-3.5 py-1.5 text-[var(--text-tertiary)] opacity-50">
                  Next <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
