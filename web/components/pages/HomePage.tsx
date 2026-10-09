import { ClipboardPaste, Pin, Search, ShieldCheck } from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { TrackedFaq } from '@/components/TrackedFaq';
import { SocialProof } from '@/components/SocialProof';
import { DemoMedia } from '@/components/DemoMedia';
import { ProductVisual } from '@/components/media/ProductVisual';
import { Button } from '@/components/ui/Button';
import { FinalCta } from '@/components/layout/FinalCta';
import { HomePricing } from '@/components/pricing/HomePricing';
import { HeroMockup, HeroMockupMobile } from '@/components/mockups/HeroMockup';
import { MockupCanvas } from '@/components/mockups/MockupCanvas';
import { QuickRingRecording } from '@/components/media/QuickRingRecording';
import { ColorPickerPanel } from '@/components/mockups/ColorPickerPanel';
import { WindowSwitcher } from '@/components/mockups/WindowSwitcher';
import { UtilitiesDisclosure } from '@/components/mockups/UtilitiesDisclosure';
import {
  CleanKeyboardVisual,
  DisplayDimmingVisual,
  ExternalDisplayOnlyVisual,
  MouseJigglerVisual,
  PixelLoupe,
  PreventSleepVisual,
  SystemMonitoringVisual,
} from '@/components/mockups/UtilityVisuals';
import { product, demos, clipboardFeatures, faqs, type Locale } from '@/content/product';
import { allTools } from '@/content/features';
import { translate } from '@/content/i18n';
import { localePath } from '@/content/locales';
import { routeHref } from '@/content/routes';
import { homeStructuredData } from '@/content/structured-data';
const modes = [
  { label: 'home.mode.area', keys: '⌥⇧⌘4' },
  { label: 'home.mode.scrolling', keys: '⌥⇧⌘6' },
  { label: 'home.mode.window', keys: '⌥⇧⌘9' },
] as const;
const benefitIcons = [Search, Pin, ClipboardPaste];

function ArrowLink({
  href,
  children,
  tone = 'primary',
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  tone?: 'primary' | 'light';
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`text-[15px] font-semibold ${tone === 'light' ? 'text-white hover:text-[#dfe7ff]' : 'text-primary hover:text-[#0b3bc0]'} ${className}`}
    >
      {children} →
    </a>
  );
}
function PermissionsLink({ locale, className = '' }: { locale: Locale; className?: string }) {
  return (
    <a
      href={localePath(locale, '/install/#permissions')}
      className={`home-permissions ${className}`}
    >
      <ShieldCheck size={17} strokeWidth={1.7} aria-hidden="true" />
      {translate(locale, 'home.permissions.link')}
    </a>
  );
}

