// ============================================================
//  SITE CONFIGURATION — edit this file to customize your page
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

// ---- Types ----

export type LinkItem = {
  label: string;
  description?: string;
  url: string;
  icon: LucideIcon;
  /** "favicon" = small icon (default) | "rich" = fetch OG image | "none" */
  preview?: "favicon" | "rich" | "none";
};

export type LinkSection = {
  title: string;
  items: LinkItem[];
};

export type Track = {
  title: string;
  /** Local path like "/music/song.mp3"  OR any direct audio URL */
  src: string;
};

export type Project = {
  name: string;
  description: string;
  url: string;
  tag?: string;
  /** "rich" = show OG preview image (default) | "none" = skip */
  preview?: "rich" | "none";
};

// ============================================================
//  PROFILE
// ============================================================

export const profile = {
  name: "Your Name",
  tagline: "Creator · Streamer · Developer",
  bio: "Welcome to my corner of the internet. All my links, projects and channels in one place.",
  /** Leave empty to show initials, or set to an image URL */
  avatar: "",
};

// ============================================================
//  MUSIC
//  Drop MP3s in /public/music/ and reference them below,
//  or use any direct audio URL.
//  You can also add/remove tracks live from the player UI.
// ============================================================

export const music = {
  enabled: true,
  /** Try to autoplay on load — browser may still require a user click */
  autoplay: false,
  /** Default volume: 0 to 1 */
  volume: 0.5,
  tracks: [
    { title: "Lofi Background", src: "/music/track.mp3" },
    { title: "Chill Beats",     src: "/music/track2.mp3" },
    { title: "Night Drive",     src: "/music/track3.mp3" },
  ] as Track[],
};

// ============================================================
//  LINKS
//  Add as many sections and items as you like.
//  Icons: https://lucide.dev/icons
// ============================================================

export const sections: LinkSection[] = [
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
];

// ============================================================
//  PROJECTS
// ============================================================

export const projects: Project[] = [
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
];

// ---- Re-export for components that use the old `site` import ----
export const site = { ...profile, music, sections, projects };
