self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));

self.addEventListener("push", (e) => {
  const data = e.data?.json() ?? { title: "zam-dun", body: "Your briefing is ready" };
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/icon.png",
    badge: "/badge.png",
    tag: data.urgent ? "urgent" : "briefing",
    renotify: data.urgent,
    data: { url: data.url ?? "/app" },
  });
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data?.url ?? "/app"));
});
