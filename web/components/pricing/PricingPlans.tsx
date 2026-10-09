import { Check, Coffee, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DonationLink } from '@/components/DonationLink';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import { product } from '@/content/product';

/** Free app and optional support, shared by Home and the existing pricing URL. */
export function PricingPlans({
  locale,
  compactOnMobile = false,
}: {
  locale: Locale;
  compactOnMobile?: boolean;
}) {
  const t = translate.bind(null, locale);
  const features = [
    ['pricing.compare.screenshots', undefined],
    ['pricing.compare.clipboard', { count: product.maximumHistory }],
    ['pricing.compare.customize', undefined],
    ['pricing.compare.ocr', undefined],
    ['donation.features.utilities', undefined],
    ['pricing.compare.dimming', undefined],
    ['donation.features.monitor', undefined],
  ] as const;
  return (
    <div
      className={`support-plans grid grid-cols-1 gap-6 md:grid-cols-2 dt:grid-cols-3 ${compactOnMobile ? 'support-plans-compact' : ''}`}
    >
      <article className="card min-w-0 rounded-xl bg-base-200 shadow-none">
        <div className="card-body gap-4 p-6 [&_p]:grow-0 dt:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="card-title flex-wrap gap-1.5 text-lg">
              {t('donation.community')}
              {compactOnMobile && (
                <span className="support-mobile-price">
                  · <span>$0</span>
                </span>
              )}
            </h3>
            <span className="support-desktop-detail badge badge-sm badge-ghost h-auto whitespace-normal text-muted">
              {t('donation.forever')}
            </span>
          </div>
          <p className="support-desktop-detail support-community-price text-[2rem] leading-tight font-semibold tracking-tight">
            $0
          </p>
          <p className="support-desktop-detail text-sm text-muted">{t('donation.communityBody')}</p>
          {compactOnMobile && (
            <p className="support-mobile-copy text-sm text-muted">
              {t('donation.mobileCommunityBody')}
            </p>
          )}
          <ul className="support-desktop-detail space-y-2.5 text-sm text-muted">
            {features.map(([key, values]) => (
              <li key={key} className="flex items-start gap-2">
                <Check size={17} className="mt-0.5 shrink-0 text-base-content" aria-hidden="true" />
                {t(key, values)}
              </li>
            ))}
          </ul>
          <div className="card-actions mt-auto w-full flex-col pt-3">
            <Button
              locale={locale}
              placement="pricing_free"
              className="support-download-button w-full rounded-xl"
            >
              {t('home.download')} ↓
            </Button>
            <p className="support-desktop-detail min-h-12 pt-3 text-xs text-muted">
              {t('pricing.freeFootnote')}
            </p>
          </div>
        </div>
      </article>
      <article className="card min-w-0 rounded-xl bg-base-200 shadow-none">
        <div className="card-body gap-4 p-6 [&_p]:grow-0 dt:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="card-title flex-wrap gap-1.5 text-lg">
              <Heart
                size={17}
                className="support-desktop-detail text-error"
                fill="currentColor"
                aria-hidden="true"
              />
              {t('donation.supporter')}
              {compactOnMobile && (
                <span className="support-mobile-price">· {t('donation.payWhatYouWant')}</span>
              )}
            </h3>
            <span className="support-desktop-detail badge badge-sm badge-ghost h-auto whitespace-normal text-muted">
              {t('donation.voluntary')}
            </span>
          </div>
          <p className="support-desktop-detail text-[2rem] leading-tight font-semibold tracking-tight">
            {t('donation.payWhatYouWant')}
          </p>
          <span className="support-frequency badge badge-sm badge-ghost h-auto self-start whitespace-normal text-muted">
            {t('donation.frequency')}
          </span>
          <p className="text-sm text-muted">{t('donation.body')}</p>
          <ul className="support-desktop-detail space-y-2.5 text-sm text-muted">
            {(
              [
                'donation.thanks',
                'donation.sameApp',
                'donation.improvements',
                'donation.costs',
                'donation.independent',
              ] as const
            ).map((key) => (
              <li key={key} className="flex items-start gap-2">
                <Check size={17} className="mt-0.5 shrink-0 text-base-content" aria-hidden="true" />
                {t(key)}
              </li>
            ))}
          </ul>
          <div className="support-desktop-detail card-actions mt-auto w-full flex-col pt-3">
            <DonationLink
              locale={locale}
              placement="free_support"
              className="btn support-kofi-button w-full max-w-full rounded-xl whitespace-normal"
            >
              {t('donation.cta')}
            </DonationLink>
            <p className="min-h-12 pt-3 text-xs text-muted">{t('donation.supportFootnote')}</p>
          </div>
        </div>
      </article>
      <article className="support-direct-card card min-w-0 rounded-xl bg-base-200 shadow-none md:col-span-2 dt:col-span-1">
        <div className="card-body gap-4 p-6 [&_p]:grow-0 dt:p-8">
          <h3 className="card-title gap-2 text-lg">
            <Coffee
              size={17}
              className={compactOnMobile ? 'hidden' : 'text-error'}
              aria-hidden="true"
            />
            {t('donation.directTitle')}
          </h3>
          <p className="text-sm text-muted">{t('donation.directBody')}</p>
          <div className="relative min-h-[380px] flex-1">
            <div
              className="kofi-panel-scroll absolute inset-0 overflow-y-auto overscroll-contain rounded-md border border-line bg-base-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              role="region"
              aria-label={t('donation.widgetTitle')}
              tabIndex={0}
            >
              <iframe
                id="kofiframe"
                src={`${product.donationURL}/?hidefeed=true&widget=true&embed=true&preview=true`}
                title={t('donation.widgetTitle')}
                loading="lazy"
                height="712"
                className="block w-full border-none bg-base-100 p-1"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="payment"
              />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
