import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { localizePath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { assertLang } from '@/i18n/server';
import { sanityFetch } from '@/sanity/live';
import { DOCS_NAV_QUERY } from '@/sanity/queries';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary(assertLang((await params).lang)).docs };
}

// The docs index opens the first article in order.
export default async function DocsIndexPage({ params }: Props) {
  const lang = assertLang((await params).lang);
  const { data: docs } = await sanityFetch({ query: DOCS_NAV_QUERY, params: { lang }, stega: false });
  const first = docs.find((doc) => doc.slug && !doc.parentId) ?? docs.find((doc) => doc.slug);
  if (first?.slug) redirect(localizePath(`/docs/${first.slug}`, lang));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-headline text-4xl font-extrabold">{getDictionary(lang).docs}</h1>
    </div>
  );
}
