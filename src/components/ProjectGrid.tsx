"use client";
/* eslint-disable @next/next/no-img-element -- covers come from Notion and Framer with unknown sizes */

import Link from "next/link";
import { useMemo, useState } from "react";

export type ProjectCard = {
  slug: string;
  title: string;
  summary: string;
  role: string | null;
  industry: string | null;
  cover: string | null;
};

/** Featured work grid with /ROLE and /INDUSTRY filters. */
export function ProjectGrid({ projects }: { projects: ProjectCard[] }) {
  const [role, setRole] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);

  const roles = useMemo(() => unique(projects.map((p) => p.role)), [projects]);
  const industries = useMemo(() => unique(projects.map((p) => p.industry)), [projects]);
  const shown = projects.filter(
    (p) => (!role || p.role === role) && (!industry || p.industry === industry),
  );

  return (
    <div>
      <div className="label mb-8 flex flex-wrap gap-x-8 gap-y-3">
        <Filter name="Role" options={roles} value={role} onChange={setRole} />
        <Filter name="Industry" options={industries} value={industry} onChange={setIndustry} />
      </div>
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
        {shown.map((p) => (
          <Link key={p.slug} href={`/${p.slug}`} className="group block">
            <div className="aspect-[16/10] overflow-hidden rounded-lg bg-line">
              {p.cover && (
                <img
                  src={p.cover}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              )}
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-medium">{p.title}</h3>
                <p className="label mt-1 text-muted">
                  {[p.role, p.industry].filter(Boolean).join(" / ")}
                </p>
              </div>
              <span className="label shrink-0 pt-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                [ View ]
              </span>
            </div>
          </Link>
        ))}
      </div>
      {shown.length === 0 && <p className="label text-muted">Nothing matches those filters.</p>}
    </div>
  );
}

function unique(values: (string | null)[]) {
  return [...new Set(values.filter((v): v is string => !!v))];
}

function Filter({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  if (options.length < 2) return null;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-muted">/{name}</span>
      {[null, ...options].map((o) => (
        <button
          key={o ?? "all"}
          onClick={() => onChange(o)}
          className={value === o ? "underline underline-offset-4" : "text-muted hover:text-foreground"}
        >
          {o ?? "All"}
        </button>
      ))}
    </div>
  );
}
