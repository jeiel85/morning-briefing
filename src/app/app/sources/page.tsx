import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getVisitor } from "@/lib/visitor";
import { getTranslations } from "next-intl/server";

async function toggleSource(formData: FormData) {
  "use server";
  const sourceId = formData.get("sourceId") as string;
  const enabled = formData.get("enabled") === "true";
  await prisma.source.update({ where: { id: sourceId }, data: { enabled } });
  revalidatePath("/app/sources");
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 0.8 ? "bg-green-100 text-green-700" : score >= 0.5 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  return <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${color}`}>{(score * 100).toFixed(0)}%</span>;
}

function ToggleBtn({ enabled }: { enabled: boolean }) {
  return (
    <button
      type="submit"
      className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${enabled ? "bg-violet-500" : "bg-neutral-200"}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-5" : "translate-x-1"}`} />
    </button>
  );
}

export default async function SourcesPage() {
  await getVisitor();
  const t = await getTranslations("sources");

  const sources = await prisma.source.findMany({
    orderBy: { key: "asc" },
    include: { fetchRuns: { take: 1, orderBy: { startedAt: "desc" } } },
  });

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-sm text-white shadow-sm">◉</div>
        <h1 className="text-xl font-bold md:text-2xl">{t("title")}</h1>
      </div>
      <div className="space-y-2">
        {sources.map((source, idx) => {
          const lastRun = source.fetchRuns[0];
          return (
            <form
              key={source.id}
              action={toggleSource}
              className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-5 py-3.5 shadow-sm transition-all hover:shadow-md animate-scale-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <input type="hidden" name="sourceId" value={source.id} />
              <input type="hidden" name="enabled" value={String(!source.enabled)} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-neutral-900">{source.displayName}</p>
                  <ScoreBadge score={source.reliabilityScore} />
                </div>
                <p className="truncate text-xs text-neutral-400">
                  {source.sourceType} · {source.defaultCategory ?? "general"}
                  {lastRun && ` · last ${lastRun.startedAt.toLocaleDateString()}`}
                </p>
              </div>
              <ToggleBtn enabled={source.enabled} />
            </form>
          );
        })}
      </div>
    </div>
  );
}
