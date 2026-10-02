import type { ReactNode } from 'react';
import type { Locale } from '@/content/locales';
import { getMediaSlot, hasGeneratedMedia } from '@/content/media';
import { MediaSlot } from './MediaSlot';

/**
 * Homepage media resolution:
 *   1. generated AVIF/WebP/PNG variants when a real master exists
 *   2. otherwise the temporary Claude mockup passed as `children`
 *   3. only if neither is available does it fall back to the MediaSlot placeholder
 *
 * Mockups are illustrative, kept out of the tab order and marked aria-hidden
 * because the surrounding section already provides the meaningful text.
 */
export function ProductVisual({
  id,
  locale,
  className = '',
  priority = false,
  children,
}: {
  id: string;
  locale: Locale;
  className?: string;
  priority?: boolean;
  children?: ReactNode;
}) {
  const slot = getMediaSlot(id);
  const generated = hasGeneratedMedia(id);

  if (generated) {
    return <MediaSlot id={id} locale={locale} className={className} priority={priority} />;
  }

  if (!children) {
    return <MediaSlot id={id} locale={locale} className={className} priority={priority} />;
  }

  return (
    <figure
      className={`relative ${className}`}
      data-media-slot={slot.id}
      data-media-state="mockup"
      aria-hidden="true"
    >
      {children}
    </figure>
  );
}
