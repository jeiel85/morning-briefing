import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isInternalRequest } from "@/lib/auth-guard";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isInternalRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const delLogs = await prisma.deliveryLog.deleteMany({ where: { attemptedAt: { lt: thirtyDaysAgo } } });
  const clusters = await prisma.topicCluster.deleteMany({ where: { lastSeenAt: { lt: thirtyDaysAgo }, items: { none: {} }, briefingItems: { none: {} } } });
  const rawItems = await prisma.rawItem.deleteMany({ where: { fetchedAt: { lt: thirtyDaysAgo }, clusterItems: { none: {} } } });
  const runs = await prisma.sourceFetchRun.deleteMany({ where: { completedAt: { lt: sevenDaysAgo } } });

  return NextResponse.json({
    deletedDeliveryLogs: delLogs.count,
    deletedClusters: clusters.count,
    deletedRawItems: rawItems.count,
    deletedFetchRuns: runs.count,
  });
}
