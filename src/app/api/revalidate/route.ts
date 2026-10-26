import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

import { revalidateTargets, type WebhookPayload } from '@/sanity/revalidate';

// Called by a Sanity GROQ webhook on create, update and delete.
// The signature is checked with SANITY_REVALIDATE_SECRET before anything is revalidated.
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: 'SANITY_REVALIDATE_SECRET is not set' }, { status: 500 });
  }

  try {
    // Waits briefly so the Content Lake returns the new version when pages refetch.
    const { isValidSignature, body } = await parseBody<WebhookPayload>(request, secret, true);
    if (!isValidSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: 'Missing _type in payload' }, { status: 400 });
    }

    const targets = revalidateTargets(body);
    for (const target of targets) revalidatePath(target.path, target.type);
    revalidatePath('/sitemap.xml');

    return NextResponse.json({ revalidated: targets.map((t) => t.path) });
  } catch {
    return NextResponse.json({ message: 'Could not parse webhook body' }, { status: 400 });
  }
}
