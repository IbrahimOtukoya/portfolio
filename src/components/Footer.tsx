/* eslint-disable @next/next/no-img-element -- static pixel-art SVGs from the Figma file */
import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative mt-0 overflow-hidden bg-footer text-white">
      <div className="relative mx-auto grid min-h-[923px] max-w-[1512px] grid-rows-[auto_1fr_auto] gap-12 px-6 pb-8 pt-[103px] lg:block">
        <div className="relative z-10">
          <p className="label">Let’s work together</p>
          <p className="mt-6 text-xl leading-[1.35]">
            Send me an email at
            <br />
            <a href={site.enquiryHref} className="hover:underline">
              {site.email}
            </a>
          </p>
        </div>

        {/* Pixel portrait over its grid, centred as in the design (480×744 within a 768px-wide grid). */}
        <div className="relative mx-auto aspect-[768/768] w-full max-w-[768px] lg:absolute lg:left-1/2 lg:top-[103px] lg:w-[768px] lg:-translate-x-1/2">
          <img src="/pixel/portrait-grid.svg" alt="" className="absolute inset-0 size-full opacity-25" />
          <img
            src="/pixel/portrait.svg"
            alt="Pixel-art portrait of Ibrahim Otukoya"
            className="absolute left-1/2 top-0 h-[96.875%] -translate-x-1/2"
          />
        </div>

        <div className="relative z-10 flex items-end justify-between gap-6 lg:absolute lg:inset-x-6 lg:bottom-8">
          <ul className="label flex flex-col gap-4">
            <li>
              <Link href="/#work" className="hover:underline">Work</Link>
            </li>
            {site.socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className="hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="label w-[155px] text-right text-xs">Designed by iotukoya built by jen</p>
        </div>
      </div>
    </footer>
  );
}
