import crypto from "node:crypto";

export function canonicalUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    u.search = "";
    u.pathname = u.pathname.replace(/\/+$/, "");
    return u.origin + u.pathname.toLowerCase();
  } catch {
    return url;
  }
}

export function normalizeTitle(title: string): string {
  return title
    .replace(/[^a-zA-Z0-9\uAC00-\uD7AF\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function titleHash(title: string): string {
  return crypto.createHash("sha256").update(normalizeTitle(title)).digest("hex").slice(0, 16);
}

export function urlHash(url: string): string {
  return crypto.createHash("sha256").update(canonicalUrl(url)).digest("hex").slice(0, 16);
}
