import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const parseBody = vi.fn();
const revalidatePath = vi.fn();
vi.mock('next-sanity/webhook', () => ({ parseBody: (...args: unknown[]) => parseBody(...args) }));
vi.mock('next/cache', () => ({ revalidatePath: (...args: unknown[]) => revalidatePath(...args) }));

import type { NextRequest } from 'next/server';

import { POST } from '@/app/api/revalidate/route';

const request = {} as NextRequest;

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    vi.stubEnv('SANITY_REVALIDATE_SECRET', 'test-secret');
    parseBody.mockReset();
    revalidatePath.mockReset();
  });
  afterEach(() => vi.unstubAllEnvs());

  it('returns 500 when the secret is not configured', async () => {
    vi.stubEnv('SANITY_REVALIDATE_SECRET', '');
    const res = await POST(request);
    expect(res.status).toBe(500);
    expect(parseBody).not.toHaveBeenCalled();
  });

  it('rejects an invalid signature without revalidating', async () => {
    parseBody.mockResolvedValue({ isValidSignature: false, body: { _type: 'post' } });
    const res = await POST(request);
    expect(res.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('rejects a payload without _type', async () => {
    parseBody.mockResolvedValue({ isValidSignature: true, body: {} });
    expect((await POST(request)).status).toBe(400);
  });

  it('revalidates the paths for the changed document and the sitemap', async () => {
    parseBody.mockResolvedValue({ isValidSignature: true, body: { _type: 'event', slug: 'meetup', language: 'de' } });
    const res = await POST(request);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ revalidated: ['/de/events/meetup', '/de/events'] });
    expect(parseBody).toHaveBeenCalledWith(request, 'test-secret', true);
    expect(revalidatePath).toHaveBeenCalledWith('/de/events/meetup', undefined);
    expect(revalidatePath).toHaveBeenCalledWith('/sitemap.xml');
  });

  it('returns 400 when the body cannot be parsed', async () => {
    parseBody.mockRejectedValue(new Error('bad json'));
    expect((await POST(request)).status).toBe(400);
  });
});
