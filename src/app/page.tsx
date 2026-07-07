import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("landing");

  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">{t("title")}</h1>
      <p className="mb-10 text-lg text-neutral-600">{t("subtitle")}</p>
      <a
        href="/auth/signin"
        className="inline-block rounded-lg bg-neutral-900 px-8 py-3 text-sm font-medium text-white hover:bg-neutral-800"
      >
        {t("start")}
      </a>
    </main>
  );
}
