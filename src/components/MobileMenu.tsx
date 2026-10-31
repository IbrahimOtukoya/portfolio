"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavLink = { label: string; href: string };

/** Phone-only menu: a blue three-bar button that drops the nav links below the bar. */
export function MobileMenu({ links, enquiry }: { links: NavLink[]; enquiry: NavLink }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-6 w-[26px] flex-col justify-between py-[3px]"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-[2px] w-full bg-accent transition-transform duration-200 ${
              open && i === 0 ? "translate-y-[7px] rotate-45" : open && i === 2 ? "-translate-y-[7px] -rotate-45" : ""
            } ${open && i === 1 ? "opacity-0" : ""}`}
          />
        ))}
      </button>

      {open && (
        <ul
          id="mobile-menu"
          className="label absolute inset-x-0 top-full flex animate-[fade_150ms_ease-out] flex-col border-b border-[#e5e5e5] bg-background px-[33px] pb-6 text-base"
        >
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)} className="block py-3 hover:text-accent">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <a href={enquiry.href} data-track="Email" data-track-where="Mobile menu" className="block py-3 text-accent">
              {enquiry.label}
            </a>
          </li>
        </ul>
      )}
    </div>
  );
}
