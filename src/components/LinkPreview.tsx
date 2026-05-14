import { useEffect, useState } from "react";

// Returns a favicon URL via Google's public favicon service.
export function faviconFor(url: string, size = 64) {
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=${size}`;
  } catch {
    return null;
  }
}

type Microlink = {
  status: string;
  data: { title?: string; description?: string; image?: { url?: string }; logo?: { url?: string } };
};

// Fetches an OG preview (image, title, description) via the public Microlink API.
// Free tier, no key required, rate-limited but fine for personal links pages.
export function useLinkPreview(url: string | undefined, enabled = true) {
  const [data, setData] = useState<{ image?: string; title?: string; description?: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !url) return;
    let cancelled = false;
    setLoading(true);
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)
      .then((r) => r.json() as Promise<Microlink>)
      .then((j) => {
        if (cancelled || j.status !== "success") return;
        setData({
          image: j.data.image?.url || j.data.logo?.url,
          title: j.data.title,
          description: j.data.description,
        });
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [url, enabled]);

  return { data, loading };
}
