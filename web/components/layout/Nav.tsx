import { ChevronDown } from 'lucide-react';
import { localePath, type Locale } from '@/content/locales';
import { translate } from '@/content/i18n';
import { productMenu, toolHref } from '@/content/features';
import { routeHref } from '@/content/routes';
import { product } from '@/content/product';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ToolIcon } from '@/components/ToolIcon';
import { NavDisclosure } from '@/components/layout/NavDisclosure';

export function Nav({ locale }: { locale: Locale }) {
  const t = translate.bind(null, locale);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base-100/90 backdrop-blur">
      <div className="container-page home-nav-shell">
        <a
          href={localePath(locale, '/')}
          className="flex items-center gap-2 text-[1.0625rem] font-bold tracking-tight"
          aria-label={t('a11y.brandHome')}
          data-umami-event="nav_click"
          data-umami-event-placement="brand"
          data-umami-event-target="home"
        >
          <img src="/assets/images/deskutils-icon.webp" alt="" width="28" height="28" />
          DeskUtils
        </a>

        <nav className="home-nav-desktop" aria-label={t('a11y.primaryNav')}>
          <div className="home-nav-center">
            <NavDisclosure
              className="home-features-disclosure"
              summary={
                <>
                  {t('nav.features')}
                  <ChevronDown className="home-nav-chevron" size={16} aria-hidden="true" />
                </>
              }
              summaryClassName="home-nav-link list-none"
              panelClassName="home-features-panel card-surface absolute left-0 top-full z-50 mt-2 grid w-[560px] grid-cols-2 gap-1 p-2 shadow-xl"
              panelLabel={t('nav.features')}
            >
              {productMenu.map((tool) => (
                <a
                  key={tool.id}
                  href={toolHref(locale, tool)}
                  className="flex gap-3 rounded-field p-3 hover:bg-base-200"
                >
                  <span className="mt-0.5 text-primary">
                    <ToolIcon name={tool.icon} size={20} />
                  </span>
                  <span>
                    <strong className="block text-sm font-semibold">{t(tool.nameKey)}</strong>
                    <span className="text-xs text-muted">{t(tool.bodyKey)}</span>
                  </span>
                </a>
              ))}
              <a
                href={routeHref(locale, 'features', '/#tools')}
                className="col-span-2 rounded-field px-3 py-2 text-sm font-semibold text-primary hover:bg-base-200"
              >
                {t('nav.allFeatures')} →
              </a>
            </NavDisclosure>
            <a className="home-nav-link" href={localePath(locale, '/install/')}>
              {t('nav.install')}
            </a>
            <a className="home-nav-link" href={routeHref(locale, 'pricing', '/#pricing')}>
              {t('nav.pricing')}
            </a>
            <a className="home-nav-link" href={localePath(locale, '/feedback/')}>
              {t('nav.feedback')}
            </a>
            <a className="home-nav-link" href={product.releasesURL}>
              {t('nav.changelog')}
            </a>
          </div>
          <div className="home-nav-actions">
            <LanguageSwitcher locale={locale} compact={false} />
            <Button
              href={localePath(locale, '/install/')}
              download
              locale={locale}
              placement="header"
              size="sm"
            >
              {t('nav.download')}
            </Button>
          </div>
        </nav>

        <div className="flex items-center gap-2 dt:hidden">
          <Button locale={locale} placement="header" size="sm" className="hidden md:inline-flex">
            {t('nav.download')}
          </Button>
          <NavDisclosure
            trapFocus
            summary={<span aria-hidden="true">☰</span>}
            summaryAriaLabel={t('a11y.mobileNav')}
            summaryClassName="btn btn-ghost btn-sm list-none"
            panelClassName="card-surface absolute right-0 top-full z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] p-3 shadow-xl"
            panelLabel={t('a11y.mobileNav')}
          >
            <p className="px-2 pb-1 text-xs font-semibold uppercase text-muted">
              {t('nav.features')}
            </p>
            {productMenu.map((tool) => (
              <a
                key={tool.id}
                href={toolHref(locale, tool)}
                className="block rounded-field px-2 py-2 text-sm font-medium hover:bg-base-200"
              >
                {t(tool.nameKey)}
              </a>
            ))}
            <a
              href={routeHref(locale, 'features', '/#tools')}
              className="block rounded-field px-2 py-2 text-sm font-semibold text-primary hover:bg-base-200"
            >
              {t('nav.allFeatures')}
            </a>
            <div className="my-2 h-px bg-line" />
            <a
              href={localePath(locale, '/install/')}
              className="block rounded-field px-2 py-2 text-sm font-medium hover:bg-base-200"
            >
              {t('nav.install')}
            </a>
            <a
              href={routeHref(locale, 'support', '/#faq')}
              className="block rounded-field px-2 py-2 text-sm font-medium hover:bg-base-200"
            >
              {t('nav.support')}
            </a>
            <a
              href={routeHref(locale, 'pricing', '/#pricing')}
              className="block rounded-field px-2 py-2 text-sm font-medium hover:bg-base-200"
            >
              {t('nav.pricing')}
            </a>
            <a
              href={localePath(locale, '/feedback/')}
              className="block rounded-field px-2 py-2 text-sm font-medium hover:bg-base-200"
            >
              {t('nav.feedback')}
            </a>
            <a
              href={product.releasesURL}
              className="block rounded-field px-2 py-2 text-sm font-medium hover:bg-base-200"
            >
              {t('nav.changelog')}
            </a>
            <div className="mt-2 px-2">
              <LanguageSwitcher locale={locale} compact />
            </div>
          </NavDisclosure>
        </div>
      </div>
    </header>
  );
}
