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
import { Button } from '@/components/ui/Button';
import { CopyCommand } from '@/components/install/CopyCommand';
import { Panel } from '@/components/ui/Panel';
import { product } from '@/content/product';
import { translate } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';

const shaCommand = 'shasum -a 256 ~/Downloads/DeskUtils.dmg';

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

const troubleshooting = [
  {
    question: 'install.troubleshooting.noAnyway',
    answer: 'install.troubleshooting.noAnywayAnswer',
  },
  {
    question: 'install.troubleshooting.hashMismatch',
    answer: 'install.troubleshooting.hashMismatchAnswer',
  },
  {
    question: 'install.troubleshooting.wontOpen',
    answer: 'install.troubleshooting.wontOpenAnswer',
  },
  {
    question: 'install.troubleshooting.toolDeclined',
    answer: 'install.troubleshooting.toolDeclinedAnswer',
  },
] as const;

const permissionIcons = [BadgeCheck, LockKeyhole, Wifi] as const;

const permissions = [
  { name: 'permission.screen.title', description: 'permission.screen.description' },
  { name: 'permission.accessibility.title', description: 'permission.accessibility.description' },
  { name: 'permission.network.title', description: 'permission.network.description' },
] as const;

function StepRow({
  number,
  icon: Icon,
  title,
  body,
}: {
  number: number;
  icon: (typeof gatekeeperSteps)[number]['icon'] | typeof FolderInput;
  title: string;
  body: string;
}) {
  return (
    <li className="grid grid-cols-[30px_34px_minmax(0,1fr)] items-start gap-3 border-b border-line py-5 last:border-b-0 max-sm:grid-cols-[30px_minmax(0,1fr)]">
      <span className="grid h-[30px] w-[30px] place-items-center rounded-[9px] border border-[#cfdcff] bg-[#edf3ff] text-[12px] font-semibold text-[#174bc9]">
        {number}
      </span>
      <span
        className="grid h-[30px] place-items-center text-primary max-sm:hidden"
        aria-hidden="true"
      >
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <div>
        <h3 className="text-[15px] font-semibold">{title}</h3>
        <p className="mt-1 text-[13px] leading-[1.55] text-muted">{body}</p>
      </div>
    </li>
  );
}

