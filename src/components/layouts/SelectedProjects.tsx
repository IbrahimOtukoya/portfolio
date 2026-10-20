"use client";
/* eslint-disable @next/next/no-img-element -- Notion images have unknown sizes */

import { useState } from "react";
import { PixelIcon } from "@/components/PixelIcon";

export type SelectedProject = { id: string; label: string; description: string[]; images: string[] };

/** "Selected projects" carousel: one project at a time on a cream panel, with arrows to move between them. */
export function SelectedProjects({ items, className = "" }: { items: SelectedProject[]; className?: string }) {
  const [i, setI] = useState(0);
  const item = items[i];
  const go = (d: number) => setI((n) => (n + d + items.length) % items.length);
  // Two columns, filled alternately so images keep their own proportions.
  const cols = [item.images.filter((_, k) => k % 2 === 0), item.images.filter((_, k) => k % 2 === 1)];

  return (
    <section className={className} aria-roledescription="carousel" aria-label="Selected projects">
      <div className="flex items-center justify-between">
        <h2 className="label py-2 text-accent">Selected projects</h2>
        {items.length > 1 && (
          <div className="flex items-center gap-8">
            <button onClick={() => go(-1)} aria-label="Previous project" className="p-1">
              <PixelIcon name="chevron" className="size-4" />
            </button>
            <button onClick={() => go(1)} aria-label="Next project" className="p-1">
              <PixelIcon name="chevron" flip className="size-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 bg-[#fffbf5] p-3 sm:mt-6 sm:p-6">
        <div className={`grid gap-3 sm:gap-5 ${cols[1].length ? "grid-cols-2" : ""}`}>
          {cols
            .filter((c) => c.length)
            .map((col, c) => (
              <div key={c} className="flex flex-col gap-3 sm:gap-5">
                {col.map((src) => (
                  <img key={src} src={src} alt="" loading="lazy" className="w-full" />
                ))}
              </div>
            ))}
        </div>
      </div>

      <div className="mt-6 space-y-4 text-muted" aria-live="polite">
        <p className="label">{item.label}</p>
        {item.description.map((d) => (
          <p key={d} className="max-w-[598px] text-xl">
            {d}
          </p>
        ))}
      </div>
    </section>
  );
}
