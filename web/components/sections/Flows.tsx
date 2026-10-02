import { translate, type MessageKey } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import { ToolIcon, type ToolIconName } from '@/components/ToolIcon';

/** Three-item benefit row shared by feature pages. */
export function Flows({
  locale,
  items,
  tone = 'blue',
  columns = 3,
}: {
  locale: Locale;
  items: { icon: ToolIconName; title: MessageKey; body: MessageKey }[];
  tone?: 'blue' | 'lavender';
  columns?: 3 | 4;
}) {
  const tile = tone === 'lavender' ? 'bg-[#efeaff] text-accent' : 'bg-[#eaf0ff] text-primary';
  return (
    <div
      className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${
        columns === 4 ? 'dt:grid-cols-4' : 'dt:grid-cols-3'
      }`}
    >
      {items.map((item) => (
        <div key={item.title} className="flex flex-col gap-3">
          <span className={`grid h-12 w-12 place-items-center rounded-[14px] ${tile}`}>
            <ToolIcon name={item.icon} size={24} />
          </span>
          <h3 className="text-[18px] font-semibold">{translate(locale, item.title)}</h3>
          <p className="text-[15px] leading-[1.5] text-muted">{translate(locale, item.body)}</p>
        </div>
      ))}
    </div>
  );
}
