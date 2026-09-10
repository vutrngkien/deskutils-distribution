import {
  ArrowUpRight,
  ClipboardList,
  Crop,
  EyeOff,
  History,
  Keyboard,
  LayoutGrid,
  LockKeyhole,
  Monitor,
  Moon,
  PencilLine,
  Pipette,
  ScanFace,
  ScanLine,
  ScanText,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';

export type ToolIconName =
  | 'clipboard'
  | 'capture'
  | 'crop'
  | 'arrow'
  | 'blur'
  | 'annotate'
  | 'previous'
  | 'scroll'
  | 'subject'
  | 'color'
  | 'text'
  | 'tools'
  | 'keyboard'
  | 'moon'
  | 'display'
  | 'lock';

const icons: Record<ToolIconName, LucideIcon> = {
  clipboard: ClipboardList,
  capture: ScanLine,
  crop: Crop,
  arrow: ArrowUpRight,
  blur: EyeOff,
  annotate: PencilLine,
  previous: History,
  scroll: ScrollText,
  subject: ScanFace,
  color: Pipette,
  text: ScanText,
  tools: LayoutGrid,
  keyboard: Keyboard,
  moon: Moon,
  display: Monitor,
  lock: LockKeyhole,
};

export function ToolIcon({ name }: { name: ToolIconName }) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" size={24} strokeWidth={1.7} />;
}
