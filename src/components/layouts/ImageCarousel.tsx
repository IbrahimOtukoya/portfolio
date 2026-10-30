"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sideways carousel of images, one per slide. Visitors swipe, scroll sideways,
 * use the arrow keys or pick a dot to move between them.
 * Used for the Editorial spreads and the case study "Selected projects" panel.
 */
export function ImageCarousel({
  images,
  label,
  slideName,
  trackClassName = "",
  slideClassName = "",
  imageClassName = "max-h-[80vh] w-auto max-w-full",
  className = "gap-8",
}: {
  images: { src: string; alt: string }[];
  label: string;
  slideName: string;
  trackClassName?: string;
  slideClassName?: string;
  imageClassName?: string;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const index = Math.max(0, Math.min(images.length - 1, i));
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  // The active dot follows whichever slide is centred, however the track was scrolled.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setCurrent(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(current + 1);
      if (e.key === "ArrowLeft") goTo(current - 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  if (images.length === 0) return null;

  return (
    <section aria-roledescription="carousel" aria-label={label} className={`flex flex-col items-center ${className}`}>
      <div
        ref={track}
        className={`no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain ${trackClassName}`}
      >
        {images.map((img, i) => (
          <figure
            key={img.src}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${images.length}`}
            className={`flex w-full shrink-0 snap-center snap-always items-center justify-center ${slideClassName}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt || `${slideName[0].toUpperCase()}${slideName.slice(1)} ${i + 1}`}
              draggable={false}
              loading={i < 2 ? "eager" : "lazy"}
              className={`select-none object-contain ${imageClassName}`}
            />
          </figure>
        ))}
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-2 text-accent">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => goTo(i)}
              aria-label={`Go to ${slideName} ${i + 1}`}
              aria-current={i === current}
              className={`flex size-7 items-center justify-center rounded-full border transition-colors ${
                i === current ? "border-current" : "border-transparent hover:border-current/30"
              }`}
            >
              <span className="size-1 rounded-full bg-current" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
