"use client";

import { useEffect } from "react";

// Same mark as app/icon.svg and the navbar Favicon, with the eyes shifted left by `dx`.
const frame = (dx: number) =>
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" shape-rendering="crispEdges">` +
      `<path d="M16 4V8H20V16H16V20H8V16H4V8H8V4H16Z" fill="#D48249"/>` +
      `<path d="M24 20H20V24H4V20H0V0H24V20ZM16 8V4H8V8H4V16H8V20H16V16H20V8H16Z" fill-rule="evenodd" fill="#404040"/>` +
      `<rect x="${8 - dx}" y="8" width="4" height="4" fill="white"/>` +
      `<rect x="${16 - dx}" y="8" width="4" height="4" fill="white"/>` +
      `</svg>`,
  );

// The navbar glance as [ms from loop start, eye offset]: hold 1s, a 350ms ease-in move 4px left
// (one pixel per step), hold 1s, then the same move back. One loop is 2.7s.
const ease = (px: number) => Math.round(350 * Math.sqrt(px / 4));
const steps: [number, number][] = [
  [0, 0],
  ...[1, 2, 3, 4].map((px): [number, number] => [1000 + ease(px), px]),
  ...[1, 2, 3, 4].map((px): [number, number] => [2350 + ease(px), 4 - px]),
];
const LOOP = 2700;

/** Plays the navbar mark's eye glance in the browser tab icon, where the browser allows it. */
export function AnimatedTabIcon() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'));
    if (links.length === 0) return;
    const original = links.map((l) => l.href);
    const urls = new Map([0, 1, 2, 3, 4].map((dx) => [dx, frame(dx)]));

    let timer = 0;
    let i = 0;
    let loopStart = performance.now();
    const tick = () => {
      const [, dx] = steps[i];
      for (const l of links) l.href = urls.get(dx)!;
      i = (i + 1) % steps.length;
      if (i === 0) loopStart += LOOP;
      timer = window.setTimeout(tick, Math.max(0, loopStart + steps[i][0] - performance.now()));
    };
    tick();

    return () => {
      clearTimeout(timer);
      links.forEach((l, n) => (l.href = original[n]));
    };
  }, []);

  return null;
}
