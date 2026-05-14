// ============================================================
//  LINKS — your socials, channels, communities, websites
//  To add a link:  copy an item and change the values
//  To add a section: copy a whole { title, items } block
//  To remove: just delete the entry
//  Icons list: https://lucide.dev/icons
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
  preview?: "favicon" | "rich" | "none";
};

export type LinkSection = {
  title: string;
  items: LinkItem[];
};

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
