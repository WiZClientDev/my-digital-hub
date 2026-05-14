import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { profile, sections, projects, type LinkItem, type Project } from "@/config/site";
import { MusicPlayer } from "@/components/MusicPlayer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { SettingsPanel } from "@/components/SettingsPanel";
import { faviconFor, useLinkPreview } from "@/components/LinkPreview";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${profile.name} — Links & Projects` },
      { name: "description", content: profile.bio },
      { property: "og:title", content: `${profile.name} — Links & Projects` },
      { property: "og:description", content: profile.bio },
    ],
  }),
  component: Index,
});

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function LinkCard({ item }: { item: LinkItem }) {
  const Icon = item.icon;
  const mode = item.preview ?? "favicon";
  const { data } = useLinkPreview(item.url, mode === "rich");
  const favicon = mode !== "none" ? faviconFor(item.url) : null;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-3.5 overflow-hidden rounded-xl border border-border/50 bg-card/30 p-3.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card/60 hover:shadow-lg"
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
        <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
        {favicon && (
          <img
            src={favicon}
            alt=""
            className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded border border-border/60 bg-background object-contain"
            loading="lazy"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-medium leading-tight">{item.label}</p>
        {(item.description || data?.description) && (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {item.description ?? data?.description}
          </p>
        )}
      </div>

      {mode === "rich" && data?.image && (
        <img
          src={data.image}
          alt=""
          className="hidden h-10 w-16 shrink-0 rounded-md object-cover opacity-70 transition-opacity group-hover:opacity-100 sm:block"
          loading="lazy"
        />
      )}

      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
    </a>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const enabled = (p.preview ?? "rich") === "rich";
  const { data } = useLinkPreview(p.url, enabled);

  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card/60 hover:shadow-xl"
    >
      {data?.image ? (
        <div className="aspect-[16/7] w-full overflow-hidden">
          <img
            src={data.image}
            alt={p.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{p.name}</h3>
              {p.tag && (
                <span className="rounded-full border border-border/60 bg-muted/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {p.tag}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
          </div>
          <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40 transition-all group-hover:text-primary" />
        </div>
      </div>
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
        {children}
      </h2>
      <div className="h-px flex-1 bg-border/40" />
    </div>
  );
}

function Index() {
  return (
    <div className="relative min-h-screen text-foreground">
      <AnimatedBackground />
      <CustomCursor />

      <main className="mx-auto max-w-2xl px-5 py-16 sm:py-24">

        {/* Profile header */}
        <header className="mb-16 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-border/50 bg-card/60 shadow-xl ring-4 ring-background backdrop-blur-md">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-foreground/80">
                  {initials(profile.name)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-background bg-emerald-500 shadow-sm" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{profile.name}</h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
            {profile.tagline}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground/90">
            {profile.bio}
          </p>
        </header>

        {/* Link sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <SectionLabel>{section.title}</SectionLabel>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {section.items.map((item) => (
                  <LinkCard key={item.label} item={item} />
                ))}
              </div>
            </section>
          ))}

          {projects.length > 0 && (
            <section>
              <SectionLabel>Projects</SectionLabel>
              <div className="grid gap-3 sm:grid-cols-2">
                {projects.map((p) => (
                  <ProjectCard key={p.name} p={p} />
                ))}
              </div>
            </section>
          )}
        </div>

        <footer className="mt-20 flex flex-col items-center gap-2 text-center text-xs text-muted-foreground/50">
          <p>
            Edit{" "}
            <code className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[11px]">
              src/config/site.ts
            </code>{" "}
            to customize
          </p>
        </footer>
      </main>

      <SettingsPanel />
      <MusicPlayer />
    </div>
  );
}
