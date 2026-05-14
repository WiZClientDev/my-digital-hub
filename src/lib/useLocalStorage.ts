import { useEffect, useState, useCallback } from "react";

// SSR-safe localStorage hook with cross-component sync via a custom event.
const EVT = "lovable:storage";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(key: string, fallback: T) {
  // Always initialize with fallback for SSR consistency
  const [value, setValue] = useState<T>(fallback);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    setValue(read(key, fallback));
    setIsHydrated(true);
  }, [key, fallback]);

  // Sync with other tabs/components
  useEffect(() => {
    if (!isHydrated) return;

    const handleCustomEvent = (e: Event) => {
      const detail = (e as CustomEvent<{ key: string }>).detail;
      if (!detail || detail.key === key) {
        setValue(read(key, fallback));
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === key || e.key === null) {
        setValue(read(key, fallback));
      }
    };

    window.addEventListener(EVT, handleCustomEvent);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(EVT, handleCustomEvent);
      window.removeEventListener("storage", handleStorage);
    };
  }, [key, fallback, isHydrated]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const newValue =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(newValue));
          window.dispatchEvent(new CustomEvent(EVT, { detail: { key } }));
        } catch {
          // ignore quota errors
        }
        return newValue;
      });
    },
    [key]
  );

  return [value, set] as const;
}
