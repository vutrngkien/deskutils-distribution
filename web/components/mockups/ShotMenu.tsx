import {
  AppWindow,
  ChevronLeft,
  ChevronRight,
  Crop,
  History,
  Maximize,
  MousePointerClick,
  PencilLine,
  ScanFace,
  ScanText,
  ScrollText,
  SquarePen,
  type LucideIcon,
} from 'lucide-react';

type Row = { icon: LucideIcon; label: string; keys?: string; sep?: boolean };

const rows: Row[] = [
  { icon: ScanText, label: 'Capture Text (OCR)', keys: '⇧⌘2', sep: true },
  { icon: Maximize, label: 'Capture Fullscreen', keys: '⌥⇧⌘3', sep: true },
  { icon: Crop, label: 'Capture Area', keys: '⌥⇧⌘4' },
  { icon: History, label: 'Capture Previous Area', keys: '⇧⌘8' },
  { icon: PencilLine, label: 'Quick Annotate', keys: '⇧⌘7' },
  { icon: ScrollText, label: 'Scrolling Capture', keys: '⌥⇧⌘6' },
  { icon: ScanFace, label: 'Capture Subject', keys: '⇧⌘1' },
  { icon: MousePointerClick, label: 'Capture Smart Element', keys: '⌥⇧4' },
  { icon: AppWindow, label: 'Capture Active Window', keys: '⌥⇧⌘9' },
  { icon: SquarePen, label: 'Open Annotate', sep: true },
  { icon: History, label: 'Open Screenshot History', keys: '⇧⌘H' },
];

/**
 * Temporary visual: the Screenshot submenu (ported from DUShotMenu). The
 * `highlight` row mirrors the hovered capture mode on the feature page.
 */
export function ShotMenu({ highlight = 2 }: { highlight?: number }) {
  return (
    <div
      aria-hidden="true"
      className="w-[320px] rounded-[14px] p-2 text-[13.5px] text-[#1d1d1f] shadow-[0_0_0_0.5px_rgba(0,0,0,0.12),0_30px_60px_-24px_rgba(10,30,110,0.6)] backdrop-blur-xl"
      style={{ background: 'rgba(247,248,251,0.96)' }}
    >
      <div className="flex h-[34px] items-center gap-1.5 px-1.5 font-semibold text-[14.5px]">
        <ChevronLeft size={16} />
        Screenshot
      </div>
      {rows.map((row, index) => {
        const Icon = row.icon;
        return (
          <div key={row.label}>
            <div
              data-shot-row={index}
              className={`flex h-[30px] items-center gap-2.5 rounded-[7px] px-2.5 ${
                index === highlight ? 'bg-black/[0.07]' : ''
              }`}
            >
              <Icon size={15} className="text-[#3a3a3f]" />
              <span className="flex-1 truncate">{row.label}</span>
              {row.keys && <span className="text-[11px] text-[#86868b]">{row.keys}</span>}
              <ChevronRight size={14} className="text-[#c7c7cc]" />
            </div>
            {row.sep && <div className="mx-2.5 my-[5px] h-px bg-black/[0.09]" />}
          </div>
        );
      })}
    </div>
  );
}
