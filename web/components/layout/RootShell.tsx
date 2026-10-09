import type { ReactNode } from 'react';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { KofiFloatingWidget } from '@/components/KofiFloatingWidget';

/**
 * Shared chrome rendered by both root layouts. Pages provide their own
 * `<main id="main">`, so this component does not emit a landmark.
 */
export function RootShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        {translate(locale, 'a11y.skip')}
      </a>
      <Nav locale={locale} />
      {children}
      <Footer locale={locale} />
      <KofiFloatingWidget />
    </>
  );
}
