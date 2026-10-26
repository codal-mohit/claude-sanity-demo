// Seeds sample tech blog content into a Sanity dataset.
// Usage: npm run seed                          create or update all seed-* documents
//        npm run seed -- --clean               delete all seed-* documents
//        npm run seed -- --reset-singletons    also overwrite siteSettings and navigation
// Production is refused unless --allow-production is passed.
import { deflateSync } from 'node:zlib';

import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;
const args = new Set(process.argv.slice(2));

if (!projectId || !dataset || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET or SANITY_API_WRITE_TOKEN.');
  process.exit(1);
}
if (dataset === 'production' && !args.has('--allow-production')) {
  console.error('Refusing to touch the production dataset. Use staging, or pass --allow-production on purpose.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2026-10-01', useCdn: false });

// ---------- helpers ----------

let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36)}`;
const ref = (id) => ({ _type: 'reference', _ref: id });
const keyedRef = (id) => ({ ...ref(id), _key: key() });
const slug = (current) => ({ _type: 'slug', current });
const seo = (description) => ({ _type: 'seo', description });

const span = (text, marks = []) => ({ _type: 'span', _key: key(), text, marks });
const block = (text, style = 'normal') => ({ _type: 'block', _key: key(), style, markDefs: [], children: [span(text)] });
const h2 = (text) => block(text, 'h2');
const bullets = (items) =>
  items.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [span(text)],
  }));
const withCode = (before, code, after) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [span(before), span(code, ['code']), span(after)],
});
const linked = (before, linkText, after, markDef) => {
  const mark = { ...markDef, _key: key() };
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [mark],
    children: [span(before), span(linkText, [mark._key]), span(after)],
  };
};
const callout = (tone, text) => ({ _type: 'callout', _key: key(), tone, text });
const code = (language, filename, source) => ({ _type: 'codeBlock', _key: key(), language, filename, code: source.trim() });

// Minimal PNG encoder: a vertical two-color gradient, so placeholders look intentional.
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function gradientPng(width, height, from, to) {
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [a, b] = [hex(from), hex(to)];
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    const t = y / (height - 1);
    const rgb = a.map((v, i) => Math.round(v + (b[i] - v) * t));
    const row = y * (width * 3 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) raw.set(rgb, row + 1 + x * 3);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.set([8, 2, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Brand palette gradients only.
const PALETTES = {
  indigo: ['#3416f5', '#0b111f'],
  lilac: ['#d7d5fd', '#3416f5'],
  ink: ['#0b111f', '#393c45'],
  slate: ['#393c45', '#d7d5fd'],
  violet: ['#1c0b85', '#8a79fa'],
  mist: ['#f9f9f9', '#d7d5fd'],
  midnight: ['#0b111f', '#3416f5'],
  dusk: ['#240ea8', '#393c45'],
};

async function uploadImages() {
  const assets = {};
  for (const [name, [from, to]] of Object.entries(PALETTES)) {
    const asset = await client.assets.upload('image', gradientPng(1200, 630, from, to), {
      filename: `seed-tech-${name}.png`,
    });
    assets[name] = asset._id;
  }
  return assets;
}

const image = (assets, name, alt) => ({ _type: 'imageWithAlt', asset: ref(assets[name]), alt });
const keyedImage = (assets, name, alt) => ({ ...image(assets, name, alt), _key: key() });
const internalLink = (label, id) => ({ _type: 'link', _key: key(), label, type: 'internal', reference: ref(id) });
const externalLink = (label, url) => ({ _type: 'link', _key: key(), label, type: 'external', url, openInNewTab: true });
const pathLink = (label, path) => ({ _type: 'link', _key: key(), label, type: 'external', url: path, openInNewTab: false });

// ---------- articles ----------

const ARTICLES = [
  {
    id: 'typed-groq-with-typegen',
    title: 'Typed GROQ queries with Sanity TypeGen',
    category: 'backend',
    author: 'maya',
    image: 'indigo',
    tags: ['groq', 'typescript', 'sanity'],
    featured: true,
    excerpt: 'Generate TypeScript types from your schema and queries so a renamed field fails the build instead of the page.',
    body: () => [
      block('Hand-written types for CMS data drift the moment an editor adds a field. TypeGen reads your schema and every defineQuery call, then writes exact result types.'),
      h2('Extract the schema'),
      withCode('Run ', 'sanity schema extract', ' to write the schema as JSON, then point TypeGen at it.'),
      code('json', 'sanity-typegen.json', `
{
  "path": "./src/**/*.{ts,tsx}",
  "schema": "./src/sanity/extract.json",
  "generates": "./src/sanity/types.ts",
  "overloadClientMethods": true
}`),
      h2('Write queries with defineQuery'),
      code('typescript', 'src/sanity/queries.ts', `
