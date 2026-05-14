import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { site } from "@/config/site";
import { MusicPlayer } from "@/components/MusicPlayer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${site.name} — Links & Projects` },
      { name: "description", content: site.bio },
      { property: "og:title", content: `${site.name} — Links & Projects` },
      { property: "og:description", content: site.bio },
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

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/30 blur-3xl" />
      </div>

      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* Header */}
        <header className="flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-2xl font-semibold shadow-lg">
            {site.avatar ? (
              <img src={site.avatar} alt={site.name} className="h-full w-full object-cover" />
            ) : (
              <span>{initials(site.name)}</span>
            )}
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">{site.name}</h1>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">
            {site.tagline}
          </p>
          <p className="mt-6 max-w-xl text-base text-muted-foreground">{site.bio}</p>
        </header>

        {/* Link sections */}
        <div className="mt-16 space-y-12">
          {site.sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {section.title}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card hover:shadow-lg"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{item.label}</div>
                        {item.description && (
                          <div className="truncate text-sm text-muted-foreground">
                            {item.description}
                          </div>
                        )}
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                    </a>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Projects */}
          {site.projects.length > 0 && (
            <section>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Projects
              </h2>
              <div className="grid gap-3">
                {site.projects.map((p) => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-border bg-card/60 p-5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
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
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        <footer className="mt-20 text-center text-xs text-muted-foreground">
          Edit <code className="rounded bg-muted px-1.5 py-0.5">src/config/site.ts</code> to customize this page.
        </footer>
      </main>

      <MusicPlayer />
    </div>
  );
}
