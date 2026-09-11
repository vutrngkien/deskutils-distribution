import type { ReactNode } from 'react';
import { product } from '@/content/product';
import type { Locale } from '@/content/locales';

type DownloadPlacement =
  | 'header'
  | 'header_compact'
  | 'hero'
  | 'mobile_menu'
  | 'pricing_free'
  | 'pricing_pro'
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
  return (
    <a
      className={className}
      data-button={className ? true : undefined}
      data-umami-event="download"
      data-umami-event-locale={locale}
      data-umami-event-placement={placement}
      href={product.downloadURL}
    >
      {children}
    </a>
  );
}
