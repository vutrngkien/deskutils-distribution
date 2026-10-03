import { ExternalLink } from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { ChangelogReleases } from '@/components/changelog/ChangelogReleases';
import { FinalCta } from '@/components/layout/FinalCta';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { releases } from '@/content/releases';
import { translate } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';
import { routeHref } from '@/content/routes';
import { breadcrumbData } from '@/content/structured-data';
import { product } from '@/content/product';

export function ChangelogPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);
  const homeHref = localePath(locale, '/');
  const featuresHref = routeHref(locale, 'features', '/#tools');

  return (
    <>
      <StructuredData
        data={breadcrumbData([
          { name: t('breadcrumb.home'), item: `${product.origin}${homeHref}` },
          {
            name: t('changelog.hero.title'),
            item: `${product.origin}${localePath(locale, '/changelog/')}`,
          },
        ])}
      />
      <main id="main" lang={locale}>
        <header
          className="container-page flex flex-col gap-4 pt-10 dt:pt-14"
          data-umami-section="hero"
        >
          <Breadcrumbs
            items={[{ label: t('breadcrumb.home'), href: homeHref }, { label: t('nav.changelog') }]}
          />
          <h1 className="h-display text-[38px] dt:text-[48px]">{t('changelog.hero.title')}</h1>
          <p className="lede max-w-[620px]">{t('changelog.hero.lede')}</p>
          <a
            href={product.releasesURL}
            className="mt-1 flex min-h-[52px] w-fit items-center gap-2 rounded-[12px] bg-primary px-6 text-[15.5px] font-semibold text-white hover:bg-[#0b3bc0]"
            data-track-event="external_link"
            data-track-event-placement="changelog"
            data-track-event-target="all_releases"
          >
            {t('changelog.viewAll')}
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </header>

        <ChangelogReleases
          initialReleases={releases}
          locale={locale}
          labels={{
            title: t('changelog.hero.title'),
            empty: t('changelog.empty'),
            latest: t('changelog.latest'),
            releasedOn: t('changelog.releasedOn'),
            viewOnGitHub: t('changelog.viewOnGitHub'),
          }}
        />
      </main>
      <FinalCta
        locale={locale}
        secondaryLabel={t('screenshot.hero.explore')}
        secondaryHref={featuresHref}
      />
    </>
  );
}
