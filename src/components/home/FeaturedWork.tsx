"use client";
/* eslint-disable @next/next/no-img-element -- thumbnails come from Notion with unknown sizes */

import Link from "next/link";
import { useMemo, useState } from "react";
import { PixelIcon } from "@/components/PixelIcon";

export type FeaturedProject = {
  slug: string;
  title: string;
  summary: string;
  years: string;
  roles: string[];
  categories: string[];
  industry: string | null;
  thumbnails: string[];
};

const CATEGORIES = ["Branding", "Illustration", "Editorial", "Graphic Design"];
const PAGE_SIZE = 6;

// Desktop columns from the Figma frame: /YEAR, /NAME, /ROLE, INDUSTRY (the /FILTER column is 247px).
const cols = "lg:grid-cols-[124px_620px_246px_1fr]";

export function FeaturedWork({ projects, year }: { projects: FeaturedProject[]; year: number }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const filtered = useMemo(
    () =>
      selected.length === 0
        ? projects
        : projects.filter((p) => p.categories.some((c) => selected.includes(c))),
    [projects, selected],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const shown = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggle = (c: string | null) => {
    setPage(0);
    setSelected((s) => (c === null ? [] : s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  };

  return (
    <section id="work" className="scroll-mt-[70px] bg-surface px-4 pb-16 pt-6 text-accent sm:px-[23px]">
      <h2 className="flex items-start gap-1 text-5xl sm:text-[64px] sm:leading-[83px]">
        Featured Work<span className="mt-3 text-base">©{year}</span>
      </h2>

      <div className="mt-6 grid lg:grid-cols-[247px_1fr]">
        {/* /FILTER column */}
        <div>
          <p className="label lg:w-[124px] lg:border-b lg:border-accent-soft lg:pb-4">/Filter</p>
          <ul className="label mt-4 flex flex-wrap gap-x-6 gap-y-[13px] lg:mt-8 lg:flex-col">
            {[null, ...CATEGORIES].map((c) => {
              const active = c === null ? selected.length === 0 : selected.includes(c);
              return (
                <li key={c ?? "all"}>
                  <button
                    onClick={() => toggle(c)}
                    aria-pressed={active}
                    className="flex items-center gap-3 uppercase"
                  >
                    <span
                      className={`size-4 rounded-[4px] border border-accent ${active ? "bg-accent" : ""}`}
                      aria-hidden
                    />
                    {c ?? "All"}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-8 lg:mt-0">
          {/* Column headings */}
          <div className={`label hidden border-b border-accent-soft pb-4 lg:grid ${cols}`}>
            <span>/Year</span>
            <span>/Name</span>
            <span>/Role</span>
            <span>Industry</span>
          </div>
          <ol>
            {shown.map((p) => (
              <Row key={p.slug} project={p} />
            ))}
            {shown.length === 0 && <li className="label py-8">No projects in this category yet.</li>}
          </ol>
        </div>
      </div>

      {pageCount > 1 && (
        <nav aria-label="Pages" className="label mt-10 flex items-center justify-center gap-4">
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
  const roles = p.roles.map((r, i) => (
    <span key={r} className="lg:block">
      {r}
      {i < p.roles.length - 1 && "/ "}
    </span>
  ));
  const industry = p.industry && (
    <span className="inline-block rounded-[4px] border-[0.5px] border-accent px-1.5 py-1">{p.industry}</span>
  );

  return (
    <li className={`grid gap-4 border-b border-accent-soft py-8 last:border-b-0 lg:gap-0 lg:pb-8 lg:pt-4 ${cols}`}>
      {/* Small screens: one meta line above the title */}
      <p className="label flex flex-wrap items-center gap-x-4 gap-y-2 text-sm lg:hidden">
        <span>{p.years}</span>
        <span>{roles}</span>
        {industry}
      </p>

      <p className="label hidden pt-4 lg:block">{p.years}</p>

      <div className="flex min-w-0 flex-col gap-6 lg:pr-6">
        <div className="flex max-w-[598px] flex-col gap-4">
          <h3 className="text-2xl leading-[1.35] tracking-[-0.01em] sm:text-[32px]">
            <Link href={href} className="hover:underline">
              {p.title}
            </Link>
          </h3>
          <div className="space-y-[1.35em] leading-[1.35] text-foreground">
            {p.summary.split(/\n\s*\n/).map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start gap-8">
          {p.thumbnails.length > 0 && (
            <Link href={href} className="flex max-w-full gap-5 overflow-x-auto" tabIndex={-1} aria-hidden>
              {p.thumbnails.map((src) => (
                <img key={src} src={src} alt="" loading="lazy" className="h-[127px] w-auto max-w-none shrink-0 object-cover" />
              ))}
            </Link>
          )}
          <Link
            href={href}
            className="label flex items-center gap-2 bg-background py-2.5 pl-3 pr-3.5 leading-4 transition-colors hover:bg-accent hover:text-white"
          >
            Read case study
            <PixelIcon name="diamond" />
          </Link>
        </div>
      </div>

      <p className="label hidden pt-4 lg:block">{roles}</p>
      <p className="label hidden pt-3 lg:block">{industry}</p>
    </li>
  );
}
