/* eslint-disable @next/next/no-img-element -- small static pixel-art SVG */
import Link from "next/link";
import { site } from "@/content/site";

const links = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Archive", href: "/archive" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e5e5e5] bg-background">
      <nav className="label flex h-[70px] items-center justify-between gap-6 px-4 text-muted sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-xl">
          <img src="/pixel/favicon.svg" alt="" width={24} height={24} className="size-6" />
          <span className="hidden sm:inline">{site.name}</span>
        </Link>
        <div className="flex items-center gap-4 whitespace-nowrap text-sm sm:gap-10 lg:gap-[120px]">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-accent">
              {l.label}
            </Link>
          ))}
          <a href={site.enquiryHref} className="text-accent hover:underline">
            Let’s talk
          </a>
        </div>
      </nav>
    </header>
  );
}
