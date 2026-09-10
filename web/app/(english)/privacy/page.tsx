import { Document } from '@/components/Document';
import { SiteFrame } from '@/components/SiteFrame';
import { product, permissions } from '@/content/product';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import { pageMetadata } from '@/content/metadata';

export const metadata = pageMetadata('en', 'privacy', '/privacy/');
const sections = [
  ['privacy.local.title', ['privacy.local.body1', 'privacy.local.body2']],
  ['privacy.network.title', ['privacy.network.body']],
  ['privacy.website.title', ['privacy.website.body']],
  ['privacy.purchase.title', ['privacy.purchase.body1', 'privacy.purchase.body2']],
  ['privacy.support.title', ['privacy.support.body']],
  ['privacy.changes.title', ['privacy.changes.body']],
] as const;
export function PrivacyPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);
  return (
    <SiteFrame locale={locale}>
      <Document
        locale={locale}
        title="privacy.title"
        description="meta.privacy.description"
        label="privacy.label"
        dated
      >
        <section>
          <h2>{t('privacy.local.title')}</h2>
          <p>{t('privacy.local.body1')}</p>
          <p>{t('privacy.local.body2')}</p>
        </section>
        <section>
          <h2>{t('privacy.permissions.title')}</h2>
          <p>{t('privacy.permissions.intro')}</p>
          <ul>
            {permissions.map((permission) => (
              <li key={permission.name}>
                <strong>{t(permission.name)}:</strong> {t(permission.description)}
              </li>
            ))}
          </ul>
          <p>{t('privacy.permissions.outro')}</p>
        </section>
        {sections.slice(1).map(([title, bodies]) => (
          <section key={title}>
            <h2>{t(title)}</h2>
            {bodies.map((body) => (
              <p key={body}>{t(body, { email: product.supportEmail })}</p>
            ))}
          </section>
        ))}
      </Document>
    </SiteFrame>
  );
}
export default function Privacy() {
  return <PrivacyPage />;
}
