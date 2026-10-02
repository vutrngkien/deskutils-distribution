import type { ReactNode } from 'react';
import { product } from '@/content/product';
import type { Locale } from '@/content/locales';
import { DownloadLink, type DownloadPlacement } from '@/components/DownloadLink';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'neutral' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost: 'btn btn-ghost',
  neutral: 'btn btn-neutral',
  dark: 'btn border-transparent bg-white/10 text-white hover:bg-white/20',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

/**
 * Shared button. When `download` is set it preserves the existing
 * `DownloadLink` behavior: start the DMG download and then navigate the current
 * tab to the localized install guide.
 */
export function Button({
  children,
  href,
  download = false,
  locale = 'en',
  placement = 'cta',
  variant = 'primary',
  size = 'md',
  className = '',
}: {
  children: ReactNode;
  href?: string;
  download?: boolean;
  locale?: Locale;
  placement?: DownloadPlacement;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const classes =
    `max-w-full whitespace-normal ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  if (download || href === undefined || href === product.downloadURL) {
    return (
      <DownloadLink className={classes} locale={locale} placement={placement}>
        {children}
      </DownloadLink>
    );
  }

  const isCheckout =
    href === product.pricing.purchaseURL ||
    href.startsWith('https://deskutils.lemonsqueezy.com/checkout/');

  return (
    <a
      className={classes}
      href={href}
      data-umami-event={isCheckout ? 'checkout' : undefined}
      data-umami-event-locale={isCheckout ? locale : undefined}
      data-umami-event-placement={isCheckout ? placement : undefined}
    >
      {children}
    </a>
  );
}
