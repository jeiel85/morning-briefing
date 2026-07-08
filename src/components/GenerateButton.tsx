"use client";

import { useActionState } from "react";
import { Sparkles } from "lucide-react";
import { generateBriefing } from "@/lib/actions";

export function GenerateButton({ label, pendingLabel }: { label: string; pendingLabel?: string }) {
  const [, action, pending] = useActionState(generateBriefing, null);

  return (
    <form action={action}>
      <button
        type="submit"
        disabled={pending}
        className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-aurora-deep to-iris px-7 py-3.5 text-sm font-medium text-white shadow-glow-violet transition-all hover:shadow-[0_0_0_1px_rgba(139,92,246,0.2),0_16px_40px_-10px_rgba(124,92,240,0.6)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
      >
        {pending ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            {pendingLabel ?? "Generating…"}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110 group-hover:rotate-12" />
            {label}
          </>
        )}
      </button>
    </form>
  );
}
