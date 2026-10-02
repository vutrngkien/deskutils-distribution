import { translate, type MessageKey } from '@/content/i18n';
import type { Locale } from '@/content/locales';

/** "Three ways to start" style card used by feature pages. */
export function ShortcutsCard({
  locale,
  eyebrow,
  title,
  items,
}: {
  locale: Locale;
  eyebrow?: MessageKey;
  title: MessageKey;
  items: { name: MessageKey; keys: string }[];
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[22px] bg-[#f3f6ff] p-8">
      {eyebrow && <p className="eyebrow">{translate(locale, eyebrow)}</p>}
      <h2 className="text-[24px] font-bold tracking-[-0.03em]">{translate(locale, title)}</h2>
      <ul className="flex flex-col">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex min-h-[44px] items-center justify-between gap-3 border-b border-line py-2 last:border-b-0"
          >
            <span className="text-[15.5px] font-medium">{translate(locale, item.name)}</span>
            <kbd className="keys">{item.keys}</kbd>
          </li>
        ))}
      </ul>
    </div>
  );
}
