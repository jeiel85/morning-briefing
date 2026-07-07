import { getVisitor } from "@/lib/visitor";
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";

export default async function HistoryPage() {
  const user = await getVisitor();
  const t = await getTranslations("history");

  const briefings = user
    ? await prisma.briefing.findMany({
        where: { userId: user.id },
        include: { _count: { select: { items: true } } },
        orderBy: { briefingDate: "desc" },
        take: 50,
      })
    : [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      {briefings.length === 0 ? (
        <p className="text-neutral-600">{t("empty")}</p>
      ) : (
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
      )}
    </div>
  );
}
