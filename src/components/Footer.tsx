/* eslint-disable @next/next/no-img-element -- static pixel-art SVGs from the Figma file */
import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative mt-0 overflow-hidden bg-footer text-white">
      {/* On desktop the footer fills one screen below the 70px navbar, and the portrait scales to fit it. */}
      <div className="relative mx-auto grid max-w-[1512px] grid-rows-[auto_1fr_auto] gap-16 px-[34px] pb-10 pt-[72px] lg:block lg:px-6 lg:h-[calc(100svh-70px)] lg:min-h-[560px] lg:pt-8">
        <div className="relative z-10">
          <p className="label">
            <span className="sm:hidden">Want to work with me?</span>
            <span className="hidden sm:inline">Let’s work together</span>
          </p>
          <p className="mt-6 text-lg leading-[1.35] sm:text-xl">
            Send me an email at
            <br />
            <a href={site.enquiryHref} className="hover:underline">
              {site.email}
            </a>
          </p>
        </div>

        {/* Pixel portrait with its grid, one 769×769 SVG from the Figma file, centred. */}
        <div className="relative -mx-5 max-w-[769px] sm:mx-auto sm:w-full lg:absolute lg:inset-y-8 lg:left-1/2 lg:flex lg:w-auto lg:max-w-none lg:-translate-x-1/2 lg:items-center">
          <img src="/pixel/footer-portrait.svg" alt="Pixel-art portrait of Ibrahim Otukoya" className="aspect-square w-full lg:h-full lg:max-h-[769px] lg:w-auto lg:max-w-none" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6 lg:absolute lg:inset-x-6 lg:bottom-8">
          <ul className="label flex flex-wrap justify-center gap-x-9 gap-y-4 text-base sm:flex-col sm:flex-nowrap sm:justify-start sm:text-sm">
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
          <p className="label text-center text-xs sm:text-right">Designed and built by iOtukoya</p>
        </div>
      </div>
    </footer>
  );
}
