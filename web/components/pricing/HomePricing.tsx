import { PricingPlans } from './PricingPlans';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';

/** Original homepage pricing layout, with current product facts and launch gates. */
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
          <h2 id="home-pricing">{t('home.pricing.title')}</h2>
          <p>{t('pricing.subtitle')}</p>
        </div>
        <PricingPlans locale={locale} />
      </div>
    </section>
  );
}
