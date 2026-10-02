import { ArrowRight } from 'lucide-react';
import { ToolIcon } from '@/components/ToolIcon';
import { StructuredData } from '@/components/StructuredData';
import { Button } from '@/components/ui/Button';
import { FinalCta } from '@/components/layout/FinalCta';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { RelatedGuides } from '@/components/sections/RelatedGuides';
import { RelatedTools } from '@/components/sections/RelatedTools';
import { MockupCanvas } from '@/components/mockups/MockupCanvas';
import { ScreenshotStage } from '@/components/mockups/ScreenshotStage';
import { ClipboardPanel } from '@/components/mockups/ClipboardPanel';
import { QuickRing } from '@/components/mockups/QuickRing';
import { featureCompares, featureGroups } from '@/content/features-page';
import { productMenu } from '@/content/features';
import { translate } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';
import { routeHref } from '@/content/routes';
import { breadcrumbData, itemListData } from '@/content/structured-data';
import { product } from '@/content/product';

export function FeaturesPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);
  const homeHref = localePath(locale, '/');
  const pricingHref = routeHref(locale, 'pricing', '/#pricing');

  const featured = productMenu.filter((tool) =>
    ['screenshot', 'clipboard-manager', 'quick-ring'].includes(tool.id),
  );

  const crumbs = [
    { name: t('breadcrumb.home'), item: `${product.origin}${homeHref}` },
    { name: t('features.title'), item: `${product.origin}${localePath(locale, '/features/')}` },
  ];

  const catalog = featureGroups.flatMap((group) =>
    group.tools.map((tool) => ({
      name: t(tool.name),
      url: `${product.origin}${routeHref(locale, tool.id, '/#tools')}`,
    })),
  );

  return (
    <>
      <StructuredData data={breadcrumbData(crumbs)} />
      <StructuredData data={itemListData(t('features.title'), catalog)} />
      <main id="main" lang={locale}>
        <header
          className="container-page flex flex-col items-center gap-5 pt-10 text-center dt:pt-10"
          style={{
            background: 'radial-gradient(60% 60% at 50% 100%, #dfe9ff 0%, rgba(223,233,255,0) 70%)',
          }}
          data-umami-section="hero"
        >
          <div className="w-full max-w-[1100px]">
            <Breadcrumbs
              items={[
                { label: t('breadcrumb.home'), href: homeHref },
                { label: t('nav.features') },
              ]}
            />
          </div>
          <p className="eyebrow mt-3">{t('features.eyebrow')}</p>
          <h1 className="h-display max-w-[880px]">{t('features.title')}</h1>
          <p className="lede max-w-[760px]">{t('features.lede')}</p>
          <div className="flex flex-wrap items-center justify-center gap-7">
            <Button locale={locale} placement="hero">
              {t('home.download')}
            </Button>
            <a
              href={pricingHref}
              className="text-[17px] font-semibold text-base-content hover:text-primary"
            >
              {t('features.pricing')} →
            </a>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {featureGroups.map((group) => (
              <li key={group.id}>
                <a
                  href={`#group-${group.id}`}
                  className="flex items-center gap-2 rounded-full bg-[#eaf0ff] px-4 py-2 text-[14px] font-semibold text-primary hover:bg-[#dbe6ff]"
                >
                  <ToolIcon name={group.icon} size={17} />
                  {t(group.title)}
                </a>
              </li>
            ))}
          </ul>
        </header>

        {/* Featured */}
        <section className="container-page flex flex-col gap-6 pt-16 dt:pt-[130px]">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">{t('features.featured.eyebrow')}</p>
            <h2 className="h-section text-[28px] dt:text-[40px]">{t('features.featured.title')}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 dt:grid-cols-[7fr_5fr] dt:grid-rows-2">
            <article
              className="flex flex-col gap-4 overflow-hidden rounded-[28px] p-8 dt:row-span-2 dt:p-10"
              style={{
                background:
                  'radial-gradient(80% 90% at 80% 0%, #7cc4ff 0%, #2a6bff 40%, #2330c9 72%, #4b2fb8 100%)',
                color: '#fff',
              }}
              data-testid="featured-screenshot"
            >
              <h3 className="text-[26px] font-bold leading-tight dt:text-[32px]">
                {t('tool.screenshot.name')}
              </h3>
              <p className="max-w-[460px] text-[17px] text-white/90">
                {t('features.featured.screenshot')}
              </p>
              <a
                href={routeHref(locale, 'screenshot', '/#tools')}
                className="text-[15px] font-semibold text-white hover:text-[#dfe7ff]"
              >
                {t('features.featured.explore', { feature: t('tool.screenshot.name') })} →
              </a>
              <div className="mt-2">
                <MockupCanvas width={1000} height={640}>
                  <ScreenshotStage />
                </MockupCanvas>
              </div>
            </article>
            <article
              className="flex flex-col gap-4 overflow-hidden rounded-[28px] bg-neutral p-8 text-white"
              data-testid="featured-clipboard"
            >
              <h3 className="text-[22px] font-bold">{t('tool.clipboard-manager.name')}</h3>
              <p className="text-[15.5px] text-neutral-content">
                {t('features.featured.clipboard')}
              </p>
              <a
                href={routeHref(locale, 'clipboard-manager', '/#tools')}
                className="text-[15px] font-semibold text-white hover:text-[#dfe7ff]"
              >
                {t('features.featured.explore', { feature: t('tool.clipboard-manager.name') })} →
              </a>
              <div className="mt-2">
                <MockupCanvas width={840} height={520}>
                  <ClipboardPanel />
                </MockupCanvas>
              </div>
            </article>
            <article
              className="flex flex-col gap-4 overflow-hidden rounded-[28px] bg-[#eaf0ff] p-8"
              data-testid="featured-quick-ring"
            >
              <h3 className="text-[22px] font-bold">{t('tool.quick-ring.name')}</h3>
              <p className="text-[15.5px] text-muted">{t('features.featured.quickring')}</p>
              <a
                href={routeHref(locale, 'quick-ring', '/#tools')}
                className="text-[15px] font-semibold text-primary hover:text-[#0b3bc0]"
              >
                {t('features.featured.explore', { feature: t('tool.quick-ring.name') })} →
              </a>
              <div className="mx-auto mt-1 w-[180px]">
                <MockupCanvas width={300} height={300}>
                  <QuickRing selected={0} />
                </MockupCanvas>
              </div>
            </article>
          </div>
        </section>

        {/* Groups */}
        <section className="container-page flex flex-col gap-10 pt-16 dt:pt-[130px]">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">{t('features.groups.eyebrow')}</p>
            <h2 className="h-section text-[28px] dt:text-[40px]">{t('features.groups.title')}</h2>
          </div>
          <div className="flex flex-col">
            {featureGroups.map((group) => (
              <section
                key={group.id}
                id={`group-${group.id}`}
                className="grid grid-cols-1 gap-6 border-t border-line py-8 dt:grid-cols-[4fr_8fr] dt:gap-10"
              >
                <div className="flex flex-col gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-[13px] bg-[#eaf0ff] text-primary">
                    <ToolIcon name={group.icon} size={22} />
                  </span>
                  <h3 className="h-feature text-[22px]">{t(group.title)}</h3>
                  <p className="text-[15.5px] text-muted">{t(group.body)}</p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {group.tools.map((tool) => (
                    <a
                      key={tool.id}
                      href={routeHref(locale, tool.id, '/#tools')}
                      className="flex items-start gap-4 rounded-[18px] bg-white p-4 shadow-[0_0_0_1px_#eef1f6] transition-colors hover:bg-[#f3f6ff]"
                    >
                      <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-[#eaf0ff] text-primary">
                        <ToolIcon name={tool.icon} size={22} />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <b className="text-[16px]">{t(tool.name)}</b>
                        <span className="text-[14px] text-muted">{t(tool.body)}</span>
                      </span>
                      <ArrowRight size={18} className="mt-1 text-muted" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        {/* Compare */}
        <section className="container-page flex flex-col gap-6 pt-16 dt:pt-[130px]">
          <div className="flex flex-col gap-3">
            <h2 className="h-section text-[28px] dt:text-[40px]">{t('features.compare.title')}</h2>
            <p className="text-[17px] text-muted">{t('features.compare.body')}</p>
          </div>
          <div className="flex flex-col gap-5">
            {featureCompares.map((compare) => (
              <div
                key={compare.id}
                className="grid grid-cols-1 gap-4 rounded-[24px] bg-[#f3f6ff] p-6 dt:grid-cols-[260px_1fr_1fr] dt:items-center dt:gap-6"
              >
                <h3 className="text-[19px] font-bold">{t(compare.title)}</h3>
                {[compare.a, compare.b].map((option) => (
                  <a
                    key={option.id}
                    href={option.href ?? routeHref(locale, option.id, '/#tools')}
                    className="flex flex-col gap-2 rounded-[18px] bg-white p-5"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf0ff] text-primary">
                      <ToolIcon name={option.icon} size={20} />
                    </span>
                    <b className="text-[16px]">{t(option.name)}</b>
                    <span className="text-[14px] text-muted">{t(option.body)}</span>
                    <span className="text-[14px] font-semibold text-primary">
                      {t(option.link)} →
                    </span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section
          className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[4fr_8fr] dt:gap-16 dt:pt-[130px]"
          data-umami-section="features-related"
        >
          <RelatedGuides locale={locale} installHref={localePath(locale, '/install/')} />
          <div className="flex flex-col gap-3.5">
            <h2 className="text-[28px] font-bold tracking-[-0.03em]">
              {t('screenshot.related.title')}
            </h2>
            <RelatedTools
              locale={locale}
              items={featured.map((tool) => ({
                id: tool.id,
                icon: tool.icon,
                href: routeHref(locale, tool.id, '/#tools'),
                name: tool.nameKey,
                body: tool.bodyKey,
              }))}
            />
          </div>
        </section>
      </main>
      <FinalCta
        locale={locale}
        title={t('features.cta.title')}
        secondaryLabel={t('features.pricing')}
        secondaryHref={pricingHref}
      />
    </>
  );
}
