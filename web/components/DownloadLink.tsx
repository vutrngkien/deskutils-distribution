'use client';

import type { ReactNode } from 'react';
import { track } from '@vercel/analytics';
import { product } from '@/content/product';
import type { Locale } from '@/content/locales';

type DownloadPlacement =
  | 'header'
  | 'header_compact'
  | 'hero'
  | 'mobile_menu'
  | 'pricing_free'
  | 'pricing_pro'
  | 'install_page';

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
  return (
    <a
      className={className}
      data-button={className ? true : undefined}
      href={product.downloadURL}
      onClick={() => track('Download', { locale, placement })}
    >
      {children}
    </a>
  );
}
