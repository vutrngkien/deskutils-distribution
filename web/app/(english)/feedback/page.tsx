import { FeedbackForm } from '@/components/FeedbackForm';
import { Shell } from '@/components/Site';
import { SiteFrame } from '@/components/SiteFrame';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import { pageMetadata } from '@/content/metadata';
import s from './Feedback.module.css';

export const metadata = {
  ...pageMetadata('en', 'feedback', '/feedback/'),
  robots: { index: false, follow: false },
};

export function FeedbackPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);
  return (
    <SiteFrame locale={locale}>
      <main id="main" lang={locale} className={s.main}>
        <Shell>
          <section className={s.stage} aria-labelledby="feedback-title">
            <header className={s.hero}>
              <p className={s.eyebrow}>{t('feedback.label')}</p>
              <h1 id="feedback-title">
                <span>{t('feedback.title.line1')}</span>
                <span>{t('feedback.title.line2')}</span>
              </h1>
              <p>{t('feedback.description')}</p>
            </header>
            <FeedbackForm locale={locale} />
          </section>
        </Shell>
      </main>
    </SiteFrame>
  );
}

export default function Feedback() {
  return <FeedbackPage />;
}
