import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { ThemeToggle } from "@/components/ThemeToggle";
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
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      <header className="flex items-center justify-between px-4 py-4 md:px-8">
        <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-lg font-bold text-transparent dark:from-violet-400 dark:to-indigo-300">
          {t("title")}
        </span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/app"
            className="rounded-lg bg-neutral-900 px-4 py-1.5 text-sm text-white transition-all hover:bg-neutral-800 active:scale-95 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {t("start")}
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1 text-xs text-violet-600 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-400">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            Morning briefing · AI-powered
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-7xl">
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-amber-500 bg-clip-text text-transparent dark:from-violet-400 dark:via-indigo-300 dark:to-amber-400">
              {t("title")}
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-md text-lg text-[var(--text-secondary)]">{t("subtitle")}</p>
          <Link
            href="/app"
            className="inline-block rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-10 py-3.5 text-sm font-medium text-white shadow-lg shadow-violet-200 transition-all hover:shadow-xl hover:shadow-violet-300 active:scale-95 dark:shadow-violet-950/50 dark:hover:shadow-violet-950/70"
          >
            {t("start")}
          </Link>
        </div>

        <div className="mt-20 w-full border-t border-[var(--border)] pt-12 animate-fade-in-up-delay-1">
          <h2 className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
            {t("features_title")}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {["feature1", "feature2", "feature3"].map((key) => (
              <div
                key={key}
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-6 text-center transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto mb-3 h-8 w-8 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 transition-colors group-hover:from-violet-200 group-hover:to-indigo-200 dark:from-violet-900/50 dark:to-indigo-900/50 dark:group-hover:from-violet-800/50 dark:group-hover:to-indigo-800/50" />
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{t(key)}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center gap-4 border-t border-[var(--border)] px-4 py-5 text-xs text-[var(--text-tertiary)]">
        <Link href="/privacy" className="transition-colors hover:text-[var(--text-secondary)]">Privacy</Link>
        <span className="text-[var(--border)]">·</span>
        <Link href="/terms" className="transition-colors hover:text-[var(--text-secondary)]">Terms</Link>
        <span className="text-[var(--border)]">·</span>
        <a href="https://github.com/jeiel85/morning-briefing" className="transition-colors hover:text-[var(--text-secondary)]" target="_blank" rel="noopener noreferrer">GitHub</a>
        {stats && (
          <>
            <span className="text-[var(--border)]">·</span>
            <span>{stats.users} users · {stats.briefings} briefings</span>
          </>
        )}
      </footer>
    </div>
  );
}
