import { translate, type MessageKey } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import { getRoute, routeHref } from '@/content/routes';

/**
 * Left column of the "Related guides" block. The install card is the only
 * destination while no guide article is published; the browse link appears
 * automatically once the Guides route is published, so it never points at
 * unrelated content.
 */
export function RelatedGuides({
  locale,
  title,
  installHref,
}: {
  locale: Locale;
  title?: MessageKey;
  installHref: string;
}) {
  const guidesPublished = getRoute('guides').publish;

  return (
    <div data-track-placement="related_guides" className="flex flex-col gap-3.5">
      <h2 className="text-[28px] font-bold tracking-[-0.03em]">
        {translate(locale, title ?? 'screenshot.guides.title')}
      </h2>
      <a
        href={installHref}
        className="flex flex-col gap-1.5 rounded-[20px] bg-[#f3f6ff] p-6 text-base-content"
      >
        <span className="text-[13px] font-semibold text-primary">
          {translate(locale, 'screenshot.guides.install.label')}
        </span>
        <b className="text-[17px]">{translate(locale, 'screenshot.guides.install.title')}</b>
        <span className="text-[14px] text-muted">
          {translate(locale, 'screenshot.guides.install.body')}
        </span>
      </a>
      {guidesPublished && (
        <a
          href={routeHref(locale, 'guides')}
          className="text-[15px] font-semibold text-primary hover:text-[#0b3bc0]"
        >
          {translate(locale, 'screenshot.guides.browse')} →
        </a>
      )}
    </div>
  );
}
