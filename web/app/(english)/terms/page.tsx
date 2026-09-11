import { Document } from '@/components/Document';
import { SiteFrame } from '@/components/SiteFrame';
import { product } from '@/content/product';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import { pageMetadata } from '@/content/metadata';

export const metadata = pageMetadata('en', 'terms', '/terms/');
const sections = [
  ['terms.using.title', ['terms.using.body1', 'terms.using.body2']],
  ['terms.plans.title', ['terms.plans.body1', 'terms.plans.body2']],
  ['terms.renewal.title', ['terms.renewal.body']],
  ['terms.payment.title', ['terms.payment.body']],
  ['terms.refunds.title', ['terms.refunds.body']],
  ['terms.beta.title', ['terms.beta.body']],
  ['terms.requirements.title', ['terms.requirements.body']],
  ['terms.changes.title', ['terms.changes.body']],
] as const;
export function TermsPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);
  const values = {
    macs: product.pricing.macs,
    amount: product.pricing.amount,
    original: product.pricing.originalAmount,
    customers: product.pricing.customerLimit,
    version: product.minimumMacOS,
    email: product.supportEmail,
  };
  return (
    <SiteFrame locale={locale}>
      <Document
        locale={locale}
        title="terms.title"
        description="meta.terms.description"
        label="terms.label"
        dated
      >
        {sections.map(([title, bodies]) => (
          <section key={title}>
            <h2>{t(title)}</h2>
            {bodies.map((body) => (
              <p key={body}>{t(body, values)}</p>
            ))}
          </section>
        ))}
      </Document>
    </SiteFrame>
  );
}
export default function Terms() {
  return <TermsPage />;
}
