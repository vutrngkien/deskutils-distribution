'use client';

import type { MouseEvent, ReactNode } from 'react';
import { product } from '@/content/product';
import { localePath, type Locale } from '@/content/locales';

export type DownloadPlacement =
  | 'header'
  | 'header_compact'
  | 'hero'
  | 'mobile_menu'
  | 'nav'
  | 'pricing_free'
  | 'pricing_pro'
  | 'cta'
  | 'install_page'
  | 'not_found';

export function DownloadLink({
  children,
  className,
  locale,
  placement,
}: {
  children: ReactNode;
  className?: string;
  locale: Locale;
  placement: DownloadPlacement;
}) {
  const installPath = localePath(locale, '/install/');
  const href = placement === 'install_page' ? product.downloadURL : installPath;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (placement === 'install_page') return;

    const link = event.currentTarget;
    link.href = product.downloadURL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    window.setTimeout(() => window.location.assign(installPath), 0);
  }

  return (
    <a
      className={className}
      data-button={className ? true : undefined}
      data-track-event="download"
      data-track-event-locale={locale}
      data-track-event-placement={placement}
      href={href}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
