import Link from "next/link";
import { footerColumns, siteName, siteTagline } from "@/data/site";

const linkClasses =
  "font-sans text-sm text-body hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-8 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Link href="/" className="font-sans text-base font-semibold text-heading">
            {siteName}
          </Link>
          <p className="max-w-xs font-sans text-sm leading-6 text-body">{siteTagline}</p>
        </div>
        {footerColumns.map((column) => (
          <nav key={column.title} aria-labelledby={`footer-${column.title}`} className="flex flex-col gap-3">
            <h2 id={`footer-${column.title}`} className="font-mono text-xs uppercase tracking-wide text-heading">
              {column.title}
            </h2>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-5xl px-4 py-6 font-mono text-xs text-body sm:px-8">
          © {new Date().getFullYear()} {siteName}. Demo project, not a real store.
        </p>
      </div>
    </footer>
  );
}
