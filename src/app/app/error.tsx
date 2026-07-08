"use client";

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in-up">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-xl dark:bg-red-950/40">!</div>
      <h2 className="mb-2 text-xl font-bold">Something went wrong</h2>
      <p className="mb-6 text-sm text-[var(--text-secondary)]">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md active:scale-95"
      >
        Try again
      </button>
    </div>
  );
}