import { defineQuery } from 'next-sanity';

export const POST_QUERY = defineQuery(\`*[_type == "post" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  "author": author->name
}\`);`),
      block('With overloadClientMethods on, client.fetch(POST_QUERY) returns the generated type with no generics.'),
      callout('tip', 'Add the typegen command to CI and fail when the generated file changes. That catches schema drift before review.'),
      linked('Next in the series: ', 'visual editing in the App Router', '.', { _type: 'internalLink', reference: ref('seed-post-visual-editing-app-router') }),
    ],
  },
  {
    id: 'visual-editing-app-router',
    title: 'Visual editing in the Next.js App Router',
    category: 'frontend',
    author: 'leo',
    image: 'lilac',
    tags: ['nextjs', 'sanity', 'react'],
    featured: false,
    excerpt: 'Wire draft mode, stega and the Presentation tool so editors click any text on the page and land in the right field.',
    body: () => [
      block('Visual editing has three parts: a draft mode route, a client that encodes stega metadata, and overlays rendered in preview only.'),
      h2('Enable draft mode'),
      code('typescript', 'src/app/api/draft-mode/enable/route.ts', `
import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { client } from '@/sanity/client';

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});`),
      h2('Render overlays in preview'),
      withCode('In the layout, render ', '<VisualEditing />', ' only when draftMode().isEnabled is true, so production pages ship no overlay code.'),
      callout('info', 'Pass stega: false when fetching data for metadata. Invisible characters in a title tag hurt SEO.'),
      ...bullets([
        'Read token: Viewer role, server only.',
        'Presentation tool: maps documents to routes with defineLocations.',
        'SanityLive: refreshes server components when content changes.',
      ]),
    ],
  },
  {
    id: 'on-demand-revalidation',
    title: 'On-demand revalidation with Sanity webhooks',
    category: 'devops',
    author: 'maya',
    image: 'midnight',
    tags: ['nextjs', 'caching', 'webhooks'],
    featured: false,
    excerpt: 'Cache pages forever and refresh exactly the ones that changed, using a signed webhook and revalidateTag.',
    body: () => [
      block('Time-based revalidation is a guess. A webhook that fires on publish tells you exactly what changed.'),
      h2('Verify the signature'),
      code('typescript', 'src/app/api/revalidate/route.ts', `
import { revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';

export async function POST(request: Request) {
  const { isValidSignature, body } = await parseBody<{ _type: string }>(
    request,
    process.env.SANITY_REVALIDATE_SECRET,
  );
  if (!isValidSignature || !body?._type) {
    return new Response('Invalid signature', { status: 401 });
  }
  revalidateTag(body._type);
  return Response.json({ revalidated: body._type });
}`),
      callout('warning', 'Never skip the signature check. Without it anyone can flush your cache on demand.'),
      block('Tag every fetch with the document type it reads, and the webhook only needs to send _type.'),
    ],
  },
  {
    id: 'claude-md-that-helps',
    title: 'Writing a CLAUDE.md that actually helps',
    category: 'workflow',
    author: 'leo',
    image: 'violet',
    tags: ['claude-code', 'dx'],
    featured: true,
    excerpt: 'Short, specific project instructions beat long style guides. What to put in CLAUDE.md and what to leave out.',
    body: () => [
      block('CLAUDE.md is read at the start of every session. Every line costs attention, so each one should change behavior.'),
      h2('What belongs in it'),
      ...bullets([
        'The commands that prove work is done, such as npm run verify.',
        'Layout facts that are not obvious from file names.',
        'Hard rules with a reason, for example never run build while dev runs.',
      ]),
      code('markdown', 'CLAUDE.md', `
## Commands
- \`npm run verify\`: lint, typecheck and tests. Run before calling any task done.

## Rules
Detailed rules live in \`.claude/rules/\` and must be followed.`),
      callout('tip', 'Move long, topic-specific guidance into .claude/rules/ files and link them. The main file stays scannable.'),
    ],
  },
  {
    id: 'claude-code-hooks-guardrails',
    title: 'Guardrails with Claude Code hooks',
    category: 'workflow',
    author: 'maya',
    image: 'ink',
    tags: ['claude-code', 'automation'],
    featured: false,
    excerpt: 'Hooks run your own scripts before and after tool calls. Use them to block risky commands and run checks automatically.',
    body: () => [
      block('Instructions are suggestions. Hooks are code: they run every time, and a non-zero exit blocks the action.'),
      h2('Block a risky command'),
      code('json', '.claude/settings.json', `
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "node .claude/hooks/guard-bash.mjs" }]
      }
    ]
  }
}`),
      withCode('The script reads the tool input from stdin and exits with ', '2', ' to block it, printing the reason for Claude to read.'),
      callout('info', 'Pair hooks with permission deny rules. Deny rules stop the obvious cases, hooks handle the ones that need logic.'),
    ],
  },
  {
    id: 'testing-server-components',
    title: 'Testing async server components with Vitest',
    category: 'frontend',
    author: 'leo',
    image: 'dusk',
    tags: ['testing', 'react', 'nextjs'],
    featured: false,
    excerpt: 'Server components are async functions. Await them in the test, mock the data layer, and assert on what renders.',
    body: () => [
      block('An async server component returns a promise of JSX. Testing Library renders JSX, so await the component first.'),
      code('tsx', 'src/app/(site)/page.test.tsx', `
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

const sanityFetch = vi.fn();
vi.mock('@/sanity/live', () => ({ sanityFetch: (...a: unknown[]) => sanityFetch(...a) }));

import Home from '@/app/(site)/page';

it('renders the placeholder without content', async () => {
  sanityFetch.mockResolvedValue({ data: null });
  render(await Home());
  expect(screen.getByRole('link', { name: 'Open Studio' })).toBeInTheDocument();
});`),
      callout('tip', 'Mock at the module boundary you own, here @/sanity/live, not deep inside the Sanity client.'),
      block('No network, no flakiness, and the test documents exactly which data the page depends on.'),
    ],
  },
];

