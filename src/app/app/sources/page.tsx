import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getVisitor } from "@/lib/visitor";
import { isAdmin } from "@/lib/admin";
import { getTranslations } from "next-intl/server";
import { Rss, Lock } from "lucide-react";

async function toggleSource(formData: FormData) {
  "use server";
  // Global config — operator only. Silently no-op for non-admins.
  const user = await getVisitor();
  if (!isAdmin(user)) return;
  const sourceId = formData.get("sourceId") as string;
  const enabled = formData.get("enabled") === "true";
  await prisma.source.update({ where: { id: sourceId }, data: { enabled } });
  revalidatePath("/app/sources");
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 0.8
      ? "text-emerald-600 bg-emerald-500/10 ring-emerald-500/20 dark:text-emerald-400"
      : score >= 0.5
        ? "text-sun-deep bg-sun/10 ring-sun/25 dark:text-sun"
        : "text-rose-dawn bg-rose-dawn/10 ring-rose-dawn/25";
  return (
    <span className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] font-medium ring-1 ring-inset ${color}`}>
      {(score * 100).toFixed(0)}%
    </span>
  );
}

function Switch({ enabled, interactive }: { enabled: boolean; interactive: boolean }) {
  const track = `relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
    enabled ? "bg-gradient-to-r from-aurora-deep to-iris" : "bg-[var(--border-strong)]"
  } ${interactive ? "" : "opacity-60"}`;
  const knob = `inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
    enabled ? "translate-x-6" : "translate-x-1"
  }`;
  if (interactive) {
    return (
      <button type="submit" aria-pressed={enabled} className={track}>
        <span className={knob} />
      </button>
    );
  }
  return (
    <span role="img" aria-label={enabled ? "enabled" : "disabled"} className={track}>
      <span className={knob} />
    </span>
  );
}

export default async function SourcesPage() {
  const user = await getVisitor();
  const admin = isAdmin(user);
  const t = await getTranslations("sources");

  const sources = await prisma.source.findMany({
    orderBy: { key: "asc" },
    include: { fetchRuns: { take: 1, orderBy: { startedAt: "desc" } } },
  });

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up">
      <div className="mb-6 flex items-center gap-3.5">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora-deep to-iris text-white shadow-glow-violet">
          <Rss className="h-5 w-5" />
        </span>
        <h1 className="font-display text-2xl font-medium md:text-3xl">{t("title")}</h1>
      </div>

      {!admin && (
        <p className="mb-4 inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--text-tertiary)]">
          <Lock className="h-3.5 w-3.5" />
          {t("readonly_notice")}
        </p>
      )}

      <div className="space-y-2">
        {sources.map((source, idx) => {
          const lastRun = source.fetchRuns[0];
          const Row = (
            <>
              {admin && <input type="hidden" name="sourceId" value={source.id} />}
              {admin && <input type="hidden" name="enabled" value={String(!source.enabled)} />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`truncate font-medium ${source.enabled ? "text-[var(--text)]" : "text-[var(--text-tertiary)]"}`}>
                    {source.displayName}
                  </p>
                  <ScoreBadge score={source.reliabilityScore} />
                </div>
                <p className="truncate font-mono text-[11px] uppercase tracking-wide text-[var(--text-tertiary)]">
                  {source.sourceType} · {source.defaultCategory ?? "general"}
                  {lastRun && ` · ${lastRun.startedAt.toLocaleDateString()}`}
                </p>
              </div>
              <Switch enabled={source.enabled} interactive={admin} />
            </>
          );

          const rowCls =
            "group flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 shadow-sm transition-all duration-300 hover:border-aurora/30 hover:shadow-lift animate-scale-in";
          const style = { animationDelay: `${idx * 45}ms` };

          return admin ? (
            <form key={source.id} action={toggleSource} className={rowCls} style={style}>
              {Row}
            </form>
          ) : (
            <div key={source.id} className={rowCls} style={style}>
              {Row}
            </div>
          );
        })}
      </div>
    </div>
  );
}
