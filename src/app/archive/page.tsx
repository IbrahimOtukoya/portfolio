import type { Metadata } from "next";
import { Gallery } from "@/components/layouts/Gallery";
import { GalleryIntro } from "@/components/layouts/GalleryIntro";
import { archive } from "@/content/site";

export const metadata: Metadata = {
  title: "Archive",
  description: archive.subhead,
};

export default function Archive() {
  return (
    <div className="dot-grid px-4 pb-24 pt-16 sm:px-3">
      <GalleryIntro title={archive.headline} summary={archive.subhead} />
      <div id="gallery" className="mx-auto mt-16 max-w-[1200px] scroll-mt-[86px] bg-background p-4">
        <Gallery images={archive.images.map((src) => ({ src, alt: "" }))} />
      </div>
    </div>
  );
}
