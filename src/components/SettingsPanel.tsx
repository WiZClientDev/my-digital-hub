import { useState } from "react";
import { Settings, RotateCcw } from "lucide-react";
import { useBgSettings, DEFAULT_BG } from "@/lib/bgSettings";

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [s, setS] = useBgSettings();

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Settings"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/80 text-foreground shadow-lg backdrop-blur-md transition hover:border-primary/60 hover:text-primary"
      >
        <Settings className={`h-4 w-4 transition ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right animate-scale-in rounded-xl border border-border/60 bg-card/90 p-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Background</h3>
            <button
              onClick={() => setS(DEFAULT_BG)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>

          <div className="space-y-3">
            <Slider label="Stars"     value={s.stars}     onChange={(v) => setS({ ...s, stars: v })} />
            <Slider label="Aurora"    value={s.aurora}    onChange={(v) => setS({ ...s, aurora: v })} />
            <Slider label="Blobs"     value={s.blobs}     onChange={(v) => setS({ ...s, blobs: v })} />
            <Slider label="Particles" value={s.particles} onChange={(v) => setS({ ...s, particles: v })} />

            <label className="flex items-center justify-between pt-1 text-xs">
              <span className="text-muted-foreground">Grid overlay</span>
              <input
                type="checkbox"
                checked={s.grid}
                onChange={(e) => setS({ ...s, grid: e.target.checked })}
                className="h-4 w-4 accent-primary"
              />
            </label>
          </div>

          <p className="mt-4 text-[10px] text-muted-foreground">
            Settings are saved to your browser.
          </p>
        </div>
      )}
    </div>
  );
}

function Slider({
  label, value, onChange,
}: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums text-foreground/80">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
      />
    </div>
  );
}