export function HomePage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);
  return (
    <>
      <StructuredData data={homeStructuredData(locale)} />
      <main id="main" lang={locale}>
        <header className="container-page home-hero" data-umami-section="hero">
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <p className="eyebrow">{t('home.eyebrow')}</p>
              <h1>
                {t('home.title.lead')}{' '}
                <span className="text-primary">{t('home.title.accent')}</span>.
              </h1>
              <p className="lede">{t('home.lede')}</p>
              <div className="home-hero-actions">
                <Button locale={locale} placement="hero" className="home-primary">
                  {t('home.download')}
                </Button>
                <ArrowLink href={routeHref(locale, 'features', '/#tools')}>
                  {t('home.exploreTools')}
                </ArrowLink>
              </div>
              <p className="home-hero-note">
                {t('home.freeNote', { version: product.minimumMacOS })}
              </p>
            </div>
            <div className="home-hero-desktop min-w-0">
              <div className="home-hero-photo-shell">
                <ProductVisual
                  id="hero"
                  locale={locale}
                  priority
                  className="home-hero-photo h-[580px] w-full min-w-0 [&_img]:object-cover [&_img]:object-right-top"
                  frameStyle={{ aspectRatio: 'auto', border: 0, background: 'transparent' }}
                >
                  <HeroMockup />
                </ProductVisual>
              </div>
            </div>
            <div className="home-hero-mobile">
              <div className="home-hero-photo-shell">
                <ProductVisual
                  id="hero"
                  locale={locale}
                  priority
                  className="home-hero-photo"
                  frameClassName="h-[440px] overflow-hidden"
                  frameStyle={{ border: 0, background: 'transparent' }}
                  cropClassName="absolute top-0 left-1/2 h-[470px] w-[576px] -translate-x-[345px]"
                >
                  <HeroMockupMobile />
                </ProductVisual>
              </div>
            </div>
          </div>
        </header>
        <SocialProof locale={locale} />
        <section
          className="container-page home-shot-section"
          aria-labelledby="home-screenshot"
          data-umami-section="screenshots"
        >
          <div className="home-shot-copy">
            <p className="eyebrow">{t('home.screenshot.eyebrow')}</p>
            <h2 id="home-screenshot" className="home-shot-title">
              {t('home.screenshot.title')}
            </h2>
            <p className="home-shot-lead">{t('home.screenshot.lede')}</p>
            <div className="home-shot-modes">
              {modes.map((mode) => (
                <div key={mode.label}>
                  <span>{t(mode.label)}</span>
                  <kbd>{mode.keys}</kbd>
                </div>
              ))}
            </div>
            <a
              className="home-feature-button home-shot-link"
              href={routeHref(locale, 'screenshot', '/#tools')}
            >
              {t('home.screenshot.cta')}
            </a>
            <PermissionsLink locale={locale} className="home-shot-permissions" />
          </div>
          <div className="home-shot-demo">
            <div className="home-shot-stage [&>figure]:h-full [&>figure>div]:h-full [&_img]:object-cover! [&_video]:object-cover!">
              <DemoMedia
                demo={{ ...demos.screenshot, mockup: false }}
                caption={false}
                locale={locale}
              />
            </div>
            <p className="home-shot-caption">{t('home.tab.annotate.body')}</p>
          </div>
        </section>
        <section className="home-clipboard" data-umami-section="clipboard">
          <div className="container-page home-clipboard-grid">
            <div className="home-clip-visual">
              <div className="home-clip-recording">
                <DemoMedia
                  demo={{ ...demos.clipboard, mockup: false }}
                  caption={false}
                  locale={locale}
                />
              </div>
            </div>
            <div className="home-clip-copy">
              <p className="home-clip-eyebrow">{t('home.clipboard.eyebrow')} · ⇧⌘V</p>
              <h2 className="home-clip-title">{t('home.clipboard.title')}</h2>
              <div className="home-clip-benefits">
                {clipboardFeatures.map((feature, i) => {
                  const Icon = benefitIcons[i];
                  return (
                    <div key={feature.label}>
                      <span className="home-clip-icon">
                        <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                      </span>
                      <span>{t(feature.label)}</span>
                    </div>
                  );
                })}
              </div>
              <a
                className="home-feature-button home-clip-link"
                href={routeHref(locale, 'clipboard-manager', '/#tools')}
              >
                {t('home.clipboard.cta')}
              </a>
              <p className="home-clip-note">{t('home.clipboard.note')}</p>
            </div>
          </div>
        </section>
        <section id="quickring" className="home-ring-section" data-umami-section="quickring">
          <div className="container-page home-ring-grid">
            <div className="home-ring-copy">
              <p className="eyebrow">{t('home.quickring.eyebrow')}</p>
              <h2 className="home-ring-title">{t('home.quickring.title')}</h2>
              <p className="home-ring-lead">{t('home.quickring.lede')}</p>
              <p className="home-ring-note">
                {t('home.quickring.note')}{' '}
                <ArrowLink href={routeHref(locale, 'quick-ring', '/#tools')}>
                  {t('home.quickring.cta')}
                </ArrowLink>
              </p>
            </div>
            <QuickRingRecording locale={locale} />
          </div>
        </section>
        <section
          className="container-page home-focused"
          aria-labelledby="home-focused"
          data-umami-section="tools"
        >
          <div className="home-focused-heading" id="tools">
            <p className="eyebrow">{t('home.focused.eyebrow')}</p>
            <h2 id="home-focused" className="home-section-title">
              {t('home.focused.title')}
            </h2>
          </div>
          <div className="home-focused-grid">
            <article className="home-color-card" data-testid="color-picker-card">
              <div className="home-focused-copy">
                <h3>{t('tool.color-picker.name')}</h3>
                <p>{t('home.focused.color.body')}</p>
                <ArrowLink
                  className="home-color-copy-link"
                  href={routeHref(locale, 'color-picker', '/#tools')}
                  tone="light"
                >
                  {t('tool.color-picker.name')}
                </ArrowLink>
              </div>
              <PixelLoupe className="home-color-loupe" />
              <ProductVisual
                id="color-picker-panel"
                locale={locale}
                className="home-color-art overflow-visible! rounded-none! border-0! bg-transparent!"
              >
                <MockupCanvas width={340} height={330}>
                  <ColorPickerPanel />
                </MockupCanvas>
              </ProductVisual>
            </article>
            <article className="home-ocr-card" data-testid="capture-text-card">
              <div className="home-focused-copy">
                <h3>{t('tool.capture-text.name')}</h3>
                <p>{t('home.focused.text.body')}</p>
                <div className="flex flex-wrap items-center gap-5">
                  <ArrowLink href={routeHref(locale, 'capture-text', '/#tools')}>
                    {t('tool.capture-text.name')}
                  </ArrowLink>
                  <PermissionsLink locale={locale} />
                </div>
              </div>
              <div className="home-ocr-recording [&>figure]:h-full [&>figure>div]:h-full [&_img]:object-cover! [&_video]:object-cover! [&_img]:object-[50%_30%]! [&_video]:object-[50%_30%]!">
                <DemoMedia demo={demos.captureText} caption={false} locale={locale} />
              </div>
            </article>
            <article className="home-window-card">
              <div className="home-focused-copy">
                <h3>{t('tool.window-switcher.name')}</h3>
                <p>{t('home.focused.window.body')}</p>
                <ArrowLink href={routeHref(locale, 'window-switcher', '/#tools')} tone="light">
                  {t('tool.window-switcher.name')}
                </ArrowLink>
              </div>
              <div className="home-window-stage">
                <MockupCanvas width={900} height={190} className="home-window-art">
                  <WindowSwitcher />
                </MockupCanvas>
              </div>
            </article>
          </div>
        </section>
        <section
          className="container-page home-utilities"
          aria-labelledby="home-utilities"
          data-umami-section="utilities"
        >
          <div className="home-utilities-heading">
            <div>
              <p className="eyebrow">{t('home.utilities.eyebrow')}</p>
              <h2 id="home-utilities" className="home-section-title">
                {t('home.utilities.title')}
              </h2>
            </div>
            <ArrowLink href={routeHref(locale, 'features', '/#tools')}>
              {t('home.exploreTools')}
            </ArrowLink>
          </div>
          <UtilitiesDisclosure
            names={allTools.slice(6).map((tool) => t(tool.nameKey))}
            showLabel={t('home.utilities.show')}
            hideLabel={t('home.utilities.hide')}
          >
            <a
              href={routeHref(locale, 'prevent-sleep', '/#tools')}
              aria-label={t('tool.prevent-sleep.name')}
              className="card home-utility-card home-utility-wide home-utility-dark"
            >
              <div>
                <div className="home-utility-copy">
                  <span className="text-[#9fbaff]">{t('tool.prevent-sleep.name')} · ⇧⌘P</span>
                  <h3>{t('home.util.sleep.title')}</h3>
                  <p>{t('home.util.sleep.body')}</p>
                </div>
                <PreventSleepVisual />
              </div>
            </a>
            <a
              href={routeHref(locale, 'mouse-jiggler', '/#tools')}
              aria-label={t('tool.mouse-jiggler.name')}
              className="card home-utility-card bg-[#efeaff]"
            >
              <MockupCanvas width={234} height={130} className="home-utility-preview">
                <MouseJigglerVisual />
              </MockupCanvas>
              <div className="home-utility-copy">
                <h3>{t('home.util.jiggler.title')}</h3>
                <p>{t('home.util.jiggler.body')}</p>
              </div>
            </a>
            <a
              href={routeHref(locale, 'clean-keyboard', '/#tools')}
              aria-label={t('tool.clean-keyboard.name')}
              className="card home-utility-card bg-base-200"
            >
              <MockupCanvas width={234} height={130} className="home-utility-preview">
                <CleanKeyboardVisual />
              </MockupCanvas>
              <div className="home-utility-copy">
                <h3>{t('home.util.keyboard.title')}</h3>
                <p>{t('home.util.keyboard.body')}</p>
              </div>
            </a>
            <a
              href={routeHref(locale, 'display-dimming', '/#tools')}
              aria-label={t('tool.display-dimming.name')}
              className="card home-utility-card bg-[#e8efff]"
            >
              <MockupCanvas width={234} height={130} className="home-utility-preview">
                <DisplayDimmingVisual />
              </MockupCanvas>
              <div className="home-utility-copy">
                <h3>{t('home.util.dimming.title')}</h3>
                <p>{t('home.util.dimming.body')}</p>
              </div>
            </a>
            <a
              href={routeHref(locale, 'external-display-only', '/#tools')}
              aria-label={t('tool.external-display-only.name')}
              className="card home-utility-card bg-base-200"
            >
              <MockupCanvas width={234} height={130} className="home-utility-preview">
                <ExternalDisplayOnlyVisual />
              </MockupCanvas>
              <div className="home-utility-copy">
                <h3>{t('home.util.external.title')}</h3>
                <p>{t('home.util.external.body')}</p>
                <span className="home-utility-compatibility">{t('home.util.external.badge')}</span>
              </div>
            </a>
            <a
              href={routeHref(locale, 'system-monitoring', '/#tools')}
              aria-label={t('tool.system-monitoring.name')}
              className="card home-utility-card home-utility-wide home-monitor-card"
            >
              <div>
                <div className="home-utility-copy">
                  <span className="text-primary">{t('home.util.monitor.eyebrow')}</span>
                  <h3>{t('home.util.monitor.title')}</h3>
                  <p>{t('home.util.monitor.body')}</p>
                </div>
                <SystemMonitoringVisual interactive={false} />
              </div>
            </a>
          </UtilitiesDisclosure>
        </section>
        {/* ================= Pricing ================= */}
        <HomePricing locale={locale} />

        {/* ================= FAQ ================= */}
        <section
          className="container-page home-faq"
          id="faq"
          aria-labelledby="home-faq"
          data-umami-section="faq"
        >
          <div className="flex flex-col gap-4 self-start">
            <h2 id="home-faq" className="h-section text-[28px] dt:text-[32px]">
              {t('home.faq.title')}
            </h2>
            <a
              href={localePath(locale, '/feedback/')}
              className="text-sm font-semibold text-primary hover:text-[#0b3bc0]"
            >
              {t('faq.contact')} →
            </a>
          </div>
          <div className="flex flex-col">
            {faqs.map((faq) => (
              <TrackedFaq
                key={faq.question}
                id={faq.question.replace('faq.', '').replace('.question', '')}
                question={t(faq.question, faq.values)}
                answer={t(faq.answer, faq.values)}
                locale={locale}
              />
            ))}
          </div>
        </section>
      </main>
      <FinalCta locale={locale} />
    </>
  );
}
