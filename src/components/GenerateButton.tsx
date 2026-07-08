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
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-violet-200 transition-all hover:shadow-xl hover:shadow-violet-300 active:scale-95 disabled:opacity-50 disabled:shadow-none dark:shadow-violet-950/50 dark:hover:shadow-violet-950/70"
      >
        {pending ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Generating...
          </>
        ) : (
          label
        )}
      </button>
    </form>
  );
}
