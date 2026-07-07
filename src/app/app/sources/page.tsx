import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";

async function toggleSource(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) return;
  const sourceId = formData.get("sourceId") as string;
  const enabled = formData.get("enabled") === "true";
  await prisma.source.update({ where: { id: sourceId }, data: { enabled } });
  revalidatePath("/app/sources");
}

export default async function SourcesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const t = await getTranslations("sources");

  const sources = await prisma.source.findMany({ orderBy: { key: "asc" } });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold">{t("title")}</h1>
      <div className="space-y-3">
        {sources.map((source) => (
          <form key={source.id} action={toggleSource} className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
            <input type="hidden" name="sourceId" value={source.id} />
            <div>
              <p className="font-medium">{source.displayName}</p>
              <p className="text-sm text-neutral-500">{source.sourceType} · {source.defaultCategory ?? "general"}</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="hidden" name="enabled" value={String(!source.enabled)} />
              <button
                type="submit"
                className={`rounded px-3 py-1 text-xs font-medium ${source.enabled ? "bg-green-100 text-green-800" : "bg-neutral-100 text-neutral-500"}`}
              >
                {source.enabled ? "Enabled" : "Disabled"}
              </button>
            </label>
          </form>
        ))}
      </div>
    </div>
  );
}
