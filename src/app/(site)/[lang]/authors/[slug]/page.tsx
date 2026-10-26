import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ArticleCard } from '@/features/blog/ArticleCard';
import { SanityImage } from '@/features/content/SanityImage';
import { localizePath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { assertLang } from '@/i18n/server';
import { sanityFetch } from '@/sanity/live';
import { AUTHOR_QUERY } from '@/sanity/queries';

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = assertLang(raw);
  const { data: author } = await sanityFetch({ query: AUTHOR_QUERY, params: { slug, lang }, stega: false });
  return {
    title: author?.name ?? undefined,
    description: author?.bio ?? undefined,
    alternates: { canonical: localizePath(`/authors/${slug}`, lang) },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { lang: raw, slug } = await params;
  const lang = assertLang(raw);
  const t = getDictionary(lang);
  const { data: author } = await sanityFetch({ query: AUTHOR_QUERY, params: { slug, lang } });
  if (!author) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="border-border size-24 shrink-0 overflow-hidden rounded-full border">
          <SanityImage image={author.avatar} width={192} height={192} priority />
        </div>
        <div>
          <p className="text-accent font-mono text-sm">~/authors</p>
          <h1 className="text-headline mt-1 text-4xl font-extrabold tracking-tight">{author.name}</h1>
          {author.role ? <p className="mt-1 font-mono text-sm">{author.role}</p> : null}
          {author.bio ? <p className="mt-3 max-w-2xl leading-7">{author.bio}</p> : null}
          {author.socials?.length ? (
            <ul className="mt-3 flex flex-wrap gap-4 font-mono text-sm">
              {author.socials.map((url) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
                    {new URL(url).hostname.replace(/^www\./, '')}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>

      <section className="mt-16">
        <h2 className="text-headline mb-6 text-2xl font-bold">{t.articlesBy(author.name ?? '')}</h2>
        {author.articles.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {author.articles.map((article) => (
              <ArticleCard key={article._id} article={article} lang={lang} />
            ))}
          </div>
        ) : (
          <p className="font-mono">{t.noArticlesYet}</p>
        )}
      </section>
    </div>
  );
}
