import { ToolIcon } from '@/components/ToolIcon';
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
import { WindowSwitcher } from '@/components/mockups/WindowSwitcher';
import { DockPreviewVisual } from '@/components/mockups/DockPreviewVisual';
import {
  windowSwitcherCases,
  windowSwitcherFaqs,
  windowSwitcherFlows,
  windowSwitcherRelated,
  windowSwitcherShortcuts,
} from '@/content/window-switcher';
import { translate } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';
import { routeHref } from '@/content/routes';
import { breadcrumbData, faqData } from '@/content/structured-data';
import { product } from '@/content/product';

export function WindowSwitcherPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);
  const homeHref = localePath(locale, '/');
  const featuresHref = routeHref(locale, 'features', '/#tools');
  const permissionHref = localePath(locale, '/install/#permissions');

  const related = windowSwitcherRelated.map((item) => ({
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
            name: t('tool.window-switcher.name'),
            item: `${product.origin}${localePath(locale, '/window-switcher/')}`,
          },
        ])}
      />
      <StructuredData
        data={faqData(
          windowSwitcherFaqs.map((faq) => ({
            question: t(faq.question),
            answer: t(faq.answer),
          })),
        )}
      />
      <main id="main" lang={locale}>
        {/* Hero */}
        <header
          className="text-white"
          style={{
            background: 'linear-gradient(160deg, #0f1d4d 0%, #23307d 55%, #4b2fb8 100%)',
          }}
          data-umami-section="hero"
        >
          <div className="container-page flex flex-col items-start gap-5 py-12 text-left dt:items-center dt:py-16 dt:text-center">
            <div className="w-full">
              <Breadcrumbs
                tone="light"
                items={[
                  { label: t('breadcrumb.home'), href: homeHref },
                  { label: t('nav.features'), href: featuresHref },
                  { label: t('tool.window-switcher.name') },
                ]}
              />
            </div>
            <p className="eyebrow mt-3">{t('window-switcher.hero.eyebrow')}</p>
            <h1 className="h-display max-w-[900px]">{t('window-switcher.hero.title')}</h1>
            <p className="max-w-[720px] text-[17px] leading-[1.55] text-white/80">
              {t('window-switcher.hero.lede')}
            </p>
            <div className="flex w-full flex-col gap-3 dt:w-auto dt:flex-row dt:items-center dt:justify-center dt:gap-7">
              <Button locale={locale} placement="hero" className="w-full dt:w-auto">
                {t('home.download')}
              </Button>
              <a
                href={featuresHref}
                className="text-center text-[17px] font-semibold text-white hover:text-[#dfe7ff]"
              >
                {t('screenshot.hero.explore')} →
              </a>
            </div>
            <p className="text-[14px] text-white/70">
              {t('home.freeNote', { version: product.minimumMacOS })}
            </p>
            <ProductVisual
              id="window-switcher-hero"
              locale={locale}
              priority
              className="mt-4 w-full"
              frameClassName="relative h-[150px] overflow-hidden rounded-[18px] dt:h-[380px] dt:max-w-[1000px] dt:rounded-[24px]"
              cropClassName="absolute left-[-70px] top-1/2 w-[648px] -translate-y-1/2 dt:left-1/2 dt:w-[1000px] dt:-translate-x-1/2"
            >
              <MockupCanvas width={900} height={190}>
                <WindowSwitcher />
              </MockupCanvas>
            </ProductVisual>
          </div>
        </header>

        {/* Flows */}
        <section className="container-page pt-16 dt:pt-[130px]">
          <Flows locale={locale} items={windowSwitcherFlows} />
        </section>

        {/* Dock preview */}
        <section className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[7fr_5fr] dt:items-center dt:gap-14 dt:pt-[130px]">
          <ProductVisual id="dock-preview" locale={locale} className="w-full">
            <MockupCanvas width={600} height={360}>
              <div
                style={{ position: 'relative', width: 600, height: 360 }}
                className="overflow-hidden rounded-[20px] bg-[#f3f6ff]"
              >
                <DockPreviewVisual />
              </div>
            </MockupCanvas>
          </ProductVisual>
          <div className="flex flex-col gap-4">
            <p className="eyebrow">{t('window-switcher.dock.eyebrow')}</p>
            <h2 className="h-section text-[26px] dt:text-[40px]">
              {t('window-switcher.dock.title')}
            </h2>
            <p className="text-[17px] leading-[1.55] text-muted">
              {t('window-switcher.dock.body')}
            </p>
          </div>
        </section>

        {/* Cases */}
        <section className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[5fr_7fr] dt:items-center dt:gap-14 dt:pt-[130px]">
          <h2 className="h-section text-[26px] dt:text-[40px]">
            {t('window-switcher.cases.title')}
          </h2>
          <div className="grid grid-cols-1 gap-4 rounded-[28px] bg-[#f3f6ff] p-6 sm:grid-cols-3">
            {windowSwitcherCases.map((item) => (
              <div key={item.title} className="flex flex-col gap-3 rounded-[18px] bg-white p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf0ff] text-primary">
                  <ToolIcon name={item.icon} size={20} />
                </span>
                <b className="text-[16px]">{t(item.title)}</b>
                <span className="text-[14px] text-muted">{t(item.body)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Shortcuts + permissions */}
        <section className="container-page grid grid-cols-1 gap-5 pt-16 dt:grid-cols-2 dt:pt-[130px]">
          <ShortcutsCard
            locale={locale}
            eyebrow="window-switcher.shortcuts.eyebrow"
            title="window-switcher.shortcuts.title"
            items={windowSwitcherShortcuts}
          />
          <div className="flex flex-col gap-4 rounded-[28px] bg-neutral p-8 text-white dt:p-10">
            <p className="eyebrow">{t('window-switcher.permissions.eyebrow')}</p>
            <h2 className="text-[26px] font-bold leading-tight dt:text-[32px]">
              {t('window-switcher.permissions.title')}
            </h2>
            <p className="text-[15.5px] leading-[1.6] text-neutral-content">
              {t('window-switcher.permissions.body')}
            </p>
            <a href={permissionHref} className="text-[15.5px] font-semibold text-white">
              {t('screenshot.permissions.link')} →
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="container-page grid grid-cols-1 gap-8 pt-16 dt:grid-cols-[4fr_8fr] dt:gap-16 dt:pt-[130px]"
          id="faq"
          aria-labelledby="window-switcher-faq"
        >
          <h2 id="window-switcher-faq" className="h-section text-[28px] dt:text-[36px]">
            {t('window-switcher.faq.title')}
          </h2>
          <Faq locale={locale} id="window-switcher" items={windowSwitcherFaqs} />
        </section>

        {/* Related */}
        <section
          className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[4fr_8fr] dt:gap-16 dt:pt-[110px]"
          data-umami-section="window-switcher-related"
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
        title={t('window-switcher.cta.title')}
        secondaryLabel={t('screenshot.hero.explore')}
        secondaryHref={featuresHref}
      />
    </>
  );
}
