import type { Metadata } from "next";
import { Gallery } from "@/components/layouts/Gallery";
import { archive } from "@/content/site";

export const metadata: Metadata = {
  title: "Archive",
  description: archive.subhead,
};

export default function Archive() {
  return (
    <div className="pt-16">
      <h1 className="text-5xl font-semibold uppercase tracking-tight sm:text-8xl">{archive.headline}</h1>
      <p className="label mt-4 max-w-md text-muted">{archive.subhead}</p>
      <div className="mt-16">
        <Gallery images={archive.images.map((src) => ({ src, alt: "" }))} />
      </div>
    </div>
  );
}
