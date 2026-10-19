/* eslint-disable @next/next/no-img-element -- static pixel-art SVGs */
import Link from "next/link";
import { PixelIcon } from "@/components/PixelIcon";
import { site } from "@/content/site";

// Where each tile's illustration sits inside its 310×208 card (from Figma 765:1058, 765:1585, 773:746).
const art: Record<string, { src: string; className: string }> = {
  Work: { src: "/pixel/work.svg", className: "left-[22.58%] right-[12.26%] top-[30.77%] bottom-0" },
  Thoughts: { src: "/pixel/thoughts.svg", className: "left-1/2 bottom-[0.6px] h-[141.848px] w-[198.587px] -translate-x-1/2" },
  Experiments: { src: "/pixel/experiments.svg", className: "left-[42.55px] bottom-[0.26px] h-[141.848px] w-[226.957px]" },
};

export function Hero() {
  return (
    <section className="dot-grid relative px-4 pb-24 pt-12 sm:pb-[164px] sm:pt-[92px]">
      <div className="mx-auto flex w-full max-w-[978px] flex-col gap-[60px]">
        <div className="label flex w-fit flex-col gap-2 bg-background p-6 text-accent">
          <h1 className="text-lg sm:text-2xl">{site.hero.headline}</h1>
          <p className="text-sm sm:text-base">{site.hero.role}</p>
        </div>

        <div className="grid gap-[21px] sm:grid-cols-3">
          {site.tiles.map((t) => {
            const a = art[t.label];
            const external = t.href.startsWith("http");
            const Tag = external ? "a" : Link;
            return (
              <Tag
                key={t.label}
                href={t.href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group relative block h-[208px] overflow-clip bg-background"
              >
                <span
                  className="label absolute left-6 top-6 bg-surface p-[3.5px] text-[14.185px]"
                  style={{ color: t.color }}
                >
                  {t.label}
                </span>
                {a && (
                  <img
                    src={a.src}
                    alt=""
                    className={`absolute transition-transform duration-300 group-hover:-translate-y-1 ${a.className}`}
                  />
                )}
              </Tag>
            );
          })}
        </div>

        <div className="flex flex-col items-start gap-7 bg-background p-6">
          <p className="text-lg leading-[1.35] text-muted sm:text-2xl">{site.hero.bio}</p>
          <p className="label flex items-center gap-1 bg-chip px-3 py-2 text-xs text-accent">
            <PixelIcon name="pin" />[{site.location}]
          </p>
        </div>
      </div>
    </section>
  );
}
