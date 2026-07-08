import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PrivacyPage() {
  const [t, ta] = await Promise.all([getTranslations("privacy"), getTranslations("app")]);

  return (
    <main className="mx-auto max-w-2xl px-5 py-16 animate-fade-in-up">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:text-aurora"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-dawn font-display font-semibold">{ta("brand")}</span>
      </Link>
      <h1 className="font-display text-3xl font-medium tracking-tight">{t("title")}</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--text-secondary)]">
        {(t.raw("content") as string[]).map((paragraph: string, i: number) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
