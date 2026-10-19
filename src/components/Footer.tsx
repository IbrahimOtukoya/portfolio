/* eslint-disable @next/next/no-img-element -- static pixel-art SVGs from the Figma file */
import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative mt-0 overflow-hidden bg-footer text-white">
      {/* On desktop the footer fills one screen below the 70px navbar, and the portrait scales to fit it. */}
      <div className="relative mx-auto grid max-w-[1512px] grid-rows-[auto_1fr_auto] gap-12 px-6 pb-8 pt-12 lg:block lg:h-[calc(100svh-70px)] lg:min-h-[560px] lg:pt-8">
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

        {/* Pixel portrait with its grid, one 769×769 SVG from the Figma file, centred. */}
        <div className="relative mx-auto w-full max-w-[769px] lg:absolute lg:inset-y-8 lg:left-1/2 lg:flex lg:w-auto lg:max-w-none lg:-translate-x-1/2 lg:items-center">
          <img src="/pixel/footer-portrait.svg" alt="Pixel-art portrait of Ibrahim Otukoya" className="aspect-square w-full lg:h-full lg:max-h-[769px] lg:w-auto lg:max-w-none" />
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
