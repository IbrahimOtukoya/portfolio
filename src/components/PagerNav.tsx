import Link from "next/link";
import { PixelIcon } from "@/components/PixelIcon";

type ProjectLink = { slug: string; title: string };

/** PREVIOUS · INDEX · NEXT links at the foot of every project page. */
export function PagerNav({
  prev,
  next,
  className = "mt-24 sm:mt-32",
}: {
  prev: ProjectLink;
  next: ProjectLink;
  className?: string;
}) {
  return (
    <nav aria-label="More projects" className={`label flex items-center justify-center gap-8 text-xs leading-4 text-accent ${className}`}>
      <Link href={`/${prev.slug}`} title={prev.title} className="flex items-center gap-2 hover:underline">
        <PixelIcon name="chevron" />
        Previous
      </Link>
      <Link href="/#work" className="hover:underline">
        Index
      </Link>
      <Link href={`/${next.slug}`} title={next.title} className="flex items-center gap-2 hover:underline">
        Next
        <PixelIcon name="chevron" flip />
      </Link>
    </nav>
  );
}