// ---------- content ----------

function buildDocuments(assets) {
  const categories = [
    ['frontend', 'Frontend', 'React, Next.js and the browser.'],
    ['backend', 'Backend', 'Content APIs, GROQ and data modeling.'],
    ['devops', 'DevOps', 'Caching, deploys and pipelines.'],
    ['workflow', 'Workflow', 'Working faster with Claude Code.'],
  ].map(([id, title, description]) => ({
    _type: 'category',
    _id: `seed-category-${id}`,
    title,
    slug: slug(id),
    description,
  }));

  const authors = [
    ['maya', 'Maya Chen', 'Staff engineer', 'indigo'],
    ['leo', 'Leo Okafor', 'Frontend lead', 'lilac'],
  ].map(([id, name, role, img]) => ({
    _type: 'author',
    _id: `seed-author-${id}`,
    name,
    slug: slug(id),
    role,
    bio: `${name} writes about building content-driven web apps.`,
    avatar: image(assets, img, `Avatar placeholder for ${name}`),
  }));

  const posts = ARTICLES.map((article, i) => ({
    _type: 'post',
    _id: `seed-post-${article.id}`,
    title: article.title,
    slug: slug(article.id),
    excerpt: article.excerpt,
    body: article.body(),
    coverImage: image(assets, article.image, `Cover placeholder for ${article.title}`),
    author: ref(`seed-author-${article.author}`),
    categories: [keyedRef(`seed-category-${article.category}`)],
    tags: article.tags,
    publishedAt: new Date(Date.UTC(2026, 9, 24 - i * 3, 9)).toISOString(),
    featured: article.featured,
    repoUrl: 'https://github.com/example/sanity-claude-demo',
    seo: seo(article.excerpt),
  }));

  const series = {
    _type: 'series',
    _id: 'seed-series-nextjs-sanity',
    title: 'Next.js and Sanity from scratch',
    slug: slug('nextjs-sanity-from-scratch'),
    summary: 'Three parts: typed queries, visual editing, then cache invalidation with webhooks.',
    coverImage: image(assets, 'midnight', 'Series cover placeholder'),
    articles: ['typed-groq-with-typegen', 'visual-editing-app-router', 'on-demand-revalidation'].map((id) =>
      keyedRef(`seed-post-${id}`),
    ),
    seo: seo('A three part guide to building a typed, live-previewed Next.js site on Sanity.'),
  };

  const docs = [
    ['getting-started', 'Getting started', 0, 'Clone the repo, add your Sanity project ID and run the dev server.'],
    ['project-structure', 'Project structure', 1, 'Where routes, features, schema and Claude Code config live.'],
  ].map(([id, title, order, summary]) => ({
    _type: 'docsArticle',
    _id: `seed-docs-${id}`,
    title,
    slug: slug(id),
    order,
    summary,
    version: 'v2',
    body: [block(summary), code('bash', 'terminal', 'npm install\nnpm run dev')],
    seo: seo(summary),
  }));

  const faqs = [
    ['stack', 'What is this site built with?', 'Next.js 15, Sanity, Tailwind CSS and Vitest, written with Claude Code.'],
    ['code', 'Can I use the code samples?', 'Yes. Every sample is MIT licensed and linked to an example repository.'],
    ['newsletter', 'How often is the newsletter sent?', 'Once a month, with the new articles and nothing else.'],
  ].map(([id, question, answer]) => ({
    _type: 'faq',
    _id: `seed-faq-${id}`,
    question,
    answer: [block(answer)],
  }));

  const event = {
    _type: 'event',
    _id: 'seed-event-studio-plugin-live',
    title: 'Live: building a Sanity Studio plugin',
    slug: slug('live-building-a-studio-plugin'),
    summary: 'A one hour live session building a custom Studio tool from scratch.',
    body: [block('We build a content health tool, wire it into sanity.config.ts and answer questions at the end.')],
    image: image(assets, 'violet', 'Live session placeholder'),
    startsAt: '2026-11-19T16:00:00.000Z',
    endsAt: '2026-11-19T17:00:00.000Z',
    format: 'online',
    onlineUrl: 'https://example.com/live',
    seo: seo('A one hour live session building a custom Sanity Studio tool.'),
  };

  const home = {
    _type: 'page',
    _id: 'seed-page-home',
    title: 'Home',
    slug: slug('home'),
    seo: seo('Notes on building modern web apps with Next.js, Sanity and Claude Code.'),
    blocks: [
      {
        _type: 'hero',
        _key: key(),
        eyebrow: 'New series: Next.js and Sanity from scratch',
        heading: 'Notes on building modern web apps',
        text: 'Practical articles on Next.js, Sanity, GROQ and shipping faster with Claude Code. Every post comes with working code.',
        image: image(assets, 'midnight', 'Hero placeholder image'),
        links: [pathLink('Read the blog', '/blog'), pathLink('Browse series', '/series')],
      },
      { _type: 'storyGrid', _key: key(), heading: 'Latest articles', mode: 'latest', limit: 6 },
      {
        _type: 'cta',
        _key: key(),
        heading: 'Start the three part series',
        text: 'Typed queries, visual editing and webhook revalidation, in order.',
        tone: 'accent',
        link: internalLink('Start part one', 'seed-series-nextjs-sanity'),
      },
      { _type: 'faqBlock', _key: key(), heading: 'Questions', items: faqs.map((f) => keyedRef(f._id)) },
      { _type: 'formBlock', _key: key(), heading: 'Get new articles by email', kind: 'newsletter', submitLabel: 'Subscribe' },
    ],
  };

  const about = {
    _type: 'page',
    _id: 'seed-page-about',
    title: 'About',
    slug: slug('about'),
    seo: seo('Who writes this blog and how it is built.'),
    blocks: [
      {
        _type: 'hero',
        _key: key(),
        eyebrow: 'About',
        heading: 'Two engineers writing down what works',
        text: 'We build content platforms for a living and publish the parts worth sharing.',
        image: image(assets, 'ink', 'About hero placeholder image'),
      },
      {
        _type: 'storyGrid',
        _key: key(),
        heading: 'Working with Claude Code',
        mode: 'category',
        category: ref('seed-category-workflow'),
        limit: 3,
      },
      {
        _type: 'gallery',
        _key: key(),
        heading: 'Colors of the brand',
        layout: 'grid',
        images: ['indigo', 'lilac', 'violet'].map((name) => keyedImage(assets, name, `Brand gradient: ${name}`)),
      },
    ],
  };

  const navigation = {
    _type: 'navigation',
    _id: 'navigation',
    header: [pathLink('Blog', '/blog'), pathLink('Series', '/series'), internalLink('About', 'seed-page-about')],
    footerColumns: [
      {
        _type: 'footerColumn',
        _key: key(),
        title: 'Topics',
        links: [
          pathLink('Frontend', '/blog?category=frontend'),
          pathLink('Backend', '/blog?category=backend'),
          pathLink('Workflow', '/blog?category=workflow'),
        ],
      },
      {
        _type: 'footerColumn',
        _key: key(),
        title: 'Elsewhere',
        links: [externalLink('GitHub', 'https://github.com/example/sanity-claude-demo'), internalLink('About', 'seed-page-about')],
      },
    ],
  };

  const siteSettings = {
    _type: 'siteSettings',
    _id: 'siteSettings',
    title: 'Sanity Claude Demo',
    description: 'A tech blog about building with Next.js, Sanity and Claude Code.',
  };

  const translated = buildTranslations({ posts, home });

  return [
    ...categories,
    ...authors,
    ...posts,
    series,
    ...docs,
    ...faqs,
    event,
    home,
    about,
    navigation,
    siteSettings,
    ...translated,
  ].map((doc) => (I18N_TYPES.has(doc._type) && !doc.language ? { ...doc, language: 'en' } : doc));
}

