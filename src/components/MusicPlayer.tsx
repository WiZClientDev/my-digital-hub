import { useEffect, useRef, useState } from "react";
import {
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, ListMusic,
  Activity, AudioWaveform, Eye, EyeOff, Plus, Trash2, GripVertical, X, Check,
} from "lucide-react";
import { music as defaultMusic, type Track } from "@/config/site";
import { useLocalStorage } from "@/lib/useLocalStorage";

type VizStyle = "bars" | "wave";

type MusicState = {
  index: number;
  volume: number;
  muted: boolean;
  autoplay: boolean;
  vizEnabled: boolean;
  vizStyle: VizStyle;
  vizSensitivity: number;
  tracks: Track[];
};

const FADE_MS = 1200;
const BARS = 28;

function fmt(s: number) {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export function MusicPlayer() {
  const [state, setState] = useLocalStorage<MusicState>("music-state-v2", {
    index: 0,
    volume: defaultMusic.volume,
    muted: false,
    autoplay: defaultMusic.autoplay,
    vizEnabled: true,
    vizStyle: "bars",
    vizSensitivity: 1,
    tracks: defaultMusic.tracks,
  });

  const tracks = state.tracks;
  const safeIndex = Math.min(Math.max(0, state.index), Math.max(0, tracks.length - 1));
  const current = tracks[safeIndex];

  const [playing, setPlaying] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"playlist" | "add" | "settings">("playlist");
  const [time, setTime] = useState({ current: 0, duration: 0 });

  // Add-track form state
  const [newTitle, setNewTitle] = useState("");
  const [newSrc, setNewSrc] = useState("");
  const [addError, setAddError] = useState("");

  // Dual audio for crossfade
  const audioARef = useRef<HTMLAudioElement | null>(null);
  const audioBRef = useRef<HTMLAudioElement | null>(null);
  const activeRef = useRef<"A" | "B">("A");

  // Web Audio
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
    } catch { /* fallback to HTML5 audio */ }
  };

  const runViz = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const freq = new Uint8Array(analyser.frequencyBinCount);
    const td = new Uint8Array(analyser.fftSize);
    const tick = () => {
      const sens = sensRef.current;
      const next: number[] = [];
      if (vizStyleRef.current === "wave") {
        analyser.getByteTimeDomainData(td);
        const step = Math.floor(td.length / BARS) || 1;
        for (let i = 0; i < BARS; i++) {
          const v = (td[i * step] - 128) / 128;
          next.push(Math.min(1, Math.abs(v) * sens));
        }
      } else {
        analyser.getByteFrequencyData(freq);
        const step = Math.floor(freq.length / BARS) || 1;
        for (let i = 0; i < BARS; i++) {
          let sum = 0;
          for (let j = 0; j < step; j++) sum += freq[i * step + j] || 0;
          next.push(Math.min(1, (sum / step / 255) * sens));
        }
      }
      setBars(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  useEffect(() => {
    const a = audioARef.current, b = audioBRef.current;
    if (a) a.muted = state.muted;
    if (b) b.muted = state.muted;
    const gActive = activeRef.current === "A" ? gainARef.current : gainBRef.current;
    const ctx = ctxRef.current;
    if (gActive && ctx) {
      gActive.gain.cancelScheduledValues(ctx.currentTime);
      gActive.gain.setValueAtTime(state.volume, ctx.currentTime);
    } else {
      if (a) a.volume = activeRef.current === "A" ? state.volume : 0;
      if (b) b.volume = activeRef.current === "B" ? state.volume : 0;
    }
  }, [state.volume, state.muted]);

  useEffect(() => {
    const active = activeRef.current === "A" ? audioARef.current : audioBRef.current;
    const inactive = activeRef.current === "A" ? audioBRef.current : audioARef.current;
    if (!active || !current) return;
    if (!active.src.endsWith(current.src)) {
      active.src = current.src;
      active.load();
    }
    if (inactive) inactive.volume = 0;
    if (state.autoplay) {
      active.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = async () => {
    initAudio();
    const ctx = ctxRef.current;
    if (ctx?.state === "suspended") await ctx.resume();
    const active = activeRef.current === "A" ? audioARef.current : audioBRef.current;
    if (!active) return;
    if (active.paused) {
      try { await active.play(); setPlaying(true); } catch { /* ignore */ }
    } else {
      active.pause();
      setPlaying(false);
    }
  };

  const switchTo = async (newIndex: number) => {
    const clampedNew = Math.min(Math.max(0, newIndex), tracks.length - 1);
    if (clampedNew === safeIndex && !audioARef.current?.paused && !audioBRef.current?.paused) return;
    initAudio();
    const ctx = ctxRef.current;
    if (ctx?.state === "suspended") await ctx.resume();

    const fromKey = activeRef.current;
    const toKey: "A" | "B" = fromKey === "A" ? "B" : "A";
    const fromEl = fromKey === "A" ? audioARef.current : audioBRef.current;
    const toEl = toKey === "A" ? audioARef.current : audioBRef.current;
    const fromGain = fromKey === "A" ? gainARef.current : gainBRef.current;
    const toGain = toKey === "A" ? gainARef.current : gainBRef.current;
    if (!fromEl || !toEl) return;

    toEl.src = tracks[clampedNew].src;
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
    setTimeout(() => fromEl.pause(), FADE_MS + 50);
    activeRef.current = toKey;
    setState((s) => ({ ...s, index: clampedNew }));
    setPlaying(true);
  };

  const next = () => switchTo((safeIndex + 1) % tracks.length);
  const prev = () => switchTo((safeIndex - 1 + tracks.length) % tracks.length);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = activeRef.current === "A" ? audioARef.current : audioBRef.current;
      if (el) setTime({ current: el.currentTime || 0, duration: Number.isFinite(el.duration) ? el.duration : 0 });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = activeRef.current === "A" ? audioARef.current : audioBRef.current;
    if (!el || !time.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.currentTime = Math.max(0, Math.min(time.duration, ((e.clientX - rect.left) / rect.width) * time.duration));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.code === "Space") { e.preventDefault(); toggle(); }
      else if (e.code === "ArrowRight" && (e.shiftKey || tracks.length > 1)) { e.preventDefault(); next(); }
      else if (e.code === "ArrowLeft" && (e.shiftKey || tracks.length > 1)) { e.preventDefault(); prev(); }
      else if (e.key.toLowerCase() === "m") setState((s) => ({ ...s, muted: !s.muted }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex, state.volume, state.muted]);

  // Track management
  const addTrack = () => {
    if (!newSrc.trim()) { setAddError("URL or path is required."); return; }
    const title = newTitle.trim() || newSrc.split("/").pop()?.replace(/\.[^.]+$/, "") || "Track";
    setState((s) => ({ ...s, tracks: [...s.tracks, { title, src: newSrc.trim() }] }));
    setNewTitle("");
    setNewSrc("");
    setAddError("");
    setActiveTab("playlist");
  };

  const removeTrack = (i: number) => {
    if (tracks.length <= 1) return;
    setState((s) => {
      const next = s.tracks.filter((_, idx) => idx !== i);
      const newIdx = i <= s.index ? Math.max(0, s.index - 1) : s.index;
      return { ...s, tracks: next, index: Math.min(newIdx, next.length - 1) };
    });
  };

  const moveTrack = (from: number, to: number) => {
    if (to < 0 || to >= tracks.length) return;
    setState((s) => {
      const arr = [...s.tracks];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      let newIdx = s.index;
      if (s.index === from) newIdx = to;
      else if (from < s.index && to >= s.index) newIdx--;
      else if (from > s.index && to <= s.index) newIdx++;
      return { ...s, tracks: arr, index: newIdx };
    });
  };

  const resetToDefaults = () => {
    setState((s) => ({ ...s, tracks: defaultMusic.tracks, index: 0 }));
  };

  if (!defaultMusic.enabled || tracks.length === 0) return null;

  const progressPct = time.duration ? (time.current / time.duration) * 100 : 0;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <audio ref={audioARef} preload="auto" onEnded={next} crossOrigin="anonymous" />
      <audio ref={audioBRef} preload="auto" onEnded={next} crossOrigin="anonymous" />

      {/* Panel */}
      {panelOpen && (
        <div className="w-72 origin-bottom-right animate-scale-in overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-2xl backdrop-blur-xl">
          {/* Tabs */}
          <div className="flex border-b border-border/40">
            {(["playlist", "add", "settings"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition ${
                  activeTab === tab
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "playlist" ? "Playlist" : tab === "add" ? "+ Add" : "Settings"}
              </button>
            ))}
          </div>

          {/* Playlist tab */}
          {activeTab === "playlist" && (
            <div>
              <ul className="max-h-60 overflow-y-auto py-1">
                {tracks.map((t, i) => (
                  <li key={`${t.src}-${i}`} className="group flex items-center gap-1 px-2">
                    <button
                      onClick={() => moveTrack(i, i - 1)}
                      disabled={i === 0}
                      className="p-1 text-muted-foreground opacity-0 transition hover:text-foreground group-hover:opacity-100 disabled:opacity-0"
                      aria-label="Move up"
                    >
                      <GripVertical className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => { switchTo(i); setPanelOpen(false); }}
                      className={`flex flex-1 items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition hover:bg-muted/60 ${
                        i === safeIndex ? "text-primary" : ""
                      }`}
                    >
                      <span className="w-4 shrink-0 text-center text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                      <span className="flex-1 truncate">{t.title}</span>
                      {i === safeIndex && playing && (
                        <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wider text-primary">NOW</span>
                      )}
                    </button>
                    <button
                      onClick={() => removeTrack(i)}
                      disabled={tracks.length <= 1}
                      className="p-1 text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100 disabled:pointer-events-none"
                      aria-label="Remove track"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border/40 px-3 py-2">
                <button
                  onClick={resetToDefaults}
                  className="text-[11px] text-muted-foreground transition hover:text-foreground"
                >
                  Reset to defaults
                </button>
              </div>
            </div>
          )}

          {/* Add track tab */}
          {activeTab === "add" && (
            <div className="p-3 space-y-3">
              <p className="text-[11px] text-muted-foreground">
                Paste a direct audio URL or a local path like <code className="rounded bg-muted px-1">/music/song.mp3</code>.
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Track title (optional)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-muted/50 px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="URL or /music/file.mp3 *"
                  value={newSrc}
                  onChange={(e) => { setNewSrc(e.target.value); setAddError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && addTrack()}
                  className={`w-full rounded-lg border bg-muted/50 px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
                    addError ? "border-destructive focus:ring-destructive" : "border-border/60 focus:ring-primary"
                  }`}
                />
                {addError && <p className="text-[11px] text-destructive">{addError}</p>}
              </div>
              <button
                onClick={addTrack}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Add to Playlist
              </button>
            </div>
          )}

          {/* Settings tab */}
          {activeTab === "settings" && (
            <div className="divide-y divide-border/40">
              <label className="flex items-center justify-between px-3 py-2.5 text-xs">
                <span className="text-muted-foreground">Autoplay on load</span>
                <input
                  type="checkbox"
                  checked={state.autoplay}
                  onChange={(e) => setState((s) => ({ ...s, autoplay: e.target.checked }))}
                  className="h-4 w-4 accent-primary"
                />
              </label>
              <div className="flex items-center justify-between px-3 py-2.5 text-xs">
                <span className="text-muted-foreground">Visualizer</span>
                <button
                  onClick={() => setState((s) => ({ ...s, vizEnabled: !s.vizEnabled }))}
                  className={`flex h-5 w-9 items-center rounded-full transition-colors ${
                    state.vizEnabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${state.vizEnabled ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 text-xs">
                <span className="text-muted-foreground">Style</span>
                <div className="flex overflow-hidden rounded-full border border-border/60">
                  {(["bars", "wave"] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setState((s) => ({ ...s, vizStyle: style }))}
                      className={`flex items-center gap-1 px-2.5 py-1 text-[10px] capitalize transition ${
                        state.vizStyle === style ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {style === "bars" ? <Activity className="h-3 w-3" /> : <AudioWaveform className="h-3 w-3" />}
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center justify-between gap-3 px-3 py-2.5 text-xs">
                <span className="text-muted-foreground">Sensitivity</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0.2}
                    max={3}
                    step={0.05}
                    value={state.vizSensitivity}
                    onChange={(e) => setState((s) => ({ ...s, vizSensitivity: Number(e.target.value) }))}
                    className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                  />
                  <span className="w-7 text-right tabular-nums text-muted-foreground">{state.vizSensitivity.toFixed(1)}</span>
                </div>
              </label>
            </div>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div className="flex w-full max-w-[400px] items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 shadow-lg backdrop-blur-md">
        <span className="w-9 text-right text-[10px] tabular-nums text-muted-foreground">{fmt(time.current)}</span>
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
        <span className="w-9 text-[10px] tabular-nums text-muted-foreground">{fmt(time.duration)}</span>
      </div>

      {/* Player bar */}
      <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-2 py-2 shadow-lg backdrop-blur-md">
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
          aria-label={playing ? "Pause" : "Play"}
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

        {/* Visualizer bars */}
        {state.vizEnabled && (
          <div className="flex h-8 items-end gap-px px-1" aria-hidden>
            {bars.map((v, i) => (
              <span
                key={i}
                className="viz-bar"
                style={{
                  height: `${Math.max(2, v * 28)}px`,
                  ...(state.vizStyle === "wave" ? { alignSelf: "center" } : {}),
                }}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => setState((s) => ({ ...s, vizEnabled: !s.vizEnabled }))}
          aria-label={state.vizEnabled ? "Hide visualizer" : "Show visualizer"}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground"
        >
          {state.vizEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>

        {/* Track name */}
        {current && (
          <div className="hidden min-w-0 max-w-[110px] px-1 text-xs md:block">
            <div className="truncate font-medium">{current.title}</div>
            <div className="truncate text-[10px] text-muted-foreground">{safeIndex + 1} / {tracks.length}</div>
          </div>
        )}

        {/* Volume */}
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
          className="h-1 w-14 cursor-pointer appearance-none rounded-full bg-muted accent-primary sm:w-18"
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
          onClick={() => setPanelOpen((o) => !o)}
          aria-label="Playlist & settings"
          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
            panelOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListMusic className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
