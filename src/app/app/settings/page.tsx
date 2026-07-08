import { getVisitor } from "@/lib/visitor";
import { redirect } from "next/navigation";
import { savePreferences } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { SlidersHorizontal, Check } from "lucide-react";

const TIMEZONES = Intl.supportedValuesOf?.("timeZone") ?? [
  "Asia/Seoul", "America/New_York", "America/Chicago", "America/Denver",
  "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Europe/Paris",
  "Asia/Tokyo", "Asia/Shanghai", "Asia/Singapore", "Australia/Sydney",
];

const CATEGORIES = [
  "technology", "developer", "ai", "security", "startup",
  "science", "business", "world", "design", "open_source",
];

const inputCls =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none transition-all focus:border-aurora/50 focus:ring-2 focus:ring-aurora/20";
const sectionCls = "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm md:p-6";
const labelCls = "mb-1.5 block text-sm font-medium text-[var(--text)]";
const chipCls =
  "flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm transition-all hover:border-aurora/40 hover:bg-aurora/[0.05] has-checked:border-aurora/60 has-checked:bg-aurora/[0.08] has-checked:text-aurora";

function formatNextDelivery(timezone: string, deliveryTime: string): string {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    const currentLocal = `${get("year")}-${get("month")}-${get("day")}T${deliveryTime}:00`;
    const next = new Date(currentLocal);
    if (next <= now) next.setDate(next.getDate() + 1);
    return next.toLocaleString(undefined, { weekday: "short", hour: "2-digit", minute: "2-digit", timeZone: timezone });
  } catch { return deliveryTime; }
}

export default async function SettingsPage() {
  const user = await getVisitor();
  if (!user) redirect("/");
  const t = await getTranslations("settings");
  const [prefs, pushCount] = await Promise.all([
    prisma.userPreference.findUnique({ where: { userId: user.id } }),
    prisma.pushSubscription.count({ where: { userId: user.id, revokedAt: null } }),
  ]);

  const displayTime = prefs ? formatNextDelivery(prefs.timezone, prefs.briefingDeliveryTime) : null;

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up">
      <div className="mb-8 flex items-center gap-3.5">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora-deep to-iris text-white shadow-glow-violet">
          <SlidersHorizontal className="h-5 w-5" />
        </span>
        <h1 className="font-display text-2xl font-medium md:text-3xl">{t("title")}</h1>
      </div>

      <form action={savePreferences} className="space-y-5">
        <section className={sectionCls}>
          <h2 className="mb-4 font-display text-base font-medium">{t("schedule")}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>{t("timezone")}</label>
              <select name="timezone" defaultValue={prefs?.timezone ?? "Asia/Seoul"} className={inputCls}>
                {TIMEZONES.map((tz) => (<option key={tz} value={tz}>{tz}</option>))}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t("delivery_time")}</label>
              <input type="time" name="briefingDeliveryTime" defaultValue={prefs?.briefingDeliveryTime ?? "07:05"} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("inactive_start")}</label>
              <input type="time" name="inactiveWindowStart" defaultValue={prefs?.inactiveWindowStart ?? "23:30"} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("inactive_end")}</label>
              <input type="time" name="inactiveWindowEnd" defaultValue={prefs?.inactiveWindowEnd ?? "07:00"} className={inputCls} />
            </div>
          </div>
          {displayTime && (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-wide text-[var(--text-tertiary)]">
              {t("next_delivery", { time: displayTime })}
            </p>
          )}
        </section>

        <section className={sectionCls}>
          <h2 className="mb-4 font-display text-base font-medium">{t("briefing_mode")}</h2>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {(["three_minute", "ten_minute", "full", "developer", "global"] as const).map((mode) => (
              <label key={mode} className={chipCls}>
                <input type="radio" name="briefingMode" value={mode} defaultChecked={(prefs?.briefingMode ?? "three_minute") === mode} className="accent-aurora" />
                {t(`mode_${mode}`)}
              </label>
            ))}
          </div>
        </section>

        <section className={sectionCls}>
          <h2 className="mb-4 font-display text-base font-medium">{t("topics")}</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <label key={cat} className={`${chipCls} py-1.5`}>
                <input type="checkbox" name="categories" value={cat} defaultChecked={prefs?.categories.includes(cat) ?? true} className="accent-aurora" />
                {cat.replace("_", " ")}
              </label>
            ))}
          </div>
        </section>

        <section className={sectionCls}>
          <h2 className="mb-4 font-display text-base font-medium">{t("keywords")}</h2>
          <div className="space-y-3">
            <div>
              <label className={labelCls}>{t("interest_keywords")}</label>
              <input type="text" name="interestKeywords" defaultValue={prefs?.interestKeywords.join(", ") ?? ""} placeholder={t("interest_placeholder")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("blocked_keywords")}</label>
              <input type="text" name="blockedKeywords" defaultValue={prefs?.blockedKeywords.join(", ") ?? ""} placeholder={t("blocked_placeholder")} className={inputCls} />
            </div>
          </div>
        </section>

        <section className={sectionCls}>
          <h2 className="mb-4 font-display text-base font-medium">{t("delivery")}</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5">
              <span className="text-sm text-[var(--text)]">{t("push_status")}</span>
              <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-wide ${pushCount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-[var(--text-tertiary)]"}`}>
                {pushCount > 0 && <Check className="h-3.5 w-3.5" />}
                {pushCount > 0 ? t("push_subscribed") : t("push_not_subscribed")}
              </span>
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm transition-all hover:border-aurora/40">
              <input type="checkbox" name="pushEnabled" defaultChecked={prefs?.pushEnabled ?? false} className="accent-aurora" />
              {t("push_enabled")}
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm transition-all hover:border-aurora/40">
              <input type="checkbox" name="urgentAlertsEnabled" defaultChecked={prefs?.urgentAlertsEnabled ?? false} className="accent-aurora" />
              {t("urgent_enabled")}
            </label>
          </div>
        </section>

        <div className="text-right">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-aurora-deep to-iris px-6 py-2.5 text-sm font-medium text-white shadow-glow-violet transition-all hover:shadow-[0_0_0_1px_rgba(139,92,246,0.2),0_16px_40px_-10px_rgba(124,92,240,0.6)] active:scale-95"
          >
            {t("save")}
          </button>
        </div>
      </form>
    </div>
  );
}
