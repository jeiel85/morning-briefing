import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { savePreferences, getPreferences } from "@/lib/actions";

const TIMEZONES = Intl.supportedValuesOf?.("timeZone") ?? [
  "Asia/Seoul", "America/New_York", "America/Chicago", "America/Denver",
  "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Europe/Paris",
  "Asia/Tokyo", "Asia/Shanghai", "Asia/Singapore", "Australia/Sydney",
];

const CATEGORIES = [
  "technology", "developer", "ai", "security", "startup",
  "science", "business", "world", "design", "open_source",
];

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const prefs = await getPreferences();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold">Settings</h1>

      <form action={savePreferences} className="space-y-8">
        <section className="rounded-lg border border-neutral-200 p-6">
          <h2 className="mb-4 text-lg font-semibold">Schedule</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Timezone</label>
              <select name="timezone" defaultValue={prefs?.timezone ?? "Asia/Seoul"} className="w-full rounded border border-neutral-300 px-3 py-2 text-sm">
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Inactive window start</label>
              <input type="time" name="inactiveWindowStart" defaultValue={prefs?.inactiveWindowStart ?? "23:30"} className="w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Inactive window end</label>
              <input type="time" name="inactiveWindowEnd" defaultValue={prefs?.inactiveWindowEnd ?? "07:00"} className="w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Delivery time</label>
              <input type="time" name="briefingDeliveryTime" defaultValue={prefs?.briefingDeliveryTime ?? "07:05"} className="w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 p-6">
          <h2 className="mb-4 text-lg font-semibold">Topics</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-2 rounded border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50">
                <input type="checkbox" name="categories" value={cat} defaultChecked={prefs?.categories.includes(cat) ?? true} />
                {cat.replace("_", " ")}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 p-6">
          <h2 className="mb-4 text-lg font-semibold">Keywords</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Interest keywords</label>
              <input type="text" name="interestKeywords" defaultValue={prefs?.interestKeywords.join(", ") ?? ""} placeholder="rust, typescript, nextjs" className="w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Blocked keywords</label>
              <input type="text" name="blockedKeywords" defaultValue={prefs?.blockedKeywords.join(", ") ?? ""} placeholder="spoiler, gossip" className="w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 p-6">
          <h2 className="mb-4 text-lg font-semibold">Delivery</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="emailEnabled" defaultChecked={prefs?.emailEnabled ?? true} />
              <span className="text-sm">Email briefing</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="pushEnabled" defaultChecked={prefs?.pushEnabled ?? false} />
              <span className="text-sm">Push notifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="urgentAlertsEnabled" defaultChecked={prefs?.urgentAlertsEnabled ?? false} />
              <span className="text-sm">Urgent alerts</span>
            </label>
          </div>
        </section>

        <div className="text-right">
          <button type="submit" className="rounded-lg bg-neutral-900 px-6 py-2 text-sm text-white hover:bg-neutral-800">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
