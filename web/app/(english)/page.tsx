import {
  ClipboardList,
  ClipboardPaste,
  History,
  Keyboard,
  Moon,
  PencilLine,
  Pin,
  Pipette,
  ScanLine,
  ScanText,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { StructuredData } from '@/components/StructuredData';
import { TrackedFaq } from '@/components/TrackedFaq';
import { SocialProof } from '@/components/SocialProof';
import { ProductVisual } from '@/components/media/ProductVisual';
import { Button } from '@/components/ui/Button';
import { FinalCta } from '@/components/layout/FinalCta';
import { HeroMockup, HeroMockupMobile } from '@/components/mockups/HeroMockup';
import { MockupCanvas } from '@/components/mockups/MockupCanvas';
import { ScreenshotStage } from '@/components/mockups/ScreenshotStage';
import { ScreenshotTabs } from '@/components/mockups/ScreenshotTabs';
import { ClipboardPanel } from '@/components/mockups/ClipboardPanel';
import { QuickRingDemo } from '@/components/mockups/QuickRingDemo';
import { screenshotDemoSources } from '@/content/screenshot-demos';
import { ColorPickerPanel } from '@/components/mockups/ColorPickerPanel';
import { WindowSwitcher } from '@/components/mockups/WindowSwitcher';
import { CaptureTextScene, CaptureTextSceneMobile } from '@/components/mockups/CaptureTextScene';
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
import {
  product,
  clipboardFeatures,
  plans,
  faqs,
  launchOffer,
  type Locale,
} from '@/content/product';
import { allTools, quickRingActions } from '@/content/features';
import { translate } from '@/content/i18n';
import { localePath } from '@/content/locales';
import { routeHref } from '@/content/routes';
import { routeMetadata } from '@/content/metadata';
import { homeStructuredData } from '@/content/structured-data';

export const metadata = routeMetadata('en', 'home');
const modes = [
  { label: 'home.mode.area', keys: '⌥⇧⌘4' },
  { label: 'home.mode.scrolling', keys: '⌥⇧⌘6' },
  { label: 'home.mode.window', keys: '⌥⇧⌘9' },
] as const;
const tabs = [
  { title: 'home.tab.capture', body: 'home.tab.capture.body' },
  { title: 'home.tab.annotate', body: 'home.tab.annotate.body' },
  { title: 'home.tab.save', body: 'home.tab.save.body' },
] as const;
const actionIcons = [
  ScanLine,
  ScanText,
  ClipboardList,
  Moon,
  History,
  Keyboard,
  PencilLine,
  Pipette,
];
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

export default function Home({ locale = 'en' }: { locale?: Locale }) {
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
            <div className="home-hero-desktop">
              <ProductVisual id="hero" locale={locale} priority className="h-[580px]">
                <HeroMockup />
              </ProductVisual>
            </div>
            <div className="home-hero-mobile">
              <ProductVisual id="hero" locale={locale} priority className="h-[440px]">
                <HeroMockupMobile />
              </ProductVisual>
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
            <ScreenshotTabs
              labels={tabs.map((tab) => t(tab.title))}
              descriptions={tabs.map((tab) => t(tab.body))}
              videos={screenshotDemoSources()}
              playLabel={t('home.demo.play')}
            >
              <ProductVisual id="screenshot" locale={locale} className="home-shot-stage">
                <MockupCanvas width={1000} height={640} className="home-shot-art">
                  <ScreenshotStage />
                </MockupCanvas>
              </ProductVisual>
            </ScreenshotTabs>
          </div>
        </section>
        <section className="home-clipboard" data-umami-section="clipboard">
          <div className="container-page home-clipboard-grid">
            <ProductVisual id="clipboard" locale={locale} className="home-clip-visual">
              <MockupCanvas width={840} height={520} className="home-clip-art">
                <ClipboardPanel />
              </MockupCanvas>
            </ProductVisual>
            <div className="home-clip-copy">
              <p className="home-clip-eyebrow">{t('home.clipboard.eyebrow')} · ⇧⌘V</p>
              <h2 className="home-clip-title">{t('home.clipboard.title')}</h2>
              <p className="home-clip-lead">{t('home.clipboard.lede')}</p>
              <div className="home-clip-benefits">
                {clipboardFeatures.map((feature, i) => {
                  const Icon = benefitIcons[i];
                  return (
                    <div key={feature.title}>
                      <span className="home-clip-icon">
                        <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                      </span>
                      <div>
                        <strong>{t(feature.title)}</strong>
                        <p>{t(feature.detail)}</p>
                      </div>
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
        <section className="home-ring-section" data-umami-section="quickring">
          <div className="container-page home-ring-grid">
            <div className="home-ring-copy">
              <p className="eyebrow">{t('home.quickring.eyebrow')}</p>
              <h2 className="home-ring-title">{t('home.quickring.title')}</h2>
              <p className="home-ring-lead">{t('home.quickring.lede')}</p>
              <div className="home-ring-actions">
                {quickRingActions.map((action, i) => {
                  const Icon = actionIcons[i];
                  return (
                    <div key={action} className={i === 0 ? 'text-primary font-semibold' : ''}>
                      <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                      <span>{t(action)}</span>
                    </div>
                  );
                })}
              </div>
              <p className="home-ring-note">
                {t('home.quickring.note')}{' '}
                <ArrowLink href={routeHref(locale, 'quick-ring', '/#tools')}>
                  {t('home.quickring.cta')}
                </ArrowLink>
              </p>
            </div>
            <ProductVisual id="quickring" locale={locale} className="home-ring-visual">
              <QuickRingDemo
                steps={[t('home.ring.press'), t('home.ring.opens'), t('home.ring.choose')]}
              />
            </ProductVisual>
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
              <MockupCanvas width={340} height={330} className="home-color-art">
                <ColorPickerPanel />
              </MockupCanvas>
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
              <MockupCanvas width={715} height={306} className="home-ocr-desktop">
                <CaptureTextScene />
              </MockupCanvas>
              <CaptureTextSceneMobile />
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
            <article className="home-utility-wide home-utility-dark">
              <div>
                <div className="home-utility-copy">
                  <span className="text-[#9fbaff]">{t('tool.prevent-sleep.name')} · ⇧⌘P</span>
                  <h3>{t('home.util.sleep.title')}</h3>
                  <p>{t('home.util.sleep.body')}</p>
                </div>
                <PreventSleepVisual />
              </div>
            </article>
            <article className="bg-[#efeaff]">
              <MockupCanvas width={234} height={130} className="home-utility-preview">
                <MouseJigglerVisual />
              </MockupCanvas>
              <div className="home-utility-copy">
                <h3>{t('home.util.jiggler.title')}</h3>
                <p>{t('home.util.jiggler.body')}</p>
              </div>
            </article>
            <article className="bg-base-200">
              <MockupCanvas width={234} height={130} className="home-utility-preview">
                <CleanKeyboardVisual />
              </MockupCanvas>
              <div className="home-utility-copy">
                <h3>{t('home.util.keyboard.title')}</h3>
                <p>{t('home.util.keyboard.body')}</p>
              </div>
            </article>
            <article className="bg-[#e8efff]">
              <MockupCanvas width={234} height={130} className="home-utility-preview">
                <DisplayDimmingVisual />
              </MockupCanvas>
              <div className="home-utility-copy">
                <h3>{t('home.util.dimming.title')}</h3>
                <p>{t('home.util.dimming.body')}</p>
              </div>
            </article>
            <article className="bg-base-200">
              <MockupCanvas width={234} height={130} className="home-utility-preview">
                <ExternalDisplayOnlyVisual />
              </MockupCanvas>
              <div className="home-utility-copy">
                <h3>{t('home.util.external.title')}</h3>
                <p>{t('home.util.external.body')}</p>
                <span className="home-utility-compatibility">{t('home.util.external.badge')}</span>
              </div>
            </article>
            <article className="home-utility-wide home-monitor-card">
              <div>
                <div className="home-utility-copy">
                  <span className="text-primary">{t('home.util.monitor.eyebrow')}</span>
                  <h3>{t('home.util.monitor.title')}</h3>
                  <p>{t('home.util.monitor.body')}</p>
                </div>
                <SystemMonitoringVisual />
              </div>
            </article>
          </UtilitiesDisclosure>
        </section>
        {/* ================= Pricing ================= */}
        <section
          className="container-page flex flex-col gap-4 pt-12 dt:gap-8 dt:pt-[130px]"
          id="pricing"
          aria-labelledby="home-pricing"
          data-umami-section="pricing"
        >
          <h2 id="home-pricing" className="h-section text-[30px] dt:text-[40px]">
            {t('home.pricing.title')}
          </h2>
          <div className="grid grid-cols-1 gap-3 dt:gap-5 dt:grid-cols-2">
            {plans.map((plan) => {
              const pro = plan.id === 'pro';
              return (
                <article
                  key={plan.id}
                  className={`flex flex-col gap-4 rounded-[22px] p-6 dt:rounded-[28px] dt:p-10 ${
                    pro ? 'bg-neutral text-white' : 'bg-[#f3f6ff]'
                  }`}
                >
                  <span
                    className={`text-sm font-semibold ${pro ? 'text-[#9fbaff]' : 'text-primary'}`}
                  >
                    {pro ? t('pricing.pro') : t('pricing.free')}
                  </span>
                  <h3 className="text-[24px] font-bold leading-tight dt:text-[30px]">
                    {t(plan.pitch)}
                  </h3>
                  {pro ? (
                    <div className="flex flex-wrap items-baseline gap-3">
                      {product.pricing.showOriginal && (
                        <del className="text-lg text-neutral-content/60">
                          ${product.pricing.originalAmount}
                        </del>
                      )}
                      <strong className="text-4xl font-bold">${product.pricing.amount}</strong>
                      <span className="text-sm text-neutral-content/80">
                        {t('pricing.lifetime')}
                      </span>
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
                </article>
              );
            })}
          </div>
        </section>

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
