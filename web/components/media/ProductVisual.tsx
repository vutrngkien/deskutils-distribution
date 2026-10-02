import type { CSSProperties, ReactNode } from 'react';
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
 *
 * Sizing/cropping is expressed through three props applied identically in the
 * mockup and generated-media states, so a mobile crop never disappears when a
 * real master replaces the mockup:
 *   - `frameClassName`/`frameStyle`: the outer box (fixed height, overflow).
 *   - `cropClassName`/`cropStyle`: an inner positioner for the artwork. Both
 *     the mockup child and the generated image are placed inside it, so an
 *     `absolute` offset/scale holds for either.
 *
 * When no crop is supplied the outer box keeps the slot aspect ratio (mockup
 * child flows; the generated image is `object-contain` inside it).
 */
export function ProductVisual({
  id,
  locale,
  className = '',
  frameClassName = '',
  frameStyle,
  cropClassName = '',
  cropStyle,
  priority = false,
  children,
}: {
  id: string;
  locale: Locale;
  className?: string;
  frameClassName?: string;
  frameStyle?: CSSProperties;
  cropClassName?: string;
  cropStyle?: CSSProperties;
  priority?: boolean;
  children?: ReactNode;
}) {
  const slot = getMediaSlot(id);
  const generated = hasGeneratedMedia(id);
  const frame = `${className} ${frameClassName}`.trim();
  const hasCrop = Boolean(cropClassName || cropStyle || frameClassName || frameStyle);

  if (generated || !children) {
    return (
      <MediaSlot
        id={id}
        locale={locale}
        className={frame}
        style={frameStyle}
        cropClassName={cropClassName}
        cropStyle={cropStyle}
        priority={priority}
      />
    );
  }

  return (
    <figure
      className={`relative ${frame}`}
      style={frameStyle}
      data-media-slot={slot.id}
      data-media-state="mockup"
      aria-hidden="true"
    >
      {hasCrop ? (
        <div className={cropClassName} style={cropStyle}>
          {children}
        </div>
      ) : (
        children
      )}
    </figure>
  );
}