// ---------- translations ----------

const I18N_TYPES = new Set(['post', 'page', 'series', 'event', 'docsArticle']);

const TRANSLATIONS = {
  'typed-groq-with-typegen': {
    fr: {
      title: 'Des requêtes GROQ typées avec Sanity TypeGen',
      excerpt: 'Générez des types TypeScript depuis votre schéma et vos requêtes : un champ renommé casse le build, pas la page.',
      intro: 'Les types écrits à la main dérivent dès qu’un éditeur ajoute un champ. TypeGen lit le schéma et chaque appel defineQuery, puis écrit les types exacts.',
    },
    de: {
      title: 'Typisierte GROQ-Abfragen mit Sanity TypeGen',
      excerpt: 'Erzeuge TypeScript-Typen aus Schema und Abfragen, damit ein umbenanntes Feld den Build bricht und nicht die Seite.',
      intro: 'Handgeschriebene Typen für CMS-Daten veralten, sobald jemand ein Feld hinzufügt. TypeGen liest das Schema und jede defineQuery und schreibt exakte Typen.',
    },
  },
  'claude-md-that-helps': {
    fr: {
      title: 'Écrire un CLAUDE.md vraiment utile',
      excerpt: 'Des instructions courtes et précises valent mieux qu’un long guide de style. Ce qu’il faut mettre dans CLAUDE.md.',
      intro: 'CLAUDE.md est lu au début de chaque session. Chaque ligne coûte de l’attention, elle doit donc changer un comportement.',
    },
    de: {
      title: 'Eine CLAUDE.md, die wirklich hilft',
      excerpt: 'Kurze, konkrete Projektanweisungen schlagen lange Styleguides. Was in CLAUDE.md gehört und was nicht.',
      intro: 'CLAUDE.md wird zu Beginn jeder Sitzung gelesen. Jede Zeile kostet Aufmerksamkeit und sollte daher Verhalten ändern.',
    },
  },
};

