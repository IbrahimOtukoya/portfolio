/* eslint-disable @next/next/no-img-element -- static pixel-art SVGs */
import Link from "next/link";
import { PixelIcon } from "@/components/PixelIcon";
import { site } from "@/content/site";

// Each tile is a stack of full-card SVG frames exported from Figma (label included), 310×208.
// On hover, frames 2-6 play 0.4s apart, then the tile returns to frame 1 (see .tile-frame in globals.css).
const FRAMES = 6;

export function Hero() {
  return (
    <section className="dot-grid relative px-4 pb-24 pt-12 sm:pb-[164px] sm:pt-[92px]">
      <div className="mx-auto flex w-full max-w-[978px] flex-col gap-[60px]">
        <div className="label flex w-fit flex-col gap-2 bg-background p-6 text-accent">
          <h1 className="text-2xl">{site.hero.headline}</h1>
          <p className="text-sm sm:text-base">{site.hero.role}</p>
        </div>

        <div className="grid gap-[21px] sm:grid-cols-3">
          {site.tiles.map((t) => {
            const external = t.href.startsWith("http");
            const Tag = external ? "a" : Link;
            return (
              <Tag
                key={t.label}
                href={t.href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                aria-label={t.label}
                className="tile relative block aspect-[310/208] bg-background"
              >
                {Array.from({ length: FRAMES }, (_, i) => (
                  <img
                    key={i}
                    src={`/pixel/tiles/${t.label.toLowerCase()}-${i + 1}.svg`}
                    alt=""
                    style={{ "--frame": i } as React.CSSProperties}
                    className={`absolute inset-0 size-full ${i > 0 ? "tile-frame" : ""}`}
                  />
                ))}
              </Tag>
            );
          })}
        </div>

        <div className="flex flex-col items-start gap-7 bg-background p-6">
          <p className="text-2xl text-muted">{site.hero.bio}</p>
          <p className="label flex items-center gap-1 bg-chip px-3 py-2 text-xs text-accent">
            <PixelIcon name="pin" />[{site.location}]
          </p>
        </div>
      </div>
    </section>
  );
}
