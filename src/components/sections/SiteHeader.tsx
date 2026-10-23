import Link from "next/link";
import { navLinks, siteName } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <nav aria-label="Main" className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link
          href="/"
          className="font-sans text-base font-semibold text-heading focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {siteName}
        </Link>
        <ul className="flex gap-5 font-mono text-xs">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
