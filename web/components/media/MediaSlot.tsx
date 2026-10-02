import type { Locale } from '@/content/locales';
import { translate } from '@/content/i18n';
import { getMediaSlot, hasGeneratedMedia, mediaVariant } from '@/content/media';
import { ToolIcon } from '@/components/ToolIcon';

/**
 * Stable, fixed-aspect media slot. When the media pipeline has generated
 * variants for the slot it renders a responsive <picture> (AVIF → WebP → PNG,
 * 1x/2x) with explicit dimensions and no layout shift; otherwise it renders an
 * honest placeholder at the declared dimensions. It never recreates app UI.
 */
export function MediaSlot({
  id,
  locale,
  className = '',
  priority = false,
}: {
  id: string;
  locale: Locale;
  className?: string;
  priority?: boolean;
}) {
  const slot = getMediaSlot(id);
  const generated = hasGeneratedMedia(id);
  const alt = translate(locale, slot.altKey);

  return (
    <figure
      className={`relative overflow-hidden rounded-2xl border border-line bg-base-200 ${className}`}
      style={{ aspectRatio: slot.aspectRatio }}
      data-media-slot={slot.id}
      data-media-state={generated ? 'ready' : 'placeholder'}
    >
      {generated ? (
        <picture>
          <source
            type="image/avif"
            srcSet={`${mediaVariant(id, 'avif', 1)} 1x, ${mediaVariant(id, 'avif', 2)} 2x`}
          />
          <source
            type="image/webp"
            srcSet={`${mediaVariant(id, 'webp', 1)} 1x, ${mediaVariant(id, 'webp', 2)} 2x`}
          />
          <img
            src={mediaVariant(id, 'png', 1)}
            srcSet={`${mediaVariant(id, 'png', 1)} 1x, ${mediaVariant(id, 'png', 2)} 2x`}
            width={slot.width}
            height={slot.height}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            className="h-full w-full object-contain"
          />
        </picture>
      ) : (
        <div
          className="absolute inset-0 grid place-items-center gap-2 text-muted"
          role="img"
          aria-label={alt}
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-base-100 text-primary">
            <ToolIcon name={slot.icon} size={24} />
          </span>
          <figcaption className="text-xs font-medium uppercase tracking-wide">
            {translate(locale, 'video.comingSoon')}
          </figcaption>
          <span className="sr-only">
            {slot.width} × {slot.height}
          </span>
        </div>
      )}
    </figure>
  );
}
