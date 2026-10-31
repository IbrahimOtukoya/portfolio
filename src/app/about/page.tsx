/* eslint-disable @next/next/no-img-element -- static images, some still on Framer's CDN */
import type { Metadata } from "next";
import { about } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: about.headline,
};

export default function About() {
  return (
    <div className="mx-auto max-w-[1018px] px-6 pb-16 pt-14 sm:pb-24 sm:pt-[116px]">
      <h1 className="text-center font-mono text-xl font-light uppercase text-accent sm:text-title">
        {about.headlineLines.map((line) => (
          <span key={line} className="sm:block">
            {line}{" "}
          </span>
        ))}
      </h1>

      <Portrait />

      <div className="mt-10 text-center leading-[1.35] sm:mt-12">
        <div className="space-y-[1.35em] text-xl font-light text-accent sm:-mx-6 sm:text-title xl:-mx-20">
          {about.intro.map((lines) => (
            <p key={lines[0]}>
              {lines.map((line) => (
                <span key={line} className="sm:block">
                  {line}{" "}
                </span>
              ))}
            </p>
          ))}
        </div>
        <div className="mt-8 space-y-[1.35em] text-base text-muted sm:text-xl">
          {about.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>

      <Section title="Past experience">
        <ul>
          {about.experience.map((e) => (
            <li
              key={e.role + e.years}
              className="flex items-baseline justify-between gap-4 border-b border-[#d9d9d9] py-4 text-base leading-[1.35] text-muted sm:text-xl"
            >
              <span>
                {e.role}
                {e.company && (
                  <>
                    , <strong className="font-bold">{e.company}</strong>
                  </>
                )}
              </span>
              <span className="shrink-0 text-right font-mono text-sm font-light uppercase sm:text-xl">{e.years}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Now" id="now">
        <Shelf title="Reading" images={about.reading} />
        <Shelf title="Watching" images={about.watching} />
      </Section>
    </div>
  );
}

// Black-and-white photo inside a frame marked by four blue corner brackets.
function Portrait() {
  const corners = [
    "left-0 top-0 border-l border-t",
    "right-0 top-0 border-r border-t",
    "bottom-0 left-0 border-b border-l",
    "bottom-0 right-0 border-b border-r",
  ];
  return (
    <div className="relative mx-auto mt-10 w-full max-w-[472px] p-2 sm:mt-12">
      <img src={about.portrait} alt="Ibrahim Otukoya" className="aspect-[456/476] w-full object-cover grayscale" />
      {corners.map((c) => (
        <span key={c} aria-hidden className={`absolute size-6 border-accent ${c}`} />
      ))}
    </div>
  );
}

function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-16 scroll-mt-[90px] sm:mt-24">
      <h2 className="border-b-2 border-label pb-4 font-mono text-base font-light uppercase text-accent sm:text-xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Shelf({ title, images }: { title: string; images: string[] }) {
  return (
    <div className="border-b border-[#d9d9d9] pb-8 pt-4">
      <h3 className="text-base leading-[1.35] text-muted sm:text-xl">{title}</h3>
      <div className="mt-4 grid grid-cols-3 gap-3 sm:flex sm:gap-[21px]">
        {images.map((src) => (
          <img key={src} src={src} alt="" loading="lazy" className="w-full object-cover sm:h-[349px] sm:w-auto" />
        ))}
      </div>
    </div>
  );
}
