import { Copy } from 'lucide-react';
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
import { ColorPickerPanel } from '@/components/mockups/ColorPickerPanel';
import {
  colorPickerFaqs,
  colorPickerFlows,
  colorPickerFormats,
  colorPickerRelated,
  colorPickerShortcuts,
  colorPickerSwatches,
} from '@/content/color-picker';
import { translate } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';
import { routeHref } from '@/content/routes';
import { breadcrumbData, faqData } from '@/content/structured-data';
import { product } from '@/content/product';

export function ColorPickerPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);
  const homeHref = localePath(locale, '/');
  const featuresHref = routeHref(locale, 'features', '/#tools');
  const permissionHref = localePath(locale, '/install/#permissions');

  const related = colorPickerRelated.map((item) => ({
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
            name: t('tool.color-picker.name'),
            item: `${product.origin}${localePath(locale, '/color-picker/')}`,
          },
        ])}
      />
      <StructuredData
        data={faqData(
          colorPickerFaqs.map((faq) => ({
            question: t(faq.question),
            answer: t(faq.answer),
          })),
        )}
      />
      <main id="main" lang={locale}>
        {/* Hero */}
        <header className="container-page pt-6 dt:pt-10" data-umami-section="hero">
          <div
            className="grid grid-cols-1 gap-10 rounded-[32px] p-8 text-white dt:grid-cols-[6fr_6fr] dt:items-center dt:p-14"
            style={{
              background:
                'radial-gradient(60% 90% at 85% 20%, #f25c9b 0%, rgba(242,92,155,0) 55%), radial-gradient(70% 90% at 10% 100%, #ff9a6b 0%, rgba(255,154,107,0) 55%), #4b5cff',
            }}
          >
            <div className="flex flex-col gap-5">
              <Breadcrumbs
                tone="light"
                items={[
                  { label: t('breadcrumb.home'), href: homeHref },
                  { label: t('nav.features'), href: featuresHref },
                  { label: t('tool.color-picker.name') },
                ]}
              />
              <p className="eyebrow text-white/80">{t('color-picker.hero.eyebrow')}</p>
              <h1 className="h-display text-[36px] dt:text-[56px]">
                {t('color-picker.hero.title')}
              </h1>
              <p className="max-w-[520px] text-[17px] leading-[1.55] text-white/85">
                {t('color-picker.hero.lede')}
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <Button locale={locale} placement="hero">
                  {t('home.download')}
                </Button>
                <a
                  href={featuresHref}
                  className="text-[17px] font-semibold text-white hover:text-[#ffe3ef]"
                >
                  {t('screenshot.hero.explore')} →
                </a>
              </div>
              <p className="text-[14px] text-white/70">
                {t('home.freeNote', { version: product.minimumMacOS })}
              </p>
            </div>
            <div className="flex flex-col items-center gap-5">
              <ProductVisual
                id="color-picker-panel"
                locale={locale}
                className="w-[300px] max-w-full overflow-visible! rounded-none! border-0! bg-transparent!"
              >
                <MockupCanvas width={340} height={330}>
                  <ColorPickerPanel />
                </MockupCanvas>
              </ProductVisual>
              <div className="flex flex-wrap justify-center gap-2">
                {colorPickerSwatches.map((swatch) => (
                  <span
                    key={swatch.hex}
                    className="flex items-center gap-2 rounded-full bg-white/15 py-1.5 pl-1.5 pr-3 font-mono text-[12px] text-white"
                  >
                    <span
                      className="h-5 w-5 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.5)]"
                      style={{ background: swatch.hex }}
                    />
                    {swatch.hex}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Flows */}
        <section
          data-umami-section="color-picker-flow"
          className="container-page pt-16 dt:pt-[130px]"
        >
          <Flows locale={locale} tone="lavender" items={colorPickerFlows} />
        </section>

        {/* Formats */}
        <section
          data-umami-section="color-picker-formats"
          className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[5fr_7fr] dt:items-center dt:gap-14 dt:pt-[130px]"
        >
          <div className="flex flex-col gap-4">
            <h2 className="h-section text-[26px] dt:text-[40px]">
              {t('color-picker.formats.title')}
            </h2>
          </div>
          <div className="flex flex-col gap-3 rounded-[24px] bg-[#f6f4ff] p-6">
            {colorPickerFormats.map((format) => (
              <div key={format.code} className="flex items-center gap-4 rounded-field bg-white p-4">
                <span className="w-12 text-[14px] font-bold text-accent">{format.code}</span>
                <span className="flex-1 font-mono text-[15px] text-base-content">
                  {format.value}
                </span>
                <span className="hidden flex-1 text-[14px] text-muted sm:block">
                  {t(format.body)}
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#efeaff] text-accent">
                  <Copy size={16} aria-hidden="true" />
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Recent colors */}
        <section
          data-umami-section="color-picker-recent"
          className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[7fr_5fr] dt:items-center dt:gap-14 dt:pt-[130px]"
        >
          <div className="flex flex-wrap gap-4 rounded-[28px] bg-neutral p-8 dt:p-10">
            {colorPickerSwatches.map((swatch) => (
              <span key={swatch.hex} className="flex flex-col items-center gap-2">
                <span
                  className="h-16 w-16 rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.15)]"
                  style={{ background: swatch.hex }}
                />
                <span className="font-mono text-[11px] text-neutral-content">{swatch.hex}</span>
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <p className="eyebrow">{t('color-picker.recent.eyebrow')}</p>
            <h2 className="h-section text-[26px] dt:text-[40px]">
              {t('color-picker.recent.title')}
            </h2>
            <p className="text-[17px] leading-[1.55] text-muted">{t('color-picker.recent.body')}</p>
          </div>
        </section>

        {/* Permissions + shortcuts */}
        <section
          data-umami-section="color-picker-permissions"
          className="container-page grid grid-cols-1 gap-5 pt-16 dt:grid-cols-2 dt:pt-[130px]"
        >
          <div className="flex flex-col gap-4 rounded-[28px] bg-[#eaf0ff] p-8 dt:p-10">
            <p className="eyebrow">{t('color-picker.permissions.eyebrow')}</p>
            <h2 className="text-[26px] font-bold leading-tight dt:text-[32px]">
              {t('color-picker.permissions.title')}
            </h2>
            <p className="text-[15.5px] leading-[1.6] text-muted">
              {t('color-picker.permissions.body')}
            </p>
            <a href={permissionHref} className="text-[15.5px] font-semibold text-primary">
              {t('screenshot.permissions.link')} →
            </a>
          </div>
          <ShortcutsCard
            locale={locale}
            eyebrow="color-picker.shortcuts.eyebrow"
            title="color-picker.shortcuts.title"
            items={colorPickerShortcuts}
          />
        </section>

        {/* FAQ */}
        <section
          data-umami-section="color-picker-faq"
          className="container-page grid grid-cols-1 gap-8 pt-16 dt:grid-cols-[4fr_8fr] dt:gap-16 dt:pt-[130px]"
          id="faq"
          aria-labelledby="color-picker-faq"
        >
          <h2 id="color-picker-faq" className="h-section text-[28px] dt:text-[36px]">
            {t('color-picker.faq.title')}
          </h2>
          <Faq locale={locale} id="color-picker" items={colorPickerFaqs} />
        </section>

        {/* Related */}
        <section
          className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[4fr_8fr] dt:gap-16 dt:pt-[110px]"
          data-umami-section="color-picker-related"
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
        title={t('color-picker.cta.title')}
        secondaryLabel={t('screenshot.hero.explore')}
        secondaryHref={featuresHref}
      />
    </>
  );
}
