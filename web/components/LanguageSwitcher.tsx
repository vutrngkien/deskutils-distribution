'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, Globe2 } from 'lucide-react';
import { languages, localePath, type Locale } from '@/content/locales';
import { translate } from '@/content/i18n';
import styles from './LanguageSwitcher.module.css';

function suggestedLocale(): Locale | undefined {
  if (typeof navigator === 'undefined') return undefined;
  for (const language of navigator.languages) {
    const code = language.toLowerCase();
    if (code.startsWith('vi')) return 'vi';
    if (code.startsWith('ja')) return 'ja';
    if (code.startsWith('ko')) return 'ko';
    if (code.startsWith('ru')) return 'ru';
    if (code.startsWith('zh-hk') || code.startsWith('zh-mo') || code.startsWith('zh-tw'))
      return 'zh-TW';
    if (code.startsWith('zh')) return 'zh-CN';
  }
  return undefined;
}

const subscribeToBrowserLanguage = () => () => {};
const serverSuggestedLocale = () => undefined;

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
  const suggested = useSyncExternalStore(
    subscribeToBrowserLanguage,
    () => (locale === 'en' ? suggestedLocale() : undefined),
    serverSuggestedLocale,
  );
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
          >
            <span>{language.label}</span>
            {locale === 'en' && language.code === suggested && language.code !== locale && (
              <small>{translate(locale, 'language.suggested')}</small>
            )}
          </a>
        ))}
      </div>
    </details>
  );
}
