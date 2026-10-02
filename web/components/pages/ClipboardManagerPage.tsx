import { Accessibility, Link2, Wifi } from 'lucide-react';
import { ToolIcon } from '@/components/ToolIcon';
import { StructuredData } from '@/components/StructuredData';
import { ProductVisual } from '@/components/media/ProductVisual';
import { Button } from '@/components/ui/Button';
import { FinalCta } from '@/components/layout/FinalCta';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Faq } from '@/components/ui/Faq';
import { Flows } from '@/components/sections/Flows';
import { RelatedGuides } from '@/components/sections/RelatedGuides';
import { RelatedTools } from '@/components/sections/RelatedTools';
import { MockupCanvas } from '@/components/mockups/MockupCanvas';
import { ClipboardPanel } from '@/components/mockups/ClipboardPanel';
import {
  clipboardFaqs,
  clipboardFilters,
  clipboardFlows,
  clipboardPrivacy,
  clipboardRelated,
} from '@/content/clipboard-manager';
import { translate } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';
import { routeHref } from '@/content/routes';
import { breadcrumbData, faqData } from '@/content/structured-data';
import { product } from '@/content/product';

const privacyIcons = [Wifi, Link2, Accessibility];

function ClipboardVisual({ locale, className = '' }: { locale: Locale; className?: string }) {
  return (
    <ProductVisual id="clipboard" locale={locale} className={className}>
      <MockupCanvas width={840} height={520}>
        <ClipboardPanel />
      </MockupCanvas>
    </ProductVisual>
  );
}

