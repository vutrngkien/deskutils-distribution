import {
  BadgeCheck,
  Download,
  ExternalLink,
  FolderInput,
  LockKeyhole,
  MousePointerClick,
  Settings2,
  Wifi,
} from 'lucide-react';
import { SiteFrame } from '@/components/SiteFrame';
import { Button, Shell } from '@/components/Site';
import { product, permissions } from '@/content/product';
import { translate } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';
import { pageMetadata } from '@/content/metadata';
import s from './Install.module.css';

export const metadata = pageMetadata('en', 'install', '/install/');

const gatekeeperSteps = [
  {
    title: 'install.gatekeeper.try.title',
    body: 'install.gatekeeper.try.body',
    icon: MousePointerClick,
  },
  {
    title: 'install.gatekeeper.settings.title',
    body: 'install.gatekeeper.settings.body',
    icon: Settings2,
  },
  {
    title: 'install.gatekeeper.confirm.title',
    body: 'install.gatekeeper.confirm.body',
    icon: LockKeyhole,
  },
] as const;

const permissionIcons = [BadgeCheck, LockKeyhole, Wifi] as const;

export function InstallPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);

  return (
    <SiteFrame locale={locale}>
      <main id="main" lang={locale} className={s.main}>
        <Shell>
          <div className={s.page}>
            <a
              href={localePath(locale, '/')}
              className={s.back}
              data-umami-event="nav_click"
              data-umami-event-placement="install"
              data-umami-event-target="home"
            >
              <span aria-hidden="true">←</span> {t('document.back')}
            </a>

            <header className={s.hero}>
              <p className={s.eyebrow}>{t('install.label')}</p>
              <h1>{t('install.title')}</h1>
              <p>{t('meta.install.description')}</p>
            </header>

            <div className={s.guideGrid}>
              <section className={s.downloadCard} aria-labelledby="download-heading">
                <div className={s.appIcon}>
                  <img src="/assets/images/deskutils-icon.webp" alt="" width="92" height="92" />
                </div>
                <h2 id="download-heading">{t('install.download')}</h2>
                <p className={s.downloadCopy}>
                  {t('install.before.body', { version: product.minimumMacOS })}
                </p>
                <Button locale={locale} placement="install_page">
                  <Download aria-hidden="true" size={17} />
                  {t('install.download')}
                </Button>
                <div className={s.downloadMeta}>
                  <span>macOS {product.minimumMacOS}+</span>
                  <span aria-hidden="true">·</span>
                  <span>DeskUtils.dmg</span>
                </div>
              </section>

              <section className={s.stepsCard} aria-labelledby="steps-heading">
                <div className={s.sectionTitle}>
                  <span aria-hidden="true" />
                  <h2 id="steps-heading">{t('install.steps.title')}</h2>
                </div>
                <ol className={s.steps}>
                  <li>
                    <span className={s.stepNumber}>1</span>
                    <div className={s.stepIcon} aria-hidden="true">
                      <FolderInput />
                    </div>
                    <div>
                      <h3>{t('install.steps.install.title')}</h3>
                      <p>{t('install.steps.install.body')}</p>
                    </div>
                  </li>
                  {gatekeeperSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <li key={step.title}>
                        <span className={s.stepNumber}>{index + 2}</span>
                        <div className={s.stepIcon} aria-hidden="true">
                          <Icon />
                        </div>
                        <div>
                          <h3>{t(step.title)}</h3>
                          <p>{t(step.body)}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            </div>

            <div className={s.detailGrid}>
              <section className={s.detailCard}>
                <p className={s.detailLabel}>{t('install.permissions.title')}</p>
                <h2>{t('install.permissions.heading')}</h2>
                <p className={s.detailIntro}>{t('install.permissions.body')}</p>
                <div className={s.permissions}>
                  {[
                    ...permissions,
                    {
                      name: 'permission.network.title' as const,
                      description: 'permission.network.description' as const,
                    },
                  ].map((permission, index) => {
                    const Icon = permissionIcons[index];
                    return (
                      <div key={permission.name}>
                        <span aria-hidden="true">
                          <Icon />
                        </span>
                        <div>
                          <h3>{t(permission.name)}</h3>
                          <p>{t(permission.description)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className={s.detailCard}>
                <p className={s.detailLabel}>{t('install.verify.title')}</p>
                <h2>{t('install.verify.heading')}</h2>
                <p className={s.detailIntro}>{t('install.verify.body')}</p>
                <code>shasum -a 256 ~/Downloads/DeskUtils.dmg</code>
                <p className={s.verifyNote}>
                  {t('install.verify.failure')}{' '}
                  <a
                    href={product.releasesURL}
                    data-umami-event="external_link"
                    data-umami-event-placement="install"
                    data-umami-event-target="release_verification"
                  >
                    {t('install.verify.release')}
                  </a>
                  .
                </p>
                <Button
                  href={product.releasesURL}
                  locale={locale}
                  placement="install_page"
                  secondary
                >
                  {t('install.releaseNotes')}
                  <ExternalLink aria-hidden="true" size={16} />
                </Button>
              </section>
            </div>

            <p className={s.support}>
              {t('install.gatekeeper.support', { email: product.supportEmail })}
            </p>
          </div>
        </Shell>
      </main>
    </SiteFrame>
  );
}

export default function Install() {
  return <InstallPage />;
}
