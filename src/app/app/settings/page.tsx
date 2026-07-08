import { getVisitor } from "@/lib/visitor";
import { redirect } from "next/navigation";
import { savePreferences } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";

const TIMEZONES = Intl.supportedValuesOf?.("timeZone") ?? [
  "Asia/Seoul", "America/New_York", "America/Chicago", "America/Denver",
  "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Europe/Paris",
  "Asia/Tokyo", "Asia/Shanghai", "Asia/Singapore", "Australia/Sydney",
];

const CATEGORIES = [
  "technology", "developer", "ai", "security", "startup",
  "science", "business", "world", "design", "open_source",
];

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
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-sm text-white shadow-sm">◎</div>
        <h1 className="text-xl font-bold md:text-2xl">{t("title")}</h1>
      </div>

      <form action={savePreferences} className="space-y-6">
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm md:p-6">
          <h2 className="mb-4 text-base font-semibold">{t("schedule")}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">{t("timezone")}</label>
              <select name="timezone" defaultValue={prefs?.timezone ?? "Asia/Seoul"} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 dark:focus:border-violet-500">
                {TIMEZONES.map((tz) => (<option key={tz} value={tz}>{tz}</option>))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">{t("delivery_time")}</label>
              <input type="time" name="briefingDeliveryTime" defaultValue={prefs?.briefingDeliveryTime ?? "07:05"} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 dark:focus:border-violet-500" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">{t("inactive_start")}</label>
              <input type="time" name="inactiveWindowStart" defaultValue={prefs?.inactiveWindowStart ?? "23:30"} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 dark:focus:border-violet-500" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">{t("inactive_end")}</label>
              <input type="time" name="inactiveWindowEnd" defaultValue={prefs?.inactiveWindowEnd ?? "07:00"} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 dark:focus:border-violet-500" />
            </div>
          </div>
          {displayTime && <p className="mt-3 text-xs text-[var(--text-tertiary)]">{t("next_delivery", { time: displayTime })}</p>}
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm md:p-6">
          <h2 className="mb-4 text-base font-semibold">{t("briefing_mode")}</h2>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {(["three_minute", "ten_minute", "full", "developer", "global"] as const).map((mode) => (
              <label key={mode} className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm transition-all hover:border-violet-200 hover:bg-violet-50 has-checked:border-violet-400 has-checked:bg-violet-50 dark:hover:border-violet-800 dark:hover:bg-violet-950/40 dark:has-checked:border-violet-600 dark:has-checked:bg-violet-950/40">
                <input type="radio" name="briefingMode" value={mode} defaultChecked={(prefs?.briefingMode ?? "three_minute") === mode} className="text-violet-600 accent-violet-600" />
                {t(`mode_${mode}`)}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm md:p-6">
          <h2 className="mb-4 text-base font-semibold">{t("topics")}</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm transition-all hover:border-violet-200 hover:bg-violet-50 has-checked:border-violet-400 has-checked:bg-violet-50 dark:hover:border-violet-800 dark:hover:bg-violet-950/40 dark:has-checked:border-violet-600 dark:has-checked:bg-violet-950/40">
                <input type="checkbox" name="categories" value={cat} defaultChecked={prefs?.categories.includes(cat) ?? true} className="text-violet-600 accent-violet-600" />
                {cat.replace("_", " ")}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm md:p-6">
          <h2 className="mb-4 text-base font-semibold">{t("keywords")}</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">{t("interest_keywords")}</label>
              <input type="text" name="interestKeywords" defaultValue={prefs?.interestKeywords.join(", ") ?? ""} placeholder={t("interest_placeholder")} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 dark:focus:border-violet-500" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">{t("blocked_keywords")}</label>
              <input type="text" name="blockedKeywords" defaultValue={prefs?.blockedKeywords.join(", ") ?? ""} placeholder={t("blocked_placeholder")} className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm transition-colors focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 dark:focus:border-violet-500" />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm md:p-6">
          <h2 className="mb-4 text-base font-semibold">{t("delivery")}</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-neutral-50 px-4 py-2.5 dark:bg-neutral-900/50">
              <span className="text-sm text-[var(--text)]">{t("push_status")}</span>
              <span className={`text-xs font-medium ${pushCount > 0 ? "text-green-600 dark:text-green-400" : "text-[var(--text-tertiary)]"}`}>
                {pushCount > 0 ? t("push_subscribed") : t("push_not_subscribed")}
              </span>
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm transition-all hover:border-violet-200 dark:hover:border-violet-800">
              <input type="checkbox" name="pushEnabled" defaultChecked={prefs?.pushEnabled ?? false} className="text-violet-600 accent-violet-600" />
              {t("push_enabled")}
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm transition-all hover:border-violet-200 dark:hover:border-violet-800">
              <input type="checkbox" name="urgentAlertsEnabled" defaultChecked={prefs?.urgentAlertsEnabled ?? false} className="text-violet-600 accent-violet-600" />
              {t("urgent_enabled")}
            </label>
          </div>
        </section>

        <div className="text-right">
          <button type="submit" className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:shadow-violet-200 active:scale-95 dark:hover:shadow-violet-950/50">
            {t("save")}
          </button>
        </div>
      </form>
    </div>
  );
}
