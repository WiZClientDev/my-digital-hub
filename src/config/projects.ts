// ============================================================
//  PROJECTS — things you've built
//  To add: copy a { name, description, url } block
//  To remove: just delete the entry
// ============================================================
export type Project = {
  name: string;
  description: string;
  url: string;
  tag?: string;
  preview?: "rich" | "none";
};

export const projects: Project[] = [
  {
    name: "Voodo",
    description: "Wide variety of cheats for any game.",
    url: "https://www.voodoclient.xyz,
    tag: "Web",
  },
  {
    name: "OffenseWare",
    description: "The Best Roblox Scripts",
    url: "https://www.offenseware.top",
    tag: "Web",
  },
  {
    name: "OpaJReborn",
    description: "The Best 1.21.11 Fabric Client",
    url: "https://example.com",
    tag: "Web",
  },
  {
    name: "Soon",
    description: "Something new is coming.",
    url: "",
    tag: "Coming Soon",
  },
];
