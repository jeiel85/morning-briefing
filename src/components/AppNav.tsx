"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sunrise, History, SlidersHorizontal, Rss, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  today: Sunrise,
  history: History,
  settings: SlidersHorizontal,
  sources: Rss,
};

export function AppNav({ items }: { items: { href: string; key: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-1 md:flex-col md:overflow-visible md:pt-4">
      {items.map(({ href, key, label }) => {
        const Icon = ICONS[key];
        const active = href === "/app" ? pathname === "/app" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`group flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all md:shrink ${
              active
                ? "bg-gradient-to-r from-aurora/15 to-transparent font-medium text-aurora ring-1 ring-inset ring-aurora/15"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
            }`}
          >
            <Icon
              className={`h-4 w-4 transition-colors ${
                active ? "text-aurora" : "text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]"
              }`}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
