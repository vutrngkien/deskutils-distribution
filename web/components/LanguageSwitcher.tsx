'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, Globe2 } from 'lucide-react';
import { languages, localePath, type Locale } from '@/content/locales';
import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher({
  locale,
  mobile = false,
  compact = false,
}: {
  locale: Locale;
  mobile?: boolean;
  compact?: boolean;
}) {
  const details = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname() ?? '/';
  const activeLanguage = languages.find((language) => language.code === locale) ?? languages[0];
  const basePath =
    locale === 'en' ? pathname : pathname.replace(new RegExp(`^/${locale}(?=/|$)`), '') || '/';

  useEffect(() => {
    const closeWhenOutside = (event: PointerEvent) => {
      if (details.current && !details.current.contains(event.target as Node))
        details.current.open = false;
    };
    document.addEventListener('pointerdown', closeWhenOutside);
    return () => document.removeEventListener('pointerdown', closeWhenOutside);
  }, []);

  return (
    <details
      ref={details}
      className={`${styles.switcher} ${mobile ? styles.mobileSwitcher : ''} ${compact ? styles.compactSwitcher : ''}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          details.current!.open = false;
          details.current?.querySelector('summary')?.focus();
        }
      }}
    >
      <summary>
        <Globe2 aria-hidden="true" />
        <span>{activeLanguage.label}</span>
        <ChevronDown aria-hidden="true" />
      </summary>
      <div className={styles.menu}>
        {languages.map((language) => (
          <a
            key={language.code}
            href={localePath(language.code, basePath)}
            lang={language.code}
            aria-current={language.code === locale ? 'page' : undefined}
            data-umami-event="language_change"
            data-umami-event-from={locale}
            data-umami-event-to={language.code}
            data-umami-event-placement={
              mobile ? 'mobile_menu' : compact ? 'header_compact' : 'header'
            }
          >
            <span>{language.label}</span>
          </a>
        ))}
      </div>
    </details>
  );
}
