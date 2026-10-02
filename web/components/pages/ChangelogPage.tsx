import { ExternalLink, Tag } from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { Markdown } from '@/components/Markdown';
import { FinalCta } from '@/components/layout/FinalCta';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { releases } from '@/content/releases';
import { translate } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';
import { routeHref } from '@/content/routes';
import { breadcrumbData } from '@/content/structured-data';
import { product } from '@/content/product';

/** Stable, shareable anchor for a version (e.g. #v0.1.10). */
export function releaseAnchor(tag: string) {
  return tag.replace(/[^a-zA-Z0-9._-]/g, '-');
}

function formatDate(locale: Locale, iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

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
            data-umami-event="external_link"
            data-umami-event-placement="changelog"
            data-umami-event-target="all_releases"
          >
            {t('changelog.viewAll')}
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </header>

        <section
          className="container-page flex flex-col gap-6 pt-12 dt:pt-16"
          aria-label={t('changelog.hero.title')}
        >
          {releases.length === 0 ? (
            <p className="max-w-[620px] rounded-[18px] border-[1.5px] border-dashed border-[#c3cde0] p-7 text-[15px] text-muted">
              {t('changelog.empty')}
            </p>
          ) : (
            releases.map((release, index) => (
              <article
                key={release.id}
                id={releaseAnchor(release.tag_name)}
                className="scroll-mt-24 rounded-[22px] border border-line bg-white p-6 shadow-[0_16px_42px_rgba(29,32,40,0.05)] dt:p-8"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-2 text-[20px] font-bold" lang="en">
                    <Tag size={18} aria-hidden="true" className="text-primary" />
                    {release.name || release.tag_name}
                  </span>
                  {index === 0 && (
                    <span className="rounded-full bg-[#eaf0ff] px-3 py-0.5 text-xs font-semibold text-primary">
                      {t('changelog.latest')}
                    </span>
                  )}
                  <time dateTime={release.published_at} className="text-[14px] text-muted">
                    {t('changelog.releasedOn', { date: formatDate(locale, release.published_at) })}
                  </time>
                </div>

                {release.body.trim() && (
                  // Release notes are mirrored verbatim from GitHub and stay in
                  // their original language.
                  <div className="mt-4" lang="en">
                    <Markdown text={release.body} />
                  </div>
                )}

                <a
                  href={release.html_url}
                  className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-primary hover:text-[#0b3bc0]"
                  data-umami-event="external_link"
                  data-umami-event-placement="changelog"
                  data-umami-event-target={release.tag_name}
                >
                  {t('changelog.viewOnGitHub')}
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              </article>
            ))
          )}
        </section>
      </main>
      <FinalCta
        locale={locale}
        secondaryLabel={t('screenshot.hero.explore')}
        secondaryHref={featuresHref}
      />
    </>
  );
}
