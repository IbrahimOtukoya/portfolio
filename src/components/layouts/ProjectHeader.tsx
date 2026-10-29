/* eslint-disable @next/next/no-img-element -- Notion images have unknown sizes and come from many hosts */
import { PixelIcon } from "@/components/PixelIcon";
import type { Project } from "@/lib/notion";

/**
 * Top of Case study and Editorial pages, after the Framer site: a wide banner, then a
 * YEAR / ROLE / INDUSTRY sidebar beside the title and whatever the page passes as children.
 */
export function ProjectHeader({
  project,
  cover,
  children,
}: {
  project: Project;
  cover: string | null;
  children?: React.ReactNode;
}) {
  const meta = [
    { label: "Year", value: project.years },
    { label: "Role", value: project.roles.join(" / ") },
    { label: "Industry", value: project.industry },
  ].filter((m) => m.value);

  return (
    <>
      {cover && <img src={cover} alt="" className="w-full" />}

      <div className="mt-10 grid gap-10 sm:mt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] md:gap-12">
        <aside className="label flex flex-col gap-8 text-sm text-foreground md:pt-1">
          {meta.length > 0 && (
            <dl className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-1">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="inline-block rounded-[3px] border border-foreground px-2 py-1">{m.label}</dt>
                  <dd className="mt-3">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {project.website && (
            <a
              href={project.website}
              target="_blank"
              rel="noreferrer"
              className="flex w-fit items-center gap-3 bg-accent-soft px-4 py-3 text-background transition-colors hover:bg-accent"
            >
              Visit website
              <PixelIcon name="plus" />
            </a>
          )}
        </aside>

        <div className="min-w-0">
          <h1 className="text-title font-medium leading-[1.35] text-accent">{project.title}</h1>
          {children}
        </div>
      </div>
    </>
  );
}
