import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>
      <p className="text-neutral-600">
        Preference management coming soon.
      </p>
    </div>
  );
}
