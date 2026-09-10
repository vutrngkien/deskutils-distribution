'use client';
import { useRef } from 'react';
import { navigation, product } from '@/content/product';
import { localePath, type Locale } from '@/content/locales';
import { translate } from '@/content/i18n';
import styles from './Site.module.css';
import { LanguageSwitcher } from './LanguageSwitcher';
export function MobileNavigation({ locale }: { locale: Locale }) {
  const details = useRef<HTMLDetailsElement>(null);
  const t = translate.bind(null, locale);
  const close = () => {
    if (details.current) details.current.open = false;
  };
  return (
    <details
      ref={details}
      className={styles.mobileNav}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          close();
          details.current?.querySelector('summary')?.focus();
        }
      }}
    >
      <summary>{t('nav.menu')}</summary>
      <nav
        className={styles.mobileLinks}
        aria-label={t('a11y.mobileNav')}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('a')) close();
        }}
      >
        {navigation.map((link) => (
          <a key={link.label} href={localePath(locale, link.href)}>
            {t(link.label)}
          </a>
        ))}
        <LanguageSwitcher mobile locale={locale} />
        <a href={product.downloadURL}>{t('nav.download')} ↓</a>
      </nav>
    </details>
  );
}
