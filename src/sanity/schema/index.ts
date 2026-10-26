import type { SchemaTypeDefinition } from 'sanity';

import { cta } from './blocks/cta';
import { faqBlock } from './blocks/faqBlock';
import { formBlock } from './blocks/formBlock';
import { gallery } from './blocks/gallery';
import { hero } from './blocks/hero';
import { storyGrid } from './blocks/storyGrid';
import { author } from './documents/author';
import { category } from './documents/category';
import { docsArticle } from './documents/docsArticle';
import { event } from './documents/event';
import { faq } from './documents/faq';
import { navigation } from './documents/navigation';
import { page } from './documents/page';
import { post } from './documents/post';
import { redirect } from './documents/redirect';
import { series } from './documents/series';
import { callout } from './objects/callout';
import { codeBlock } from './objects/codeBlock';
import { imageWithAlt } from './objects/imageWithAlt';
import { link } from './objects/link';
import { portableText } from './objects/portableText';
import { seo } from './objects/seo';
import { siteSettings } from './siteSettings';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  page,
  post,
  series,
  author,
  category,
  event,
  faq,
  docsArticle,
  navigation,
  redirect,
  siteSettings,
  // Objects
  seo,
  imageWithAlt,
  link,
  portableText,
  callout,
  codeBlock,
  // Page builder blocks
  hero,
  storyGrid,
  cta,
  faqBlock,
  gallery,
  formBlock,
];
