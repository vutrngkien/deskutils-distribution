import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { localePath, type Locale } from '@/content/locales';
import { translate, type MessageKey } from '@/content/i18n';

/**
 * Shared layout for the legal pages (Privacy, Terms), matching
 * `Site v1 - Legal.dc.html`: breadcrumb, single-column body and an optional
 * "last updated" line. Content stays owned by the page (approved copy).
 */
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
      <div className="container-page pb-20 pt-10">
        <Breadcrumbs
          items={[
            { label: t('breadcrumb.home'), href: localePath(locale, '/') },
            { label: t(label) },
          ]}
        />
        <header data-umami-section="hero" className="mt-6 flex max-w-[760px] flex-col gap-3">
          <h1 className="h-display text-[36px] dt:text-[44px]">{t(title)}</h1>
          <p className="text-[15px] text-muted">{t(description)}</p>
          {dated && (
            <p className="text-[15px] text-muted">
              {t('document.updated', { date: t('document.date') })}
            </p>
          )}
        </header>
        <div
          data-umami-section="legal-content"
          className="mt-8 flex max-w-[760px] flex-col gap-7 text-[16px] leading-[1.6] text-ink-2
            [&_h2]:text-[21px] [&_h2]:font-bold [&_h2]:text-base-content
            [&_section]:flex [&_section]:flex-col [&_section]:gap-2
            [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1.5
            [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-[3px]"
        >
          {children}
        </div>
      </div>
    </main>
  );
}
