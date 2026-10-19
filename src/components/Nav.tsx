import Link from "next/link";
import { site } from "@/content/site";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur">
      <nav className="label mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link href="/" className="whitespace-nowrap font-semibold">
          <span className="sm:hidden">I. Otukoya</span>
          <span className="hidden sm:inline">{site.name}</span>
        </Link>
        <div className="flex items-center gap-3 whitespace-nowrap sm:gap-8">
          <Link href="/#work" className="hover:text-muted">Work</Link>
          <Link href="/about" className="hover:text-muted">About</Link>
          <Link href="/archive" className="hover:text-muted">Archive</Link>
          <a
            href={site.enquiryHref}
            className="rounded-full bg-foreground px-2.5 py-1.5 sm:px-3 text-background transition-opacity hover:opacity-80"
          >
            Let&apos;s talk
          </a>
        </div>
      </nav>
    </header>
  );
}
