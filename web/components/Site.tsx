import type { ReactNode } from 'react';
import { navigation, product } from '@/content/product';
import { localePath, type Locale } from '@/content/locales';
import { translate } from '@/content/i18n';
import styles from './Site.module.css';
import { MobileNavigation } from './MobileNavigation';
import { ScrollHeader } from './ScrollHeader';
import { LanguageSwitcher } from './LanguageSwitcher';
import { DownloadLink } from './DownloadLink';
export function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.shell} ${className}`}>{children}</div>;
}
export function Brand({ locale = 'en' }: { locale?: Locale }) {
  return (
    <a
      className={styles.brand}
      href={localePath(locale, '/')}
      aria-label={translate(locale, 'a11y.brandHome')}
    >
      <img src="/assets/images/deskutils-icon.webp" alt="" width="28" height="28" />
      DeskUtils
    </a>
  );
}
export function Button({
  children,
  href = product.downloadURL,
  secondary = false,
  locale = 'en',
  placement = 'hero',
}: {
  children: ReactNode;
  href?: string;
  secondary?: boolean;
  locale?: Locale;
  placement?:
    'header' | 'header_compact' | 'hero' | 'pricing_free' | 'pricing_pro' | 'install_page';
}) {
  const className = `${styles.button} ${secondary ? styles.buttonSecondary : ''}`;
  if (href === product.downloadURL) {
    return (
      <DownloadLink className={className} locale={locale} placement={placement}>
        {children}
      </DownloadLink>
    );
  }
  return (
    <a className={className} data-button href={href}>
      {children}
    </a>
  );
}
export function Header({ locale = 'en' }: { locale?: Locale }) {
  return (
    <ScrollHeader>
      <div className={styles.headerDefault}>
        <Shell>
          <HeaderContent locale={locale} />
        </Shell>
      </div>
      <div className={styles.headerCompact}>
        <Shell>
          <HeaderContent compact locale={locale} />
        </Shell>
      </div>
    </ScrollHeader>
  );
}

function HeaderContent({ compact = false, locale }: { compact?: boolean; locale: Locale }) {
  const t = translate.bind(null, locale);

  return (
    <header className={`${styles.header} ${compact ? styles.compactHeader : ''}`}>
      <Brand locale={locale} />
      <nav className={styles.nav} aria-label={t('a11y.primaryNav')}>
        {navigation.map((link) => (
          <a key={link.label} href={localePath(locale, link.href)}>
            {t(link.label)}
          </a>
        ))}
        <LanguageSwitcher compact={compact} locale={locale} />
        <Button locale={locale} placement={compact ? 'header_compact' : 'header'}>
          {t('nav.download')} <span aria-hidden="true">↓</span>
        </Button>
      </nav>
      <MobileNavigation locale={locale} />
    </header>
  );
}
export function Footer({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);

  return (
    <Shell>
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <Brand locale={locale} />
          <nav className={styles.footerLinks} aria-label={t('a11y.footerNav')}>
            <a href={product.releasesURL}>{t('nav.changelog')}</a>
            <a href={localePath(locale, '/install/')}>{t('nav.install')}</a>
            <a href={`mailto:${product.supportEmail}`}>{t('nav.support')}</a>
            <a href={localePath(locale, '/privacy/')}>{t('nav.privacy')}</a>
            <a href={localePath(locale, '/terms/')}>{t('nav.terms')}</a>
            <a href={product.repositoryURL}>GitHub</a>
          </nav>
        </div>
        <div className={styles.footerBottom}>
          <p>{t('footer.independent')}</p>
          <p>© {new Date().getFullYear()} DeskUtils</p>
        </div>
      </footer>
    </Shell>
  );
}
