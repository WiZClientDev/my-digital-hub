import { useLocalStorage } from "@/lib/useLocalStorage";

export type BgSettings = {
  stars: number;     // 0..100
  aurora: number;    // 0..100
  blobs: number;     // 0..100
  particles: number; // 0..100
  grid: boolean;
};

export const DEFAULT_BG: BgSettings = {
  stars: 70,
  aurora: 60,
  blobs: 70,
  particles: 60,
  grid: true,
};

export function useBgSettings() {
  return useLocalStorage<BgSettings>("bg-settings", DEFAULT_BG);
}
