"use client";

import { useCallback, useState } from "react";

/**
 * Tracks each image's width/height ratio by index, so a row of images can share one height.
 * Images cached before hydration never fire onLoad, so `bind` also measures on mount.
 */
export function useImageRatios() {
  const [ratios, setRatios] = useState<Record<number, number>>({});

  const measure = useCallback((el: HTMLImageElement, i: number) => {
    const { naturalWidth: w, naturalHeight: h } = el;
    if (w && h) setRatios((rs) => (rs[i] === w / h ? rs : { ...rs, [i]: w / h }));
  }, []);

  const bind = useCallback(
    (i: number) => ({
      ref: (el: HTMLImageElement | null) => {
        if (el?.complete) measure(el, i);
      },
      onLoad: (e: React.SyntheticEvent<HTMLImageElement>) => measure(e.currentTarget, i),
    }),
    [measure],
  );

  return { ratio: (i: number) => ratios[i] ?? 1, bind };
}
