import { deleteAccount } from "@/lib/actions";
import { getTranslations } from "next-intl/server";
import { Trash2 } from "lucide-react";

export default async function DeleteAccountPage() {
  const t = await getTranslations("delete_account");

  return (
    <div className="mx-auto max-w-md py-16 text-center animate-fade-in-up">
      <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-dawn/10 text-rose-dawn ring-1 ring-inset ring-rose-dawn/25">
        <Trash2 className="h-6 w-6" />
      </span>
      <h1 className="font-display text-2xl font-medium text-rose-dawn">{t("title")}</h1>
      <p className="mx-auto mb-8 mt-3 max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">{t("warning")}</p>
      <form action={deleteAccount}>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-rose-dawn px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:shadow-[0_10px_30px_-10px_rgba(251,113,133,0.7)] active:scale-95"
        >
          <Trash2 className="h-4 w-4" />
          {t("button")}
        </button>
      </form>
    </div>
  );
}