export function InstallPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);

  return (
    <main id="main" lang={locale}>
      <div className="container-page pb-16 dt:pb-[88px]">
        <a
          href={localePath(locale, '/')}
          className="inline-flex items-center gap-1.5 pt-10 text-sm text-muted transition-colors hover:text-primary"
          data-track-event="nav_click"
          data-track-event-placement="install"
          data-track-event-target="home"
        >
          <span aria-hidden="true">←</span> {t('document.back')}
        </a>

        <header className="mx-auto my-10 flex max-w-[650px] flex-col items-center gap-4 text-center dt:my-14">
          <p className="eyebrow">{t('install.label')}</p>
          <h1 className="h-display">{t('install.title')}</h1>
          <p className="lede max-w-[570px]">{t('meta.install.description')}</p>
        </header>

        <div className="grid grid-cols-1 gap-5 dt:grid-cols-[1fr_360px] dt:items-start">
          <div className="order-2 flex flex-col dt:order-1">
            <Panel trackingSection="install-steps" as="section" className="p-7 dt:p-9">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="h-px w-5 bg-primary" aria-hidden="true" />
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary">
                  {t('install.steps.title')}
                </h2>
              </div>
              <ol>
                <StepRow
                  number={1}
                  icon={FolderInput}
                  title={t('install.steps.install.title')}
                  body={t('install.steps.install.body')}
                />
                {gatekeeperSteps.map((step, index) => (
                  <StepRow
                    key={step.title}
                    number={index + 2}
                    icon={step.icon}
                    title={t(step.title)}
                    body={t(step.body)}
                  />
                ))}
              </ol>
            </Panel>

            <Panel
              trackingSection="install-home"
              as="section"
              className="mt-5 bg-[#eaf7ee] p-7 dt:p-9"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-white text-success">
                  <BadgeCheck size={22} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-[20px] font-bold">{t('install.home.title')}</h2>
                  <p className="mt-2 text-[14.5px] leading-[1.55] text-muted">
                    {t('install.home.body')}
                  </p>
                </div>
              </div>
            </Panel>

            <div className="mt-12 grid grid-cols-1 gap-5 dt:grid-cols-2">
              <Panel
                trackingSection="install-permissions"
                as="section"
                className="p-8"
                id="permissions"
              >
                <p className="text-[12px] font-semibold uppercase tracking-[0.13em] text-primary">
                  {t('install.permissions.title')}
                </p>
                <h2 className="mt-2.5 text-[24px] font-semibold">
                  {t('install.permissions.heading')}
                </h2>
                <p className="mt-2.5 text-sm text-muted">{t('install.permissions.body')}</p>
                <div className="mt-5">
                  {permissions.map((permission, index) => {
                    const Icon = permissionIcons[index];
                    return (
                      <div
                        key={permission.name}
                        className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 border-t border-line py-3.5"
                      >
                        <span
                          className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#edf3ff] text-primary"
                          aria-hidden="true"
                        >
                          <Icon size={16} />
                        </span>
                        <div>
                          <h3 className="text-sm font-semibold">{t(permission.name)}</h3>
                          <p className="mt-1 text-xs leading-[1.5] text-muted">
                            {t(permission.description)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Panel>

              <Panel trackingSection="install-verify" as="section" className="flex flex-col p-8">
                <p className="text-[12px] font-semibold uppercase tracking-[0.13em] text-primary">
                  {t('install.verify.title')}
                </p>
                <h2 className="mt-2.5 text-[24px] font-semibold">{t('install.verify.heading')}</h2>
                <p className="mt-2.5 text-sm text-muted">{t('install.verify.body')}</p>
                <div className="mt-5">
                  <CopyCommand command={shaCommand} locale={locale} />
                </div>
                <p className="mt-4 text-[13px] text-muted">
                  {t('install.verify.failure')}{' '}
                  <a
                    href={product.releasesURL}
                    className="text-primary underline underline-offset-[3px]"
                    data-track-event="external_link"
                    data-track-event-placement="install"
                    data-track-event-target="release_verification"
                  >
                    {t('install.verify.release')}
                  </a>
                  .
                </p>
                <div className="mt-5">
                  <Button
                    href={product.releasesURL}
                    locale={locale}
                    placement="install_page"
                    variant="secondary"
                  >
                    {t('install.releaseNotes')}
                    <ExternalLink aria-hidden="true" size={16} />
                  </Button>
                </div>
              </Panel>
            </div>

            <Panel trackingSection="install-troubleshooting" as="section" className="mt-12 p-8">
              <h2 className="text-[18px] font-bold">{t('install.troubleshooting.title')}</h2>
              <div className="mt-4 flex flex-col">
                {troubleshooting.map((item) => (
                  <details
                    key={item.question}
                    data-track-faq={item.question}
                    data-track-faq-group="install-troubleshooting"
                    className="group border-b border-line last:border-b-0"
                  >
                    <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold">
                      {t(item.question)}
                      <span
                        className="text-[22px] font-normal leading-none text-primary"
                        aria-hidden="true"
                      >
                        <span className="group-open:hidden">+</span>
                        <span className="hidden group-open:inline">−</span>
                      </span>
                    </summary>
                    <p className="mb-4 max-w-[680px] text-[14.5px] leading-[1.6] text-muted">
                      {t(item.answer, { email: product.supportEmail })}
                    </p>
                  </details>
                ))}
              </div>
            </Panel>

            <Panel
              trackingSection="install-support"
              as="section"
              className="mt-5 flex flex-col gap-4 p-8 dt:flex-row dt:items-center dt:justify-between"
            >
              <h2 className="text-[18px] font-bold">{t('install.support.title')}</h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href={localePath(locale, '/feedback/')}
                  className="flex min-h-[42px] items-center rounded-[11px] bg-[#f3f6ff] px-4 text-sm font-semibold text-primary hover:bg-[#eaf0ff]"
                >
                  {t('install.support.report')}
                </a>
                <a
                  href={`mailto:${product.supportEmail}`}
                  className="flex min-h-[42px] items-center rounded-[11px] bg-[#f3f6ff] px-4 text-sm font-semibold text-primary hover:bg-[#eaf0ff]"
                >
                  {t('install.support.email')}
                </a>
              </div>
            </Panel>
          </div>

          <aside className="order-1 dt:order-2 dt:sticky dt:top-24">
            <Panel
              trackingSection="install-download"
              className="flex flex-col items-center p-7 text-center"
            >
              <div className="mb-5 grid h-[104px] w-[104px] place-items-center rounded-full border border-[#cfdcff] bg-white shadow-[0_0_0_8px_rgba(237,243,255,0.68)]">
                <img
                  src="/assets/images/deskutils-icon.webp"
                  alt=""
                  width="72"
                  height="72"
                  className="rounded-[16px]"
                />
              </div>
              <h2 className="text-[20px] font-semibold">{t('install.download')}</h2>
              <p className="mt-3 text-sm leading-[1.55] text-muted">
                {t('install.before.body', { version: product.minimumMacOS })}
              </p>
              <div className="mt-5 w-full">
                <Button locale={locale} placement="install_page" className="w-full">
                  <Download aria-hidden="true" size={17} />
                  {t('install.download')}
                </Button>
              </div>
              <div className="mt-3.5 flex flex-wrap justify-center gap-1.5 text-xs text-[#8b919d]">
                <span>macOS {product.minimumMacOS}+</span>
                <span aria-hidden="true">·</span>
                <span>DeskUtils.dmg</span>
              </div>
            </Panel>
            <p className="mt-4 px-2 text-[13px] leading-[1.55] text-muted">
              {t('install.gatekeeper.support', { email: product.supportEmail })}
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
