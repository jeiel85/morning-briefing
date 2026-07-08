import { getTranslations } from "next-intl/server";
import { getVisitor } from "@/lib/visitor";
import { PushManager } from "@/components/PushManager";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppNav } from "@/components/AppNav";
import Link from "next/link";

const NAV = [
  { href: "/app", key: "today" },
  { href: "/app/history", key: "history" },
  { href: "/app/settings", key: "settings" },
  { href: "/app/sources", key: "sources" },
] as const;

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getVisitor();
  const t = await getTranslations("app");
  const items = NAV.map((n) => ({ ...n, label: t(n.key) }));

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="relative isolate flex w-full flex-col border-b border-[var(--border)] bg-[var(--surface)] md:w-60 md:border-b-0 md:border-r">
        {/* Ambient dawn glow at the head of the rail */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-44 bg-[radial-gradient(85%_60%_at_25%_0%,rgba(139,92,246,0.12),transparent_72%)]"
        />

        <div className="flex items-center justify-between px-4 py-3 md:px-5 md:pt-5">
          <Link href="/app" className="text-dawn font-display text-lg font-semibold tracking-tight">
            {t("brand")}
          </Link>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>

        <AppNav items={items} />

        <div className="hidden items-center justify-between border-t border-[var(--border)] px-3 py-3 md:flex">
          <div className="space-y-0.5">
            <Link
              href="/privacy"
              className="block rounded-lg px-3 py-1 text-xs text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-secondary)]"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="block rounded-lg px-3 py-1 text-xs text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-secondary)]"
            >
              Terms
            </Link>
            <Link
              href="/app/delete-account"
              className="block rounded-lg px-3 py-1 text-xs text-rose-dawn/80 transition-colors hover:bg-rose-dawn/10 hover:text-rose-dawn"
            >
              {t("delete_account")}
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8">{children}</main>
      {user && <PushManager />}
    </div>
  );
}
