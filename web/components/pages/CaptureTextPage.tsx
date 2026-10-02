import { ShieldCheck } from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { ProductVisual } from '@/components/media/ProductVisual';
import { Button } from '@/components/ui/Button';
import { FinalCta } from '@/components/layout/FinalCta';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Faq } from '@/components/ui/Faq';
import { Flows } from '@/components/sections/Flows';
import { ShortcutsCard } from '@/components/sections/ShortcutsCard';
import { RelatedGuides } from '@/components/sections/RelatedGuides';
import { RelatedTools } from '@/components/sections/RelatedTools';
import { MockupCanvas } from '@/components/mockups/MockupCanvas';
import { CaptureTextScene } from '@/components/mockups/CaptureTextScene';
import { QrCodeVisual } from '@/components/mockups/QrCodeVisual';
import {
  captureTextFaqs,
  captureTextFlows,
  captureTextRelated,
  captureTextShortcuts,
} from '@/content/capture-text';
import { translate } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';
import { routeHref } from '@/content/routes';
import { breadcrumbData, faqData } from '@/content/structured-data';
import { product } from '@/content/product';

export function CaptureTextPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);
  const homeHref = localePath(locale, '/');
  const featuresHref = routeHref(locale, 'features', '/#tools');
  const permissionHref = localePath(locale, '/install/#permissions');

  const related = captureTextRelated.map((item) => ({
    ...item,
    href: routeHref(locale, item.id, '/#tools'),
  }));

  return (
    <>
      <StructuredData
        data={breadcrumbData([
          { name: t('breadcrumb.home'), item: `${product.origin}${homeHref}` },
          { name: t('nav.features'), item: `${product.origin}${featuresHref}` },
          {
            name: t('tool.capture-text.name'),
            item: `${product.origin}${localePath(locale, '/capture-text/')}`,
          },
        ])}
      />
      <StructuredData
        data={faqData(
          captureTextFaqs.map((faq) => ({
            question: t(faq.question),
            answer: t(faq.answer),
          })),
        )}
      />
      <main id="main" lang={locale}>
        {/* Hero */}
        <header
          className="container-page grid grid-cols-1 gap-10 pt-10 dt:grid-cols-2 dt:items-end dt:gap-14"
          style={{
            background: 'radial-gradient(60% 60% at 15% 0%, #eef3ff 0%, rgba(238,243,255,0) 70%)',
          }}
          data-umami-section="hero"
        >
          <div className="flex flex-col gap-5">
            <Breadcrumbs
              items={[
                { label: t('breadcrumb.home'), href: homeHref },
                { label: t('nav.features'), href: featuresHref },
                { label: t('tool.capture-text.name') },
              ]}
            />
            <p className="eyebrow mt-2">{t('capture-text.hero.eyebrow')}</p>
            <h1 className="h-display text-[36px] dt:text-[52px]">{t('capture-text.hero.title')}</h1>
          </div>
          <div className="flex flex-col gap-5">
            <p className="lede">{t('capture-text.hero.lede')}</p>
            <div className="flex flex-wrap items-center gap-6">
              <Button locale={locale} placement="hero">
                {t('home.download')}
              </Button>
              <a
                href={featuresHref}
                className="text-[17px] font-semibold text-base-content hover:text-primary"
              >
                {t('screenshot.hero.explore')} →
              </a>
            </div>
            <p className="text-[14px] text-muted">
              {t('home.freeNote', { version: product.minimumMacOS })}
            </p>
          </div>
          <div className="rounded-[28px] bg-[#eef3ff] p-6 dt:col-span-2">
            <ProductVisual id="capture-text-scene" locale={locale} className="w-full">
              <MockupCanvas width={715} height={306}>
                <CaptureTextScene />
              </MockupCanvas>
            </ProductVisual>
          </div>
        </header>

        {/* Flows */}
        <section className="container-page pt-16 dt:pt-[130px]">
          <Flows locale={locale} items={captureTextFlows} />
        </section>

        {/* QR */}
        <section className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[5fr_7fr] dt:items-center dt:gap-14 dt:pt-[130px]">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">{t('capture-text.qr.eyebrow')}</p>
            <h2 className="h-section text-[26px] dt:text-[40px]">{t('capture-text.qr.title')}</h2>
            <p className="text-[17px] leading-[1.55] text-muted">{t('capture-text.qr.body')}</p>
          </div>
          <div
            className="overflow-hidden rounded-[28px] p-8"
            style={{
              background: 'radial-gradient(80% 80% at 80% 0%, #efeaff 0%, #f6f4ff 70%)',
            }}
          >
            <MockupCanvas width={600} height={260}>
              <div style={{ position: 'relative', width: 600, height: 260 }}>
                <div className="flex h-full items-center justify-center">
                  <QrCodeVisual />
                </div>
              </div>
            </MockupCanvas>
          </div>
        </section>

        {/* Privacy + shortcuts */}
        <section className="container-page grid grid-cols-1 gap-5 pt-16 dt:grid-cols-2 dt:pt-[130px]">
          <div className="flex flex-col gap-4 rounded-[28px] bg-neutral p-8 text-white dt:p-10">
            <p className="eyebrow">{t('capture-text.privacy.eyebrow')}</p>
            <h2 className="text-[26px] font-bold leading-tight dt:text-[32px]">
              {t('capture-text.privacy.title')}
            </h2>
            <p className="text-[15.5px] leading-[1.6] text-neutral-content">
              {t('capture-text.privacy.body')}
            </p>
            <a
              href={permissionHref}
              className="inline-flex items-center gap-2 text-[15.5px] font-semibold text-white"
            >
              <ShieldCheck size={17} aria-hidden="true" />
              {t('screenshot.permissions.link')} →
            </a>
          </div>
          <ShortcutsCard
            locale={locale}
            eyebrow="capture-text.shortcuts.eyebrow"
            title="capture-text.shortcuts.title"
            items={captureTextShortcuts}
          />
        </section>

        {/* FAQ */}
        <section
          className="container-page grid grid-cols-1 gap-8 pt-16 dt:grid-cols-[4fr_8fr] dt:gap-16 dt:pt-[130px]"
          id="faq"
          aria-labelledby="capture-text-faq"
        >
          <h2 id="capture-text-faq" className="h-section text-[28px] dt:text-[36px]">
            {t('capture-text.faq.title')}
          </h2>
          <Faq locale={locale} id="capture-text" items={captureTextFaqs} />
        </section>

        {/* Related */}
        <section
          className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[4fr_8fr] dt:gap-16 dt:pt-[110px]"
          data-umami-section="capture-text-related"
        >
          <RelatedGuides locale={locale} installHref={localePath(locale, '/install/')} />
          <div className="flex flex-col gap-3.5">
            <h2 className="text-[28px] font-bold tracking-[-0.03em]">
              {t('screenshot.related.title')}
            </h2>
            <RelatedTools locale={locale} items={related} />
          </div>
        </section>
      </main>
      <FinalCta
        locale={locale}
        title={t('capture-text.cta.title')}
        secondaryLabel={t('screenshot.hero.explore')}
        secondaryHref={featuresHref}
      />
    </>
  );
}
