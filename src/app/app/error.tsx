"use client";

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="mb-2 text-xl font-bold">Something went wrong</h2>
      <p className="mb-6 text-sm text-neutral-500">{error.message}</p>
      <button onClick={reset} className="rounded-lg bg-neutral-900 px-6 py-2 text-sm text-white hover:bg-neutral-800">
        Try again
      </button>
    </div>
  );
}
