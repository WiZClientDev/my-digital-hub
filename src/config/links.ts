import {
  Youtube,
  Twitch,
  Github,
  MessageCircle,
  Users,
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
        description: "Videos",
        url: "https://www.youtube.com/@Nubbihax",
        icon: Youtube,
      },
      {
        label: "Twitch",
        description: "Live streams",
        url: "https://twitch.tv/nubbihax",
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
        url: "https://discord.com/users/1344524778043871396",
        icon: MessageCircle,
      },
      {
        label: "Discord Server",
        description: "Join the community",
        url: "",
        icon: Users,
      },
    ],
  },
  {
    title: "Socials",
    items: [
      {
        label: "GitHub",
        url: "https://github.com/WiZClientDev",
        icon: Github,
      },
    ],
  },
];
