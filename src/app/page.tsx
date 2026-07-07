import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function Home() {
  const t = await getTranslations("landing");

  let stats: { users: number; briefings: number } | null = null;
  try {
    const [users, briefings] = await Promise.all([
      prisma.user.count(),
      prisma.briefing.count(),
    ]);
    stats = { users, briefings };
  } catch {}

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4">
        <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl">{t("title")}</h1>
        <p className="mb-12 text-lg text-neutral-500">{t("subtitle")}</p>

        <Link
          href="/app"
          className="mb-16 inline-block rounded-lg bg-neutral-900 px-10 py-3 text-sm font-medium text-white hover:bg-neutral-800"
        >
          {t("start")}
        </Link>

        <div className="w-full border-t border-neutral-200 pt-10">
          <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-neutral-400">
            {t("features_title")}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {["feature1", "feature2", "feature3"].map((key) => (
              <div key={key} className="rounded-lg border border-neutral-200 bg-white px-4 py-5 text-center text-sm text-neutral-600">
                {t(key)}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center gap-4 border-t border-neutral-200 py-4 text-xs text-neutral-400">
        <Link href="/privacy" className="hover:text-neutral-600">Privacy</Link>
        <span>·</span>
        <Link href="/terms" className="hover:text-neutral-600">Terms</Link>
        <span>·</span>
        <a href="https://github.com/jeiel85/morning-briefing" className="hover:text-neutral-600" target="_blank" rel="noopener noreferrer">GitHub</a>
        {stats && (
          <>
            <span>·</span>
            <span>{stats.users} users · {stats.briefings} briefings</span>
          </>
        )}
      </footer>
    </div>
  );
}
