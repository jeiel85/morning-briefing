"use client";

import { useEffect, useCallback } from "react";

const VAPID_PUBLIC_KEY = "BFpPS-qBZhf7FfAN7HyMItkLqM9oVkUG0B3cn7J4-WoUvMpMMoEoIr6ZlIZg3N3H-1eYnEJtxXDhPrphD_6Soik";

export function PushManager({ userId }: { userId: string }) {
  const registerSw = useCallback(async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          endpoint: sub.endpoint,
          p256dh: btoa(String.fromCharCode(...new Uint8Array(sub.getKey("p256dh")!))),
          auth: btoa(String.fromCharCode(...new Uint8Array(sub.getKey("auth")!))),
          userAgent: navigator.userAgent,
        }),
      });
    } catch {
      // push not supported or permission denied
    }
  }, [userId]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") registerSw();
      });
    }
  }, [registerSw]);

  return null;
}
