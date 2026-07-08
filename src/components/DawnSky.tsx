// The signature element: a living pre-dawn sky.
// Aurora light drifts, stars twinkle then thin toward the horizon, and a
// sun-glow breathes at the bottom edge — the "잠든 사이" moment made visible.
// Pure CSS animation (no client JS); star positions are deterministic so
// server and client render identically. Ambient motion is stilled under
// prefers-reduced-motion via globals.css.

// Deterministic pseudo-random in [0,1) from a seed — identical on server/client.
function rand(i: number, salt: number): number {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const STARS = Array.from({ length: 52 }, (_, i) => {
  const topPct = rand(i, 1) * 66; // upper two-thirds of the sky only
  return {
    top: topPct,
    left: rand(i, 2) * 100,
    size: 1 + rand(i, 3) * 1.8,
    delay: rand(i, 4) * 4,
    dur: 2.6 + rand(i, 5) * 3.4,
    // stars thin out as the sky brightens toward the horizon
    max: (0.45 + rand(i, 6) * 0.5) * (1 - topPct / 90),
  };
});

export function DawnSky({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      {/* Sky wash: a violet crown that deepens in the dark */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_85%_at_50%_-15%,rgba(139,92,246,0.16),transparent_58%)] dark:bg-[radial-gradient(130%_85%_at_50%_-15%,rgba(109,92,240,0.4),transparent_60%)]" />

      {/* Horizon sunrise: warm glow rising from the bottom edge */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(70%_100%_at_50%_125%,rgba(251,191,36,0.22),rgba(251,113,133,0.12)_40%,transparent_72%)] dark:bg-[radial-gradient(70%_100%_at_50%_128%,rgba(251,191,36,0.28),rgba(251,113,133,0.16)_38%,transparent_70%)]" />

      {/* Drifting aurora blobs */}
      <div
        className="aurora-blob animate-float"
        style={{ top: "-8%", left: "8%", width: "40vw", height: "40vw", maxWidth: 520, maxHeight: 520, background: "radial-gradient(circle, #8b5cf6, transparent 68%)" }}
      />
      <div
        className="aurora-blob animate-float"
        style={{ top: "6%", right: "4%", width: "34vw", height: "34vw", maxWidth: 460, maxHeight: 460, background: "radial-gradient(circle, #6366f1, transparent 68%)", animationDelay: "-2.5s", animationDuration: "9s" }}
      />
      <div
        className="aurora-blob animate-float"
        style={{ bottom: "-10%", left: "26%", width: "44vw", height: "44vw", maxWidth: 560, maxHeight: 560, background: "radial-gradient(circle, #fb7185, transparent 70%)", opacity: 0.4, animationDelay: "-5s", animationDuration: "11s" }}
      />

      {/* Stars — only meaningful against the night, so dark-mode only */}
      <div className="absolute inset-0 hidden dark:block">
        {STARS.map((s, i) => {
          const op = Math.max(0.05, s.max);
          return (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={
                {
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  width: s.size,
                  height: s.size,
                  "--star-max": op,
                  opacity: op,
                  animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
                  boxShadow: "0 0 4px rgba(255,255,255,0.6)",
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>
    </div>
  );
}
