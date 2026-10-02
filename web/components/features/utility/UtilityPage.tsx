import { StructuredData } from '@/components/StructuredData';
import { Button } from '@/components/ui/Button';
import { FinalCta } from '@/components/layout/FinalCta';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Faq } from '@/components/ui/Faq';
import { RelatedTools } from '@/components/sections/RelatedTools';
import { ProductVisual } from '@/components/media/ProductVisual';
import { MockupCanvas } from '@/components/mockups/MockupCanvas';
import {
  CleanKeyboardVisual,
  DisplayDimmingVisual,
  ExternalDisplayOnlyVisual,
  MouseJigglerVisual,
  PreventSleepVisual,
  SystemMonitoringVisual,
} from '@/components/mockups/UtilityVisuals';
import { utilityPages, type UtilityPageData } from '@/content/utilities';
import { translate } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';
import { routeHref } from '@/content/routes';
import { breadcrumbData, faqData } from '@/content/structured-data';
import { product } from '@/content/product';

function UtilityVisual({ id }: { id: string }) {
  switch (id) {
    case 'prevent-sleep':
      return <PreventSleepVisual />;
    case 'mouse-jiggler':
      return <MouseJigglerVisual />;
    case 'clean-keyboard':
      return <CleanKeyboardVisual />;
    case 'display-dimming':
      return <DisplayDimmingVisual />;
    case 'external-display-only':
      return <ExternalDisplayOnlyVisual />;
    case 'system-monitoring':
      return <SystemMonitoringVisual />;
    default:
      return null;
  }
}

/**
 * Shared template for the six utility routes (`SiteUtilityPage.dc.html`).
 * FAQ and related blocks are omitted when the data is empty.
 */
export function UtilityPage({ locale = 'en', id }: { locale?: Locale; id: string }) {
  const t = translate.bind(null, locale);
  const page: UtilityPageData = utilityPages[id];
  const homeHref = localePath(locale, '/');
  const featuresHref = routeHref(locale, 'features', '/#tools');
  const permissionHref = localePath(locale, '/install/#permissions');

  const related = page.related.map((item) => ({
    ...item,
    href: routeHref(locale, item.id, '/#tools'),
  }));

  return (
    <>
      <StructuredData
        data={breadcrumbData([
          { name: t('breadcrumb.home'), item: `${product.origin}${homeHref}` },
          { name: t('nav.features'), item: `${product.origin}${featuresHref}` },
          { name: t(page.title), item: `${product.origin}${localePath(locale, page.path)}` },
        ])}
      />
      {page.faqs.length > 0 && (
        <StructuredData
          data={faqData(
            page.faqs.map((faq) => ({ question: t(faq.question), answer: t(faq.answer) })),
          )}
        />
      )}
      <main id="main" lang={locale}>
        <header className="container-page pt-10" data-umami-section="hero">
          <Breadcrumbs
            items={[
              { label: t('breadcrumb.home'), href: homeHref },
              { label: t('nav.features'), href: featuresHref },
              { label: t(page.eyebrow).split(' · ')[0] },
            ]}
          />
          <div className="mt-6 grid grid-cols-1 gap-10 dt:grid-cols-[5fr_7fr] dt:items-center dt:gap-14">
            <div className="flex flex-col gap-5">
              <p className="eyebrow">{t(page.eyebrow)}</p>
              <h1 className="h-display text-[36px] dt:text-[52px]">{t(page.title)}</h1>
              <p className="lede">{t(page.desc)}</p>
              <div className="flex w-full flex-col gap-3 dt:w-auto dt:flex-row dt:items-center dt:gap-7">
                <Button locale={locale} placement="hero" className="w-full dt:w-auto">
                  {t('home.download')}
                </Button>
                <a
                  href={featuresHref}
                  className="text-center text-[17px] font-semibold text-base-content hover:text-primary"
                >
                  {t('utilities.cta.secondary')} →
                </a>
              </div>
              <p className="text-[14px] text-muted">{t(page.shortcutNote)}</p>
            </div>
            <div className="flex h-[260px] items-center justify-center rounded-[28px] bg-[#f6f8fc] p-8 dt:h-[440px]">
              <ProductVisual id={page.mediaSlot} locale={locale} className="w-full">
                <MockupCanvas width={600} height={300}>
                  <div
                    style={{ position: 'relative', width: 600, height: 300 }}
                    className="flex items-center justify-center"
                  >
                    <div className="w-full max-w-[420px]">
                      <UtilityVisual id={page.id} />
                    </div>
                  </div>
                </MockupCanvas>
              </ProductVisual>
            </div>
          </div>
        </header>

        {/* How it works + permissions */}
        <section className="container-page grid grid-cols-1 gap-5 pt-16 dt:grid-cols-2 dt:pt-[130px]">
          <div className="flex flex-col gap-3 rounded-[28px] bg-[#f3f6ff] p-8 dt:p-10">
            <p className="eyebrow">{t('utilities.how.eyebrow')}</p>
            <h2 className="text-[24px] font-bold leading-tight dt:text-[30px]">
              {t(page.howTitle)}
            </h2>
            <p className="text-[15.5px] leading-[1.6] text-muted">{t(page.howDesc)}</p>
          </div>
          <div className="flex flex-col gap-3 rounded-[28px] bg-[#eaf0ff] p-8 dt:p-10">
            <p className="eyebrow">{t('utilities.permissions.eyebrow')}</p>
            <h2 className="text-[24px] font-bold leading-tight dt:text-[30px]">
              {t('utilities.permissions.title')}
            </h2>
            <p className="text-[15.5px] leading-[1.6] text-muted">{t(page.permission)}</p>
            <a href={permissionHref} className="text-[15.5px] font-semibold text-primary">
              {t('screenshot.permissions.link')} →
            </a>
          </div>
        </section>

        {/* FAQ */}
        {page.faqs.length > 0 && (
          <section
            className="container-page grid grid-cols-1 gap-8 pt-16 dt:grid-cols-[4fr_8fr] dt:gap-16 dt:pt-[130px]"
            id="faq"
            aria-labelledby={`${page.id}-faq`}
          >
            <h2 id={`${page.id}-faq`} className="h-section text-[28px] dt:text-[36px]">
              {t('utilities.faq.title', { tool: t(page.eyebrow).split(' · ')[0] })}
            </h2>
            <Faq locale={locale} id={page.id} items={page.faqs} />
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section
            className="container-page flex flex-col gap-3.5 pt-16 dt:pt-[130px]"
            data-umami-section="utility-related"
          >
            <h2 className="text-[28px] font-bold tracking-[-0.03em]">
              {t('utilities.related.title')}
            </h2>
            <RelatedTools locale={locale} items={related} />
          </section>
        )}
      </main>
      <FinalCta
        locale={locale}
        title={t('utilities.cta.title')}
        secondaryLabel={t('utilities.cta.secondary')}
        secondaryHref={featuresHref}
      />
    </>
  );
}
