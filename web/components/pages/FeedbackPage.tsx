import { FeedbackExperience } from '@/components/feedback/FeedbackExperience';
import { translate, type MessageKey } from '@/content/i18n';
import { localePath, type Locale } from '@/content/locales';
import { product } from '@/content/product';

const tipsByKind: Record<'bug' | 'feedback' | 'idea', { title: MessageKey; items: MessageKey[] }> =
  {
    bug: {
      title: 'feedback.tips.bug.title',
      items: [
        'feedback.tips.bug.1',
        'feedback.tips.bug.2',
        'feedback.tips.bug.3',
        'feedback.tips.bug.4',
        'feedback.tips.bug.5',
      ],
    },
    feedback: {
      title: 'feedback.tips.feedback.title',
      items: [
        'feedback.tips.feedback.1',
        'feedback.tips.feedback.2',
        'feedback.tips.feedback.3',
        'feedback.tips.feedback.4',
      ],
    },
    idea: {
      title: 'feedback.tips.idea.title',
      items: [
        'feedback.tips.idea.1',
        'feedback.tips.idea.2',
        'feedback.tips.idea.3',
        'feedback.tips.idea.4',
      ],
    },
  };

export function FeedbackPage({ locale = 'en' }: { locale?: Locale }) {
  const t = translate.bind(null, locale);

  const links = [
    {
      id: 'install',
      icon: 'install' as const,
      label: 'feedback.links.install' as const,
      href: localePath(locale, '/install/'),
    },
    {
      id: 'support',
      icon: 'support' as const,
      label: 'feedback.links.support' as const,
      href: localePath(locale, '/support/'),
    },
    {
      id: 'email',
      icon: 'email' as const,
      label: 'feedback.links.email' as const,
      href: `mailto:${product.supportEmail}`,
    },
  ];

  return (
    <main id="main" lang={locale}>
      <header
        className="container-page flex flex-col gap-4 pt-10 dt:pt-14"
        style={{
          background: 'radial-gradient(50% 90% at 20% 0%, #e3ecff 0%, rgba(227,236,255,0) 70%)',
        }}
      >
        <p className="eyebrow">{t('feedback.label')}</p>
        <h1 className="h-display max-w-[820px]">
          {t('feedback.title.line1')}
          <br />
          {t('feedback.title.line2')}
        </h1>
        <p className="lede max-w-[640px]">{t('feedback.description')}</p>
      </header>

      <div className="container-page grid grid-cols-1 gap-10 pb-20 pt-8 dt:grid-cols-[7fr_4fr] dt:items-start dt:gap-14">
        <FeedbackExperience locale={locale} tipsByKind={tipsByKind} links={links} />
      </div>
    </main>
  );
}
