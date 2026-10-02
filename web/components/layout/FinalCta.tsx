import type { Locale } from '@/content/locales';
import { translate } from '@/content/i18n';
import { product } from '@/content/product';
import { routeHref } from '@/content/routes';
import { Button } from '@/components/ui/Button';

export function FinalCta({ locale, title }: { locale: Locale; title?: string }) {
  const t = translate.bind(null, locale);

  return (
    <section className="container-page home-final-cta" data-testid="final-cta">
      <div
        className="cta-band flex flex-col items-center gap-6 px-6 py-20 text-center dt:px-10 dt:py-24"
        style={{
          background:
            'radial-gradient(60% 90% at 50% 0%, #2f6bff 0%, rgba(47,107,255,0) 70%), #0b1f5c',
        }}
      >
        <img
          src="/assets/images/deskutils-icon.webp"
          alt=""
          width="96"
          height="96"
          className="home-cta-icon rounded-[22px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]"
        />
        <h2 className="max-w-[760px]">{title ?? t('cta.title')}</h2>
        <div className="home-cta-actions">
          <Button locale={locale} placement="cta" className="home-primary">
            {t('cta.download')}
          </Button>
          <a
            className="text-[17px] font-semibold text-white hover:text-[#dfe7ff]"
            href={routeHref(locale, 'pricing', '/#pricing')}
          >
            {t('nav.pricing')} →
          </a>
        </div>
        <p className="home-cta-note">{t('footer.requires', { version: product.minimumMacOS })}</p>
      </div>
    </section>
  );
}
