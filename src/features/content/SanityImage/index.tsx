import Image from 'next/image';

import { urlFor } from '@/sanity/image';
import { cn } from '@/utils';

export type SanityImageValue = {
  asset?: { _ref: string } | null;
  alt?: string | null;
  decorative?: boolean | null;
  lqip?: string | null;
  dimensions?: { width?: number | null; height?: number | null } | null;
};

type SanityImageProps = {
  image: SanityImageValue | null | undefined;
  width: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function SanityImage({ image, width, height, sizes, priority, className }: SanityImageProps) {
  if (!image?.asset?._ref) return null;

  const ratio =
    image.dimensions?.width && image.dimensions?.height
      ? image.dimensions.height / image.dimensions.width
      : 2 / 3;
  const finalHeight = height ?? Math.round(width * ratio);
  const builder = urlFor(image as Parameters<typeof urlFor>[0])
    .width(width)
    .height(finalHeight)
    .fit('crop')
    .auto('format');

  return (
    <Image
      src={builder.url()}
      alt={image.decorative ? '' : (image.alt ?? '')}
      width={width}
      height={finalHeight}
      sizes={sizes}
      priority={priority}
      placeholder={image.lqip ? 'blur' : 'empty'}
      blurDataURL={image.lqip ?? undefined}
      className={cn('h-auto w-full object-cover', className)}
    />
  );
}
