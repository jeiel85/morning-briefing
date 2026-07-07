import { auth, signOut } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const t = await getTranslations("app");

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 flex-col border-r border-neutral-200 bg-white p-4">
        <h2 className="mb-6 text-lg font-semibold">DawnBrief</h2>
        <nav className="flex flex-1 flex-col gap-1">
          <a href="/app" className="rounded px-3 py-2 text-sm hover:bg-neutral-100">{t("today")}</a>
          <a href="/app/history" className="rounded px-3 py-2 text-sm hover:bg-neutral-100">{t("history")}</a>
          <a href="/app/settings" className="rounded px-3 py-2 text-sm hover:bg-neutral-100">{t("settings")}</a>
          <a href="/app/sources" className="rounded px-3 py-2 text-sm hover:bg-neutral-100">{t("sources")}</a>
        </nav>
        <div className="space-y-1 border-t border-neutral-200 pt-4">
          <a href="/privacy" className="block rounded px-3 py-1 text-xs text-neutral-500 hover:bg-neutral-100">{t("privacy")}</a>
          <a href="/terms" className="block rounded px-3 py-1 text-xs text-neutral-500 hover:bg-neutral-100">{t("terms")}</a>
          <a href="/app/delete-account" className="block rounded px-3 py-1 text-xs text-red-600 hover:bg-red-50">{t("delete_account")}</a>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
          className="mt-2"
        >
          <button type="submit" className="w-full rounded px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-100">
            {t("signout")}
          </button>
        </form>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
