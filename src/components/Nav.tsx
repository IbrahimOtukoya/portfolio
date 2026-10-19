import Link from "next/link";
import { Favicon } from "@/components/Favicon";
import { MobileMenu } from "@/components/MobileMenu";
import { site } from "@/content/site";

const links = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Archive", href: "/archive" },
];
const enquiry = { label: "Let’s talk", href: site.enquiryHref };

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e5e5e5] bg-background">
      <nav className="label relative flex h-[70px] items-center justify-between gap-6 px-[33px] text-muted sm:px-[35px]">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-base sm:text-xl">
          <Favicon className="size-6" />
          <span>{site.name}</span>
        </Link>
        <div className="hidden items-center gap-10 whitespace-nowrap text-xs sm:flex lg:gap-[81px]">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-accent">
              {l.label}
            </Link>
          ))}
          <a href={enquiry.href} className="text-accent hover:underline">
            {enquiry.label}
          </a>
        </div>
        <MobileMenu links={links} enquiry={enquiry} />
      </nav>
    </header>
  );
}
