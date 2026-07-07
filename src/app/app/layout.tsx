import { getTranslations } from "next-intl/server";
import { getVisitor } from "@/lib/visitor";
import { PushManager } from "@/components/PushManager";
import Link from "next/link";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getVisitor();
  const t = await getTranslations("app");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex w-full flex-col border-b border-neutral-200 bg-white p-4 md:w-56 md:border-b-0 md:border-r">
        <div className="mb-6 flex items-center justify-between md:block">
          <Link href="/app" className="text-lg font-semibold">{t("brand")}</Link>
        </div>
        <nav className="mb-4 flex gap-1 overflow-x-auto md:mb-0 md:flex md:flex-1 md:flex-col md:overflow-x-visible">
          <Link href="/app" className="shrink-0 rounded px-3 py-2 text-sm hover:bg-neutral-100">{t("today")}</Link>
          <Link href="/app/history" className="shrink-0 rounded px-3 py-2 text-sm hover:bg-neutral-100">{t("history")}</Link>
          <Link href="/app/settings" className="shrink-0 rounded px-3 py-2 text-sm hover:bg-neutral-100">{t("settings")}</Link>
          <Link href="/app/sources" className="shrink-0 rounded px-3 py-2 text-sm hover:bg-neutral-100">{t("sources")}</Link>
        </nav>
        <div className="hidden gap-1 border-t border-neutral-200 pt-4 md:block md:space-y-1">
          <Link href="/privacy" className="block rounded px-3 py-1 text-xs text-neutral-500 hover:bg-neutral-100">{t("privacy")}</Link>
          <Link href="/terms" className="block rounded px-3 py-1 text-xs text-neutral-500 hover:bg-neutral-100">{t("terms")}</Link>
          <Link href="/app/delete-account" className="block rounded px-3 py-1 text-xs text-red-600 hover:bg-red-50">{t("delete_account")}</Link>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
      {user && <PushManager userId={user.id} />}
    </div>
  );
}
