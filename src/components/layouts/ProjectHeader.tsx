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
  linkLabel = "Visit website",
  children,
}: {
  project: Project;
  cover: string | null;
  /** Text on the button that opens the project's Website link. */
  linkLabel?: string;
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
        <aside className="label flex flex-col gap-6 text-xs leading-4 text-foreground md:pt-1">
          {meta.length > 0 && (
            <dl className="grid grid-cols-3 gap-4 md:grid-cols-1 md:gap-6">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="inline-block rounded-[3px] border border-foreground px-1.5 py-1">{m.label}</dt>
                  <dd className="mt-2">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {/* Same button as READ CASE STUDY on the home page */}
          {project.website && (
            <a
              href={project.website}
              target="_blank"
              rel="noreferrer"
              data-track={linkLabel}
              data-track-label={project.title}
              className="flex w-fit items-center gap-2.5 bg-background p-2 text-accent transition-colors hover:bg-accent hover:text-white"
            >
              {linkLabel}
              <PixelIcon name="diamond" className="size-4" />
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
