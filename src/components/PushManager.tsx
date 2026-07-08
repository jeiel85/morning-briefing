"use client";

import { useEffect, useCallback } from "react";

// Public key — safe to expose. Sourced from env so it can be rotated per deploy,
// with the current key as a fallback for backward compatibility.
const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ??
  "BFpPS-qBZhf7FfAN7HyMItkLqM9oVkUG0B3cn7J4-WoUvMpMMoEoIr6ZlIZg3N3H-1eYnEJtxXDhPrphD_6Soik";

export function PushManager() {
  const registerSw = useCallback(async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
      });
      // The visitor is derived server-side from the httpOnly cookie, which the
      // browser attaches to this same-origin request automatically.
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          p256dh: btoa(String.fromCharCode(...new Uint8Array(sub.getKey("p256dh")!))),
          auth: btoa(String.fromCharCode(...new Uint8Array(sub.getKey("auth")!))),
          userAgent: navigator.userAgent,
        }),
      });
    } catch {
      // push not supported or permission denied
    }
  }, []);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") registerSw();
      });
    }
  }, [registerSw]);

  return null;
}
