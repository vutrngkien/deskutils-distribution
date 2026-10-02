'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackUmamiEvent } from '@/lib/umami';

export function SectionTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const seen = new Set<string>();
    const locale = document.documentElement.lang;
    const sections = document.querySelectorAll<HTMLElement>('[data-umami-section]');
    const observers = new Map<HTMLElement, IntersectionObserver>();
    function observe(element: HTMLElement) {
      observers.get(element)?.disconnect();
      observers.delete(element);
      const section = element.dataset.umamiSection;
      if (!section || seen.has(section)) return;
      // A long section may never fit 15% of its height into the viewport.
      const height = element.getBoundingClientRect().height;
      const threshold = 0.15 * Math.min(1, window.innerHeight / Math.max(height, 1));
      const observer = new IntersectionObserver(
        (entries) => {
          if (
            entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= threshold) &&
            !seen.has(section) &&
            trackUmamiEvent('section_view', { section, locale })
          ) {
            seen.add(section);
            observer.disconnect();
          }
        },
        { threshold },
      );
      observers.set(element, observer);
      observer.observe(element);
    }
    function refresh() {
      sections.forEach(observe);
    }
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => observe(entry.target as HTMLElement));
    });
    sections.forEach((section) => resizeObserver.observe(section));
    refresh();
    window.addEventListener('resize', refresh);
    return () => {
      observers.forEach((observer) => observer.disconnect());
      resizeObserver.disconnect();
      window.removeEventListener('resize', refresh);
    };
  }, [pathname]);

  return null;
}
