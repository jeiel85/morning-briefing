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
      <header className="flex items-center justify-between px-4 py-4 md:px-8">
        <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-lg font-bold text-transparent">
          {t("title")}
        </span>
        <Link
          href="/app"
          className="rounded-lg bg-neutral-900 px-4 py-1.5 text-sm text-white transition-all hover:bg-neutral-800 active:scale-95"
        >
          {t("start")}
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1 text-xs text-violet-600">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            Morning briefing · AI-powered
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-7xl">
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-amber-500 bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-md text-lg text-neutral-500">{t("subtitle")}</p>
          <Link
            href="/app"
            className="inline-block rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-10 py-3.5 text-sm font-medium text-white shadow-lg shadow-violet-200 transition-all hover:shadow-xl hover:shadow-violet-300 active:scale-95"
          >
            {t("start")}
          </Link>
        </div>

        <div className="mt-20 w-full border-t border-neutral-200 pt-12 animate-fade-in-up-delay-1">
          <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-neutral-400">
            {t("features_title")}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {["feature1", "feature2", "feature3"].map((key) => (
              <div
                key={key}
                className="group rounded-xl border border-neutral-200 bg-white px-5 py-6 text-center transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto mb-3 h-8 w-8 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 group-hover:from-violet-200 group-hover:to-indigo-200 transition-colors" />
                <p className="text-sm leading-relaxed text-neutral-600">{t(key)}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center gap-4 border-t border-neutral-200 px-4 py-5 text-xs text-neutral-400">
        <Link href="/privacy" className="transition-colors hover:text-neutral-600">Privacy</Link>
        <span className="text-neutral-300">·</span>
        <Link href="/terms" className="transition-colors hover:text-neutral-600">Terms</Link>
        <span className="text-neutral-300">·</span>
        <a href="https://github.com/jeiel85/morning-briefing" className="transition-colors hover:text-neutral-600" target="_blank" rel="noopener noreferrer">GitHub</a>
        {stats && (
          <>
            <span className="text-neutral-300">·</span>
            <span className="text-neutral-400">{stats.users} users · {stats.briefings} briefings</span>
          </>
        )}
      </footer>
    </div>
  );
}
