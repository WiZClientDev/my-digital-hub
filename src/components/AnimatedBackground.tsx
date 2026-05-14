// Chill animated background: drifting gradient blobs + floating particles.
// Pure CSS animations, no extra deps.

export function AnimatedBackground() {
  // Deterministic-ish particles
  const particles = Array.from({ length: 28 }, (_, i) => {
    const left = (i * 37) % 100;
    const delay = (i * 0.7) % 14;
    const duration = 14 + ((i * 3) % 16);
    const size = 2 + ((i * 5) % 6);
    const opacity = 0.25 + ((i % 5) * 0.1);
    return { left, delay, duration, size, opacity, key: i };
  });

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />

      {/* Animated blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />

      {/* Drifting particles */}
      {particles.map((p) => (
        <span
          key={p.key}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Subtle grain / vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5))]" />
    </div>
  );
}
