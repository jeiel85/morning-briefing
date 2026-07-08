import { getTranslations } from "next-intl/server";
import { getVisitor } from "@/lib/visitor";
import { PushManager } from "@/components/PushManager";
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
      <aside className="flex w-full flex-col border-b border-neutral-200 bg-white/80 backdrop-blur-sm md:w-56 md:border-b-0 md:border-r md:bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 md:border-b-0 md:px-5 md:pt-5">
          <Link href="/app" className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-lg font-bold text-transparent">
            {t("brand")}
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-1 md:flex-col md:overflow-x-visible md:px-3 md:pt-5">
          {NAV.map(({ href, key, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-600 transition-all hover:bg-violet-50 hover:text-violet-700 md:shrink"
            >
              <span className="w-4 text-center text-xs opacity-60">{icon}</span>
              {t(key)}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-neutral-100 px-4 py-3 md:block">
          <Link href="/privacy" className="block rounded px-3 py-1 text-xs text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-600">Privacy</Link>
          <Link href="/terms" className="block rounded px-3 py-1 text-xs text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-600">Terms</Link>
          <Link href="/app/delete-account" className="block rounded px-3 py-1 text-xs text-red-400 transition-colors hover:bg-red-50 hover:text-red-600">Delete account</Link>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
      {user && <PushManager userId={user.id} />}
    </div>
  );
}
