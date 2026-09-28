import { Shell, Button } from '@/components/Site';
import { SiteFrame } from '@/components/SiteFrame';
import { DemoMedia } from '@/components/DemoMedia';
import { DimmingControl } from '@/components/DimmingControl';
import { StructuredData } from '@/components/StructuredData';
import { ToolIcon } from '@/components/ToolIcon';
import { TrackedFaq } from '@/components/TrackedFaq';
import {
  product,
  demos,
  toolOverview,
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
import { homeStructuredData } from '@/content/structured-data';
import s from '@/app/page.module.css';

export const metadata = pageMetadata('en', 'home', '/');

export default function Home({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);

  return (
    <SiteFrame locale={locale}>
      <StructuredData data={homeStructuredData(locale)} />
      <main id="main" lang={locale}>
        <Shell>
          <section className={s.hero} aria-labelledby="hero-title">
            <div className={s.heroCopy}>
              <p className={s.kicker}>{t('hero.kicker')}</p>
              <h1 id="hero-title">
                {t('hero.smallTools')}
                <br />
                {t('hero.rightWhere')}
              </h1>
              <p className={s.lede}>{t('hero.description')}</p>
              <div className={s.heroActions}>
                <Button locale={locale} placement="hero">
                  {t('hero.downloadFree')} <span aria-hidden="true">↓</span>
                </Button>
                <Button href="#features" secondary locale={locale} placement="hero">
                  {t('hero.explore')} <span aria-hidden="true">↓</span>
                </Button>
              </div>
              <p className={s.requirement}>
                macOS {product.minimumMacOS}+ <span aria-hidden="true">·</span>{' '}
                {t('hero.noAccount')}
              </p>
            </div>
            <div className={s.heroMedia} id="product-demo">
              <DemoMedia demo={demos.clipboard} caption={false} locale={locale} />
            </div>
          </section>

          <aside className={s.trustStrip} aria-label={t('trust.label')}>
            <p>{t('trust.free')}</p>
            <p>{t('trust.account')}</p>
            <p>{t('trust.local')}</p>
            <p>{t('trust.native')}</p>
          </aside>

          <section
            className={s.overview}
            id="features"
            aria-labelledby="overview-title"
            data-umami-section="features"
          >
            <div className={s.sectionIntro}>
              <p className={s.eyebrow}>{t('overview.eyebrow')}</p>
              <h2 id="overview-title">{t('overview.title')}</h2>
              <p>{t('overview.description')}</p>
            </div>
            <nav className={s.toolOverview} aria-label={t('hero.explore')}>
              {toolOverview.map((tool) => (
                <a
                  key={tool.title}
                  href={tool.href}
                  data-umami-event="nav_click"
                  data-umami-event-placement="overview"
                  data-umami-event-target={tool.href.slice(1)}
                >
                  <span className={s.overviewIcon}>
                    <ToolIcon name={tool.icon} />
                  </span>
                  <span>
                    <strong>{t(tool.title)}</strong>
                    <small>{t(tool.description)}</small>
                  </span>
                  <span className={s.overviewArrow} aria-hidden="true">
                    ↘
                  </span>
                </a>
              ))}
            </nav>
          </section>

          <section
            className={s.productSection}
            id="clipboard"
            aria-labelledby="clipboard-title"
            data-umami-section="clipboard"
          >
            <div className={s.splitHeading}>
              <div>
                <p className={s.eyebrow}>{t('hero.clipboard')}</p>
                <h2 id="clipboard-title">{t('clipboard.title')}</h2>
              </div>
              <div>
                <p>{t('clipboard.subtitle')}</p>
                <span className={s.inlineTrust}>
                  <ToolIcon name="lock" /> {t('clipboard.local')}
                </span>
              </div>
            </div>
            <div className={s.featureNotes}>
              {clipboardFeatures.map((feature) => (
                <article key={feature.title}>
                  <h3>{t(feature.title)}</h3>
                  <p>{t(feature.detail)}</p>
                </article>
              ))}
            </div>
            <div className={s.clipboardExplore} aria-label={t('clipboard.explore')}>
              {clipboardDetails.map((feature, index) => (
                <article
                  className={`${s.mediaRow} ${index % 2 === 1 ? s.mediaRowReverse : ''}`}
                  id={feature.id}
                  key={feature.id}
                >
                  <div className={s.mediaRowCopy}>
                    <p className={s.eyebrow}>{t(feature.label)}</p>
                    <h3>{t(feature.title)}</h3>
                    <span>{t(feature.description)}</span>
                  </div>
                  <div className={s.mediaRowVisual}>
                    <DemoMedia demo={feature.demo} caption={false} locale={locale} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            className={s.productSection}
            id="screenshots"
            aria-labelledby="capture-title"
            data-umami-section="screenshots"
          >
            <div className={s.sectionIntro}>
              <p className={s.eyebrow}>{t('capture.badge')}</p>
              <h2 id="capture-title">{t('capture.title')}</h2>
              <p>{t('capture.subtitle')}</p>
            </div>
            <div className={s.wideMedia}>
              <DemoMedia demo={demos.screenshot} caption={false} locale={locale} />
            </div>
            <div className={s.capabilityHeader}>
              <h3>{t('capture.heading')}</h3>
              <p>{t('capture.description')}</p>
            </div>
            <div className={s.capabilityList}>
              {screenshotFeatures.map((feature) => (
                <article key={feature.title}>
                  <ToolIcon name={feature.icon} />
                  <div>
                    <h4>{t(feature.title)}</h4>
                    <p>{t(feature.description)}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            className={`${s.productSection} ${s.quickRing}`}
            id="quick-ring"
            aria-labelledby="quick-ring-title"
            data-umami-section="quick-ring"
          >
            <div className={s.quickRingCopy}>
              <p className={s.eyebrow}>{t('quickRing.eyebrow')}</p>
              <h2 id="quick-ring-title">{t('quickRing.title')}</h2>
              <p>{t('quickRing.description')}</p>
              <small>{t('quickRing.note')}</small>
            </div>
            <div className={s.quickRingMedia}>
              <DemoMedia demo={demos.quickRing} caption={false} locale={locale} />
            </div>
          </section>

          <section
            className={s.productSection}
            id="utilities"
            aria-labelledby="utilities-title"
            data-umami-section="utilities"
          >
            <div className={s.sectionIntro}>
              <p className={s.eyebrow}>{t('utilities.eyebrow')}</p>
              <h2 id="utilities-title">{t('utilities.title')}</h2>
              <p>{t('utilities.subtitle')}</p>
            </div>
            <div className={s.utilityShowcase}>
              <div className={s.utilityMedia}>
                <DemoMedia demo={demos.color} caption={false} locale={locale} />
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
                <article id="dimming">
                  <ToolIcon name="display" />
                  <div>
                    <h3>{t('dimming.title')}</h3>
                    <p>{t('dimming.description')}</p>
                    <div className={s.dimmingControl}>
                      <DimmingControl locale={locale} showLabel={false} />
                    </div>
                  </div>
                </article>
                <article id="external-display-only">
                  <ToolIcon name="display" />
                  <div>
                    <h3>{t('display.external.title')}</h3>
                    <p>{t('display.external.description')}</p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section
            className={s.privacy}
            id="privacy"
            aria-labelledby="privacy-title"
            data-umami-section="privacy"
          >
            <div className={s.privacyLead}>
              <span className={s.privacyIcon}>
                <ToolIcon name="lock" />
              </span>
              <p className={s.eyebrow}>{t('privacy.eyebrow')}</p>
              <h2 id="privacy-title">{t('homePrivacy.title')}</h2>
              <p>{t('homePrivacy.description')}</p>
              <a href={localePath(locale, '/privacy/')}>{t('homePrivacy.link')} →</a>
            </div>
            <div className={s.privacyPoints}>
              <article>
                <span>01</span>
                <h3>{t('homePrivacy.local.title')}</h3>
                <p>{t('homePrivacy.local.description')}</p>
              </article>
              <article>
                <span>02</span>
                <h3>{t('homePrivacy.permissions.title')}</h3>
                <p>{t('homePrivacy.permissions.description')}</p>
              </article>
              <article>
                <span>03</span>
                <h3>{t('homePrivacy.account.title')}</h3>
                <p>{t('homePrivacy.account.description')}</p>
              </article>
            </div>
          </section>

          <section
            className={s.testimonials}
            aria-labelledby="testimonials-title"
            data-umami-section="testimonials"
          >
            <div>
              <p className={s.eyebrow}>{t('testimonials.eyebrow')}</p>
              <h2 id="testimonials-title">{t('testimonials.title')}</h2>
              <p>{t('testimonials.description')}</p>
            </div>
            <blockquote className={s.quotePlaceholder} data-content-placeholder="testimonial">
              <span>{t('testimonials.placeholderLabel')}</span>
              <p>“{t('testimonials.placeholderQuote')}”</p>
              <footer>{t('testimonials.placeholderSource')}</footer>
            </blockquote>
          </section>

          <section
            className={s.pricing}
            id="pricing"
            aria-labelledby="pricing-title"
            data-umami-section="pricing"
          >
            <div className={s.sectionIntro}>
              <p className={s.eyebrow}>{t('pricing.eyebrow')}</p>
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
                    {plan.id === 'pro' ? (
                      <span className={s.launchBadge}>{t('pricing.launchOffer')}</span>
                    ) : null}
                  </div>
                  <h3 className={s.planPitch}>{t(plan.pitch)}</h3>
                  <p className={s.planDescription}>{t(plan.description)}</p>
                  {plan.id === 'pro' ? (
                    <>
                      <div className={s.price}>
                        <del>${product.pricing.originalAmount}</del>
                        <strong>${product.pricing.amount}</strong>
                      </div>
                      <p className={s.promoCode}>
                        <span>{t('pricing.promoLabel')}</span>
                        <code>{product.pricing.discountCode}</code>
                      </p>
                    </>
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
                    <Button
                      href={product.pricing.purchaseURL}
                      locale={locale}
                      placement="pricing_pro"
                    >
                      {t('pricing.cta')}
                    </Button>
                  ) : (
                    <Button locale={locale} placement="pricing_free">
                      {t('hero.downloadFree')} <span aria-hidden="true">↓</span>
                    </Button>
                  )}
                  <p className={s.planFootnote}>
                    {plan.id === 'pro'
                      ? t('pricing.proFootnote', {
                          customers: product.pricing.customerLimit,
                          original: product.pricing.originalAmount,
                        })
                      : t('pricing.freeFootnote')}
                  </p>
                </article>
              ))}
            </div>
            <p className={s.pricingDeviceNote}>
              {t('pricing.deviceNote', { count: product.pricing.macs })}
            </p>
          </section>

          <section className={s.faq} id="faq" aria-labelledby="faq-title" data-umami-section="faq">
            <div className={s.faqHeading}>
              <div>
                <p className={s.eyebrow}>{t('faq.eyebrow')}</p>
                <h2 id="faq-title">{t('faq.title')}</h2>
              </div>
              <a
                href={localePath(locale, '/feedback/')}
                data-umami-event="nav_click"
                data-umami-event-placement="faq"
                data-umami-event-target="feedback"
              >
                {t('faq.contact')} <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div>
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

          <section
            className={s.install}
            id="install"
            aria-labelledby="install-title"
            data-umami-section="install"
          >
            <img
              src="/assets/images/deskutils-icon.webp"
              alt=""
              width="72"
              height="72"
              loading="lazy"
            />
            <h2 id="install-title">{t('installCta.title')}</h2>
            <p>{t('installCta.description')}</p>
            <div className={s.installActions}>
              <Button locale={locale} placement="hero">
                {t('hero.downloadFree')} <span aria-hidden="true">↓</span>
              </Button>
              <a
                href={localePath(locale, '/install/')}
                data-umami-event="nav_click"
                data-umami-event-placement="install_cta"
                data-umami-event-target="install"
              >
                {t('installCta.link')} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
        </Shell>
      </main>
    </SiteFrame>
  );
}
