import type { Metadata } from 'next';
import Link from 'next/link';

import { ArticleCard } from '@/features/blog/ArticleCard';
import { paginate } from '@/features/blog/paginate';
import { PaginationNav } from '@/features/blog/PaginationNav';
import { localizePath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { assertLang } from '@/i18n/server';
import { sanityFetch } from '@/sanity/live';
import { CATEGORIES_QUERY, POSTS_COUNT_QUERY, POSTS_QUERY, TAGS_QUERY } from '@/sanity/queries';
import { cn } from '@/utils';

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = assertLang((await params).lang);
  return {
    title: getDictionary(lang).blog,
    alternates: { canonical: localizePath('/blog', lang) },
  };
}

const chip = (active: boolean) =>
  cn(
    'rounded-lg border px-3 py-1 font-mono text-xs transition-colors',
    active ? 'border-accent bg-accent text-background' : 'border-border hover:border-accent',
  );

export default async function BlogPage({ params, searchParams }: Props) {
  const lang = assertLang((await params).lang);
  const t = getDictionary(lang);
  const { category, tag, page: pageParam } = await searchParams;
  const filters = { lang, category: category ?? null, topic: tag ?? null };
  const { data: total } = await sanityFetch({ query: POSTS_COUNT_QUERY, params: filters });
  const { page, totalPages, start, end } = paginate(pageParam, total);
  const [{ data: posts }, { data: categories }, { data: tags }] = await Promise.all([
    sanityFetch({ query: POSTS_QUERY, params: { ...filters, start, end } }),
    sanityFetch({ query: CATEGORIES_QUERY }),
    sanityFetch({ query: TAGS_QUERY }),
  ]);
  const sortedTags = (tags ?? []).filter((t): t is string => Boolean(t)).sort();
  const hrefFor = (target: number) => {
    const query = new URLSearchParams({
      ...(category ? { category } : {}),
      ...(tag ? { tag } : {}),
      ...(target > 1 ? { page: String(target) } : {}),
    }).toString();
    return localizePath(`/blog${query ? `?${query}` : ''}`, lang);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-accent font-mono text-sm">~/blog</p>
      <h1 className="text-headline mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
        {tag ? `#${tag}` : t.allArticles}
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        {categories.length ? (
          <nav aria-label="Categories" className="flex flex-wrap gap-2">
            <Link href={localizePath('/blog', lang)} className={chip(!category && !tag)}>
              {t.all}
            </Link>
            {categories.map((item) => (
              <Link
                key={item._id}
                href={localizePath(`/blog?category=${item.slug}`, lang)}
                className={chip(category === item.slug)}
              >
                {item.title?.toLowerCase()}
              </Link>
            ))}
          </nav>
        ) : null}
        {sortedTags.length ? (
          <nav aria-label="Tags" className="flex flex-wrap gap-2">
            {sortedTags.map((item) => (
              <Link key={item} href={localizePath(`/blog?tag=${item}`, lang)} className={chip(tag === item)}>
                #{item}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>

      {posts.length ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post._id} article={post} lang={lang} />
          ))}
        </div>
      ) : (
        <p className="mt-12 font-mono">{t.noArticles}</p>
      )}
      <PaginationNav
        page={page}
        totalPages={totalPages}
        hrefFor={hrefFor}
        labels={{ previous: t.previous, next: t.next, page: t.pageOf }}
      />
    </div>
  );
}
