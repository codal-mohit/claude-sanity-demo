import Link from 'next/link';
import type { ReactNode } from 'react';

import { linkHref, type ResolvedLink } from '@/sanity/links';

type SanityLinkProps = {
  link: (ResolvedLink & { label?: string | null; openInNewTab?: boolean | null }) | null | undefined;
  lang?: string;
  className?: string;
  children?: ReactNode;
};

export function SanityLink({ link, lang, className, children }: SanityLinkProps) {
  const href = linkHref(link, lang);
  if (!link || !href) return null;

  const content = children ?? link.label;
  if (link.type === 'external' && !href.startsWith('/')) {
    return (
      <a
        href={href}
        className={className}
        {...(link.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
