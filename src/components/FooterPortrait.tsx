"use client";
/* eslint-disable @next/next/no-img-element -- static pixel-art SVG from the Figma file */

import { useEffect, useRef, useState } from "react";

// Coordinates are in the portrait SVG's 769×769 units, on its 24px pixel grid.
const CELL = 24;
// The white cells of each eye: two on the top row, four on the row below.
const eyes = [
  { cells: [[240, 313], [264, 313], [216, 337], [240, 337], [264, 337], [288, 337]], rest: [264, 337] },
  { cells: [[480, 313], [504, 313], [456, 337], [480, 337], [504, 337], [528, 337]], rest: [480, 337] },
].map((eye) => {
  const cx = eye.cells.reduce((s, [x]) => s + x, 0) / eye.cells.length + CELL / 2;
  const cy = eye.cells.reduce((s, [, y]) => s + y, 0) / eye.cells.length + CELL / 2;
  return { ...eye, cx, cy };
});
// How far (in SVG units) the aim point can move from the eye's centre.
const REACH = 40;

/**
 * Footer portrait. On devices with a mouse the pupils follow the cursor, one pixel cell at a
 * time, always staying on the white of the eye.
 */
export function FooterPortrait({ className }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [pupils, setPupils] = useState(eyes.map((e) => e.rest));

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = box.current?.getBoundingClientRect();
        if (!rect) return;
        const scale = rect.width / 769;
        setPupils(
          eyes.map((eye) => {
            const dx = (e.clientX - rect.left) / scale - eye.cx;
            const dy = (e.clientY - rect.top) / scale - eye.cy;
            const dist = Math.hypot(dx, dy);
            const reach = Math.min(REACH, dist / 6);
            const tx = dist ? eye.cx + (dx / dist) * reach : eye.cx;
            const ty = dist ? eye.cy + (dy / dist) * reach : eye.cy;
            // Snap to the white cell nearest the aim point.
            return eye.cells.reduce((best, c) =>
              Math.hypot(c[0] + CELL / 2 - tx, c[1] + CELL / 2 - ty) <
              Math.hypot(best[0] + CELL / 2 - tx, best[1] + CELL / 2 - ty)
                ? c
                : best,
            );
          }),
        );
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={box} className={`relative ${className ?? ""}`}>
      <img src="/pixel/footer-portrait.svg" alt="Pixel-art portrait of Ibrahim Otukoya" className="absolute inset-0 size-full" />
      <svg viewBox="0 0 769 769" aria-hidden className="absolute inset-0 size-full" shapeRendering="crispEdges">
        {pupils.map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={CELL} height={CELL} fill="#404040" />
        ))}
      </svg>
    </div>
  );
}
