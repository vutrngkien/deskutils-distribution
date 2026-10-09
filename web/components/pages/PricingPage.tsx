import { StructuredData } from '@/components/StructuredData';
import { Button } from '@/components/ui/Button';
import { FinalCta } from '@/components/layout/FinalCta';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Faq } from '@/components/ui/Faq';
import { PricingPlans } from '@/components/pricing/PricingPlans';
import { NotarizationGoal } from '@/components/NotarizationGoal';
import { pricingFaqs } from '@/content/pricing';
import { translate } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';
import { routeHref } from '@/content/routes';
import { breadcrumbData, faqData, pricingStructuredData } from '@/content/structured-data';
import { product } from '@/content/product';

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
          data-umami-section="pricing-plans"
          className="home-pricing-original pricing-page-plans"
          aria-label={t('pricing.page.eyebrow')}
        >
          <div className="home-pricing-shell">
            <NotarizationGoal locale={locale} headingLevel={2} />
            <PricingPlans locale={locale} compactOnMobile />
          </div>
        </section>

        {/* FAQ */}
        <section
          data-umami-section="pricing-faq"
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

        <section
          data-umami-section="pricing-links"
          className="container-page flex flex-wrap items-center gap-6 pt-12"
        >
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
