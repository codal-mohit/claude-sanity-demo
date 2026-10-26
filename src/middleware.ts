import { NextResponse, type NextRequest } from 'next/server';

import { DEFAULT_LANG, splitLocale } from '@/i18n/config';

// English is served without a prefix: /blog is rewritten to /en/blog internally,
// and /en/blog redirects to /blog so each page has one URL.
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const { lang, path, prefixed } = splitLocale(pathname);

  if (prefixed && lang === DEFAULT_LANG) {
    return NextResponse.redirect(new URL(`${path}${search}`, request.url), 308);
  }
  if (prefixed) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LANG}${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip the Studio, API routes, Next internals, metadata routes and files with an extension.
  matcher: ['/((?!studio|api|_next|sitemap.xml|robots.txt|.*\\..*).*)'],
};
