import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";

export default async function BriefingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const { id } = await params;

  const briefing = await prisma.briefing.findUnique({
    where: { id },
    include: { items: { orderBy: { rank: "asc" } } },
  });

  if (!briefing || briefing.userId !== session.user.id) notFound();

  return (
    <div>
      <a href="/app/history" className="mb-4 inline-block text-sm text-blue-600 hover:underline">
        ← Back to history
      </a>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{briefing.title}</h1>
        <p className="text-sm text-neutral-500">
          {briefing.briefingDate.toLocaleDateString()} · {briefing.mode.replace("_", " ")}
        </p>
      </div>

      <div className="space-y-4">
        {briefing.items.map((item) => (
          <article key={item.id} className="rounded-lg border border-neutral-200 p-5">
            <div className="mb-1 flex items-start justify-between">
              <span className="text-xs font-medium uppercase text-neutral-400">
                {item.section}
              </span>
              <span className="text-xs text-neutral-400">
                Score: {item.finalScore.toFixed(2)}
              </span>
            </div>
            <h2 className="mb-2 text-lg font-semibold">{item.title}</h2>
            <ul className="mb-3 space-y-1">
              {item.summaryBullets.map((bullet, i) => (
                <li key={i} className="text-sm text-neutral-700">· {bullet}</li>
              ))}
            </ul>
            {item.whyItMatters && (
              <p className="mb-3 text-sm text-neutral-600">
                <span className="font-medium">Why it matters:</span> {item.whyItMatters}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
