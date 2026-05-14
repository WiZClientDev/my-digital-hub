import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
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
      className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-card/70 hover:shadow-[0_0_30px_-5px_oklch(0.7_0.2_280/0.4)]"
    >
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" />
        {favicon && (
          <img
            src={favicon}
            alt=""
            className="absolute -bottom-1 -right-1 h-4 w-4 rounded-sm border border-border/60 bg-background"
            loading="lazy"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 font-medium">{item.label}</div>
        {(item.description || data?.description) && (
          <div className="truncate text-sm text-muted-foreground">
            {item.description ?? data?.description}
          </div>
        )}
      </div>
      {mode === "rich" && data?.image && (
        <img
          src={data.image}
          alt=""
          className="hidden h-12 w-20 shrink-0 rounded-md object-cover opacity-80 sm:block"
          loading="lazy"
        />
      )}
      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
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
      className="group relative overflow-hidden rounded-xl border border-border/60 bg-card/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_0_40px_-8px_oklch(0.7_0.2_280/0.5)]"
    >
      {data?.image && (
        <div className="aspect-[16/8] w-full overflow-hidden border-b border-border/40">
          <img
            src={data.image}
            alt={p.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{p.name}</h3>
              {p.tag && (
                <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {p.tag}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
          </div>
          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
        </div>
      </div>
    </a>
  );
}

function Index() {
  return (
    <div className="relative min-h-screen text-foreground">
      <AnimatedBackground />
      <CustomCursor />

      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <header className="flex flex-col items-center text-center animate-fade-in">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-card/60 text-2xl font-semibold shadow-lg backdrop-blur-md">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <span>{initials(profile.name)}</span>
            )}
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">{profile.name}</h1>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">
            {profile.tagline}
          </p>
          <p className="mt-6 max-w-xl text-base text-muted-foreground">{profile.bio}</p>
        </header>

        <div className="mt-16 space-y-12">
          {sections.map((section) => (
            <section key={section.title} className="animate-fade-in">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {section.title}
              </h2>
              <div className="flex flex-col gap-3">
                {section.items.map((item) => (
                  <LinkCard key={item.label} item={item} />
                ))}
              </div>
            </section>
          ))}

          {projects.length > 0 && (
            <section className="animate-fade-in">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Projects
              </h2>
              <div className="flex flex-col gap-4">
                {projects.map((p) => (
                  <ProjectCard key={p.name} p={p} />
                ))}
              </div>
            </section>
          )}
        </div>

        <footer className="mt-20 text-center text-xs text-muted-foreground">
          Edit <code className="rounded bg-muted px-1.5 py-0.5">src/config/site.ts</code> to customize this page.
        </footer>
      </main>

      <SettingsPanel />
      <MusicPlayer />
    </div>
  );
}
