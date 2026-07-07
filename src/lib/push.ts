import webpush from "web-push";
import { prisma } from "@/lib/db";

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://zam-dun.vercel.app";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(`mailto:push@${new URL(appUrl).hostname}`, vapidPublicKey, vapidPrivateKey);
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  urgent?: boolean;
}

export async function sendPush(userId: string, payload: PushPayload) {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId, revokedAt: null },
  });

  const results: { endpoint: string; status: "sent" | "failed"; error?: string }[] = [];

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify(payload),
      );

      await prisma.pushSubscription.update({
        where: { id: sub.id },
        data: { lastUsedAt: new Date() },
      });

      results.push({ endpoint: sub.endpoint, status: "sent" });
    } catch (err) {
      const isGone = err instanceof Error && "statusCode" in err && (err as any).statusCode === 410;
      if (isGone) {
        await prisma.pushSubscription.update({
          where: { id: sub.id },
          data: { revokedAt: new Date() },
        });
      }
      results.push({ endpoint: sub.endpoint, status: "failed", error: err instanceof Error ? err.message : String(err) });
    }
  }

  return results;
}

export function renderPushPayload(
  briefingTitle: string,
  itemCount: number,
  urgent?: boolean,
): PushPayload {
  return {
    title: urgent ? "🔴 zam-dun · Urgent" : "zam-dun",
    body: `${briefingTitle} · ${itemCount} items ready`,
    url: "/app",
    urgent,
  };
}
