import { useBgSettings, DEFAULT_BG } from "@/lib/bgSettings";
import { useEffect, useState } from "react";

const COLORS = [
  "oklch(0.7 0.22 285)",  // violet
  "oklch(0.72 0.2 200)",  // cyan
  "oklch(0.72 0.22 340)", // pink
  "oklch(0.72 0.2 150)",  // green
  "oklch(0.75 0.22 50)",  // amber
  "oklch(0.7 0.22 20)",   // red
  "oklch(0.72 0.2 240)",  // blue
  "oklch(0.78 0.2 100)",  // lime
];

export function AnimatedBackground() {
  // Avoid SSR / hydration mismatch — render only after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [settingsRaw] = useBgSettings();
  const s = mounted ? settingsRaw : DEFAULT_BG;

  const starCount = Math.round((s.stars / 100) * 120);
  const particleCount = Math.round((s.particles / 100) * 60);
  const blobCount = Math.max(0, Math.round((s.blobs / 100) * 8));
  const auroraOpacity = s.aurora / 100;

  const particles = Array.from({ length: particleCount }, (_, i) => {
    const left = (i * 37) % 100;
    const delay = (i * 0.7) % 16;
    const duration = 12 + ((i * 3) % 18);
    const size = 2 + ((i * 5) % 7);
    const opacity = 0.25 + ((i % 5) * 0.1);
    const hue = COLORS[i % COLORS.length];
    return { left, delay, duration, size, opacity, hue, key: i };
  });

  const stars = Array.from({ length: starCount }, (_, i) => {
    const left = (i * 53) % 100;
    const top = (i * 29) % 100;
    const delay = (i * 0.31) % 6;
    const duration = 2 + ((i * 0.7) % 4);
    const size = 1 + (i % 3);
    return { left, top, delay, duration, size, key: i };
  });

  const blobs = Array.from({ length: blobCount }, (_, i) => {
    const color = COLORS[i % COLORS.length];
    const size = 30 + ((i * 13) % 35); // vw
    const top = (i * 19) % 90;
    const left = (i * 41) % 90;
    const dur = 18 + ((i * 5) % 22);
    const opacity = 0.35 + ((i % 4) * 0.1);
    const anim = ["blob-float-a", "blob-float-b", "blob-float-c"][i % 3];
    return { color, size, top, left, dur, opacity, anim, key: i };
  });

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />

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

      {auroraOpacity > 0 && (
        <>
          <div className="aurora aurora-1" style={{ opacity: 0.55 * auroraOpacity }} />
          <div className="aurora aurora-2" style={{ opacity: 0.4 * auroraOpacity }} />
          <div className="aurora aurora-3" style={{ opacity: 0.3 * auroraOpacity, transform: "scale(1.3)" }} />
          <div className="aurora aurora-4" style={{ opacity: 0.35 * auroraOpacity }} />
        </>
      )}

      {blobs.map((b) => (
        <div
          key={`b-${b.key}`}
          className="blob"
          style={{
            top: `${b.top}%`,
            left: `${b.left}%`,
            width: `${b.size}vw`,
            height: `${b.size}vw`,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            animation: `${b.anim} ${b.dur}s ease-in-out infinite`,
            opacity: b.opacity,
          }}
        />
      ))}

      {particles.map((p) => (
        <span
          key={`p-${p.key}`}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            background: p.hue,
            boxShadow: `0 0 10px 2px ${p.hue}`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {s.grid && <div className="bg-grid" />}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55))]" />
    </div>
  );
}
