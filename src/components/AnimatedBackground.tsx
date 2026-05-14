import { useBgSettings, DEFAULT_BG } from "@/lib/bgSettings";
import { useEffect, useState, useMemo } from "react";

const COLORS = [
  "oklch(0.72 0.2 200)",  // cyan
  "oklch(0.72 0.22 340)", // pink
  "oklch(0.72 0.2 150)",  // green
  "oklch(0.75 0.22 50)",  // amber
  "oklch(0.7 0.22 20)",   // red
  "oklch(0.72 0.2 240)",  // blue
  "oklch(0.78 0.2 100)",  // lime
  "oklch(0.72 0.22 285)", // violet
];

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [settingsRaw] = useBgSettings();
  const s = mounted ? settingsRaw : DEFAULT_BG;

  const [hoverBlur, setHoverBlur] = useState(false);
  useEffect(() => {
    const isInteractive = (el: EventTarget | null) =>
      !!(el as HTMLElement | null)?.closest?.(
        'a,button,[role="button"],input,textarea,select,label',
      );
    const onOver = (e: MouseEvent) => { if (isInteractive(e.target)) setHoverBlur(true); };
    const onOut = (e: MouseEvent) => {
      if (isInteractive(e.target) && !isInteractive(e.relatedTarget)) setHoverBlur(false);
    };
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, []);

  const starCount = Math.round((s.stars / 100) * 150);
  const particleCount = Math.round((s.particles / 100) * 70);
  const blobCount = Math.max(0, Math.round((s.blobs / 100) * 8));
  const auroraOpacity = s.aurora / 100;
  const snowCount = Math.round(40 + (s.particles / 100) * 30);

  const stars = useMemo(() =>
    Array.from({ length: starCount }, (_, i) => {
      const r1 = seededRandom(i * 53 + 7);
      const r2 = seededRandom(i * 29 + 13);
      const r3 = seededRandom(i * 31 + 19);
      const r4 = seededRandom(i * 7 + 41);
      return {
        left: r1 * 100,
        top: r2 * 100,
        delay: r3 * 6,
        duration: 2 + r4 * 4,
        size: 1 + Math.floor(r3 * 3),
        brightness: 0.3 + r4 * 0.7,
        key: i,
      };
    }), [starCount]);

  const blobs = useMemo(() =>
    Array.from({ length: blobCount }, (_, i) => {
      const color = COLORS[i % COLORS.length];
      const r1 = seededRandom(i * 19 + 3);
      const r2 = seededRandom(i * 41 + 7);
      const r3 = seededRandom(i * 13 + 11);
      const r4 = seededRandom(i * 5 + 17);
      return {
        color,
        size: 25 + r1 * 40,
        top: r2 * 85,
        left: r3 * 85,
        dur: 16 + r4 * 24,
        opacity: 0.25 + seededRandom(i * 23 + 29) * 0.35,
        anim: ["blob-float-a", "blob-float-b", "blob-float-c"][i % 3],
        key: i,
      };
    }), [blobCount]);

  const particles = useMemo(() =>
    Array.from({ length: particleCount }, (_, i) => {
      const r1 = seededRandom(i * 37 + 5);
      const r2 = seededRandom(i * 7 + 13);
      const r3 = seededRandom(i * 3 + 23);
      const r4 = seededRandom(i * 11 + 31);
      const r5 = seededRandom(i * 17 + 37);
      return {
        left: r1 * 100,
        delay: r2 * 16,
        duration: 10 + r3 * 18,
        size: 2 + Math.floor(r4 * 6),
        opacity: 0.2 + r5 * 0.5,
        hue: COLORS[i % COLORS.length],
        key: i,
      };
    }), [particleCount]);

  const snow = useMemo(() =>
    Array.from({ length: snowCount }, (_, i) => {
      const r1 = seededRandom(i * 41 + 2);
      const r2 = seededRandom(i * 43 + 7);
      const r3 = seededRandom(i * 17 + 13);
      const r4 = seededRandom(i * 3 + 19);
      const r5 = seededRandom(i * 23 + 29);
      return {
        left: r1 * 100,
        delay: r2 * 18,
        duration: 10 + r3 * 18,
        size: 2 + Math.floor(r4 * 4),
        drift: -50 + r5 * 100,
        opacity: 0.3 + seededRandom(i * 19 + 41) * 0.5,
        key: i,
      };
    }), [snowCount]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-[filter] duration-500 ${
        hoverBlur ? "bg-blurred" : ""
      }`}
    >
      <div className="absolute inset-0 bg-background" />

      {/* Stars with varied brightness */}
      {stars.map((star) => (
        <span
          key={`s-${star.key}`}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            ["--star-brightness" as string]: star.brightness,
          }}
        />
      ))}

      {/* Aurora layers with smoother gradients */}
      {auroraOpacity > 0 && (
        <>
          <div className="aurora aurora-1" style={{ opacity: 0.5 * auroraOpacity }} />
          <div className="aurora aurora-2" style={{ opacity: 0.35 * auroraOpacity }} />
          <div className="aurora aurora-3" style={{ opacity: 0.25 * auroraOpacity }} />
          <div className="aurora aurora-4" style={{ opacity: 0.3 * auroraOpacity }} />
        </>
      )}

      {/* Blobs with softer edges */}
      {blobs.map((b) => (
        <div
          key={`b-${b.key}`}
          className="blob"
          style={{
            top: `${b.top}%`,
            left: `${b.left}%`,
            width: `${b.size}vw`,
            height: `${b.size}vw`,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 65%)`,
            animation: `${b.anim} ${b.dur}s ease-in-out infinite`,
            opacity: b.opacity,
          }}
        />
      ))}

      {/* Glowing particles */}
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
            boxShadow: `0 0 ${p.size * 2}px ${Math.ceil(p.size / 2)}px ${p.hue}`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Snowflakes */}
      {snow.map((f) => (
        <span
          key={`f-${f.key}`}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            opacity: f.opacity,
            ["--snow-drift" as string]: `${f.drift}px`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
          }}
        />
      ))}

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65))]" />
    </div>
  );
}
