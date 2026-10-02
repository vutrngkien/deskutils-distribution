import { translate, type MessageKey } from '@/content/i18n';
import type { Locale } from '@/content/locales';
import type { ToolIconName } from '@/components/ToolIcon';
import { ToolIcon } from '@/components/ToolIcon';

/** Three-up permission cards used by feature pages. */
export function PermissionsGrid({
  locale,
  items,
  linkHref,
  linkLabel,
}: {
  locale: Locale;
  items: { icon: ToolIconName; name: MessageKey; body: MessageKey }[];
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.name} className="flex flex-col gap-3 rounded-[22px] bg-[#f3f6ff] p-7">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-primary">
              <ToolIcon name={item.icon} size={22} />
            </span>
            <h3 className="text-[19px] font-bold">{translate(locale, item.name)}</h3>
            <p className="text-[15px] leading-[1.5] text-muted">{translate(locale, item.body)}</p>
          </div>
        ))}
      </div>
      {linkHref && linkLabel && (
        <a
          href={linkHref}
          className="text-[15.5px] font-semibold text-primary hover:text-[#0b3bc0]"
        >
          {linkLabel} →
        </a>
      )}
    </div>
  );
}
