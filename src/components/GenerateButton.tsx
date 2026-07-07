"use client";

import { useActionState } from "react";
import { generateBriefing } from "@/lib/actions";

export function GenerateButton({ label }: { label: string }) {
  const [, action, pending] = useActionState(generateBriefing, null);

  return (
    <form action={action}>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-neutral-900 px-8 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "..." : label}
      </button>
    </form>
  );
}
