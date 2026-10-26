import { defineLive } from 'next-sanity/live';

import { client } from './client';

// Viewer token. Without it the site still renders published content, but drafts and live preview are off.
const token = process.env.SANITY_API_READ_TOKEN || false;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});
