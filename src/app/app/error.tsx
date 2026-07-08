"use client";

import { useTranslations } from "next-intl";
import { RotateCcw, CloudOff } from "lucide-react";

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("error");

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in-up">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-dawn/10 text-rose-dawn ring-1 ring-inset ring-rose-dawn/25">
        <CloudOff className="h-6 w-6" />
      </span>
      <h2 className="font-display text-xl font-medium">{t("title")}</h2>
      <p className="mt-2 max-w-sm text-sm text-[var(--text-secondary)]">{t("hint")}</p>
      {error?.message && (
        <p className="mt-3 max-w-md truncate font-mono text-[11px] text-[var(--text-tertiary)]">{error.message}</p>
      )}
      <button
        onClick={reset}
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-aurora-deep to-iris px-6 py-2.5 text-sm font-medium text-white shadow-glow-violet transition-all hover:shadow-[0_0_0_1px_rgba(139,92,246,0.2),0_16px_40px_-10px_rgba(124,92,240,0.6)] active:scale-95"
      >
        <RotateCcw className="h-4 w-4" />
        {t("retry")}
      </button>
    </div>
  );
}
