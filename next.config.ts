import type { NextConfig } from 'next';
import { createClient } from 'next-sanity';

type SanityRedirect = { source: string; destination: string; permanent: boolean | null };

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  async redirects() {
    // Redirect documents live in Sanity. Skip quietly when Sanity env is not set (for example in CI).
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    if (!projectId || !dataset) return [];

    const client = createClient({ projectId, dataset, apiVersion: '2026-10-01', useCdn: false });
    const redirects = await client.fetch<SanityRedirect[]>(
      `*[_type == "redirect" && defined(source) && defined(destination)]{ source, destination, permanent }`,
    );
    return redirects.map((r) => ({
      source: r.source,
      destination: r.destination,
      permanent: r.permanent ?? true,
    }));
  },
};

export default nextConfig;
