import { useEffect, useRef, useState } from "react";
import {
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, ListMusic,
  Activity, AudioWaveform, EyeOff, Eye,
} from "lucide-react";
import { site } from "@/config/site";
import { useLocalStorage } from "@/lib/useLocalStorage";

type VizStyle = "bars" | "wave";
type MusicState = {
  index: number;
  volume: number;
  muted: boolean;
  autoplay: boolean;
  vizEnabled: boolean;
  vizStyle: VizStyle;
  vizSensitivity: number; // 0.2 .. 3
};

const FADE_MS = 1200;
const BARS = 28;

export function MusicPlayer() {
  const tracks = site.music.tracks;

  const [state, setState] = useLocalStorage<MusicState>("music-state", {
    index: 0,
    volume: site.music.volume,
    muted: false,
    autoplay: site.music.autoplay,
    vizEnabled: true,
    vizStyle: "bars",
    vizSensitivity: 1,
  });

  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState({ current: 0, duration: 0 });

  // Two audio elements for crossfade
  const audioARef = useRef<HTMLAudioElement | null>(null);
  const audioBRef = useRef<HTMLAudioElement | null>(null);
  const activeRef = useRef<"A" | "B">("A");

  // Web Audio graph
  const ctxRef = useRef<AudioContext | null>(null);
  const gainARef = useRef<GainNode | null>(null);
  const gainBRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const initedRef = useRef(false);

  // Visualizer
  const [bars, setBars] = useState<number[]>(() => Array(BARS).fill(0));
  const rafRef = useRef<number>(0);
  const vizStyleRef = useRef<VizStyle>(state.vizStyle);
  const sensRef = useRef<number>(state.vizSensitivity);
  useEffect(() => { vizStyleRef.current = state.vizStyle; }, [state.vizStyle]);
  useEffect(() => { sensRef.current = state.vizSensitivity; }, [state.vizSensitivity]);

  const safeIndex = Math.min(Math.max(0, state.index), Math.max(0, tracks.length - 1));
  const current = tracks[safeIndex];

  // ---- Init Web Audio on first user gesture ----
  const initAudio = () => {
    if (initedRef.current) return;
    const a = audioARef.current, b = audioBRef.current;
    if (!a || !b) return;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const srcA = ctx.createMediaElementSource(a);
      const srcB = ctx.createMediaElementSource(b);
      const gA = ctx.createGain();
      const gB = ctx.createGain();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      gA.gain.value = activeRef.current === "A" ? state.volume : 0;
      gB.gain.value = activeRef.current === "B" ? state.volume : 0;
      srcA.connect(gA).connect(analyser);
      srcB.connect(gB).connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      gainARef.current = gA;
      gainBRef.current = gB;
      analyserRef.current = analyser;
      initedRef.current = true;
      runViz();
    } catch {
      // Some browsers may fail; we'll still use HTMLAudio volume directly
    }
  };

  const runViz = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const step = Math.floor(data.length / BARS) || 1;
      const next: number[] = [];
      for (let i = 0; i < BARS; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) sum += data[i * step + j] || 0;
        next.push(sum / step / 255);
      }
      setBars(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // ---- Apply volume / mute live ----
  useEffect(() => {
    const a = audioARef.current, b = audioBRef.current;
    if (a) a.muted = state.muted;
    if (b) b.muted = state.muted;
    // adjust active gain only (inactive stays at 0 between fades)
    const gActive = activeRef.current === "A" ? gainARef.current : gainBRef.current;
    const ctx = ctxRef.current;
    if (gActive && ctx) {
      gActive.gain.cancelScheduledValues(ctx.currentTime);
      gActive.gain.setValueAtTime(state.volume, ctx.currentTime);
    } else {
      // fallback when web audio not initialised
      if (a) a.volume = activeRef.current === "A" ? state.volume : 0;
      if (b) b.volume = activeRef.current === "B" ? state.volume : 0;
    }
  }, [state.volume, state.muted]);

  // ---- Initial: load active audio, autoplay if requested ----
  useEffect(() => {
    const active = activeRef.current === "A" ? audioARef.current : audioBRef.current;
    const inactive = activeRef.current === "A" ? audioBRef.current : audioARef.current;
    if (!active) return;
    if (active.src !== window.location.origin + current.src && !active.src.endsWith(current.src)) {
      active.src = current.src;
      active.load();
    }
    if (inactive) {
      // pre-zero the inactive without web audio
      inactive.volume = 0;
    } else {
      // unused
    }
    if (state.autoplay) {
      active.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Play / pause toggle ----
  const toggle = async () => {
    initAudio();
    const ctx = ctxRef.current;
    if (ctx?.state === "suspended") await ctx.resume();
    const active = activeRef.current === "A" ? audioARef.current : audioBRef.current;
    if (!active) return;
    if (active.paused) {
      try {
        await active.play();
        setPlaying(true);
      } catch { /* ignore */ }
    } else {
      active.pause();
      setPlaying(false);
    }
  };

  // ---- Crossfade to a new index ----
  const switchTo = async (newIndex: number) => {
    if (newIndex === safeIndex) return;
    initAudio();
    const ctx = ctxRef.current;
    if (ctx?.state === "suspended") await ctx.resume();

    const fromKey = activeRef.current;
    const toKey: "A" | "B" = fromKey === "A" ? "B" : "A";
    const fromEl = fromKey === "A" ? audioARef.current : audioBRef.current;
    const toEl   = toKey   === "A" ? audioARef.current : audioBRef.current;
    const fromGain = fromKey === "A" ? gainARef.current : gainBRef.current;
    const toGain   = toKey   === "A" ? gainARef.current : gainBRef.current;
    if (!fromEl || !toEl) return;

    toEl.src = tracks[newIndex].src;
    toEl.muted = state.muted;
    toEl.load();

    try { await toEl.play(); } catch { /* ignore */ }

    const now = ctx?.currentTime ?? 0;
    const fadeSec = FADE_MS / 1000;
    if (ctx && fromGain && toGain) {
      fromGain.gain.cancelScheduledValues(now);
      toGain.gain.cancelScheduledValues(now);
      fromGain.gain.setValueAtTime(fromGain.gain.value, now);
      toGain.gain.setValueAtTime(0, now);
      fromGain.gain.linearRampToValueAtTime(0, now + fadeSec);
      toGain.gain.linearRampToValueAtTime(state.volume, now + fadeSec);
    } else {
      // CSS-style fallback
      const start = performance.now();
      const startVol = fromEl.volume;
      const animate = (t: number) => {
        const k = Math.min(1, (t - start) / FADE_MS);
        fromEl.volume = startVol * (1 - k);
        toEl.volume = state.volume * k;
        if (k < 1) requestAnimationFrame(animate);
        else fromEl.pause();
      };
      requestAnimationFrame(animate);
    }

    setTimeout(() => {
      fromEl.pause();
    }, FADE_MS + 50);

    activeRef.current = toKey;
    setState((s) => ({ ...s, index: newIndex }));
    setPlaying(true);
  };

  const next = () => switchTo((safeIndex + 1) % tracks.length);
  const prev = () => switchTo((safeIndex - 1 + tracks.length) % tracks.length);

  // ---- Track current time / duration of the active element ----
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = activeRef.current === "A" ? audioARef.current : audioBRef.current;
      if (el) {
        setTime({
          current: el.currentTime || 0,
          duration: Number.isFinite(el.duration) ? el.duration : 0,
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = activeRef.current === "A" ? audioARef.current : audioBRef.current;
    if (!el || !time.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    el.currentTime = Math.max(0, Math.min(time.duration, pct * time.duration));
  };

  // ---- Keyboard shortcuts ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.code === "Space") { e.preventDefault(); toggle(); }
      else if (e.code === "ArrowRight" && (e.shiftKey || tracks.length > 1)) { e.preventDefault(); next(); }
      else if (e.code === "ArrowLeft"  && (e.shiftKey || tracks.length > 1)) { e.preventDefault(); prev(); }
      else if (e.key.toLowerCase() === "m") { setState((s) => ({ ...s, muted: !s.muted })); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex, state.volume, state.muted]);

  if (!site.music.enabled || tracks.length === 0) return null;

  const fmt = (s: number) => {
    if (!Number.isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };
  const progressPct = time.duration ? (time.current / time.duration) * 100 : 0;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Track list dropdown */}
      {open && (
        <div className="w-64 origin-bottom-right animate-scale-in overflow-hidden rounded-xl border border-border/60 bg-card/90 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-border/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Playlist
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {tracks.map((t, i) => (
              <li key={`${t.src}-${i}`}>
                <button
                  onClick={() => { switchTo(i); setOpen(false); }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-muted/60 ${
                    i === safeIndex ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  <span className="w-5 text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                  <span className="flex-1 truncate">{t.title}</span>
                  {i === safeIndex && playing && (
                    <span className="text-[10px] uppercase tracking-wider">Now</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <label className="flex items-center justify-between border-t border-border/40 px-3 py-2 text-xs">
            <span className="text-muted-foreground">Autoplay on load</span>
            <input
              type="checkbox"
              checked={state.autoplay}
              onChange={(e) => setState((s) => ({ ...s, autoplay: e.target.checked }))}
              className="h-4 w-4 accent-primary"
            />
          </label>
        </div>
      )}

      {/* Progress + time */}
      <div className="flex w-full max-w-[420px] items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 shadow-lg backdrop-blur-md">
        <span className="w-9 text-right text-[10px] tabular-nums text-muted-foreground">
          {fmt(time.current)}
        </span>
        <div
          onClick={seek}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(time.duration)}
          aria-valuenow={Math.round(time.current)}
          className="group relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-[width] duration-100"
            style={{ width: `${progressPct}%` }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full bg-primary opacity-0 shadow transition group-hover:opacity-100"
            style={{ left: `${progressPct}%` }}
          />
        </div>
        <span className="w-9 text-[10px] tabular-nums text-muted-foreground">
          {fmt(time.duration)}
        </span>
      </div>

      {/* Player bar */}
      <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-2 py-2 shadow-lg backdrop-blur-md">
        <audio ref={audioARef} preload="auto" onEnded={next} crossOrigin="anonymous" />
        <audio ref={audioBRef} preload="auto" onEnded={next} crossOrigin="anonymous" />

        <button
          onClick={prev}
          aria-label="Previous track"
          disabled={tracks.length < 2}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground disabled:opacity-30"
        >
          <SkipBack className="h-4 w-4" />
        </button>

        <button
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>

        <button
          onClick={next}
          aria-label="Next track"
          disabled={tracks.length < 2}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground disabled:opacity-30"
        >
          <SkipForward className="h-4 w-4" />
        </button>

        {/* Visualizer (always visible) */}
        <div className="flex h-8 items-end gap-px px-2" aria-hidden>
          {bars.map((v, i) => (
            <span
              key={i}
              className="viz-bar"
              style={{ height: `${Math.max(2, v * 28)}px` }}
            />
          ))}
        </div>

        <div className="hidden min-w-0 max-w-[120px] px-1 text-xs md:block">
          <div className="truncate font-medium">{current.title}</div>
          <div className="truncate text-[10px] text-muted-foreground">
            {safeIndex + 1} / {tracks.length}
          </div>
        </div>

        {/* Volume slider (always visible) */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={state.muted ? 0 : state.volume}
          onChange={(e) => {
            const v = Number(e.target.value);
            setState((s) => ({ ...s, volume: v, muted: v === 0 ? s.muted : false }));
          }}
          className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-muted accent-primary sm:w-20"
          aria-label="Volume"
        />

        <button
          onClick={() => setState((s) => ({ ...s, muted: !s.muted }))}
          aria-label={state.muted ? "Unmute" : "Mute"}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground"
        >
          {state.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Playlist"
          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
            open ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListMusic className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
