import { Document } from '@/components/Document';
import { SiteFrame } from '@/components/SiteFrame';
import { Button } from '@/components/Site';
import { product, permissions } from '@/content/product';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import { pageMetadata } from '@/content/metadata';
import s from '@/components/Document.module.css';

export const metadata = pageMetadata('en', 'install', '/install/');

export function InstallPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);
  return (
    <SiteFrame locale={locale}>
      <Document
        locale={locale}
        title="install.title"
        description="meta.install.description"
        label="install.label"
      >
        <div className={s.actions}>
          <Button locale={locale} placement="install_page">
            {t('install.download')} ↓
          </Button>
          <Button href={product.releasesURL} secondary>
            {t('install.releaseNotes')}
          </Button>
        </div>
        <section>
          <h2>{t('install.before.title')}</h2>
          <p>{t('install.before.body', { version: product.minimumMacOS })}</p>
        </section>
        <section>
          <h2>{t('install.steps.title')}</h2>
          <ol>
            <li>{t('install.steps.download')}</li>
            <li>{t('install.steps.open')}</li>
            <li>{t('install.steps.drag')}</li>
            <li>{t('install.steps.launch')}</li>
          </ol>
        </section>
        <section>
          <h2>{t('install.gatekeeper.title')}</h2>
          <p>{t('install.gatekeeper.body')}</p>
          <p>
            <a href="https://support.apple.com/en-us/102445">{t('install.gatekeeper.apple')}</a>
          </p>
          <p>{t('install.gatekeeper.support', { email: product.supportEmail })}</p>
        </section>
        <section>
          <h2>{t('install.permissions.title')}</h2>
          <p>{t('install.permissions.body')}</p>
          {permissions.map((permission) => (
            <div key={permission.name}>
              <h3>{t(permission.name)}</h3>
              <p>{t(permission.description)}</p>
            </div>
          ))}
          <h3>{t('permission.network.title')}</h3>
          <p>{t('permission.network.description')}</p>
        </section>
        <section>
          <h2>{t('install.verify.title')}</h2>
          <p>{t('install.verify.body')}</p>
          <code>shasum -a 256 ~/Downloads/DeskUtils.dmg</code>
          <p>
            {t('install.verify.failure')}{' '}
            <a href={product.releasesURL}>{t('install.verify.release')}</a>.
          </p>
        </section>
      </Document>
    </SiteFrame>
  );
}
export default function Install() {
  return <InstallPage />;
}
