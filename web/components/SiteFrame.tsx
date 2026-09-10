import type { ReactNode } from 'react';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import { Footer, Header } from './Site';

export function SiteFrame({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        {translate(locale, 'a11y.skip')}
      </a>
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
    </>
  );
}
