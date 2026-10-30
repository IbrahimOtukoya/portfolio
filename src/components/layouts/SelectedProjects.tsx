"use client";

import { useState } from "react";
import { PixelIcon } from "@/components/PixelIcon";
import { ImageCarousel } from "@/components/layouts/ImageCarousel";

export type SelectedProject = { id: string; label: string; description: string[]; images: string[] };

/**
 * "Selected projects" (Figma 1071:1867): the project's name and text, arrows to move between
 * projects, then its images as a carousel on a cream panel.
 */
export function SelectedProjects({ items, className = "" }: { items: SelectedProject[]; className?: string }) {
  const [i, setI] = useState(0);
  const item = items[i];
  const go = (d: number) => setI((n) => (n + d + items.length) % items.length);

  return (
    <section className={className} aria-roledescription="carousel" aria-label="Selected projects">
      <h2 className="label flex items-center gap-2 py-2 text-accent">
        <PixelIcon name="heart" />
        Selected projects
      </h2>

      <div className="mt-6 max-w-[598px] text-muted" aria-live="polite">
        <h3 className="font-mono text-2xl uppercase">{item.label}</h3>
        {item.description.map((d) => (
          <p key={d} className="mt-4 text-xl">
            {d}
          </p>
        ))}
      </div>

      {items.length > 1 && (
        <div className="mt-6 flex items-center gap-8">
          <button onClick={() => go(-1)} aria-label="Previous project" className="-m-1 p-1">
            <PixelIcon name="chevron" className="size-4" />
          </button>
          <button onClick={() => go(1)} aria-label="Next project" className="-m-1 p-1">
            <PixelIcon name="chevron" flip className="size-4" />
          </button>
        </div>
      )}

      {item.images.length > 0 && (
        <ImageCarousel
          key={item.id}
          images={item.images.map((src) => ({ src, alt: "" }))}
          label={`${item.label} images`}
          slideName="image"
          className="mt-6 gap-6"
          trackClassName="bg-[#fffbf5] py-3 sm:py-6"
          // Every slide keeps one wide frame, so square and wide images don't resize the panel.
          slideClassName="aspect-[2/1] max-h-[75vh] px-3 sm:px-6"
          imageClassName="h-full w-full"
        />
      )}
    </section>
  );
}
