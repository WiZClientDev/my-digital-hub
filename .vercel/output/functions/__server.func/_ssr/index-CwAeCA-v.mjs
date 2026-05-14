import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { p as profile } from "./router-DajPjRUg.mjs";
import { Y as Youtube, T as Twitch, M as MessageCircle, U as Users, a as Twitter, I as Instagram, G as Github, b as Globe, E as ExternalLink, S as Settings, R as RotateCcw, c as GripVertical, d as Trash2, P as Plus, A as Activity, e as AudioWaveform, f as SkipBack, g as Pause, h as Play, i as SkipForward, j as Eye, k as EyeOff, V as VolumeX, l as Volume2, L as ListMusic } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const music = {
  /** Try to autoplay on load (browser may still require a click) */
  autoplay: false,
  /** Default volume: 0 to 1 */
  volume: 0.5,
  tracks: [
    { title: "Lofi Background", src: "/music/track.mp3" },
    { title: "Chill Beats", src: "/music/track2.mp3" },
    { title: "Night Drive", src: "/music/track3.mp3" }
  ]
};
const sections = [
  {
    title: "Channels",
    items: [
      {
        label: "YouTube",
        description: "Videos & vlogs",
        url: "https://youtube.com/@yourchannel",
        icon: Youtube
      },
      {
        label: "Twitch",
        description: "Live streams",
        url: "https://twitch.tv/yourchannel",
        icon: Twitch
      }
    ]
  },
  {
    title: "Community",
    items: [
      {
        label: "Discord",
        description: "Add me as a friend",
        url: "https://discord.com/users/yourid",
        icon: MessageCircle
      },
      {
        label: "Discord Server",
        description: "Join the community",
        url: "https://discord.gg/yourinvite",
        icon: Users
      }
    ]
  },
  {
    title: "Socials",
    items: [
      {
        label: "Twitter / X",
        url: "https://twitter.com/yourhandle",
        icon: Twitter
      },
      {
        label: "Instagram",
        url: "https://instagram.com/yourhandle",
        icon: Instagram
      },
      {
        label: "GitHub",
        url: "https://github.com/yourhandle",
        icon: Github
      }
    ]
  },
  {
    title: "Websites",
    items: [
      {
        label: "Personal site",
        url: "https://yoursite.com",
        icon: Globe
      }
    ]
  }
];
const projects = [
  {
    name: "Project One",
    description: "A short description of what this project does.",
    url: "https://example.com",
    tag: "Web"
  },
  {
    name: "Project Two",
    description: "Another cool thing you built.",
    url: "https://example.com",
    tag: "Open Source"
  }
];
const EVT = "lovable:storage";
function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function useLocalStorage(key, fallback) {
  const [value, setValue] = reactExports.useState(() => read(key, fallback));
  reactExports.useEffect(() => {
    const sync = (e) => {
      const detail = e.detail;
      if (!detail || detail.key === key) setValue(read(key, fallback));
    };
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);
  const set = (next) => {
    setValue((prev) => {
      const v = typeof next === "function" ? next(prev) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(v));
        window.dispatchEvent(new CustomEvent(EVT, { detail: { key } }));
      } catch {
      }
      return v;
    });
  };
  return [value, set];
}
const FADE_MS = 1200;
const BARS = 28;
function fmt(s) {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}
function MusicPlayer() {
  const [state, setState] = useLocalStorage("music-state-v2", {
    index: 0,
    volume: music.volume,
    muted: false,
    autoplay: music.autoplay,
    vizEnabled: true,
    vizStyle: "bars",
    vizSensitivity: 1,
    tracks: music.tracks
  });
  const tracks = state.tracks;
  const safeIndex = Math.min(Math.max(0, state.index), Math.max(0, tracks.length - 1));
  const current = tracks[safeIndex];
  const [playing, setPlaying] = reactExports.useState(false);
  const [panelOpen, setPanelOpen] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("playlist");
  const [time, setTime] = reactExports.useState({ current: 0, duration: 0 });
  const [newTitle, setNewTitle] = reactExports.useState("");
  const [newSrc, setNewSrc] = reactExports.useState("");
  const [addError, setAddError] = reactExports.useState("");
  const audioARef = reactExports.useRef(null);
  const audioBRef = reactExports.useRef(null);
  const activeRef = reactExports.useRef("A");
  const ctxRef = reactExports.useRef(null);
  const gainARef = reactExports.useRef(null);
  const gainBRef = reactExports.useRef(null);
  const analyserRef = reactExports.useRef(null);
  const initedRef = reactExports.useRef(false);
  const [bars, setBars] = reactExports.useState(() => Array(BARS).fill(0));
  const rafRef = reactExports.useRef(0);
  const vizStyleRef = reactExports.useRef(state.vizStyle);
  const sensRef = reactExports.useRef(state.vizSensitivity);
  reactExports.useEffect(() => {
    vizStyleRef.current = state.vizStyle;
  }, [state.vizStyle]);
  reactExports.useEffect(() => {
    sensRef.current = state.vizSensitivity;
  }, [state.vizSensitivity]);
  const initAudio = () => {
    if (initedRef.current) return;
    const a = audioARef.current, b = audioBRef.current;
    if (!a || !b) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
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
    }
  };
  const runViz = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const freq = new Uint8Array(analyser.frequencyBinCount);
    const td = new Uint8Array(analyser.fftSize);
    const tick = () => {
      const sens = sensRef.current;
      const next2 = [];
      if (vizStyleRef.current === "wave") {
        analyser.getByteTimeDomainData(td);
        const step = Math.floor(td.length / BARS) || 1;
        for (let i = 0; i < BARS; i++) {
          const v = (td[i * step] - 128) / 128;
          next2.push(Math.min(1, Math.abs(v) * sens));
        }
      } else {
        analyser.getByteFrequencyData(freq);
        const step = Math.floor(freq.length / BARS) || 1;
        for (let i = 0; i < BARS; i++) {
          let sum = 0;
          for (let j = 0; j < step; j++) sum += freq[i * step + j] || 0;
          next2.push(Math.min(1, sum / step / 255 * sens));
        }
      }
      setBars(next2);
      rafRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };
  reactExports.useEffect(() => () => cancelAnimationFrame(rafRef.current), []);
  reactExports.useEffect(() => {
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
  reactExports.useEffect(() => {
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
  }, []);
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
      } catch {
      }
    } else {
      active.pause();
      setPlaying(false);
    }
  };
  const switchTo = async (newIndex) => {
    const clampedNew = Math.min(Math.max(0, newIndex), tracks.length - 1);
    if (clampedNew === safeIndex && !audioARef.current?.paused && !audioBRef.current?.paused) return;
    initAudio();
    const ctx = ctxRef.current;
    if (ctx?.state === "suspended") await ctx.resume();
    const fromKey = activeRef.current;
    const toKey = fromKey === "A" ? "B" : "A";
    const fromEl = fromKey === "A" ? audioARef.current : audioBRef.current;
    const toEl = toKey === "A" ? audioARef.current : audioBRef.current;
    const fromGain = fromKey === "A" ? gainARef.current : gainBRef.current;
    const toGain = toKey === "A" ? gainARef.current : gainBRef.current;
    if (!fromEl || !toEl) return;
    toEl.src = tracks[clampedNew].src;
    toEl.muted = state.muted;
    toEl.load();
    try {
      await toEl.play();
    } catch {
    }
    const now = ctx?.currentTime ?? 0;
    const fadeSec = FADE_MS / 1e3;
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
      const animate = (t) => {
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
  reactExports.useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = activeRef.current === "A" ? audioARef.current : audioBRef.current;
      if (el) setTime({ current: el.currentTime || 0, duration: Number.isFinite(el.duration) ? el.duration : 0 });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const seek = (e) => {
    const el = activeRef.current === "A" ? audioARef.current : audioBRef.current;
    if (!el || !time.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.currentTime = Math.max(0, Math.min(time.duration, (e.clientX - rect.left) / rect.width * time.duration));
  };
  reactExports.useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      } else if (e.code === "ArrowRight" && (e.shiftKey || tracks.length > 1)) {
        e.preventDefault();
        next();
      } else if (e.code === "ArrowLeft" && (e.shiftKey || tracks.length > 1)) {
        e.preventDefault();
        prev();
      } else if (e.key.toLowerCase() === "m") setState((s) => ({ ...s, muted: !s.muted }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [safeIndex, state.volume, state.muted]);
  const addTrack = () => {
    if (!newSrc.trim()) {
      setAddError("URL or path is required.");
      return;
    }
    const title = newTitle.trim() || newSrc.split("/").pop()?.replace(/\.[^.]+$/, "") || "Track";
    setState((s) => ({ ...s, tracks: [...s.tracks, { title, src: newSrc.trim() }] }));
    setNewTitle("");
    setNewSrc("");
    setAddError("");
    setActiveTab("playlist");
  };
  const removeTrack = (i) => {
    if (tracks.length <= 1) return;
    setState((s) => {
      const next2 = s.tracks.filter((_, idx) => idx !== i);
      const newIdx = i <= s.index ? Math.max(0, s.index - 1) : s.index;
      return { ...s, tracks: next2, index: Math.min(newIdx, next2.length - 1) };
    });
  };
  const moveTrack = (from, to) => {
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
    setState((s) => ({ ...s, tracks: music.tracks, index: 0 }));
  };
  if (tracks.length === 0) return null;
  const progressPct = time.duration ? time.current / time.duration * 100 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { ref: audioARef, preload: "auto", onEnded: next, crossOrigin: "anonymous" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { ref: audioBRef, preload: "auto", onEnded: next, crossOrigin: "anonymous" }),
    panelOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-72 origin-bottom-right animate-scale-in overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-2xl backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex border-b border-border/40", children: ["playlist", "add", "settings"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setActiveTab(tab),
          className: `flex-1 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition ${activeTab === tab ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`,
          children: tab === "playlist" ? "Playlist" : tab === "add" ? "+ Add" : "Settings"
        },
        tab
      )) }),
      activeTab === "playlist" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "max-h-60 overflow-y-auto py-1", children: tracks.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "group flex items-center gap-1 px-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => moveTrack(i, i - 1),
              disabled: i === 0,
              className: "p-1 text-muted-foreground opacity-0 transition hover:text-foreground group-hover:opacity-100 disabled:opacity-0",
              "aria-label": "Move up",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-3 w-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                switchTo(i);
                setPanelOpen(false);
              },
              className: `flex flex-1 items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition hover:bg-muted/60 ${i === safeIndex ? "text-primary" : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 shrink-0 text-center text-xs tabular-nums text-muted-foreground", children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: t.title }),
                i === safeIndex && playing && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-[9px] font-semibold uppercase tracking-wider text-primary", children: "NOW" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => removeTrack(i),
              disabled: tracks.length <= 1,
              className: "p-1 text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100 disabled:pointer-events-none",
              "aria-label": "Remove track",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
            }
          )
        ] }, `${t.src}-${i}`)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/40 px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: resetToDefaults,
            className: "text-[11px] text-muted-foreground transition hover:text-foreground",
            children: "Reset to defaults"
          }
        ) })
      ] }),
      activeTab === "add" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
          "Paste a direct audio URL or a local path like ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-muted px-1", children: "/music/song.mp3" }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Track title (optional)",
              value: newTitle,
              onChange: (e) => setNewTitle(e.target.value),
              className: "w-full rounded-lg border border-border/60 bg-muted/50 px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "URL or /music/file.mp3 *",
              value: newSrc,
              onChange: (e) => {
                setNewSrc(e.target.value);
                setAddError("");
              },
              onKeyDown: (e) => e.key === "Enter" && addTrack(),
              className: `w-full rounded-lg border bg-muted/50 px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${addError ? "border-destructive focus:ring-destructive" : "border-border/60 focus:ring-primary"}`
            }
          ),
          addError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-destructive", children: addError })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: addTrack,
            className: "flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              " Add to Playlist"
            ]
          }
        )
      ] }),
      activeTab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between px-3 py-2.5 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Autoplay on load" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: state.autoplay,
              onChange: (e) => setState((s) => ({ ...s, autoplay: e.target.checked })),
              className: "h-4 w-4 accent-primary"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2.5 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Visualizer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setState((s) => ({ ...s, vizEnabled: !s.vizEnabled })),
              className: `flex h-5 w-9 items-center rounded-full transition-colors ${state.vizEnabled ? "bg-primary" : "bg-muted"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-4 w-4 rounded-full bg-white shadow transition-transform ${state.vizEnabled ? "translate-x-4" : "translate-x-0.5"}` })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2.5 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Style" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex overflow-hidden rounded-full border border-border/60", children: ["bars", "wave"].map((style) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setState((s) => ({ ...s, vizStyle: style })),
              className: `flex items-center gap-1 px-2.5 py-1 text-[10px] capitalize transition ${state.vizStyle === style ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`,
              children: [
                style === "bars" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AudioWaveform, { className: "h-3 w-3" }),
                style
              ]
            },
            style
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between gap-3 px-3 py-2.5 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Sensitivity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                min: 0.2,
                max: 3,
                step: 0.05,
                value: state.vizSensitivity,
                onChange: (e) => setState((s) => ({ ...s, vizSensitivity: Number(e.target.value) })),
                className: "h-1 w-24 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-7 text-right tabular-nums text-muted-foreground", children: state.vizSensitivity.toFixed(1) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full max-w-[400px] items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 shadow-lg backdrop-blur-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-9 text-right text-[10px] tabular-nums text-muted-foreground", children: fmt(time.current) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: seek,
          role: "slider",
          "aria-label": "Seek",
          "aria-valuemin": 0,
          "aria-valuemax": Math.round(time.duration),
          "aria-valuenow": Math.round(time.current),
          className: "group relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-muted",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-[width] duration-100",
                style: { width: `${progressPct}%` }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full bg-primary opacity-0 shadow transition group-hover:opacity-100",
                style: { left: `${progressPct}%` }
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-9 text-[10px] tabular-nums text-muted-foreground", children: fmt(time.duration) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-2 py-2 shadow-lg backdrop-blur-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: prev,
          "aria-label": "Previous track",
          disabled: tracks.length < 2,
          className: "flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground disabled:opacity-30",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipBack, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: toggle,
          "aria-label": playing ? "Pause" : "Play",
          className: "flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90",
          children: playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: next,
          "aria-label": "Next track",
          disabled: tracks.length < 2,
          className: "flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground disabled:opacity-30",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipForward, { className: "h-4 w-4" })
        }
      ),
      state.vizEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 items-end gap-px px-1", "aria-hidden": true, children: bars.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "viz-bar",
          style: {
            height: `${Math.max(2, v * 28)}px`,
            ...state.vizStyle === "wave" ? { alignSelf: "center" } : {}
          }
        },
        i
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setState((s) => ({ ...s, vizEnabled: !s.vizEnabled })),
          "aria-label": state.vizEnabled ? "Hide visualizer" : "Show visualizer",
          className: "flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground",
          children: state.vizEnabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" })
        }
      ),
      current && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden min-w-0 max-w-[110px] px-1 text-xs md:block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate font-medium", children: current.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "truncate text-[10px] text-muted-foreground", children: [
          safeIndex + 1,
          " / ",
          tracks.length
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          value: state.muted ? 0 : state.volume,
          onChange: (e) => {
            const v = Number(e.target.value);
            setState((s) => ({ ...s, volume: v, muted: v === 0 ? s.muted : false }));
          },
          className: "h-1 w-14 cursor-pointer appearance-none rounded-full bg-muted accent-primary sm:w-18",
          "aria-label": "Volume"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setState((s) => ({ ...s, muted: !s.muted })),
          "aria-label": state.muted ? "Unmute" : "Mute",
          className: "flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground",
          children: state.muted ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setPanelOpen((o) => !o),
          "aria-label": "Playlist & settings",
          className: `flex h-8 w-8 items-center justify-center rounded-full transition ${panelOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListMusic, { className: "h-4 w-4" })
        }
      )
    ] })
  ] });
}
const DEFAULT_BG = {
  stars: 70,
  aurora: 60,
  blobs: 70,
  particles: 60
};
function useBgSettings() {
  return useLocalStorage("bg-settings-v2", DEFAULT_BG);
}
const COLORS = [
  "oklch(0.72 0.2 200)",
  // cyan
  "oklch(0.72 0.22 340)",
  // pink
  "oklch(0.72 0.2 150)",
  // green
  "oklch(0.75 0.22 50)",
  // amber
  "oklch(0.7 0.22 20)",
  // red
  "oklch(0.72 0.2 240)",
  // blue
  "oklch(0.78 0.2 100)",
  // lime
  "oklch(0.72 0.22 285)"
  // violet
];
function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
function AnimatedBackground() {
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => setMounted(true), []);
  const [settingsRaw] = useBgSettings();
  const s = mounted ? settingsRaw : DEFAULT_BG;
  const [hoverBlur, setHoverBlur] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const isInteractive = (el) => !!el?.closest?.(
      'a,button,[role="button"],input,textarea,select,label'
    );
    const onOver = (e) => {
      if (isInteractive(e.target)) setHoverBlur(true);
    };
    const onOut = (e) => {
      if (isInteractive(e.target) && !isInteractive(e.relatedTarget)) setHoverBlur(false);
    };
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, []);
  const starCount = Math.round(s.stars / 100 * 150);
  const particleCount = Math.round(s.particles / 100 * 70);
  const blobCount = Math.max(0, Math.round(s.blobs / 100 * 8));
  const auroraOpacity = s.aurora / 100;
  const snowCount = Math.round(40 + s.particles / 100 * 30);
  const stars = reactExports.useMemo(() => Array.from({ length: starCount }, (_, i) => {
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
      key: i
    };
  }), [starCount]);
  const blobs = reactExports.useMemo(() => Array.from({ length: blobCount }, (_, i) => {
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
      key: i
    };
  }), [blobCount]);
  const particles = reactExports.useMemo(() => Array.from({ length: particleCount }, (_, i) => {
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
      key: i
    };
  }), [particleCount]);
  const snow = reactExports.useMemo(() => Array.from({ length: snowCount }, (_, i) => {
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
      key: i
    };
  }), [snowCount]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-[filter] duration-500 ${hoverBlur ? "bg-blurred" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background" }),
        stars.map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "star",
            style: {
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              ["--star-brightness"]: star.brightness
            }
          },
          `s-${star.key}`
        )),
        auroraOpacity > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aurora aurora-1", style: { opacity: 0.5 * auroraOpacity } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aurora aurora-2", style: { opacity: 0.35 * auroraOpacity } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aurora aurora-3", style: { opacity: 0.25 * auroraOpacity } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aurora aurora-4", style: { opacity: 0.3 * auroraOpacity } })
        ] }),
        blobs.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "blob",
            style: {
              top: `${b.top}%`,
              left: `${b.left}%`,
              width: `${b.size}vw`,
              height: `${b.size}vw`,
              background: `radial-gradient(circle, ${b.color} 0%, transparent 65%)`,
              animation: `${b.anim} ${b.dur}s ease-in-out infinite`,
              opacity: b.opacity
            }
          },
          `b-${b.key}`
        )),
        particles.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "particle",
            style: {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              background: p.hue,
              boxShadow: `0 0 ${p.size * 2}px ${Math.ceil(p.size / 2)}px ${p.hue}`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`
            }
          },
          `p-${p.key}`
        )),
        snow.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "snowflake",
            style: {
              left: `${f.left}%`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              opacity: f.opacity,
              ["--snow-drift"]: `${f.drift}px`,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`
            }
          },
          `f-${f.key}`
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65))]" })
      ]
    }
  );
}
function CustomCursor() {
  const dotRef = reactExports.useRef(null);
  const ringRef = reactExports.useRef(null);
  const [enabled, setEnabled] = reactExports.useState(false);
  const [hovering, setHovering] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;
    setEnabled(true);
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;
    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      const target = e.target;
      const isInteractive = !!target?.closest('a,button,[role="button"],input,textarea,select');
      setHovering(isInteractive);
    };
    const animate = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(animate);
    };
    document.documentElement.classList.add("custom-cursor-active");
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);
  if (!enabled) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: ringRef,
        className: `pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9 rounded-full border border-primary/70 transition-[width,height,background-color,border-color] duration-200 ${hovering ? "h-12 w-12 bg-primary/15 border-primary" : ""}`,
        style: { mixBlendMode: "difference" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: dotRef,
        className: "pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-primary"
      }
    )
  ] });
}
function SettingsPanel() {
  const [open, setOpen] = reactExports.useState(false);
  const [s, setS] = useBgSettings();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed top-4 right-4 z-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setOpen((o) => !o),
        "aria-label": "Settings",
        className: "flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/80 text-foreground shadow-lg backdrop-blur-md transition hover:border-primary/60 hover:text-primary",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: `h-4 w-4 transition ${open ? "rotate-90" : ""}` })
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 mt-2 w-72 origin-top-right animate-scale-in rounded-xl border border-border/60 bg-card/90 p-4 shadow-2xl backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Background" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setS(DEFAULT_BG),
            className: "flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3 w-3" }),
              "Reset"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: "Stars", value: s.stars, onChange: (v) => setS({ ...s, stars: v }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: "Aurora", value: s.aurora, onChange: (v) => setS({ ...s, aurora: v }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: "Blobs", value: s.blobs, onChange: (v) => setS({ ...s, blobs: v }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: "Particles", value: s.particles, onChange: (v) => setS({ ...s, particles: v }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-[10px] text-muted-foreground", children: "Settings are saved to your browser." })
    ] })
  ] });
}
function Slider({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-foreground/80", children: [
        value,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "range",
        min: 0,
        max: 100,
        value,
        onChange: (e) => onChange(Number(e.target.value)),
        className: "h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
      }
    )
  ] });
}
function faviconFor(url, size = 64) {
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=${size}`;
  } catch {
    return null;
  }
}
function useLinkPreview(url, enabled = true) {
  const [data, setData] = reactExports.useState(
    null
  );
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!enabled || !url) return;
    let cancelled = false;
    setLoading(true);
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`).then((r) => r.json()).then((j) => {
      if (cancelled || j.status !== "success") return;
      setData({
        image: j.data.image?.url || j.data.logo?.url,
        title: j.data.title,
        description: j.data.description
      });
    }).catch(() => {
    }).finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [url, enabled]);
  return { data, loading };
}
function initials(name) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}
function LinkCard({
  item
}) {
  const Icon = item.icon;
  const mode = item.preview ?? "favicon";
  const {
    data
  } = useLinkPreview(item.url, mode === "rich");
  const favicon = mode !== "none" ? faviconFor(item.url) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: item.url, target: "_blank", rel: "noopener noreferrer", className: "group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-card/70 hover:shadow-[0_0_30px_-5px_oklch(0.7_0.2_280/0.4)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }),
      favicon && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: favicon, alt: "", className: "absolute -bottom-1 -right-1 h-4 w-4 rounded-sm border border-border/60 bg-background", loading: "lazy" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 font-medium", children: item.label }),
      (item.description || data?.description) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm text-muted-foreground", children: item.description ?? data?.description })
    ] }),
    mode === "rich" && data?.image && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: data.image, alt: "", className: "hidden h-12 w-20 shrink-0 rounded-md object-cover opacity-80 sm:block", loading: "lazy" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" })
  ] });
}
function ProjectCard({
  p
}) {
  const enabled = (p.preview ?? "rich") === "rich";
  const {
    data
  } = useLinkPreview(p.url, enabled);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: p.url, target: "_blank", rel: "noopener noreferrer", className: "group relative overflow-hidden rounded-xl border border-border/60 bg-card/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_0_40px_-8px_oklch(0.7_0.2_280/0.5)]", children: [
    data?.image && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/8] w-full overflow-hidden border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: data.image, alt: p.name, className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105", loading: "lazy" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: p.name }),
          p.tag && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground", children: p.tag })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: p.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" })
    ] }) })
  ] });
}
function Index() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedBackground, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CustomCursor, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-6 py-16 sm:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-col items-center text-center animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-card/60 text-2xl font-semibold shadow-lg backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: initials(profile.name) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 text-4xl font-bold tracking-tight sm:text-5xl", children: profile.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground", children: profile.tagline }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl text-base text-muted-foreground", children: profile.bio })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-16 space-y-12", children: [
        sections.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "animate-fade-in", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: section.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: section.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(LinkCard, { item }, item.label)) })
        ] }, section.title)),
        projects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "animate-fade-in", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: "Projects" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", children: projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProjectCard, { p }, p.name)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "mt-20 text-center text-xs text-muted-foreground", children: [
        "Edit ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-muted px-1.5 py-0.5", children: "src/config/site.ts" }),
        " to customize this page."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsPanel, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MusicPlayer, {})
  ] });
}
export {
  Index as component
};