const HOME_TRANSLATIONS = {
  fr: {
    heading: 'Notes sur la création d’applications web modernes',
    text: 'Des articles pratiques sur Next.js, Sanity, GROQ et Claude Code. Chaque article contient du code qui fonctionne.',
    latest: 'Derniers articles',
    blog: 'Lire le blog',
    series: 'Voir les séries',
  },
  de: {
    heading: 'Notizen zum Bau moderner Web-Apps',
    text: 'Praxisnahe Artikel zu Next.js, Sanity, GROQ und Claude Code. Jeder Beitrag enthält funktionierenden Code.',
    latest: 'Neueste Artikel',
    blog: 'Zum Blog',
    series: 'Serien ansehen',
  },
};

const metadataEntry = (lang, id) => ({
  _key: lang,
  _type: 'internationalizedArrayReferenceValue',
  value: { _type: 'reference', _ref: id, _weak: true },
});

function buildTranslations({ posts, home }) {
  const docs = [];

  for (const [articleId, byLang] of Object.entries(TRANSLATIONS)) {
    const source = posts.find((post) => post._id === `seed-post-${articleId}`);
    const entries = [metadataEntry('en', source._id)];
    for (const [lang, copy] of Object.entries(byLang)) {
      const id = `${source._id}-${lang}`;
      docs.push({
        ...source,
        _id: id,
        language: lang,
        title: copy.title,
        excerpt: copy.excerpt,
        body: [block(copy.intro), ...source.body.slice(1)],
        seo: seo(copy.excerpt),
      });
      entries.push(metadataEntry(lang, id));
    }
    docs.push({
      _type: 'translation.metadata',
      _id: `seed-translation-${articleId}`,
      translations: entries,
      schemaTypes: ['post'],
    });
  }

  const homeEntries = [metadataEntry('en', home._id)];
  for (const [lang, copy] of Object.entries(HOME_TRANSLATIONS)) {
    const id = `${home._id}-${lang}`;
    const [hero, grid, ...rest] = home.blocks;
    docs.push({
      ...home,
      _id: id,
      language: lang,
      seo: seo(copy.text),
      blocks: [
        {
          ...hero,
          heading: copy.heading,
          text: copy.text,
          links: [pathLink(copy.blog, '/blog'), pathLink(copy.series, '/series')],
        },
        { ...grid, heading: copy.latest },
        ...rest,
      ],
    });
    homeEntries.push(metadataEntry(lang, id));
  }
  docs.push({
    _type: 'translation.metadata',
    _id: 'seed-translation-home',
    translations: homeEntries,
    schemaTypes: ['page'],
  });

  return docs;
}

