import { Shell, Button } from '@/components/Site';
import { SiteFrame } from '@/components/SiteFrame';
import { DemoMedia } from '@/components/DemoMedia';
import { DimmingControl } from '@/components/DimmingControl';
import { ToolIcon } from '@/components/ToolIcon';
import {
  product,
  demos,
  clipboardFeatures,
  clipboardDetails,
  screenshotFeatures,
  utilities,
  plans,
  faqs,
  type Locale,
} from '@/content/product';
import { translate } from '@/content/i18n';
import { localePath } from '@/content/locales';
import { pageMetadata } from '@/content/metadata';
import s from '@/app/page.module.css';

export const metadata = pageMetadata('en', 'home', '/');

export default function Home({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);

  return (
    <SiteFrame locale={locale}>
      <main id="main" lang={locale}>
        <Shell>
          <section className={s.hero} aria-labelledby="hero-title">
            <div className={s.wordmark}>
              <h1 id="hero-title">
                {t('hero.smallTools')}
                <img
                  src="/assets/images/deskutils-icon.webp"
                  alt=""
                  width="88"
                  height="88"
                  fetchPriority="high"
                />
                <br />
                {t('hero.rightWhere')}
              </h1>
            </div>
            <p className={s.lede}>{t('hero.description')}</p>
            <Button>
              {t('hero.downloadFree')} <span aria-hidden="true">↓</span>
            </Button>
            <p className={s.requirement}>
              macOS {product.minimumMacOS}+ <span aria-hidden="true">·</span> {t('hero.noAccount')}
            </p>
            <nav className={s.toolIndex} aria-label={t('hero.explore')}>
              <a href="#features">
                <ToolIcon name="clipboard" />
                <span>{t('hero.clipboard')}</span>
              </a>
              <a href="#screenshots">
                <ToolIcon name="capture" />
                <span>{t('hero.captureOcr')}</span>
              </a>
              <a href="#dimming">
                <ToolIcon name="display" />
                <span>{t('hero.brightness')}</span>
              </a>
              <a href="#utilities">
                <ToolIcon name="tools" />
                <span>{t('hero.more')}</span>
              </a>
            </nav>
          </section>

          <section className={s.clipboard} id="features" aria-labelledby="clipboard-title">
            <div className={`${s.sectionHeading} ${s.showcaseHeading}`}>
              <h2 id="clipboard-title">{t('clipboard.title')}</h2>
              <p>{t('clipboard.subtitle')}</p>
            </div>
            <div className={s.clipboardStage}>
              <DemoMedia demo={demos.clipboard} caption={false} locale={locale} />
            </div>
            <div className={s.clipboardDetails}>
              {clipboardFeatures.map((feature) => (
                <div key={feature.title}>
                  <h3>{t(feature.title)}</h3>
                  <p>{t(feature.detail)}</p>
                </div>
              ))}
            </div>
            <p className={s.localNote}>
              <ToolIcon name="lock" />
              {t('clipboard.local')}
            </p>
            <div className={s.clipboardExplore} aria-label={t('clipboard.explore')}>
              {clipboardDetails.map((feature, index) => (
                <article
                  className={`${s.clipboardFeature} ${index % 2 === 1 ? s.clipboardFeatureReverse : ''}`}
                  id={feature.id}
                  key={feature.id}
                >
                  <div className={s.clipboardFeatureCopy}>
                    <p>{t(feature.label)}</p>
                    <h3>{t(feature.title)}</h3>
                    <span>{t(feature.description)}</span>
                  </div>
                  <div className={s.clipboardFeatureMedia}>
                    <DemoMedia demo={feature.demo} caption={false} locale={locale} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={s.capture} id="screenshots" aria-labelledby="capture-title">
            <div className={s.showcaseHeading}>
              <h2 id="capture-title">{t('capture.title')}</h2>
              <p>{t('capture.subtitle')}</p>
            </div>
            <div className={s.showcaseMedia}>
              <DemoMedia demo={demos.screenshot} caption={false} locale={locale} />
            </div>
            <div className={s.captureCapabilities} aria-labelledby="capture-capabilities-title">
              <div className={s.captureCapabilitiesIntro}>
                <span>{t('capture.badge')}</span>
                <h3 id="capture-capabilities-title">{t('capture.heading')}</h3>
                <p>{t('capture.description')}</p>
              </div>
              <div className={s.captureCapabilitiesList}>
                {screenshotFeatures.map((feature) => (
                  <article key={feature.title}>
                    <div className={s.captureFeatureVisual}>
                      <ToolIcon name={feature.icon} />
                    </div>
                    <div>
                      <h4>{t(feature.title)}</h4>
                      <p>{t(feature.description)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className={s.dimming} id="dimming" aria-labelledby="dimming-title">
            <div className={s.dimmingInner}>
              <h2 id="dimming-title">{t('dimming.title')}</h2>
              <div className={s.dimmingSlider}>
                <DimmingControl locale={locale} showLabel={false} />
              </div>
              <p>{t('dimming.description')}</p>
            </div>
          </section>

          <section className={s.utilities} id="utilities" aria-labelledby="utilities-title">
            <div className={s.utilityIntro}>
              <h2 id="utilities-title">{t('utilities.title')}</h2>
              <p>{t('utilities.subtitle')}</p>
            </div>
            <div className={s.utilityList}>
              {utilities.map((tool) => (
                <article
                  key={tool.title}
                  id={tool.title === 'utilities.color.title' ? 'color' : undefined}
                >
                  <ToolIcon name={tool.icon} />
                  <div>
                    <h3>{t(tool.title)}</h3>
                    <p>{t(tool.description)}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={s.pricing} id="pricing" aria-labelledby="pricing-title">
            <div className={s.sectionHeading}>
              <h2 id="pricing-title">{t('pricing.title')}</h2>
              <p>{t('pricing.subtitle')}</p>
            </div>
            <div className={s.plans}>
              {plans.map((plan) => (
                <article
                  key={plan.id}
                  className={`${s.plan} ${plan.id === 'pro' ? s.proPlan : s.freePlan}`}
                >
                  <div className={s.planTop}>
                    <span className={s.planEyebrow}>
                      {plan.id === 'pro' ? t('pricing.pro') : t('pricing.free')}
                    </span>
                  </div>
                  <h3 className={s.planPitch}>{t(plan.pitch)}</h3>
                  <p className={s.planDescription}>{t(plan.description)}</p>
                  {plan.id === 'pro' ? (
                    <div className={s.price}>
                      <strong>${product.pricing.amount}</strong>
                      <span>
                        <del>${product.pricing.originalAmount}</del>
                        <br />
                        {t('pricing.usdYear')}
                      </span>
                    </div>
                  ) : (
                    <div className={s.price}>
                      <strong>$0</strong>
                      <span>{t('pricing.noLicense')}</span>
                    </div>
                  )}
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature.key}>{t(feature.key, feature.values)}</li>
                    ))}
                  </ul>
                  {plan.id === 'pro' ? (
                    <p className={s.comingSoon}>{t('pricing.comingSoon')}</p>
                  ) : (
                    <Button>
                      {t('hero.downloadFree')} <span aria-hidden="true">↓</span>
                    </Button>
                  )}
                  <p className={s.planFootnote}>
                    {plan.id === 'pro'
                      ? t('pricing.proFootnote', { macs: product.pricing.macs })
                      : t('pricing.freeFootnote')}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className={s.faq} id="faq" aria-labelledby="faq-title">
            <div className={s.faqHeading}>
              <h2 id="faq-title">{t('faq.title')}</h2>
              <a href={`mailto:${product.supportEmail}`}>
                {t('faq.contact')} <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div>
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{t(faq.question)}</summary>
                  <p>{t(faq.answer, faq.values)}</p>
                </details>
              ))}
            </div>
          </section>

          <section className={s.install} id="install" aria-labelledby="install-title">
            <div>
              <h2 id="install-title">{t('installCta.title')}</h2>
              <p>{t('installCta.description')}</p>
            </div>
            <a href={localePath(locale, '/install/')}>
              {t('installCta.link')} <span aria-hidden="true">↗</span>
            </a>
          </section>
        </Shell>
      </main>
    </SiteFrame>
  );
}
