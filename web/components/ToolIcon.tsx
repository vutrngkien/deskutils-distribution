import {
  Activity,
  AppWindow,
  ArrowUpRight,
  CircleDot,
  ClipboardList,
  Crop,
  EyeOff,
  History,
  Keyboard,
  LayoutGrid,
  LockKeyhole,
  Monitor,
  MonitorSmartphone,
  Moon,
  MousePointer2,
  PencilLine,
  Pipette,
  ScanFace,
  ScanLine,
  ScanText,
  ScrollText,
  SunDim,
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
  | 'lock'
  | 'ring'
  | 'window'
  | 'jiggler'
  | 'dim'
  | 'external'
  | 'gauge';

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
  ring: CircleDot,
  window: AppWindow,
  jiggler: MousePointer2,
  dim: SunDim,
  external: MonitorSmartphone,
  gauge: Activity,
};

export function ToolIcon({ name, size = 24 }: { name: ToolIconName; size?: number }) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" size={size} strokeWidth={1.7} />;
}
