import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateBriefing, saveFeedback } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const briefing = await prisma.briefing.findFirst({
    where: {
      userId: session.user.id,
      briefingDate: { gte: today },
    },
    include: {
      items: { orderBy: { rank: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!briefing) {
    return (
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">Today&apos;s Briefing</h1>
        <p className="mb-6 text-neutral-600">No briefing yet.</p>
        <form action={generateBriefing} className="inline">
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-6 py-2 text-sm text-white hover:bg-neutral-800"
          >
            Generate Now
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{briefing.title}</h1>
        <span className="text-sm text-neutral-500">
          {briefing.generatedAt.toLocaleString()}
        </span>
      </div>

      {briefing.coverageNote && (
        <p className="mb-6 rounded bg-amber-50 px-4 py-2 text-sm text-amber-800">
          {briefing.coverageNote}
        </p>
      )}

      <div className="space-y-4">
        {briefing.items.map((item, idx) => (
          <article key={item.id} className="rounded-lg border border-neutral-200 p-5">
            <div className="mb-1 flex items-start justify-between">
              <span className="text-xs font-medium uppercase text-neutral-400">
                {item.section} · #{item.rank}
              </span>
              <span className="text-xs text-neutral-400">
                Score: {item.finalScore.toFixed(2)}
              </span>
            </div>
            <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>

            {item.summaryBullets.length > 0 && (
              <ul className="mb-3 space-y-1">
                {item.summaryBullets.map((bullet, i) => (
                  <li key={i} className="text-sm text-neutral-700">· {bullet}</li>
                ))}
              </ul>
            )}

            {item.whyItMatters && (
              <p className="mb-3 text-sm text-neutral-600">
                <span className="font-medium">Why it matters:</span> {item.whyItMatters}
              </p>
            )}

            {item.confirmedFacts.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-medium text-green-700">Confirmed</span>
                <ul className="text-xs text-neutral-600">
                  {item.confirmedFacts.map((f, i) => (
                    <li key={i}>✓ {f}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.uncertainties.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-medium text-amber-700">Uncertainties</span>
                <ul className="text-xs text-neutral-600">
                  {item.uncertainties.map((u, i) => (
                    <li key={i}>? {u}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.validationStatus === "limited" && (
              <p className="mb-2 text-xs text-amber-600">Limited summary — LLM unavailable</p>
            )}

            {Array.isArray(item.sourceLinks) && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-neutral-500 hover:text-neutral-700">
                  Sources ({Array.isArray(item.sourceLinks) ? item.sourceLinks.length : 0})
                </summary>
                <ul className="mt-1 space-y-1">
                  {(item.sourceLinks as Array<{ title: string; url: string; sourceName: string }>).map((link, i) => (
                    <li key={i}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                        {link.sourceName}: {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}
            <div className="mt-3 flex gap-2 border-t border-neutral-100 pt-3">
              {["useful", "not_useful", "duplicate", "block_source"].map((type) => (
                <form key={type} action={saveFeedback.bind(null, item.id, type)}>
                  <button type="submit" className="rounded px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800">
                    {type.replace(/_/g, " ")}
                  </button>
                </form>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
