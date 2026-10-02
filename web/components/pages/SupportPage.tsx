import { Mail, MessageSquare } from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { ToolIcon } from '@/components/ToolIcon';
import { FinalCta } from '@/components/layout/FinalCta';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { supportTopics } from '@/content/support';
import { translate } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';
import { routeHref } from '@/content/routes';
import { breadcrumbData } from '@/content/structured-data';
import { product } from '@/content/product';

function topicHref(locale: Locale, topic: (typeof supportTopics)[number]): string {
  if (topic.external === 'releases') return product.releasesURL;
  const base = routeHref(locale, topic.routeId ?? 'install');
  return topic.hash ? `${base}#${topic.hash}` : base;
}

export function SupportPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);
  const homeHref = localePath(locale, '/');
  const featuresHref = routeHref(locale, 'features', '/#tools');
  const feedbackHref = localePath(locale, '/feedback/');

  return (
    <>
      <StructuredData
        data={breadcrumbData([
          { name: t('breadcrumb.home'), item: `${product.origin}${homeHref}` },
          {
            name: t('meta.support.title'),
            item: `${product.origin}${localePath(locale, '/support/')}`,
          },
        ])}
      />
      <main id="main" lang={locale}>
        <header className="container-page pt-10" data-umami-section="hero">
          <Breadcrumbs
            items={[{ label: t('breadcrumb.home'), href: homeHref }, { label: t('nav.support') }]}
          />
          <div className="mt-6 flex max-w-[760px] flex-col gap-4">
            <h1 className="h-display text-[38px] dt:text-[52px]">{t('support.hero.title')}</h1>
            <p className="lede">{t('support.hero.lede')}</p>
          </div>
        </header>

        <section
          data-umami-section="support-topics"
          className="container-page grid grid-cols-1 gap-5 pt-14 sm:grid-cols-2 dt:grid-cols-3 dt:pt-[56px]"
          data-track-placement="support_topics"
          aria-label={t('support.topics.title')}
        >
          {supportTopics.map((topic) => (
            <a
              key={topic.id}
              href={topicHref(locale, topic)}
              className="flex min-h-[64px] items-center gap-4 rounded-[22px] bg-[#f3f6ff] p-6 text-base-content transition-colors hover:bg-[#e8efff] dt:flex-col dt:items-start dt:gap-3 dt:p-7"
            >
              <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-white text-primary">
                <ToolIcon name={topic.icon} size={22} />
              </span>
              <span className="flex flex-col gap-1">
                <b className="text-[17px]">{t(topic.title)}</b>
                <span className="text-[14.5px] leading-[1.45] text-muted">{t(topic.body)}</span>
              </span>
            </a>
          ))}
        </section>

        <section
          data-umami-section="support-contact"
          data-track-placement="support_contact"
          className="container-page pt-16 dt:pt-[100px]"
        >
          <div className="flex flex-col gap-5 rounded-[28px] bg-neutral p-7 text-white dt:flex-row dt:items-center dt:justify-between dt:gap-8 dt:p-12">
            <div className="flex flex-col gap-2">
              <h2 className="text-[24px] font-bold dt:text-[28px]">{t('support.stuck.title')}</h2>
              <p className="text-[15.5px] text-neutral-content">
                {t('support.stuck.body', { email: product.supportEmail })}
              </p>
            </div>
            <div className="flex flex-col gap-3 dt:flex-row dt:flex-none">
              <a
                href={`mailto:${product.supportEmail}`}
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-[12px] bg-white px-6 text-[15.5px] font-semibold text-neutral"
              >
                <Mail size={17} aria-hidden="true" />
                {t('support.stuck.email')}
              </a>
              <a
                href={feedbackHref}
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-[12px] bg-white/12 px-6 text-[15.5px] font-semibold text-white hover:bg-white/20"
              >
                <MessageSquare size={17} aria-hidden="true" />
                {t('support.stuck.feedback')}
              </a>
            </div>
          </div>
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
