"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A video that plays like a GIF (muted, looping, inline) with a "Sound Off / Sound On" pill
 * in its bottom-right corner. It pauses while scrolled out of view, so sound never plays offscreen.
 */
export function SoundVideo({ src, label }: { src: string; label?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  // 16:9 until the file reports its size, so the page doesn't jump when it loads.
  const [ratio, setRatio] = useState(16 / 9);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    // React doesn't always put `muted` on the server-rendered tag; browsers only autoplay muted video.
    v.muted = true;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    seen.observe(v);
    return () => seen.disconnect();
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    const on = !soundOn;
    v.muted = !on;
    if (on && v.paused) v.play().catch(() => {});
    setSoundOn(on);
  };

  return (
    <div className="relative">
      <video
        ref={video}
        src={src}
        aria-label={label}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedMetadata={(e) => {
          const { videoWidth: w, videoHeight: h } = e.currentTarget;
          if (w && h) setRatio(w / h);
        }}
        style={{ aspectRatio: ratio }}
        className="block w-full bg-[#ededed] object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={soundOn}
        aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
        data-track="Video sound"
        data-track-label={soundOn ? "Off" : "On"}
        className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-[#8a8a8a]/45 py-1.5 pl-3 pr-3.5 text-xs text-white sm:gap-2.5 sm:pl-4 sm:pr-5 sm:text-sm backdrop-blur-md transition-colors hover:bg-[#6b6b6b]/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:bottom-5 sm:right-5 sm:py-2.5"
      >
        <span aria-hidden className="flex h-3 items-center gap-[3px]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-[3px] rounded-full bg-current ${soundOn ? "sound-bar h-3" : "h-[3px]"}`}
              style={soundOn ? { animationDelay: `${i * 0.15}s` } : undefined}
            />
          ))}
        </span>
        {soundOn ? "Sound On" : "Sound Off"}
      </button>
    </div>
  );
}