// ---------- run ----------

async function clean() {
  const ids = await client.fetch(`*[_id match "seed-*" || _id match "drafts.seed-*"]._id`);
  if (!ids.length) {
    console.log('Nothing to clean.');
    return;
  }
  const tx = ids.reduce((t, id) => t.delete(id), client.transaction());
  await tx.commit();
  console.log(`Deleted ${ids.length} seed documents from "${dataset}".`);
}

async function seed() {
  console.log(`Seeding dataset "${dataset}"...`);
  const assets = await uploadImages();
  const docs = buildDocuments(assets);
  // Singletons use fixed IDs shared with real content, so only overwrite them on request.
  const singletons = new Set(['siteSettings', 'navigation']);
  const resetSingletons = args.has('--reset-singletons');
  const tx = docs.reduce(
    (t, doc) => (singletons.has(doc._id) && !resetSingletons ? t.createIfNotExists(doc) : t.createOrReplace(doc)),
    client.transaction(),
  );
  await tx.commit();
  console.log(`Created or updated ${docs.length} documents and ${Object.keys(assets).length} images.`);

  // Remove seed documents from earlier versions of this script.
  const current = new Set(docs.map((doc) => doc._id));
  const stale = (await client.fetch(`*[_id match "seed-*" || _id match "drafts.seed-*"]._id`)).filter(
    (id) => !current.has(id.replace(/^drafts\./, '')),
  );
  if (stale.length) {
    await stale.reduce((t, id) => t.delete(id), client.transaction()).commit();
    console.log(`Removed ${stale.length} stale seed documents.`);
  }
}

try {
  await (args.has('--clean') ? clean() : seed());
} catch (error) {
  console.error(`Seeding failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