export function ClipboardManagerPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);
  const homeHref = localePath(locale, '/');
  const featuresHref = routeHref(locale, 'features', '/#tools');
  const permissionHref = localePath(locale, '/install/#permissions');

  const related = clipboardRelated.map((item) => ({
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
            name: t('tool.clipboard-manager.name'),
            item: `${product.origin}${localePath(locale, '/clipboard-manager/')}`,
          },
        ])}
      />
      <StructuredData
        data={faqData(
          clipboardFaqs.map((faq) => ({
            question: t(faq.question),
            answer: t(faq.answer),
          })),
        )}
      />
      <main id="main" lang={locale}>
        {/* Hero */}
        <header
          className="bg-neutral text-white"
          style={{
            background:
              'radial-gradient(70% 90% at 85% 10%, rgba(47,107,255,0.55), rgba(47,107,255,0) 60%), #0b1f5c',
          }}
          data-umami-section="hero"
        >
          <div className="container-page grid grid-cols-1 gap-10 py-12 dt:grid-cols-[42fr_58fr] dt:items-center dt:gap-14 dt:py-16">
            <div className="flex flex-col gap-5">
              <Breadcrumbs
                tone="light"
                items={[
                  { label: t('breadcrumb.home'), href: homeHref },
                  { label: t('nav.features'), href: featuresHref },
                  { label: t('tool.clipboard-manager.name') },
                ]}
              />
              <p className="eyebrow">{t('clipboard-manager.hero.eyebrow')}</p>
              <h1 className="h-display text-[38px] dt:text-[56px]">
                {t('clipboard-manager.hero.title')}
              </h1>
              <p className="lede max-w-[560px] text-[#c9d6f5]">
                {t('clipboard-manager.hero.lede')}
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <Button locale={locale} placement="hero">
                  {t('home.download')}
                </Button>
                <a
                  href={featuresHref}
                  className="text-[17px] font-semibold text-white hover:text-[#dfe7ff]"
                >
                  {t('screenshot.hero.explore')} →
                </a>
              </div>
              <p className="text-[14px] text-white/70">
                {t('home.freeNote', { version: product.minimumMacOS })}
              </p>
            </div>
            <div className="rounded-[28px] bg-white/5 p-4 backdrop-blur">
              <ProductVisual id="clipboard" locale={locale} className="w-full">
                <MockupCanvas width={840} height={520}>
                  <ClipboardPanel />
                </MockupCanvas>
              </ProductVisual>
            </div>
          </div>
        </header>

        {/* Flows */}
        <section className="container-page flex flex-col gap-8 pt-16 dt:pt-[130px]">
          <h2 className="h-section text-[28px] dt:text-[40px]">
            {t('clipboard-manager.flows.title')}
          </h2>
          <Flows locale={locale} columns={4} items={clipboardFlows} />
        </section>

        {/* Search */}
        <section className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[7fr_5fr] dt:items-center dt:gap-14 dt:pt-[130px]">
          <div className="rounded-[28px] bg-[#eef3ff] p-6">
            <ClipboardVisual locale={locale} className="w-full" />
          </div>
          <div className="flex flex-col gap-4">
            <p className="eyebrow">{t('clipboard-manager.search.eyebrow')}</p>
            <h2 className="h-section text-[26px] dt:text-[40px]">
              {t('clipboard-manager.search.title')}
            </h2>
            <p className="text-[17px] leading-[1.55] text-muted">
              {t('clipboard-manager.search.body')}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-2 text-[14px] text-muted">
                <kbd className="keys">⇧⌘V</kbd> {t('clipboard-manager.search.open')}
              </span>
              <span className="flex items-center gap-2 text-[14px] text-muted">
                <kbd className="keys">F</kbd> {t('clipboard-manager.search.find')}
              </span>
            </div>
          </div>
        </section>

        {/* Pin & filter */}
        <section className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[5fr_7fr] dt:items-center dt:gap-14 dt:pt-[130px]">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">{t('clipboard-manager.pin.eyebrow')}</p>
            <h2 className="h-section text-[26px] dt:text-[40px]">
              {t('clipboard-manager.pin.title')}
            </h2>
            <p className="text-[17px] leading-[1.55] text-muted">
              {t('clipboard-manager.pin.body')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {clipboardFilters.map((filter) => (
              <div
                key={filter.id}
                className={`flex flex-col gap-2 rounded-[20px] p-6 ${
                  filter.active ? 'bg-primary text-white' : 'bg-[#f3f6ff]'
                }`}
              >
                <span className={filter.active ? 'text-white' : 'text-primary'}>
                  <ToolIcon name={filter.icon} size={22} />
                </span>
                <b className="text-[17px]">{t(filter.title)}</b>
                <span className={`text-[14px] ${filter.active ? 'text-white/80' : 'text-muted'}`}>
                  {t(filter.body)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Preview */}
        <section className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[7fr_5fr] dt:items-center dt:gap-14 dt:pt-[130px]">
          <div
            className="rounded-[28px] p-6"
            style={{
              background:
                'radial-gradient(80% 80% at 20% 0%, #dfe8ff 0%, #f3f6ff 60%, #efeaff 100%)',
            }}
          >
            <ClipboardVisual locale={locale} className="w-full" />
          </div>
          <div className="flex flex-col gap-4">
            <p className="eyebrow">{t('clipboard-manager.preview.eyebrow')}</p>
            <h2 className="h-section text-[26px] dt:text-[40px]">
              {t('clipboard-manager.preview.title')}
            </h2>
            <p className="text-[17px] leading-[1.55] text-muted">
              {t('clipboard-manager.preview.body1')}
            </p>
            <p className="text-[17px] leading-[1.55] text-muted">
              {t('clipboard-manager.preview.body2')}
            </p>
          </div>
        </section>

        {/* Privacy + permissions */}
        <section className="container-page grid grid-cols-1 gap-5 pt-16 dt:grid-cols-2 dt:pt-[130px]">
          <div className="flex flex-col gap-4 rounded-[28px] bg-neutral p-8 text-white dt:p-10">
            <p className="eyebrow">{t('clipboard-manager.privacy.eyebrow')}</p>
            <h2 className="text-[26px] font-bold leading-tight dt:text-[32px]">
              {t('clipboard-manager.privacy.title')}
            </h2>
            <ul className="flex flex-col gap-3">
              {clipboardPrivacy.map((key, index) => {
                const Icon = privacyIcons[index];
                return (
                  <li key={key} className="flex items-start gap-3 text-[15px] text-neutral-content">
                    <Icon
                      size={18}
                      aria-hidden="true"
                      className="mt-0.5 flex-none text-[#9fbaff]"
                    />
                    {t(key)}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex flex-col gap-4 rounded-[28px] bg-[#f3f6ff] p-8 dt:p-10">
            <p className="eyebrow">{t('clipboard-manager.permissions.eyebrow')}</p>
            <h2 className="text-[26px] font-bold leading-tight dt:text-[32px]">
              {t('clipboard-manager.permissions.title')}
            </h2>
            <p className="text-[16px] leading-[1.55] text-muted">
              {t('clipboard-manager.permissions.body')}
            </p>
            <a href={permissionHref} className="text-[15.5px] font-semibold text-primary">
              {t('screenshot.permissions.link')} →
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="container-page grid grid-cols-1 gap-8 pt-16 dt:grid-cols-[4fr_8fr] dt:gap-16 dt:pt-[130px]"
          id="faq"
          aria-labelledby="clipboard-faq"
        >
          <h2 id="clipboard-faq" className="h-section text-[28px] dt:text-[36px]">
            {t('clipboard-manager.faq.title')}
          </h2>
          <Faq locale={locale} id="clipboard-manager" items={clipboardFaqs} />
        </section>

        {/* Related */}
        <section
          className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[4fr_8fr] dt:gap-16 dt:pt-[110px]"
          data-umami-section="clipboard-related"
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
        title={t('clipboard-manager.cta.title')}
        secondaryLabel={t('screenshot.hero.explore')}
        secondaryHref={featuresHref}
      />
    </>
  );
}
