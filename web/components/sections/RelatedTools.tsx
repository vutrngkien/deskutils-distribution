import { translate, type MessageKey } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import type { ToolIconName } from '@/components/ToolIcon';
import { ToolIcon } from '@/components/ToolIcon';

/**
 * "Works well with" grid. Callers pass already-localized hrefs (typically via
 * `routeHref`) so gated tools never become dead links.
 */
export function RelatedTools({
  locale,
  items,
}: {
  locale: Locale;
  items: { id: string; icon: ToolIconName; href: string; name: MessageKey; body: MessageKey }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          className="flex items-center gap-4 rounded-[18px] bg-white p-5 shadow-[0_0_0_1px_#eef1f6] transition-colors hover:bg-[#f3f6ff]"
        >
          <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-xl bg-[#eaf0ff] text-primary">
            <ToolIcon name={item.icon} size={22} />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <b className="text-[16px]">{translate(locale, item.name)}</b>
            <span className="text-[14px] text-muted">{translate(locale, item.body)}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
