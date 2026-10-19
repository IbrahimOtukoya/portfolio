/* eslint-disable @next/next/no-img-element -- static images hosted on Framer's CDN for now */
import type { Metadata } from "next";
import { about } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: about.headline,
};

export default function About() {
  return (
    <div className="pt-16">
      <h1 className="max-w-5xl text-4xl font-semibold uppercase leading-[1] tracking-tight sm:text-7xl">
        {about.headline}
      </h1>

      <div className="mt-16 grid gap-12 md:grid-cols-[minmax(0,420px)_1fr]">
        <img src={about.portrait} alt="Ibrahim Otukoya" className="w-full rounded-lg" />
        <div className="space-y-6 text-lg leading-relaxed">
          {about.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>

      <section className="mt-24">
        <h2 className="label mb-6">/Past experience</h2>
        <ul className="divide-y divide-line border-y border-line">
          {about.experience.map((e) => (
            <li key={e.role + e.years} className="flex flex-wrap items-baseline justify-between gap-2 py-4">
              <span className="text-lg">
                {e.role}
                {e.company && <>, <strong className="font-semibold">{e.company}</strong></>}
              </span>
              <span className="label text-muted">{e.years}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-24 grid gap-12 md:grid-cols-2">
        <Shelf title="Now reading" images={about.reading} />
        <Shelf title="Watching" images={about.watching} />
      </section>
    </div>
  );
}

function Shelf({ title, images }: { title: string; images: string[] }) {
  return (
    <div>
      <h2 className="label mb-6">/{title}</h2>
      <div className="flex gap-4">
        {images.map((src) => (
          <img key={src} src={src} alt="" loading="lazy" className="h-56 w-auto rounded-md object-cover shadow-sm" />
        ))}
      </div>
    </div>
  );
}
