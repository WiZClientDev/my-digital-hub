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
};

export const site = {
  // ---- Profile ----
  name: "Your Name",
  tagline: "Creator · Streamer · Developer",
  bio: "Welcome to my corner of the internet. All my links, projects and channels in one place.",
  avatar: "", // optional image URL, leave empty to use initials

  // ---- Background music ----
  // Drop an mp3 in /public (e.g. public/music/track.mp3) and reference it here,
  // OR paste any direct audio URL.
  music: {
    enabled: true,
    src: "/music/track.mp3",
    title: "Lofi Background",
    autoplay: true, // browsers may still require a user click first
    volume: 0.4,
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
  ] satisfies LinkSection[],

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
