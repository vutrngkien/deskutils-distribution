import { PricingPlans } from './PricingPlans';
import { NotarizationGoal } from '@/components/NotarizationGoal';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';

/** Free distribution and optional support. The pricing anchor preserves existing links. */
export function HomePricing({ locale }: { locale: Locale }) {
  const t = translate.bind(null, locale);

  return (
    <section
      className="home-pricing-original"
      id="pricing"
      aria-labelledby="home-pricing"
      data-umami-section="pricing"
    >
      <div className="home-pricing-shell">
        <div className="home-pricing-heading">
          <p className="eyebrow">{t('pricing.page.eyebrow')}</p>
          <h2 id="home-pricing" className="home-section-title">
            {t('home.pricing.title')}
          </h2>
          <p className="lede">{t('pricing.subtitle')}</p>
        </div>
        <NotarizationGoal locale={locale} />
        <PricingPlans locale={locale} compactOnMobile />
      </div>
    </section>
  );
}
