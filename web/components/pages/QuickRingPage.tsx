import { ShieldCheck } from 'lucide-react';
import { ToolIcon } from '@/components/ToolIcon';
import { StructuredData } from '@/components/StructuredData';
import { Button } from '@/components/ui/Button';
import { FinalCta } from '@/components/layout/FinalCta';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Faq } from '@/components/ui/Faq';
import { RelatedGuides } from '@/components/sections/RelatedGuides';
import { RelatedTools } from '@/components/sections/RelatedTools';
import { QuickRingDemo } from '@/components/mockups/QuickRingDemo';
import {
  quickRingActions,
  quickRingFaqs,
  quickRingRelated,
  quickRingSteps,
} from '@/content/quick-ring';
import { featureCompares } from '@/content/features-page';
import { translate } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';
import { routeHref } from '@/content/routes';
import { breadcrumbData, faqData } from '@/content/structured-data';
import { product } from '@/content/product';

export function QuickRingPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);
  const homeHref = localePath(locale, '/');
  const featuresHref = routeHref(locale, 'features', '/#tools');
  const compare = featureCompares.find((item) => item.id === 'ring-menu');

  const related = quickRingRelated.map((item) => ({
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
            name: t('tool.quick-ring.name'),
            item: `${product.origin}${localePath(locale, '/quick-ring/')}`,
          },
        ])}
      />
      <StructuredData
        data={faqData(
          quickRingFaqs.map((faq) => ({
            question: t(faq.question),
            answer: t(faq.answer),
          })),
        )}
      />
      <main id="main" lang={locale}>
        {/* Hero */}
        <header
          className="container-page grid grid-cols-1 gap-10 pt-10 dt:grid-cols-[5fr_7fr] dt:items-center dt:gap-14"
          style={{
            background: 'radial-gradient(60% 70% at 80% 0%, #f4f1ff 0%, rgba(244,241,255,0) 70%)',
          }}
          data-umami-section="hero"
        >
          <div className="flex flex-col gap-5">
            <Breadcrumbs
              items={[
                { label: t('breadcrumb.home'), href: homeHref },
                { label: t('nav.features'), href: featuresHref },
                { label: t('tool.quick-ring.name') },
              ]}
            />
            <p className="eyebrow mt-2">{t('quick-ring.hero.eyebrow')}</p>
            <h1 className="h-display text-[36px] dt:text-[56px]">{t('quick-ring.hero.title')}</h1>
            <p className="lede max-w-[560px]">{t('quick-ring.hero.lede')}</p>
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
          <div
            className="relative flex h-[380px] items-center justify-center overflow-hidden rounded-[28px] dt:h-[580px]"
            style={{
              background:
                'radial-gradient(80% 70% at 70% 10%, #efeaff 0%, #e6ecff 50%, #dfe8ff 100%)',
            }}
          >
            <QuickRingDemo
              steps={[
                t('quick-ring.step.press.title'),
                t('quick-ring.step.opens.title'),
                t('quick-ring.step.choose.title'),
              ]}
            />
          </div>
        </header>

        {/* Steps */}
        <section className="container-page flex flex-col gap-8 pt-16 dt:pt-[130px]">
          <h2 className="h-section text-[28px] dt:text-[40px]">{t('quick-ring.steps.title')}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {quickRingSteps.map((step) => (
              <div
                key={step.number}
                className="flex flex-col gap-2 rounded-[22px] bg-[#f3f6ff] p-7"
              >
                <span className="font-mono text-[14px] font-semibold text-primary">
                  {step.number}
                </span>
                <h3 className="text-[19px] font-bold">{t(step.title)}</h3>
                <p className="text-[15px] leading-[1.5] text-muted">{t(step.body)}</p>
              </div>
            ))}
          </div>
          <p className="flex flex-wrap items-center gap-2 text-[15px] text-muted">
            <ShieldCheck size={17} strokeWidth={1.7} aria-hidden="true" className="text-primary" />
            {t('quick-ring.permission.note')}
            <a
              href={localePath(locale, '/install/#permissions')}
              className="font-semibold text-primary hover:text-[#0b3bc0]"
            >
              {t('screenshot.permissions.link')} →
            </a>
          </p>
        </section>

        {/* Actions */}
        <section className="container-page flex flex-col gap-8 pt-16 dt:pt-[130px]">
          <div className="flex flex-col gap-3">
            <h2 className="h-section text-[28px] dt:text-[40px]">
              {t('quick-ring.actions.title')}
            </h2>
            <p className="text-[17px] text-muted">{t('quick-ring.actions.body')}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 dt:grid-cols-4">
            {quickRingActions.map((action, index) => (
              <a
                key={`${action.name}-${index}`}
                href={routeHref(locale, action.id, '/#tools')}
                className="flex flex-col gap-3 rounded-[20px] bg-white p-5 shadow-[0_0_0_1px_#eef1f6] transition-colors hover:bg-[#f3f6ff]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf0ff] text-primary">
                  <ToolIcon name={action.icon} size={20} />
                </span>
                <b className="text-[16px]">{t(action.name)}</b>
                <span className="text-[14px] text-muted">{t(action.body)}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Compare */}
        {compare && (
          <section className="container-page grid grid-cols-1 gap-4 pt-16 dt:grid-cols-[1fr_1fr] dt:gap-6 dt:pt-[130px]">
            <h2 className="text-[24px] font-bold dt:col-span-2">{t(compare.title)}</h2>
            {[compare.a, compare.b].map((option) => (
              <a
                key={option.id}
                href={option.href ?? routeHref(locale, option.id, '/#tools')}
                className="flex flex-col gap-2 rounded-[22px] bg-[#f3f6ff] p-7"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-primary">
                  <ToolIcon name={option.icon} size={22} />
                </span>
                <b className="text-[18px]">{t(option.name)}</b>
                <span className="text-[15px] text-muted">{t(option.body)}</span>
              </a>
            ))}
          </section>
        )}

        {/* FAQ */}
        <section
          className="container-page grid grid-cols-1 gap-8 pt-16 dt:grid-cols-[4fr_8fr] dt:gap-16 dt:pt-[130px]"
          id="faq"
          aria-labelledby="quick-ring-faq"
        >
          <h2 id="quick-ring-faq" className="h-section text-[28px] dt:text-[36px]">
            {t('quick-ring.faq.title')}
          </h2>
          <Faq locale={locale} id="quick-ring" items={quickRingFaqs} />
        </section>

        {/* Related */}
        <section
          className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[4fr_8fr] dt:gap-16 dt:pt-[110px]"
          data-umami-section="quick-ring-related"
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
        title={t('quick-ring.cta.title')}
        secondaryLabel={t('screenshot.hero.explore')}
        secondaryHref={featuresHref}
      />
    </>
  );
}
