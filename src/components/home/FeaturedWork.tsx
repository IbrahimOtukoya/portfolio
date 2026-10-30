"use client";
/* eslint-disable @next/next/no-img-element -- thumbnails come from Notion with unknown sizes */

import Link from "next/link";
import { useMemo, useState } from "react";
import { PixelIcon } from "@/components/PixelIcon";
import { site } from "@/content/site";
import { useImageRatios } from "@/hooks/useImageRatios";

export type FeaturedProject = {
  slug: string;
  title: string;
  summary: string;
  roles: string[];
  categories: string[];
  industry: string | null;
  thumbnails: string[];
  mobileThumbnail: string | null;
  /** Gallery projects link with "View gallery" instead of "Read case study". */
  gallery: boolean;
};

const PAGE_SIZE = 6;

// Desktop columns from the final design (689px, 276px and the rest at 1512px wide), kept as
// proportions so the table also fits tablet widths.
const cols = "lg:grid-cols-[minmax(0,689fr)_minmax(0,276fr)_minmax(0,254fr)]";

export function FeaturedWork({ projects, year }: { projects: FeaturedProject[]; year: number }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  // Services double as the filter categories; they match Notion's Category values ignoring case.
  const filtered = useMemo(() => {
    if (selected.length === 0) return projects;
    return projects.filter((p) => p.categories.some((c) => selected.includes(c.toLowerCase())));
  }, [projects, selected]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const shown = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggle = (service: string | null) => {
    setPage(0);
    if (service === null) return setSelected([]);
    const key = service.toLowerCase();
    setSelected((s) => (s.includes(key) ? s.filter((x) => x !== key) : [...s, key]));
  };

  return (
    <section id="work" className="scroll-mt-[70px] bg-surface px-[30px] pb-16 pt-6 sm:px-[23px] sm:pt-16">
      <h2 className="flex items-start gap-1 text-[2rem] text-accent sm:text-display">
        Featured Work<span className="mt-3 text-base">©{year}</span>
      </h2>

      <div className="mt-8 grid lg:grid-cols-[228px_minmax(0,1fr)] lg:gap-[19px]">
        {/* /FILTER column, checkboxes as in the Figma frame */}
        <div>
          <p className="label border-b border-accent-soft pb-4 text-accent">/Filter</p>
          <ul className="label mt-4 flex flex-wrap gap-x-6 gap-y-[13px] text-accent lg:mt-8 lg:flex-col">
            {[null, ...site.services].map((s) => {
              const active = s === null ? selected.length === 0 : selected.includes(s.toLowerCase());
              return (
                <li key={s ?? "all"}>
                  <button onClick={() => toggle(s)} aria-pressed={active} className="flex items-center gap-3 uppercase">
                    <span className={`size-4 rounded-[4px] border border-accent ${active ? "bg-accent" : ""}`} aria-hidden />
                    {s ?? "All"}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-12 lg:mt-0">
          {/* Column headings; phones show just /PROJECTS */}
          <p className="label border-b border-label pb-4 text-muted lg:hidden">/Projects</p>
          <div className={`label hidden border-b border-label pb-4 text-accent lg:grid ${cols}`}>
            <span>/Projects</span>
            <span>/Role</span>
            <span>/Industry</span>
          </div>
          <ol>
            {shown.map((p) => (
              <Row key={p.slug} project={p} />
            ))}
            {shown.length === 0 && <li className="label py-8 text-accent">No projects in this category yet.</li>}
          </ol>
        </div>
      </div>

      {pageCount > 1 && (
        <nav aria-label="Pages" className="label mt-10 flex items-center justify-center gap-4 text-accent">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} aria-label="Previous page" className="disabled:opacity-40">
            <PixelIcon name="chevron" />
          </button>
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-current={i === page ? "page" : undefined}
              className={`grid size-6 place-items-center rounded-[4px] leading-4 ${i === page ? "border border-footer" : ""}`}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} disabled={page === pageCount - 1} aria-label="Next page" className="disabled:opacity-40">
            <PixelIcon name="chevron" flip />
          </button>
        </nav>
      )}
    </section>
  );
}

function Row({ project: p }: { project: FeaturedProject }) {
  const href = `/${p.slug}`;
  const thumbs = p.thumbnails.slice(0, 3);
  const { ratio, bind } = useImageRatios();
  const roles = p.roles.join(" / ");
  const industry = p.industry && (
    <span className="inline-block rounded-[4px] border border-[#c4c4c4] px-1.5 py-1 leading-none">{p.industry}</span>
  );

  return (
    <li className="flex flex-col gap-6 border-b border-label py-8 last:border-b-0 sm:py-10">
      {/* Phones show just one image, above the title: the Mobile thumbnail, else the first one */}
      {(p.mobileThumbnail ?? thumbs[0]) && (
        <Link href={href} className="sm:hidden" tabIndex={-1} aria-hidden>
          <img src={p.mobileThumbnail ?? thumbs[0]} alt="" loading="lazy" className="w-full" />
        </Link>
      )}

      {/* Title, role and industry share one line on desktop */}
      <div className={`grid items-center gap-4 lg:gap-0 ${cols}`}>
        <h3 className="text-title tracking-[-0.01em] text-muted lg:pr-6">
          <Link href={href} className="hover:text-accent">
            {p.title}
          </Link>
        </h3>
        <p className="label flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.625rem] text-[#a3a3a3] sm:text-sm lg:contents lg:text-base">
          {roles && <span className="lg:pr-6">{roles}</span>}
          {industry && <span>{industry}</span>}
        </p>
      </div>

      <div className="space-y-[1.35em] text-sm leading-[1.35] text-label sm:text-lg">
        {p.summary.split(/\n\s*\n/).map((para) => (
          <p key={para}>{para}</p>
        ))}
      </div>

      {thumbs.length > 0 && (
        // Images keep their proportions and share one height. A full row of three is
        // stretched to the column width; shorter rows use a fixed height instead.
        <Link href={href} className="hidden gap-[26px] sm:flex" tabIndex={-1} aria-hidden>
          {thumbs.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              loading="lazy"
              {...bind(i)}
              style={{ "--r": ratio(i) } as React.CSSProperties}
              className={
                thumbs.length === 3
                  ? "min-w-0 [flex:var(--r)_1_0%]"
                  : "h-[216px] w-auto max-w-full"
              }
            />
          ))}
        </Link>
      )}

      <Link
        href={href}
        className="label flex items-center gap-2.5 self-start bg-background p-2 text-xs leading-4 text-accent transition-colors hover:bg-accent hover:text-white"
      >
        {p.gallery ? "View gallery" : "Read case study"}
        <PixelIcon name="diamond" className="size-4" />
      </Link>
    </li>
  );
}
