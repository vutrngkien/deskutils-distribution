import { ToolIcon, type ToolIconName } from '@/components/ToolIcon';
import { ProductVisual } from '@/components/media/ProductVisual';
import type { Locale } from '@/content/locales';

type Mode = { id: string; icon: ToolIconName; name: string; body: string; keys: string };

export function ScreenshotModes({
  locale,
  eyebrow,
  title,
  body,
  items,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  body: string;
  items: Mode[];
}) {
  return (
    <section
      className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[5fr_7fr] dt:items-center dt:gap-[72px] dt:pt-[130px]"
      data-umami-section="screenshot-modes"
    >
      <div className="flex items-center justify-center">
        <ProductVisual
          id="screenshot-menu"
          locale={locale}
          className="w-full max-w-[300px] rounded-none! border-0! bg-transparent! dt:max-w-[440px]"
        />
      </div>
      <div className="flex flex-col gap-5">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h-section text-[30px] dt:text-[46px]">{title}</h2>
        <p className="text-[17px] leading-[1.55] text-muted">{body}</p>
        <ul className="flex flex-col">
          {items.map((mode) => (
            <li
              key={mode.id}
              className="grid grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-line py-3"
            >
              <span className="text-primary">
                <ToolIcon name={mode.icon} size={21} />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <b className="text-[16px] font-semibold">{mode.name}</b>
                <span className="text-[14px] text-muted">{mode.body}</span>
              </span>
              <kbd className="keys">{mode.keys}</kbd>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
