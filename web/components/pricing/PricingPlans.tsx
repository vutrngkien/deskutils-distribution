import { Button } from '@/components/ui/Button';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import { launchOffer, plans, product } from '@/content/product';

/** Original plan layout shared by Home and Pricing, using current product data. */
export function PricingPlans({ locale }: { locale: Locale }) {
  const t = translate.bind(null, locale);

  return (
    <div className="home-pricing-plans">
      {plans.map((plan) => {
        const pro = plan.id === 'pro';
        return (
          <article
            key={plan.id}
            className={`home-pricing-plan ${pro ? 'card home-pricing-pro' : 'home-pricing-free'}`}
          >
            <div className="home-pricing-top">
              <span className="home-pricing-eyebrow">
                {t(pro ? 'pricing.pro' : 'pricing.free')}
              </span>
              {pro && launchOffer.enabled && (
                <span className="home-pricing-launch">{t('pricing.launchOffer')}</span>
              )}
            </div>
            <h3 className="home-pricing-pitch">{t(plan.pitch)}</h3>
            <p className="home-pricing-description">{t(plan.description)}</p>
            <div className="home-pricing-price">
              {pro && product.pricing.showOriginal && (
                <del>{`$${product.pricing.originalAmount}`}</del>
              )}
              <strong>{`$${pro ? product.pricing.amount : '0'}`}</strong>
              {pro && <span className="home-pricing-lifetime">{t('pricing.lifetime')}</span>}
              {!pro && <span>{t('pricing.noLicense')}</span>}
            </div>
            {pro && launchOffer.enabled && (
              <p className="home-pricing-code">
                <span>{t('pricing.promoLabel')}</span>
                <code>{launchOffer.discountCode}</code>
              </p>
            )}
            <ul>
              {plan.features.map((feature) => (
                <li key={feature.key}>{t(feature.key, feature.values)}</li>
              ))}
            </ul>
            {pro ? (
              <Button
                href={product.pricing.purchaseURL}
                locale={locale}
                placement="pricing_pro"
                variant="secondary"
              >
                {t('pricing.cta')}
              </Button>
            ) : (
              <Button locale={locale} placement="pricing_free">
                {t('home.download')} <span aria-hidden="true">↓</span>
              </Button>
            )}
            {pro ? (
              launchOffer.enabled && (
                <p className="home-pricing-footnote">
                  {t('pricing.proFootnote', {
                    customers: launchOffer.customerLimit,
                    original: launchOffer.regularAmount,
                  })}
                </p>
              )
            ) : (
              <p className="home-pricing-footnote">{t('pricing.freeFootnote')}</p>
            )}
          </article>
        );
      })}
    </div>
  );
}
