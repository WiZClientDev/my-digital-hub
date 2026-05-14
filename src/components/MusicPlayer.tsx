import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { site } from "@/config/site";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [index, setIndex] = useState(0);

  const tracks = site.music.tracks;
  const current = tracks[index];

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = site.music.volume;
  }, []);

  // When the track index changes, load + (auto)play
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.load();
    if (site.music.autoplay || playing) {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  const next = () => setIndex((i) => (i + 1) % tracks.length);
  const prev = () => setIndex((i) => (i - 1 + tracks.length) % tracks.length);

  if (!site.music.enabled || tracks.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-2 py-2 shadow-lg backdrop-blur-md">
      <audio
        ref={audioRef}
        src={current.src}
        loop={tracks.length === 1}
        onEnded={tracks.length > 1 ? next : undefined}
        preload="auto"
      />
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
      <div className="hidden min-w-0 max-w-[140px] px-2 text-xs sm:block">
        <div className="truncate font-medium">{current.title}</div>
        <div className="truncate text-[10px] text-muted-foreground">
          {index + 1} / {tracks.length}
        </div>
      </div>
      <button
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
