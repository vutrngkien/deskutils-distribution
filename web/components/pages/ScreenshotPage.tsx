import { Copy, PencilLine, Pin, Save, Trash2, X, type LucideIcon } from 'lucide-react';
import { ToolIcon } from '@/components/ToolIcon';
import { StructuredData } from '@/components/StructuredData';
import { ProductVisual } from '@/components/media/ProductVisual';
import { DemoMedia } from '@/components/DemoMedia';
import { Button } from '@/components/ui/Button';
import { FinalCta } from '@/components/layout/FinalCta';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Faq } from '@/components/ui/Faq';
import { PermissionsGrid } from '@/components/sections/PermissionsGrid';
import { RelatedGuides } from '@/components/sections/RelatedGuides';
import { RelatedTools } from '@/components/sections/RelatedTools';
import { MockupCanvas } from '@/components/mockups/MockupCanvas';
import { ScreenshotStage } from '@/components/mockups/ScreenshotStage';
import { ScreenshotModes } from '@/components/features/screenshot/ScreenshotModes';
import {
  PinnedScreenshotVisual,
  ScreenshotHistoryVisual,
  ScrollingCaptureVisual,
} from '@/components/mockups/ScreenshotVisuals';
import {
  screenshotFaqs,
  screenshotModes,
  screenshotPermissions,
  screenshotQuickAccess,
  screenshotRelated,
  screenshotTools,
} from '@/content/screenshot';
import { translate } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';
import { routeHref } from '@/content/routes';
import { breadcrumbData, faqData } from '@/content/structured-data';
import { demos, product } from '@/content/product';

const quickAccessIcons: Record<string, LucideIcon> = {
  copy: Copy,
  save: Save,
  edit: PencilLine,
  pin: Pin,
  delete: Trash2,
  dismiss: X,
};

