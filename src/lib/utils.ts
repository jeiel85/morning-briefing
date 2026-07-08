import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the URL only if it uses a safe web scheme (http/https). Remote feed
 * content is untrusted, so this blocks `javascript:` / `data:` hrefs before they
 * reach an anchor. Returns null for anything else.
 */
export function safeExternalUrl(url: string): string | null {
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}
