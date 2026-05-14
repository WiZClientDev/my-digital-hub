// Chill animated background: drifting gradient blobs, aurora waves,
// floating particles + twinkling stars. Pure CSS, no extra deps.

export function AnimatedBackground() {
  // Floating particles
  const particles = Array.from({ length: 40 }, (_, i) => {
    const left = (i * 37) % 100;
    const delay = (i * 0.7) % 16;
    const duration = 14 + ((i * 3) % 18);
    const size = 2 + ((i * 5) % 6);
    const opacity = 0.25 + ((i % 5) * 0.1);
    return { left, delay, duration, size, opacity, key: i };
  });

  // Twinkling stars (static positions, animated opacity)
  const stars = Array.from({ length: 70 }, (_, i) => {
    const left = (i * 53) % 100;
    const top = (i * 29) % 100;
    const delay = (i * 0.31) % 6;
    const duration = 2 + ((i * 0.7) % 4);
    const size = 1 + (i % 3);
    return { left, top, delay, duration, size, key: i };
  });

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-background" />

      {/* Twinkling stars */}
      {stars.map((s) => (
        <span
          key={`s-${s.key}`}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      {/* Aurora wave layers */}
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />

      {/* Animated blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />
      <div className="blob blob-5" />

      {/* Drifting particles */}
      {particles.map((p) => (
        <span
          key={`p-${p.key}`}
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

      {/* Subtle moving grid */}
      <div className="bg-grid" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55))]" />
    </div>
  );
}
