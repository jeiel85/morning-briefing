import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const briefings = await prisma.briefing.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { items: true } } },
    orderBy: { briefingDate: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Briefing History</h1>
      {briefings.length === 0 ? (
        <p className="text-neutral-600">No briefings yet.</p>
      ) : (
        <div className="space-y-2">
          {briefings.map((b) => (
            <a
              key={b.id}
              href={`/app/briefings/${b.id}`}
              className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 hover:bg-neutral-50"
            >
              <div>
                <p className="font-medium">{b.title}</p>
                <p className="text-sm text-neutral-500">
                  {b.briefingDate.toLocaleDateString()} · {b._count.items} items
                </p>
              </div>
              <span className="text-xs text-neutral-400">
                {b.mode.replace("_", " ")}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
