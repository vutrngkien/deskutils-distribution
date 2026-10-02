import {
  AppWindow,
  ChevronRight,
  ClipboardList,
  Keyboard,
  Moon,
  MousePointer2,
  Pipette,
  Power,
  RefreshCw,
  ScanLine,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { SystemGauges } from './SystemGauges';

type Row = {
  label: string;
  key?: string;
  icon: LucideIcon;
  toggle?: boolean;
  on?: boolean;
  chevron?: boolean;
  sepBefore?: boolean;
};

const rows: Row[] = [
  { label: 'Clipboard Manager', key: '⇧⌘V', icon: ClipboardList },
  { label: 'Color Picker', key: '⇧⌘C', icon: Pipette },
  { label: 'Window Switcher', key: '⌘Tab', icon: AppWindow },
  { label: 'Clean Keyboard', key: '⇧⌘K', icon: Keyboard, toggle: true, on: false, sepBefore: true },
  { label: 'Prevent Sleep', key: '⇧⌘P', icon: Moon, toggle: true, on: false },
  { label: 'Mouse Jiggler', key: '⇧⌘J', icon: MousePointer2, toggle: true, on: false },
  { label: 'Screenshot', icon: ScanLine, chevron: true, sepBefore: true },
  { label: 'Check for Updates', icon: RefreshCw, sepBefore: true },
  { label: 'Settings', key: '⌘,', icon: Settings },
  { label: 'Quit DeskUtils', key: '⌘Q', icon: Power },
];

/** Temporary visual: DeskUtils menu bar popover (ported from DUMenu). */
export function DeskUtilsMenu({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`w-[320px] rounded-[14px] bg-[#f7f8fb]/95 px-1.5 pb-1.5 pt-3 text-[13.5px] text-[#1d1d1f] shadow-[0_0_0_0.5px_rgba(0,0,0,0.16),0_24px_60px_-14px_rgba(10,30,110,0.5)] backdrop-blur-xl ${className}`}
    >
      <div className="flex justify-around px-2 pb-3 pt-0.5">
        <SystemGauges decorative />
      </div>
      <div className="flex flex-col">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label}>
              {row.sepBefore ? <div className="mx-2.5 my-1 h-px bg-black/10" /> : null}
              <div className="flex h-[30px] items-center gap-2.5 rounded-[7px] px-2.5">
                <Icon className="h-[18px] w-[18px] shrink-0 text-[#333]" strokeWidth={1.7} />
                <span className="flex-1 truncate">{row.label}</span>
                {row.key ? <span className="text-[12.5px] text-[#8e8e93]">{row.key}</span> : null}
                {row.chevron && <ChevronRight size={18} className="text-[#8e8e93]" />}
                {row.toggle ? (
                  <span
                    className={`relative h-5 w-[34px] shrink-0 rounded-full ${
                      row.on ? 'bg-[#1450f5]' : 'bg-[#e3e4e8]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow ${
                        row.on ? 'left-4' : 'left-0.5'
                      }`}
                    />
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
