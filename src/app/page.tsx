import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DawnSky } from "@/components/DawnSky";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import Link from "next/link";
import { ArrowRight, Rss, Sparkles, Sunrise, Github } from "lucide-react";

// ISR: keep the live counts fresh without paying a DB hit on every request.
export const revalidate = 3600;

const FEATURES = [
  { icon: Rss, title: "feature1_title", body: "feature1" },
  { icon: Sparkles, title: "feature2_title", body: "feature2" },
  { icon: Sunrise, title: "feature3_title", body: "feature3" },
] as const;

export default async function Home() {
  const t = await getTranslations("landing");

  let stats: { users: number; briefings: number } | null = null;
  try {
    const [users, briefings] = await Promise.all([prisma.user.count(), prisma.briefing.count()]);
    stats = { users, briefings };
  } catch {}

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Top fold: the living dawn sky ───────────────────────── */}
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
        <DawnSky />

        <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
          <span className="text-dawn font-display text-xl font-semibold tracking-tight">
            {t("title")}
          </span>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              href="/app"
              className="rounded-full bg-[var(--text)] px-5 py-2 text-sm font-medium text-[var(--bg)] transition-all hover:opacity-90 active:scale-95"
            >
              {t("start_short")}
            </Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-14 text-center">
          <div className="animate-fade-in-up glass mb-7 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--text-secondary)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sun" />
            </span>
            {t("eyebrow")}
          </div>

          <h1 className="animate-fade-in-up-delay-1 font-display text-5xl font-medium leading-[1.04] tracking-tight md:text-7xl">
            <span className="text-[var(--text)]">{t("headline_lead")}</span>
            <br />
            <span className="text-dawn italic">{t("headline_emph")}</span>
          </h1>

          <p className="animate-fade-in-up-delay-2 mx-auto mt-7 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)]">
            {t("subtitle")}
          </p>

          <div className="animate-fade-in-up-delay-3 mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/app"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-aurora-deep to-iris px-7 py-3.5 text-sm font-medium text-white shadow-glow-violet transition-all hover:shadow-[0_0_0_1px_rgba(139,92,246,0.2),0_16px_40px_-10px_rgba(124,92,240,0.6)] active:scale-95"
            >
              {t("start")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="glass rounded-full border border-[var(--border-strong)] px-6 py-3.5 text-sm font-medium text-[var(--text)] transition-all hover:border-aurora/50 hover:text-aurora"
            >
              {t("how")}
            </a>
          </div>

          {/* Briefing preview — makes the abstract concrete */}
          <div className="animate-fade-in-up-delay-3 mt-16 w-full max-w-md">
            <div className="glass group rotate-[-1.2deg] rounded-2xl p-5 text-left shadow-lift transition-transform duration-500 hover:rotate-0">
              <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">
                <span className="inline-flex items-center gap-1.5">
                  <Sunrise className="h-3.5 w-3.5 text-sun-deep" />
                  {t("preview_label")}
                </span>
                <span className="rounded bg-aurora/10 px-1.5 py-0.5 text-aurora">#1</span>
              </div>
              <h3 className="font-display text-lg font-medium leading-snug text-[var(--text)]">
                {t("preview_title")}
              </h3>
              <ul className="mt-3 space-y-2">
                {[t("preview_bullet1"), t("preview_bullet2")].map((b, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-aurora to-rose-dawn" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className="mx-auto w-full max-w-6xl scroll-mt-8 px-5 py-24">
        <Reveal>
          <p className="text-center font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
            {t("features_title")}
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 90}>
                <div className="group h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-aurora/40 hover:shadow-lift">
                  <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-aurora/15 to-iris/15 text-aurora ring-1 ring-inset ring-aurora/20 transition-all group-hover:from-aurora/25 group-hover:to-iris/25">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-medium text-[var(--text)]">{t(f.title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{t(f.body)}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── Live stats ───────────────────────────────────────────── */}
      {stats && (stats.users > 0 || stats.briefings > 0) && (
        <section className="border-y border-[var(--border)] bg-[var(--surface-2)]/50">
          <div className="mx-auto grid max-w-3xl grid-cols-2 divide-x divide-[var(--border)]">
            {[
              { value: stats.users, label: t("stat_readers") },
              { value: stats.briefings, label: t("stat_briefings") },
            ].map((s) => (
              <Reveal key={s.label} className="px-5 py-12 text-center">
                <div className="text-dawn font-display text-4xl font-semibold md:text-5xl">
                  <CountUp value={s.value} />
                </div>
                <div className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                  {s.label}
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Closing CTA ──────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden px-5 py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_120%_at_50%_120%,rgba(139,92,246,0.12),transparent_60%)]" />
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-medium leading-tight tracking-tight text-[var(--text)] md:text-4xl">
            {t("cta_title")}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--text-secondary)]">{t("cta_sub")}</p>
          <Link
            href="/app"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-aurora-deep to-iris px-7 py-3.5 text-sm font-medium text-white shadow-glow-violet transition-all hover:shadow-[0_0_0_1px_rgba(139,92,246,0.2),0_16px_40px_-10px_rgba(124,92,240,0.6)] active:scale-95"
          >
            {t("start")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-[var(--border)] px-5 py-6 text-xs text-[var(--text-tertiary)]">
        <span className="text-dawn font-display font-semibold">{t("title")}</span>
        <span className="opacity-40">·</span>
        <Link href="/privacy" className="transition-colors hover:text-[var(--text-secondary)]">Privacy</Link>
        <Link href="/terms" className="transition-colors hover:text-[var(--text-secondary)]">Terms</Link>
        <a
          href="https://github.com/jeiel85/morning-briefing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 transition-colors hover:text-[var(--text-secondary)]"
        >
          <Github className="h-3.5 w-3.5" /> GitHub
        </a>
      </footer>
    </div>
  );
}
