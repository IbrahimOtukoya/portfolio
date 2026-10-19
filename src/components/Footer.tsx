import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 sm:px-8 md:grid-cols-3">
        <div>
          <p className="label text-muted">Want to work with me?</p>
          <p className="mt-3 text-2xl">
            Send me an email at{" "}
            <a href={site.enquiryHref} className="underline underline-offset-4">
              {site.email}
            </a>
          </p>
        </div>
        <div>
          <p className="label text-muted">/Services</p>
          <ul className="label mt-3 space-y-1">
            {site.services.map((s) => (
              <li key={s}>/{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label text-muted">/Elsewhere</p>
          <ul className="label mt-3 space-y-1">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-muted">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="label mx-auto max-w-[1440px] px-4 pb-8 text-muted sm:px-8">
        ©{new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
}
