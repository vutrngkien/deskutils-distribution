'use client';

import { useEffect } from 'react';
import { trackUmamiEvent } from '@/lib/umami';

export function SectionTracker() {
  useEffect(() => {
    const seen = new Set<string>();
    const pending = new Set<string>();
    const locale = document.documentElement.lang;
    let interval: number | undefined;
    const flush = () => {
      for (const section of pending) {
        if (trackUmamiEvent('section_view', { section, locale })) {
          pending.delete(section);
          seen.add(section);
        }
      }
      if (pending.size === 0 && interval !== undefined) {
        window.clearInterval(interval);
        interval = undefined;
      }
    };
    const retryPending = () => {
      if (pending.size > 0 && interval === undefined) {
        interval = window.setInterval(flush, 300);
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = (entry.target as HTMLElement).dataset.umamiSection;
          if (entry.isIntersecting && section && !seen.has(section)) pending.add(section);
        }
        flush();
        retryPending();
      },
      { threshold: 0.5 },
    );

    document
      .querySelectorAll('[data-umami-section]')
      .forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, []);

  return null;
}
