import { Button } from '@/components/ui/Button';
import { plans, product, launchOffer } from '@/content/product';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';

/**
 * Free/Pro plan cards. All pricing, the checkout URL and the launch offer come
 * from `content/product.ts`, so launch-on and launch-off render consistently.
 */
export function PricingPlans({ locale }: { locale: Locale }) {
  const t = translate.bind(null, locale);

  return (
    <div className="grid grid-cols-1 gap-4 dt:grid-cols-2 dt:gap-6">
      {plans.map((plan) => {
        const pro = plan.id === 'pro';
        return (
          <article
            key={plan.id}
            className={`flex flex-col gap-5 rounded-[24px] border p-8 shadow-[0_16px_42px_rgba(29,32,40,0.06)] dt:p-10 ${
              pro ? 'border-neutral bg-neutral text-white' : 'border-line bg-[#f3f6ff]'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className={`text-sm font-semibold ${pro ? 'text-[#9fbaff]' : 'text-primary'}`}>
                {pro ? t('pricing.pro') : t('pricing.free')}
              </span>
              {pro && launchOffer.enabled && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                  {t('pricing.launchOffer')}
                </span>
              )}
            </div>
            <h3 className="text-[24px] font-bold leading-tight dt:text-[30px]">{t(plan.pitch)}</h3>
            <p className={`text-[15px] ${pro ? 'text-neutral-content' : 'text-muted'}`}>
              {t(plan.description)}
            </p>
            {pro ? (
              <div className="flex flex-wrap items-baseline gap-3">
                {product.pricing.showOriginal && (
                  <del className="text-lg text-neutral-content/60">
                    {`$${product.pricing.originalAmount}`}
                  </del>
                )}
                <strong className="text-4xl font-bold">{`$${product.pricing.amount}`}</strong>
                <span className="text-sm text-neutral-content/80">{t('pricing.lifetime')}</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-baseline gap-2">
                <strong className="text-4xl font-bold">$0</strong>
                <span className="text-sm text-muted">{t('pricing.noLicense')}</span>
              </div>
            )}
            <ul className="flex flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature.key} className="flex items-center gap-3 text-[15.5px]">
                  <span className={pro ? 'text-[#9fbaff]' : 'text-primary'}>✓</span>
                  <span>{t(feature.key, feature.values)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2">
              {pro ? (
                <Button
                  href={product.pricing.purchaseURL}
                  locale={locale}
                  placement="pricing_pro"
                  variant="secondary"
                  className="bg-white text-neutral"
                >
                  {t('pricing.cta')}
                </Button>
              ) : (
                <Button locale={locale} placement="pricing_free">
                  {t('home.download')} <span aria-hidden="true">↓</span>
                </Button>
              )}
            </div>
            {pro && launchOffer.enabled && (
              <p className="text-sm text-neutral-content/80">
                {t('pricing.proFootnote', {
                  customers: launchOffer.customerLimit,
                  original: launchOffer.regularAmount,
                })}
              </p>
            )}
            {!pro && <p className="text-sm text-muted">{t('pricing.freeFootnote')}</p>}
          </article>
        );
      })}
    </div>
  );
}
