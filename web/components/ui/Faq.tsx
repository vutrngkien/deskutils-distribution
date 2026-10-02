import { translate, type MessageKey, type MessageValues } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import { TrackedFaq } from '@/components/TrackedFaq';

/**
 * Native exclusive accordion shared by feature pages. One `<details>` group per
 * page, so a single answer is open at a time and it still works without JS.
 * `values` interpolates `{placeholder}` tokens (used by pricing/utility FAQs).
 */
export function Faq({
  locale,
  id,
  items,
  className = '',
}: {
  locale: Locale;
  id: string;
  items: { id: string; question: MessageKey; answer: MessageKey; values?: MessageValues }[];
  className?: string;
}) {
  const group = `${id}-faq`;
  return (
    <div data-umami-section={`${id}-faq`} className={`flex flex-col ${className}`}>
      {items.map((item) => (
        <TrackedFaq
          key={item.id}
          id={item.id}
          name={group}
          locale={locale}
          question={translate(locale, item.question, item.values)}
          answer={translate(locale, item.answer, item.values)}
        />
      ))}
    </div>
  );
}
