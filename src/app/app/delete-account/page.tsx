import { deleteAccount } from "@/lib/actions";
import { getTranslations } from "next-intl/server";

export default async function DeleteAccountPage() {
  const t = await getTranslations("delete_account");

  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className="mb-4 text-2xl font-bold text-red-700">{t("title")}</h1>
      <p className="mb-8 text-sm text-neutral-600">{t("warning")}</p>
      <form action={deleteAccount}>
        <button type="submit" className="rounded-lg bg-red-700 px-6 py-2 text-sm text-white hover:bg-red-800">
          {t("button")}
        </button>
      </form>
    </div>
  );
}
