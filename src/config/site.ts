// ============================================================
//  SITE — re-exports everything from the individual config files
//  Edit the specific files below, not this one:
//    src/config/profile.ts   — your name, bio, avatar
//    src/config/music.ts     — background music tracks
//    src/config/links.ts     — your links and sections
//    src/config/projects.ts  — your projects
// ============================================================

export { profile } from "./profile";
export { music } from "./music";
export type { Track } from "./music";
export { sections } from "./links";
export type { LinkItem, LinkSection } from "./links";
export { projects } from "./projects";
export type { Project } from "./projects";
