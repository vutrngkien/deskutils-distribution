import type { ReactNode } from 'react';
import { product } from '@/content/product';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';

export function DonationLink({
  locale,
  placement,
  className,
  children,
}: {
  locale: Locale;
  placement: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a
      href={product.donationURL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-track-event="donate_click"
      data-track-event-locale={locale}
      data-track-event-placement={placement}
    >
      {children ?? translate(locale, 'donation.cta')} <span aria-hidden="true">↗</span>
    </a>
  );
}
