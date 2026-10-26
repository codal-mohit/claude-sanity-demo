import Link from 'next/link';

import { DEFAULT_LANG, localizePath, type Lang } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { cn } from '@/utils';

import type { DocsTreeNode } from '../buildDocsTree';

function TreeLevel({
  nodes,
  currentSlug,
  depth,
  lang,
}: {
  nodes: DocsTreeNode[];
  currentSlug?: string;
  depth: number;
  lang: Lang;
}) {
  return (
    <ul className={cn('space-y-1', depth > 0 && 'border-border mt-1 ml-3 border-l pl-3')}>
      {nodes.map((node) => {
        const current = node.slug === currentSlug;
        return (
          <li key={node._id}>
            {node.slug ? (
              <Link
                href={localizePath(`/docs/${node.slug}`, lang)}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'block rounded-md px-2 py-1 text-sm transition-colors',
                  current ? 'bg-accent/10 text-headline font-semibold' : 'hover:text-accent',
                )}
              >
                {node.title}
              </Link>
            ) : (
              <span className="block px-2 py-1 text-sm">{node.title}</span>
            )}
            {node.children.length ? <TreeLevel nodes={node.children} currentSlug={currentSlug} depth={depth + 1} lang={lang} /> : null}
          </li>
        );
      })}
    </ul>
  );
}

export function DocsSidebar({
  tree,
  currentSlug,
  lang = DEFAULT_LANG,
}: {
  tree: DocsTreeNode[];
  currentSlug?: string;
  lang?: Lang;
}) {
  if (!tree.length) return null;
  return (
    <nav aria-label="Docs" className="border-border bg-surface rounded-2xl border p-4">
      <p className="text-accent mb-3 px-2 font-mono text-xs uppercase tracking-wider">{getDictionary(lang).docs}</p>
      <TreeLevel nodes={tree} currentSlug={currentSlug} depth={0} lang={lang} />
    </nav>
  );
}
