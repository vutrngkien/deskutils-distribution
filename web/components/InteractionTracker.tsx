'use client';

import { useEffect } from 'react';
import { trackUmamiEvent, type UmamiEventData } from '@/lib/umami';

/** Capture before React changes a download href or closes a navigation panel. */
export function InteractionTracker() {
  useEffect(() => {
    function click(event: MouseEvent) {
      if (event.type === 'auxclick' && event.button !== 1) return;
      const node = event.target instanceof Element ? event.target : null;
      const element = node?.closest<HTMLElement>('[data-track-event], a[href]');
      if (!element) return;
      const placement =
        element.closest<HTMLElement>('[data-track-placement]')?.dataset.trackPlacement ??
        element.closest<HTMLElement>('[data-umami-section]')?.dataset.umamiSection ??
        'content';
      const data: UmamiEventData = { placement };
      if (element.dataset.trackEvent) {
        // Only explicitly authored metadata; never textContent or form values.
        for (const attribute of element.attributes) {
          if (attribute.name.startsWith('data-track-event-'))
            data[attribute.name.slice('data-track-event-'.length)] = attribute.value;
        }
        trackUmamiEvent(element.dataset.trackEvent, data);
        return;
      }
      const href = element.getAttribute('href');
      if (!href || href === '#main') return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.protocol === 'mailto:') {
        trackUmamiEvent('support_click', { ...data, target: 'email' });
      } else if (url.protocol === 'https:' || url.protocol === 'http:') {
        const internal = url.origin === window.location.origin;
        const permissions = internal && url.hash === '#permissions';
        trackUmamiEvent(
          permissions ? 'permissions_click' : internal ? 'nav_click' : 'external_link',
          {
            ...data,
            // Omit queries (checkout data) and mailto addresses entirely.
            target: internal ? `${url.pathname}${url.hash}` : `${url.hostname}${url.pathname}`,
          },
        );
      }
    }
    function toggle(event: Event) {
      const element = event.target;
      if (!(element instanceof HTMLDetailsElement) || !element.open || !element.dataset.trackFaq)
        return;
      trackUmamiEvent('faq_open', {
        faq: element.dataset.trackFaq,
        group: element.dataset.trackFaqGroup ?? 'install-troubleshooting',
      });
    }
    document.addEventListener('click', click, true);
    document.addEventListener('auxclick', click, true);
    document.addEventListener('toggle', toggle, true);
    return () => {
      document.removeEventListener('click', click, true);
      document.removeEventListener('auxclick', click, true);
      document.removeEventListener('toggle', toggle, true);
    };
  }, []);
  return null;
}
