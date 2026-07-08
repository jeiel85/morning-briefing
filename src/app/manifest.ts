import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "zam-dun · 잠든 사이",
    short_name: "zam-dun",
    description: "While you slept, the world moved. Wake to a calm, curated morning briefing.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    background_color: "#08060f",
    theme_color: "#08060f",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
    ],
  };
}
