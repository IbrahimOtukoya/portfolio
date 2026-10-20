"use client";

import { useEffect, useRef, useState } from "react";
import { PageFlip } from "page-flip";
import { PixelIcon } from "@/components/PixelIcon";

/**
 * Flip-book for editorial work. Each image is one page; the first and last are
 * shown as covers. Desktop shows spreads, narrow screens show one page at a time.
 */
export function Showcase({ pages }: { pages: string[] }) {
  const holder = useRef<HTMLDivElement>(null);
  const book = useRef<PageFlip | null>(null);
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el || pages.length === 0) return;
    let cancelled = false;

    // Page size follows the first page's proportions.
    const probe = new Image();
    probe.src = pages[0];
    const init = () => {
      if (cancelled) return;
      const ratio = probe.naturalWidth && probe.naturalHeight ? probe.naturalHeight / probe.naturalWidth : 1.414;
      const width = 600;
      // Keep the whole book within ~80% of the viewport height.
      const pageMax = Math.min(900, Math.floor((window.innerHeight * 0.8) / ratio));
      const portrait = window.innerWidth < 768;
      el.style.maxWidth = `${portrait ? pageMax : pageMax * 2}px`;

      // PageFlip moves these nodes around itself, so they are created outside React.
      const container = document.createElement("div");
      el.replaceChildren(container);
      const nodes = pages.map((src, i) => {
        const page = document.createElement("div");
        page.className = "showcase-page";
        if (i === 0 || i === pages.length - 1) page.dataset.density = "hard";
        const img = document.createElement("img");
        img.src = src;
        img.alt = `Page ${i + 1}`;
        img.draggable = false;
        page.appendChild(img);
        container.appendChild(page);
        return page;
      });

      const pf = new PageFlip(container, {
        width,
        height: Math.round(width * ratio),
        size: "stretch",
        minWidth: 240,
        maxWidth: pageMax,
        minHeight: Math.round(240 * ratio),
        maxHeight: Math.round(pageMax * ratio),
        showCover: true,
        usePortrait: true,
        maxShadowOpacity: 0.4,
        mobileScrollSupport: true,
      });
      pf.loadFromHTML(nodes);
      pf.on("flip", (e) => setCurrent(Number(e.data)));
      book.current = pf;
      setReady(true);
    };
    if (probe.complete) init();
    else {
      probe.onload = init;
      probe.onerror = init;
    }

    return () => {
      cancelled = true;
      book.current?.destroy();
      book.current = null;
    };
  }, [pages]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") book.current?.flipNext();
      if (e.key === "ArrowLeft") book.current?.flipPrev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div ref={holder} className="mx-auto w-full" />
      {!ready && <p className="label text-muted">Loading pages…</p>}
      {ready && (
        // Same style as the PREVIOUS / INDEX / NEXT pager at the foot of project pages.
        <div className="label flex items-center gap-8 text-xs leading-4 text-accent">
          <button onClick={() => book.current?.flipPrev()} className="flex items-center gap-2 py-2 hover:underline">
            <PixelIcon name="chevron" />
            Previous
          </button>
          <span>
            {current + 1} / {pages.length}
          </span>
          <button onClick={() => book.current?.flipNext()} className="flex items-center gap-2 py-2 hover:underline">
            Next
            <PixelIcon name="chevron" flip />
          </button>
        </div>
      )}
    </div>
  );
}
