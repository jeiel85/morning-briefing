import { deleteAccount } from "@/lib/actions";
import { getTranslations } from "next-intl/server";

export default async function DeleteAccountPage() {
  const t = await getTranslations("delete_account");

  return (
    <div className="mx-auto max-w-md py-12 text-center animate-fade-in-up">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-xl dark:bg-red-950/40">!</div>
      <h1 className="mb-4 text-2xl font-bold text-red-700 dark:text-red-400">{t("title")}</h1>
      <p className="mb-8 text-sm text-[var(--text-secondary)]">{t("warning")}</p>
      <form action={deleteAccount}>
        <button type="submit" className="rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md active:scale-95">
          {t("button")}
        </button>
      </form>
    </div>
  );
}
