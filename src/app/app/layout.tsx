import { getTranslations } from "next-intl/server";
import { getVisitor } from "@/lib/visitor";
import { PushManager } from "@/components/PushManager";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

const NAV = [
  { href: "/app", key: "today", icon: "◇" },
  { href: "/app/history", key: "history", icon: "◈" },
  { href: "/app/settings", key: "settings", icon: "◎" },
  { href: "/app/sources", key: "sources", icon: "◉" },
] as const;

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getVisitor();
  const t = await getTranslations("app");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex w-full flex-col border-b border-[var(--border)] bg-[var(--surface)] md:w-56 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 md:border-b-0 md:px-5 md:pt-5">
          <Link href="/app" className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-lg font-bold text-transparent dark:from-violet-400 dark:to-indigo-300">
            {t("brand")}
          </Link>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-1 md:flex-col md:overflow-x-visible md:px-3 md:pt-5">
          {NAV.map(({ href, key, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-all hover:bg-violet-50 hover:text-violet-700 md:shrink dark:hover:bg-violet-950/50 dark:hover:text-violet-400"
            >
              <span className="w-4 text-center text-xs opacity-60">{icon}</span>
              {t(key)}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center justify-between border-t border-[var(--border)] px-4 py-3 md:flex">
          <div className="space-y-0.5">
            <Link href="/privacy" className="block rounded px-3 py-1 text-xs text-[var(--text-tertiary)] transition-colors hover:bg-neutral-50 hover:text-[var(--text-secondary)] dark:hover:bg-neutral-800">Privacy</Link>
            <Link href="/terms" className="block rounded px-3 py-1 text-xs text-[var(--text-tertiary)] transition-colors hover:bg-neutral-50 hover:text-[var(--text-secondary)] dark:hover:bg-neutral-800">Terms</Link>
            <Link href="/app/delete-account" className="block rounded px-3 py-1 text-xs text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30">Delete account</Link>
          </div>
          <ThemeToggle />
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
      {user && <PushManager userId={user.id} />}
    </div>
  );
}
