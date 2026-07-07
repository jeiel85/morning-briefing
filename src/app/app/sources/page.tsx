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

function ToggleSwitch({ enabled }: { enabled: boolean }) {
  return (
    <button
      type="submit"
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${enabled ? "bg-green-500" : "bg-neutral-300"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-4.5" : "translate-x-1"}`} style={{ translate: enabled ? "18px" : "4px" }} />
    </button>
  );
}

export default async function SourcesPage() {
  const user = await getVisitor();
  const t = await getTranslations("sources");

  const sources = await prisma.source.findMany({
    orderBy: { key: "asc" },
    include: {
      fetchRuns: { take: 1, orderBy: { startedAt: "desc" } },
    },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold">{t("title")}</h1>
      <div className="space-y-2">
        {sources.map((source) => {
          const lastRun = source.fetchRuns[0];
          return (
            <form key={source.id} action={toggleSource} className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
              <input type="hidden" name="sourceId" value={source.id} />
              <input type="hidden" name="enabled" value={String(!source.enabled)} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{source.displayName}</p>
                  <ScoreBadge score={source.reliabilityScore} />
                </div>
                <p className="truncate text-xs text-neutral-500">
                  {source.sourceType} · {source.defaultCategory ?? "general"}
                  {lastRun && ` · last: ${lastRun.startedAt.toLocaleDateString()}`}
                </p>
              </div>
              <ToggleSwitch enabled={source.enabled} />
            </form>
          );
        })}
      </div>
    </div>
  );
}
