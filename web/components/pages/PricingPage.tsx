import { Check } from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { Button } from '@/components/ui/Button';
import { FinalCta } from '@/components/layout/FinalCta';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Faq } from '@/components/ui/Faq';
import { PricingPlans } from '@/components/pricing/PricingPlans';
import { pricingComparison, pricingFaqs, type PricingCell } from '@/content/pricing';
import { translate, type MessageKey } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';
import { routeHref } from '@/content/routes';
import { breadcrumbData, faqData, pricingStructuredData } from '@/content/structured-data';
import { product } from '@/content/product';

function Cell({ locale, cell, pro }: { locale: Locale; cell: PricingCell; pro: boolean }) {
  const t = translate.bind(null, locale);
  if (cell.kind === 'included') {
    return (
      <span className="flex items-center gap-2 font-medium">
        <Check size={17} aria-hidden="true" className={pro ? 'text-[#9fbaff]' : 'text-primary'} />
        {t('pricing.included' as MessageKey)}
      </span>
    );
  }
  if (cell.kind === 'none') {
    return <span className="text-muted">{t('pricing.none' as MessageKey)}</span>;
  }
  return <span>{t(cell.key, cell.values)}</span>;
}

export function PricingPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);
  const homeHref = localePath(locale, '/');
  const featuresHref = routeHref(locale, 'features', '/#tools');
  const installHref = localePath(locale, '/install/');
  const faqs = pricingFaqs();

  return (
    <>
      <StructuredData data={pricingStructuredData(locale)} />
      <StructuredData
        data={breadcrumbData([
          { name: t('breadcrumb.home'), item: `${product.origin}${homeHref}` },
          {
            name: t('meta.pricing.title'),
            item: `${product.origin}${localePath(locale, '/pricing/')}`,
          },
        ])}
      />
      <StructuredData
        data={faqData(
          faqs.map((faq) => ({
            question: t(faq.question, faq.values),
            answer: t(faq.answer, faq.values),
          })),
        )}
      />
      <main id="main" lang={locale}>
        <header
          className="container-page flex flex-col items-center gap-5 pt-10 text-center"
          data-umami-section="hero"
        >
          <div className="w-full max-w-[1100px]">
            <Breadcrumbs
              items={[{ label: t('breadcrumb.home'), href: homeHref }, { label: t('nav.pricing') }]}
            />
          </div>
          <p className="eyebrow mt-3">{t('pricing.page.eyebrow')}</p>
          <h1 className="h-display max-w-[880px]">{t('home.pricing.title')}</h1>
          <p className="lede max-w-[720px]">{t('pricing.page.lede')}</p>
        </header>

        <section
          className="home-pricing-original pricing-page-plans"
          aria-label={t('pricing.page.eyebrow')}
        >
          <div className="home-pricing-shell">
            <PricingPlans locale={locale} />
          </div>
        </section>

        {/* Compare */}
        <section className="container-page pt-16 dt:pt-[130px]" aria-labelledby="pricing-compare">
          <h2 id="pricing-compare" className="h-section text-[28px] dt:text-[40px]">
            {t('pricing.compare.title')}
          </h2>
          <div className="mt-8 overflow-hidden rounded-[24px] border border-line">
            {/* Desktop table */}
            <table className="hidden w-full border-collapse text-left dt:table">
              <thead>
                <tr className="bg-[#f3f6ff]">
                  <th className="p-5 text-[15px] font-semibold">{t('pricing.compare.feature')}</th>
                  <th className="w-[22%] p-5 text-[15px] font-semibold">{t('pricing.free')}</th>
                  <th className="w-[22%] p-5 text-[15px] font-semibold">{t('pricing.pro')}</th>
                </tr>
              </thead>
              <tbody>
                {pricingComparison.map((row) => (
                  <tr key={row.id} className="border-t border-line">
                    <th scope="row" className="p-5 text-[15px] font-medium">
                      {t(row.feature)}
                    </th>
                    <td className="p-5 text-[15px]">
                      <Cell locale={locale} cell={row.free} pro={false} />
                    </td>
                    <td className="p-5 text-[15px]">
                      <Cell locale={locale} cell={row.pro} pro />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Mobile stacked cards */}
            <div className="flex flex-col dt:hidden">
              {pricingComparison.map((row) => (
                <div key={row.id} className="border-b border-line p-5 last:border-b-0">
                  <b className="text-[15.5px] font-semibold">{t(row.feature)}</b>
                  <div className="mt-2 flex flex-col gap-1.5 text-[14.5px]">
                    <span className="flex items-center gap-2">
                      <span className="w-[70px] flex-none text-muted">{t('pricing.free')}</span>
                      <Cell locale={locale} cell={row.free} pro={false} />
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-[70px] flex-none text-muted">{t('pricing.pro')}</span>
                      <Cell locale={locale} cell={row.pro} pro />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="container-page grid grid-cols-1 gap-8 pt-16 dt:grid-cols-[4fr_8fr] dt:gap-16 dt:pt-[130px]"
          id="faq"
          aria-labelledby="pricing-faq"
        >
          <h2 id="pricing-faq" className="h-section text-[28px] dt:text-[36px]">
            {t('pricing.faq.title')}
          </h2>
          <Faq
            locale={locale}
            id="pricing"
            items={faqs.map((faq) => ({
              id: faq.id,
              question: faq.question,
              answer: faq.answer,
              values: faq.values,
            }))}
          />
        </section>

        <section className="container-page flex flex-wrap items-center gap-6 pt-12">
          <Button href={installHref} locale={locale} placement="pricing_free">
            {t('home.download')} <span aria-hidden="true">↓</span>
          </Button>
          <a
            href={featuresHref}
            className="text-[17px] font-semibold text-base-content hover:text-primary"
          >
            {t('screenshot.hero.explore')} →
          </a>
        </section>
      </main>
      <FinalCta
        locale={locale}
        title={t('pricing.cta.title')}
        secondaryLabel={t('screenshot.hero.explore')}
        secondaryHref={featuresHref}
      />
    </>
  );
}
