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