export function ScreenshotPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);

  const homeHref = localePath(locale, '/');
  const featuresHref = routeHref(locale, 'features', '/#tools');
  const permissionHref = localePath(locale, '/install/#permissions');

  const modes = screenshotModes.map((mode) => ({
    id: mode.id,
    icon: mode.icon,
    keys: mode.keys,
    name: t(mode.name),
    body: t(mode.body),
  }));

  const related = screenshotRelated.map((item) => ({
    ...item,
    href: routeHref(locale, item.id, '/#tools'),
  }));

  const crumbs = [
    { name: t('breadcrumb.home'), item: `${product.origin}${homeHref}` },
    { name: t('nav.features'), item: `${product.origin}${featuresHref}` },
    {
      name: t('tool.screenshot.name'),
      item: `${product.origin}${localePath(locale, '/screenshot/')}`,
    },
  ];

  return (
    <>
      <StructuredData data={breadcrumbData(crumbs)} />
      <StructuredData
        data={faqData(
          screenshotFaqs.map((faq) => ({
            question: t(faq.question),
            answer: t(faq.answer),
          })),
        )}
      />
      <main id="main" lang={locale}>
        {/* Hero */}
        <header
          className="container-page flex flex-col items-start gap-5 pt-10 text-left dt:items-center dt:text-center"
          data-umami-section="hero"
        >
          <div className="w-full max-w-[1100px]">
            <Breadcrumbs
              items={[
                { label: t('breadcrumb.home'), href: homeHref },
                { label: t('nav.features'), href: featuresHref },
                { label: t('tool.screenshot.name') },
              ]}
            />
          </div>
          <p className="eyebrow mt-3">{t('tool.screenshot.name')}</p>
          <h1 className="h-display max-w-[880px]">{t('screenshot.hero.title')}</h1>
          <p className="lede max-w-[720px]">{t('screenshot.hero.lede')}</p>
          <div className="flex w-full flex-col gap-3 dt:w-auto dt:flex-row dt:items-center dt:justify-center dt:gap-7">
            <Button locale={locale} placement="hero" className="w-full dt:w-auto">
              {t('home.download')}
            </Button>
            <a
              href={featuresHref}
              className="text-center text-[17px] font-semibold text-base-content hover:text-primary"
            >
              {t('screenshot.hero.explore')} →
            </a>
          </div>
          <p className="text-[14px] text-muted">
            {t('home.freeNote', { version: product.minimumMacOS })}
          </p>
          <ProductVisual
            id="screenshot-hero"
            locale={locale}
            priority
            className="mt-9 w-full"
            frameClassName="rounded-none! border-0! bg-transparent! dt:max-w-[1100px]"
          >
            <MockupCanvas width={1000} height={640}>
              <ScreenshotStage />
            </MockupCanvas>
          </ProductVisual>
        </header>

        {/* Capture modes */}
        <ScreenshotModes
          locale={locale}
          eyebrow={t('screenshot.modes.eyebrow')}
          title={t('screenshot.modes.title')}
          body={t('screenshot.modes.body')}
          items={modes}
        />

        {/* Annotate */}
        <section
          className="container-page flex flex-col gap-10 pt-16 dt:pt-[130px]"
          aria-labelledby="screenshot-annotate"
          data-umami-section="screenshot-annotate"
        >
          <div className="grid grid-cols-1 gap-6 dt:grid-cols-[7fr_5fr] dt:items-end dt:gap-14">
            <h2 id="screenshot-annotate" className="h-section text-[30px] dt:text-[46px]">
              {t('screenshot.annotate.title')}
            </h2>
            <p className="text-[17px] leading-[1.55] text-muted">{t('screenshot.annotate.lede')}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 dt:grid-cols-[8fr_4fr] dt:items-center dt:gap-10">
            <div className="hidden w-full dt:block [&_img]:object-cover! [&_video]:object-cover!">
              <DemoMedia
                demo={{ ...demos.screenshot, mockup: false, aspectRatio: '1000 / 640' }}
                caption={false}
                locale={locale}
              />
            </div>
            <div className="flex flex-col">
              {screenshotTools.map((tool) => (
                <div key={tool.name} className="flex items-start gap-3.5 py-3">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-[11px] bg-[#f3f6ff] text-primary">
                    <ToolIcon name={tool.icon} size={21} />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <h3 className="text-[16.5px] font-semibold">{t(tool.name)}</h3>
                    <span className="text-[14.5px] leading-[1.45] text-muted">{t(tool.body)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Access */}
        <section
          className="section-dark mt-16 dt:mt-[130px]"
          data-umami-section="quick-access"
          aria-labelledby="screenshot-quick-access"
        >
          <div className="container-page grid grid-cols-1 gap-10 py-14 dt:grid-cols-[5fr_7fr] dt:items-center dt:gap-16 dt:py-24">
            <div className="flex flex-col gap-5">
              <p className="eyebrow">{t('screenshot.quickAccess.eyebrow')}</p>
              <h2 id="screenshot-quick-access" className="h-section text-[28px] dt:text-[44px]">
                {t('screenshot.quickAccess.title')}
              </h2>
              <p className="lede">{t('screenshot.quickAccess.body')}</p>
              <ul className="flex flex-wrap gap-2">
                {screenshotQuickAccess.map((action) => {
                  const Icon = quickAccessIcons[action.id];
                  return (
                    <li
                      key={action.id}
                      className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-[14.5px] font-medium text-white/90"
                    >
                      <Icon size={17} aria-hidden="true" className="text-[#9fbaff]" />
                      {t(action.label)}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="w-full [&_img]:object-cover! [&_video]:object-cover!">
              <DemoMedia demo={demos.quickAccess} caption={false} locale={locale} />
            </div>
          </div>
        </section>

        {/* Scrolling capture */}
        <section
          className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[5fr_7fr] dt:items-center dt:gap-16 dt:pt-[130px]"
          aria-labelledby="screenshot-scrolling"
          data-umami-section="screenshot-scrolling"
        >
          <div className="flex flex-col gap-5">
            <p className="eyebrow">{t('screenshot.scrolling.eyebrow')}</p>
            <h2 id="screenshot-scrolling" className="h-section text-[28px] dt:text-[44px]">
              {t('screenshot.scrolling.title')}
            </h2>
            <p className="text-[17px] leading-[1.55] text-muted">
              {t('screenshot.scrolling.body')}
            </p>
          </div>
          <ProductVisual
            id="screenshot-scrolling"
            locale={locale}
            className="mx-auto w-full max-w-[520px]"
          >
            <MockupCanvas width={600} height={900}>
              <div style={{ position: 'relative', width: 600, height: 900 }}>
                <ScrollingCaptureVisual />
              </div>
            </MockupCanvas>
          </ProductVisual>
        </section>

        {/* History + Pin */}
        <section
          className="container-page grid grid-cols-1 gap-5 pt-16 dt:grid-cols-2 dt:pt-[130px]"
          data-umami-section="screenshot-cards"
        >
          <article className="flex flex-col gap-3.5 rounded-[28px] bg-[#f3f6ff] p-8 dt:p-10">
            <p className="eyebrow">{t('screenshot.history.eyebrow')}</p>
            <h2 className="h-section text-[24px] dt:text-[32px]">
              {t('screenshot.history.title')}
            </h2>
            <p className="text-[16px] leading-[1.55] text-muted">{t('screenshot.history.body')}</p>
            <ProductVisual id="screenshot-history" locale={locale} className="mt-3 w-full">
              <MockupCanvas width={600} height={380}>
                <div style={{ position: 'relative', width: 600, height: 380 }}>
                  <ScreenshotHistoryVisual />
                </div>
              </MockupCanvas>
            </ProductVisual>
          </article>
          <article className="flex flex-col gap-3.5 rounded-[28px] bg-[#efeaff] p-8 dt:p-10">
            <p className="eyebrow text-accent">{t('screenshot.pin.eyebrow')}</p>
            <h2 className="h-section text-[24px] dt:text-[32px]">{t('screenshot.pin.title')}</h2>
            <p className="text-[16px] leading-[1.55] text-[#4a4672]">{t('screenshot.pin.body')}</p>
            <ProductVisual id="screenshot-pin" locale={locale} className="mt-3 w-full">
              <MockupCanvas width={600} height={380}>
                <div style={{ position: 'relative', width: 600, height: 380 }}>
                  <PinnedScreenshotVisual />
                </div>
              </MockupCanvas>
            </ProductVisual>
          </article>
        </section>

        {/* Permissions */}
        <section className="container-page flex flex-col gap-9 pt-16 dt:pt-[130px]">
          <div className="flex max-w-[760px] flex-col gap-3">
            <p className="eyebrow">{t('screenshot.permissions.eyebrow')}</p>
            <h2 className="h-section text-[28px] dt:text-[44px]">
              {t('screenshot.permissions.title')}
            </h2>
            <p className="text-[17px] leading-[1.55] text-muted">
              {t('screenshot.permissions.body')}
            </p>
          </div>
          <PermissionsGrid
            locale={locale}
            items={screenshotPermissions}
            linkHref={permissionHref}
            linkLabel={t('screenshot.permissions.link')}
          />
        </section>

        {/* FAQ */}
        <section
          className="container-page grid grid-cols-1 gap-8 pt-16 dt:grid-cols-[4fr_8fr] dt:gap-16 dt:pt-[130px]"
          id="faq"
          aria-labelledby="screenshot-faq"
        >
          <h2 id="screenshot-faq" className="h-section text-[28px] dt:text-[36px]">
            {t('screenshot.faq.title')}
          </h2>
          <Faq locale={locale} id="screenshot" items={screenshotFaqs} />
        </section>

        {/* Related */}
        <section
          className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[4fr_8fr] dt:gap-16 dt:pt-[110px]"
          data-umami-section="screenshot-related"
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
        title={t('screenshot.cta.title')}
        secondaryLabel={t('screenshot.hero.explore')}
        secondaryHref={featuresHref}
      />
    </>
  );
}
