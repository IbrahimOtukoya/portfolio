"use client";
/* eslint-disable @next/next/no-img-element -- Notion images have unknown sizes and come from many hosts */

import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryImage = { src: string; alt: string };

/** Image grid; clicking a tile zooms it over a blurred backdrop. */
export function Gallery({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {images.map((img, i) => (
          <button
            key={img.src + i}
            onClick={() => setOpen(i)}
            className="group mb-4 block w-full cursor-zoom-in overflow-hidden rounded-lg"
            aria-label={`Open image ${i + 1}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex animate-[fade_200ms_ease-out] items-center justify-center bg-background/60 px-4 pb-16 pt-16 backdrop-blur-xl sm:px-12"
          onClick={close}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <img
            key={open}
            src={images[open].src}
            alt={images[open].alt}
            className="max-h-full max-w-full animate-[zoom_250ms_ease-out] cursor-zoom-out rounded-lg object-contain shadow-2xl"
          />
          <div className="label absolute inset-x-0 bottom-4 flex items-center justify-center gap-6">
            <button onClick={(e) => (e.stopPropagation(), step(-1))} className="px-3 py-2" aria-label="Previous image">
              ← Prev
            </button>
            <span>
              {open + 1} / {images.length}
            </span>
            <button onClick={(e) => (e.stopPropagation(), step(1))} className="px-3 py-2" aria-label="Next image">
              Next →
            </button>
          </div>
          <button onClick={close} className="label absolute right-4 top-4 px-3 py-2" aria-label="Close">
            [ Close ]
          </button>
        </div>
      )}
    </>
  );
}
