import type { ReactNode } from 'react';
import { Shell } from './Site';
import { localePath, type Locale } from '@/content/locales';
import { translate, type MessageKey } from '@/content/i18n';
import s from './Document.module.css';
export function Document({
  locale = 'en',
  title,
  description,
  label,
  children,
  dated = false,
}: {
  locale?: Locale;
  title: MessageKey;
  description: MessageKey;
  label: MessageKey;
  children: ReactNode;
  dated?: boolean;
}) {
  const t = translate.bind(null, locale);
  return (
    <main id="main" lang={locale}>
      <Shell>
        <div className={s.document}>
          <a href={localePath(locale, '/')} className={s.back}>
            ← {t('document.back')}
          </a>
          <header className={s.heading}>
            <p className={s.label}>{t(label)}</p>
            <h1>{t(title)}</h1>
            <p className={s.description}>{t(description)}</p>
            {dated && (
              <p className={s.meta}>{t('document.updated', { date: t('document.date') })}</p>
            )}
          </header>
          <div className={s.content}>{children}</div>
        </div>
      </Shell>
    </main>
  );
}
