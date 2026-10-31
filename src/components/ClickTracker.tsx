"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/**
 * Sends a Vercel Analytics custom event when a link or button marked with
 * data-track="Event name" is clicked. Optional data-track-label and
 * data-track-where become the event's two properties (Pro allows two per event).
 * One listener on the page, so server components only need the data attributes.
 */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const { track: name, trackLabel, trackWhere } = el.dataset;
      if (!name) return;
      const props: Record<string, string> = {};
      if (trackLabel) props.label = trackLabel;
      if (trackWhere) props.where = trackWhere;
      track(name, props);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
