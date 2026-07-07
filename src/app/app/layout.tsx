import { auth, signOut } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const t = await getTranslations("app");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex w-full flex-col border-b border-neutral-200 bg-white p-4 md:w-56 md:border-b-0 md:border-r">
        <div className="mb-6 flex items-center justify-between md:block">
          <h2 className="text-lg font-semibold">DawnBrief</h2>
        </div>
        <nav className="mb-4 flex gap-1 overflow-x-auto md:mb-0 md:flex md:flex-1 md:flex-col md:overflow-x-visible">
          <a href="/app" className="shrink-0 rounded px-3 py-2 text-sm hover:bg-neutral-100">{t("today")}</a>
          <a href="/app/history" className="shrink-0 rounded px-3 py-2 text-sm hover:bg-neutral-100">{t("history")}</a>
          <a href="/app/settings" className="shrink-0 rounded px-3 py-2 text-sm hover:bg-neutral-100">{t("settings")}</a>
          <a href="/app/sources" className="shrink-0 rounded px-3 py-2 text-sm hover:bg-neutral-100">{t("sources")}</a>
        </nav>
        <div className="hidden gap-1 border-t border-neutral-200 pt-4 md:block md:space-y-1">
          <a href="/privacy" className="block rounded px-3 py-1 text-xs text-neutral-500 hover:bg-neutral-100">{t("privacy")}</a>
          <a href="/terms" className="block rounded px-3 py-1 text-xs text-neutral-500 hover:bg-neutral-100">{t("terms")}</a>
          <a href="/app/delete-account" className="block rounded px-3 py-1 text-xs text-red-600 hover:bg-red-50">{t("delete_account")}</a>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
          className="md:mt-2"
        >
          <button type="submit" className="w-full rounded px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-100">
            {t("signout")}
          </button>
        </form>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
