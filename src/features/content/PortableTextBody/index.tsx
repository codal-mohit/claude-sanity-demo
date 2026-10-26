import Link from 'next/link';
import { PortableText, type PortableTextBlock, type PortableTextComponents } from 'next-sanity';

import { resolveHref, type LinkTarget } from '@/sanity/links';
import { cn } from '@/utils';

import { SanityImage, type SanityImageValue } from '../SanityImage';

const calloutTone: Record<string, { label: string; className: string }> = {
  info: { label: 'Note', className: 'border-accent bg-accent/5' },
  tip: { label: 'Tip', className: 'border-primary-400 bg-primary-400/5' },
  warning: { label: 'Warning', className: 'border-headline bg-headline/5' },
};

const linkClass = 'text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent';

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-headline mt-12 mb-4 text-2xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="text-headline mt-10 mb-3 text-xl font-bold">{children}</h3>,
    h4: ({ children }) => <h4 className="text-headline mt-8 mb-2 text-lg font-semibold">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-accent text-headline my-6 border-l-2 pl-5 text-lg italic">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="my-5 leading-8">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="marker:text-accent my-5 list-disc space-y-2 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="marker:text-accent my-5 list-decimal space-y-2 pl-6 marker:font-mono">{children}</ol>,
  },
  marks: {
    code: ({ children }) => (
      <code className="border-border bg-surface text-headline rounded-md border px-1.5 py-0.5 font-mono text-[0.9em]">{children}</code>
    ),
    externalLink: ({ value, children }) => (
      <a
        href={value?.href}
        className={linkClass}
        {...(value?.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    ),
    internalLink: ({ value, children }) => {
      const href = resolveHref(value?.reference as LinkTarget | undefined);
      return href ? (
        <Link href={href} className={linkClass}>
          {children}
        </Link>
      ) : (
        <>{children}</>
      );
    },
  },
  types: {
    imageWithAlt: ({ value }: { value: SanityImageValue & { caption?: string } }) => (
      <figure className="my-10">
        <SanityImage image={value} width={1400} sizes="(min-width: 768px) 768px, 100vw" className="border-border rounded-2xl border" />
        {value.caption ? <figcaption className="mt-3 text-center font-mono text-xs">{value.caption}</figcaption> : null}
      </figure>
    ),
    callout: ({ value }: { value: { tone?: string; text?: string } }) => {
      const tone = calloutTone[value.tone ?? 'info'] ?? calloutTone.info;
      return (
        <aside role="note" className={cn('my-8 rounded-xl border-l-2 px-5 py-4', tone.className)}>
          <p className="text-headline font-mono text-xs uppercase tracking-wider">{tone.label}</p>
          <p className="mt-1 leading-7">{value.text}</p>
        </aside>
      );
    },
    codeBlock: ({ value }: { value: { code?: string; language?: string; filename?: string } }) => (
      <figure className="border-border bg-secondary-900 my-8 overflow-hidden rounded-xl border">
        <figcaption className="border-border flex items-center justify-between border-b px-4 py-2 font-mono text-xs">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
            </span>
            <span className="text-secondary-300">{value.filename ?? ''}</span>
          </span>
          <span className="text-primary-300">{value.language}</span>
        </figcaption>
        <pre className="text-secondary-100 overflow-x-auto p-4 text-sm leading-6">
          <code data-language={value.language} className="font-mono">
            {value.code}
          </code>
        </pre>
      </figure>
    ),
  },
};

export function PortableTextBody({ value }: { value: PortableTextBlock[] | unknown[] | null | undefined }) {
  if (!value?.length) return null;
  return <PortableText value={value as PortableTextBlock[]} components={components} />;
}
