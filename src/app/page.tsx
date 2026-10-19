import { ProjectGrid } from "@/components/ProjectGrid";
import { site } from "@/content/site";
import { getProjects } from "@/lib/notion";

export const revalidate = 300;

export default async function Home() {
  const projects = (await getProjects()).filter((p) => p.featured);

  return (
    <>
      <section className="flex min-h-[70vh] flex-col justify-end gap-10 py-16">
        <h1 className="text-[clamp(3rem,11vw,10rem)] font-semibold uppercase leading-[0.9] tracking-tight">
          {site.hero.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,560px)] md:items-end">
          <div className="label space-y-1">
            <p>{site.hero.role}</p>
            <p className="text-muted">[ {site.location} ]</p>
          </div>
          <p className="text-lg leading-relaxed">{site.hero.bio}</p>
        </div>
      </section>

      <section id="work" className="scroll-mt-24 border-t border-line pt-10">
        <h2 className="label mb-6">/Featured work</h2>
        <ProjectGrid
          projects={projects.map(({ slug, title, summary, role, industry, cover }) => ({
            slug,
            title,
            summary,
            role,
            industry,
            cover,
          }))}
        />
      </section>
    </>
  );
}
