import { ImageCarousel } from "@/components/layouts/ImageCarousel";

/** Carousel for editorial work. Each image is one spread mockup. */
export function Editorial({ images }: { images: { src: string; alt: string }[] }) {
  return <ImageCarousel images={images} label="Spreads" slideName="spread" />;
}
