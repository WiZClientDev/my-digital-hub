// ============================================================
//  EDIT THIS FILE TO CUSTOMIZE YOUR SITE
//  You can change anything here directly on GitHub.
// ============================================================

import {
  Youtube,
  Twitch,
  Github,
  Globe,
  MessageCircle,
  Users,
  Twitter,
  Instagram,
  type LucideIcon,
} from "lucide-react";

export type LinkItem = {
  label: string;
  description?: string;
  url: string;
  icon: LucideIcon;
  // Preview behavior:
  //   "favicon" (default) — small favicon next to the icon
  //   "rich"               — fetches OG image + description (great for articles/sites)
  //   "none"               — no preview, just the icon
  preview?: "favicon" | "rich" | "none";
};

export type LinkSection = {
  title: string;
  items: LinkItem[];
};

export type Project = {
  name: string;
  description: string;
  url: string;
  tag?: string;
  // Set to "rich" to auto-fetch a screenshot/OG image preview. Default: "rich".
  preview?: "rich" | "none";
};

export const site = {
  // ---- Profile ----
  name: "Your Name",
  tagline: "Creator · Streamer · Developer",
  bio: "Welcome to my corner of the internet. All my links, projects and channels in one place.",
  avatar: "", // optional image URL, leave empty to use initials

  // ---- Background music ----
  // Add as many tracks as you want. Drop mp3s in /public/music/ and reference
  // them here, OR paste any direct audio URL. Users can switch between them.
  music: {
    enabled: true,
    autoplay: true, // browsers may still require a user click first
    volume: 0.4,
    tracks: [
      { title: "Lofi Background", src: "/music/track.mp3" },
      { title: "Chill Beats",     src: "/music/track2.mp3" },
      { title: "Night Drive",     src: "/music/track3.mp3" },
    ],
  },

  // ---- Sections of links ----
  sections: ([
    {
      title: "Channels",
      items: [
        {
          label: "YouTube",
          description: "Videos & vlogs",
          url: "https://youtube.com/@yourchannel",
          icon: Youtube,
        },
        {
          label: "Twitch",
          description: "Live streams",
          url: "https://twitch.tv/yourchannel",
          icon: Twitch,
        },
      ],
    },
    {
      title: "Community",
      items: [
        {
          label: "Discord",
          description: "Add me as a friend",
          url: "https://discord.com/users/yourid",
          icon: MessageCircle,
        },
        {
          label: "Discord Server",
          description: "Join the community",
          url: "https://discord.gg/yourinvite",
          icon: Users,
        },
      ],
    },
    {
      title: "Socials",
      items: [
        {
          label: "Twitter / X",
          url: "https://twitter.com/yourhandle",
          icon: Twitter,
        },
        {
          label: "Instagram",
          url: "https://instagram.com/yourhandle",
          icon: Instagram,
        },
        {
          label: "GitHub",
          url: "https://github.com/yourhandle",
          icon: Github,
        },
      ],
    },
    {
      title: "Websites",
      items: [
        {
          label: "Personal site",
          url: "https://yoursite.com",
          icon: Globe,
        },
      ],
    },
  ] as LinkSection[]),

  // ---- Projects ----
  projects: [
    {
      name: "Project One",
      description: "A short description of what this project does.",
      url: "https://example.com",
      tag: "Web",
    },
    {
      name: "Project Two",
      description: "Another cool thing you built.",
      url: "https://example.com",
      tag: "Open Source",
    },
  ] satisfies Project[],
};
