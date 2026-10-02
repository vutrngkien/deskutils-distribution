'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { trackUmamiEvent } from '@/lib/umami';

/** One view, first playback and failure per rendered demo, never per loop. */
export function useDemoTracking(host: RefObject<HTMLElement | null>, demo: string, locale: string) {
  const seen = useRef(new Set<string>());
  const record = (event: string) => {
    if (seen.current.has(event)) return;
    const placement =
      host.current?.closest<HTMLElement>('[data-track-placement]')?.dataset.trackPlacement ??
      host.current?.closest<HTMLElement>('[data-umami-section]')?.dataset.umamiSection ??
      'content';
    if (trackUmamiEvent(event, { demo, locale, placement })) seen.current.add(event);
  };
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const placement =
            element.closest<HTMLElement>('[data-track-placement]')?.dataset.trackPlacement ??
            element.closest<HTMLElement>('[data-umami-section]')?.dataset.umamiSection ??
            'content';
          if (
            !seen.current.has('demo_view') &&
            trackUmamiEvent('demo_view', { demo, locale, placement })
          )
            seen.current.add('demo_view');
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [host, demo, locale]);
  return { onPlaying: () => record('demo_play'), onError: () => record('demo_error') };
}
