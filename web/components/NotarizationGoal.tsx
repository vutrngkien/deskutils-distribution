import Image from 'next/image';
import { DonationLink } from '@/components/DonationLink';
import { NotarizationProgress } from '@/components/NotarizationProgress';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import { notarizationGoal } from '@/content/notarization';

export function NotarizationGoal({
  locale,
  headingLevel = 3,
}: {
  locale: Locale;
  headingLevel?: 2 | 3;
}) {
  const t = translate.bind(null, locale);
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const { targetUSD, fundedPercent } = notarizationGoal;
  const amount = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return (
    <section
      id="notarization"
      className="home-notarization"
      aria-labelledby="notarization-title"
      data-umami-section="notarization"
    >
      <div className="card notarization-surface shadow-none">
        <div className="card-body items-center gap-0 px-5 py-7 text-center [&_p]:grow-0 md:px-8 md:py-8">
          <div
            className="notarization-apple flex size-[60px] items-center justify-center rounded-2xl bg-base-100"
            aria-hidden="true"
          >
            <Image
              src="/images/apple-logo.svg"
              alt=""
              width={28}
              height={34}
              className="h-[34px] w-7"
            />
          </div>
          <a
            href="https://developer.apple.com/programs/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Apple Developer Program
          </a>
          <Heading
            id="notarization-title"
            className="notarization-title mt-1 font-bold tracking-tight"
          >
            {t('notarization.title')}
          </Heading>
          <p className="mt-2 max-w-[600px] text-sm leading-relaxed text-muted">
            {t('notarization.body')}
          </p>
          <div className="mt-5 w-full max-w-[720px] text-left">
            <NotarizationProgress
              initialPercent={Math.max(0, Math.min(100, fundedPercent))}
              targetUSD={targetUSD}
              targetAmount={amount.format(targetUSD)}
              raisedLabel={t('notarization.raised')}
              targetLabel={t('notarization.target')}
              progressTemplate={t('notarization.progress')}
              title={t('notarization.title')}
            />
          </div>
          <div className="mt-5 flex w-full flex-col items-center gap-3 md:flex-row md:justify-center md:gap-5">
            <DonationLink
              locale={locale}
              placement="notarization_goal"
              className="btn support-kofi-button h-auto min-h-11 w-full rounded-xl px-5 py-3 whitespace-normal md:w-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {t('donation.cta')}
            </DonationLink>
            <p className="max-w-[380px] text-xs leading-relaxed text-muted">
              {t('donation.supportFootnote')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
