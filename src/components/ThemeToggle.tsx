"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // The blocking script in <head> already set the class; sync to it.
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  const base =
    "group relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] transition-all hover:border-aurora/50 hover:text-aurora active:scale-90";

  // Before mount, render a stable placeholder so server and client first paint match.
  if (!mounted) {
    return (
      <button className={base} aria-label="Toggle theme">
        <Moon className="h-[18px] w-[18px] opacity-60" />
      </button>
    );
  }

  return (
    <button className={base} onClick={toggle} aria-label="Toggle theme" aria-pressed={dark}>
      <Sun
        className={`absolute h-[18px] w-[18px] transition-all duration-500 ${
          dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        }`}
      />
      <Moon
        className={`absolute h-[18px] w-[18px] transition-all duration-500 ${
          dark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
    </button>
  );
}
