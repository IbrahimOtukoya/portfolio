// The small label card at the top of the Archive and Gallery pages, sitting on the dot grid.
// It takes the page's background colour (white on Archive, the tint on project pages).
export function GalleryIntro({
  title,
  summary,
  links = [],
  className = "bg-background",
}: {
  title: string;
  summary?: string;
  links?: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <header className={`label max-w-[505px] ${className} p-3 text-xs leading-4 sm:ml-5`}>
      <h1 className="text-accent">{title}</h1>
      {summary?.split(/\n\s*\n/).map((para) => (
        <p key={para} className="leading-5 text-muted">
          {para}
        </p>
      ))}
      <p className="flex flex-wrap gap-x-4 text-accent">
        <a href="#gallery" className="hover:underline">
          [Scroll to explore]
        </a>
        {links.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="hover:underline">
            [{l.label}]
          </a>
        ))}
      </p>
    </header>
  );
}
