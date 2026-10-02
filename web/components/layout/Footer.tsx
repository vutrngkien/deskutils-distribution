import { localePath, type Locale } from '@/content/locales';
import { translate } from '@/content/i18n';
import { product } from '@/content/product';
import { productMenu, toolHref } from '@/content/features';
import { routeHref } from '@/content/routes';

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold text-base-content">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-muted">{children}</ul>
    </div>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const t = translate.bind(null, locale);
  const year = new Date().getFullYear();

  return (
    <footer data-track-placement="footer" className="border-t border-line bg-base-100">
      <nav
        aria-label={t('a11y.footerNav')}
        className="container-page grid grid-cols-[repeat(2,minmax(0,1fr))] gap-8 py-12 dt:grid-cols-[2fr_repeat(5,minmax(0,1fr))] dt:py-20"
      >
        <div className="col-span-2 dt:col-span-1">
          <a
            href={localePath(locale, '/')}
            className="flex items-center gap-2 font-bold"
            aria-label={t('a11y.brandHome')}
          >
            <img src="/assets/images/deskutils-icon.webp" alt="" width="28" height="28" />
            DeskUtils
          </a>
          <p className="mt-3 max-w-xs text-sm text-muted">{t('footer.tagline')}</p>
          <p className="mt-2 text-sm text-muted">{t('footer.independent')}</p>
        </div>

        <Column title={t('footer.product')}>
          <li>
            <a className="hover:text-primary" href={routeHref(locale, 'features', '/#tools')}>
              {t('nav.allFeatures')}
            </a>
          </li>
          <li>
            <a className="hover:text-primary" href={localePath(locale, '/install/')}>
              {t('nav.install')}
            </a>
          </li>
          <li>
            <a className="hover:text-primary" href={routeHref(locale, 'pricing', '/#pricing')}>
              {t('nav.pricing')}
            </a>
          </li>
        </Column>

        <Column title={t('footer.features')}>
          {productMenu.map((tool) => (
            <li key={tool.id}>
              <a className="hover:text-primary" href={toolHref(locale, tool)}>
                {t(tool.nameKey)}
              </a>
            </li>
          ))}
        </Column>

        <Column title={t('footer.resources')}>
          <li>
            <a className="hover:text-primary" href={product.repositoryURL}>
              GitHub
            </a>
          </li>
          <li>
            <a className="hover:text-primary" href={routeHref(locale, 'changelog', '/changelog/')}>
              {t('nav.changelog')}
            </a>
          </li>
        </Column>

        <Column title={t('footer.support')}>
          <li>
            <a className="hover:text-primary" href={routeHref(locale, 'support', '/#faq')}>
              {t('nav.support')}
            </a>
          </li>
          <li>
            <a className="hover:text-primary" href={localePath(locale, '/feedback/')}>
              {t('nav.feedback')}
            </a>
          </li>
          <li>
            <a className="break-all hover:text-primary" href={`mailto:${product.supportEmail}`}>
              {product.supportEmail}
            </a>
          </li>
        </Column>

        <Column title={t('footer.legal')}>
          <li>
            <a className="hover:text-primary" href={localePath(locale, '/privacy/')}>
              {t('nav.privacy')}
            </a>
          </li>
          <li>
            <a className="hover:text-primary" href={localePath(locale, '/terms/')}>
              {t('nav.terms')}
            </a>
          </li>
        </Column>
      </nav>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-1 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} DeskUtils</p>
          <p>{t('footer.requires', { version: product.minimumMacOS })}</p>
        </div>
      </div>
    </footer>
  );
}
