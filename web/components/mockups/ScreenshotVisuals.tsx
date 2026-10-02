import { Copy, Crop, PencilLine, Pin, Trash2, X, type LucideIcon } from 'lucide-react';

const traffic = ['#ff5f57', '#febc2e', '#28c840'];

function TrafficLights() {
  return (
    <span className="flex items-center gap-1.5">
      {traffic.map((color) => (
        <span key={color} className="h-[9px] w-[9px] rounded-full" style={{ background: color }} />
      ))}
    </span>
  );
}

/**
 * Temporary visual: the Quick Access card that appears after a capture
 * (design placeholder S3). Actions follow the app's Quick Access shortcuts.
 */
export function QuickAccessCard() {
  const actions: { icon: LucideIcon; label: string }[] = [
    { icon: Copy, label: 'Copy' },
    { icon: PencilLine, label: 'Open in editor' },
    { icon: Pin, label: 'Pin' },
    { icon: Trash2, label: 'Delete' },
    { icon: X, label: 'Dismiss' },
  ];
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden rounded-[24px]"
      style={{
        background: 'radial-gradient(90% 80% at 20% 0%, #24306f 0%, #101a44 55%, #0b1330 100%)',
      }}
    >
      <div className="absolute left-12 top-14 h-[420px] w-[620px] rounded-[16px] bg-white/10 backdrop-blur" />
      <div className="absolute bottom-10 right-14 w-[360px] rounded-[18px] bg-white p-3 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
        <div className="relative h-[150px] overflow-hidden rounded-[12px] bg-[#eef1f8]">
          <div className="absolute inset-x-4 top-4 h-3 w-32 rounded bg-[#c9d6f5]" />
          <div className="absolute inset-x-4 top-10 h-2.5 w-48 rounded bg-[#dde5f5]" />
          <div className="absolute left-4 top-20 h-16 w-24 rounded bg-[#d7e0fb]" />
          <div className="absolute right-4 top-16 h-20 w-28 rounded bg-[#e6ecfb]" />
          <div className="absolute left-6 top-24 rounded-[4px] border-2 border-[#ff3b30] px-10 py-4" />
        </div>
        <div className="mt-3 flex items-center justify-between px-1">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <span
                key={action.label}
                className="flex flex-col items-center gap-1 text-[10px] text-muted"
              >
                <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#f1f4fb] text-primary">
                  <Icon size={17} />
                </span>
                {action.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Temporary visual: a long page joined into one tall capture. Abstract
 * before/after representation from the design (replaced by a real recording).
 */
export function ScrollingCaptureVisual() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[24px] bg-[#f3f6ff]"
    >
      <div className="flex h-[760px] w-[520px] flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_30px_60px_-24px_rgba(10,30,110,0.45)]">
        <div className="flex h-10 items-center gap-2 border-b border-[#eef1f6] px-4">
          <TrafficLights />
          <div className="ml-3 h-5 flex-1 rounded-full bg-[#f1f4f9]" />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <span className="h-4 w-40 rounded bg-[#c9d6f5]" />
          <span className="h-3 w-64 rounded bg-[#e3e9f5]" />
          <span className="h-[120px] rounded-[10px] bg-[#dfe8ff]" />
          <span className="h-3 w-52 rounded bg-[#e3e9f5]" />
          <span className="h-3 w-60 rounded bg-[#e3e9f5]" />
          <span className="h-[140px] rounded-[10px] bg-[#efeaff]" />
          <span className="h-3 w-48 rounded bg-[#e3e9f5]" />
          <span className="h-[120px] rounded-[10px] bg-[#e6f4ea]" />
          <span className="h-3 w-56 rounded bg-[#e3e9f5]" />
          <span className="h-3 w-40 rounded bg-[#e3e9f5]" />
        </div>
      </div>
      <span className="absolute bottom-8 flex items-center gap-2 rounded-full bg-[#0b1f5c] px-4 py-2 text-[12px] font-semibold text-white">
        <Crop size={14} /> Scrolling Capture · joining 4 screens
      </span>
    </div>
  );
}

/** Temporary visual: Screenshot History window (design placeholder S4). */
export function ScreenshotHistoryVisual() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden rounded-[20px] bg-[#eef3ff] p-6"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_20px_50px_-24px_rgba(10,30,110,0.45)]">
        <div className="flex h-11 items-center gap-3 border-b border-[#eef1f6] px-4">
          <TrafficLights />
          <b className="text-[13px]">Screenshot History</b>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-3 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <span
                className="flex-1 rounded-[10px]"
                style={{
                  background: ['#dfe8ff', '#efeaff', '#e6f4ea', '#fdeaf2', '#e8efff', '#f4efe6'][
                    index
                  ],
                }}
              />
              <span className="h-2.5 w-20 rounded bg-[#dfe3ea]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Temporary visual: a screenshot pinned above another app (S5). */
export function PinnedScreenshotVisual() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden rounded-[20px] bg-[#efeaff]"
    >
      <div className="absolute inset-8 rounded-[14px] bg-white/70 p-6 shadow-[0_20px_50px_-30px_rgba(10,30,110,0.4)]">
        <span className="block h-4 w-40 rounded bg-[#d9def0]" />
        <span className="mt-3 block h-3 w-64 rounded bg-[#e6e9f4]" />
        <span className="mt-3 block h-3 w-52 rounded bg-[#e6e9f4]" />
      </div>
      <div className="absolute bottom-10 right-12 w-[300px] rotate-[-3deg] rounded-[12px] bg-white p-2 shadow-[0_24px_50px_-18px_rgba(10,30,110,0.55)]">
        <div className="relative h-[170px] overflow-hidden rounded-[8px] bg-[#eef1f8]">
          <div className="absolute left-3 top-3 h-3 w-24 rounded bg-[#c9d6f5]" />
          <div className="absolute left-3 top-9 h-2.5 w-36 rounded bg-[#dde5f5]" />
          <div className="absolute left-3 top-[70px] h-14 w-24 rounded bg-[#dfe8ff]" />
          <div className="absolute right-3 top-[60px] h-16 w-24 rounded bg-[#efeaff]" />
        </div>
        <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-muted">
          <span className="flex items-center gap-1.5 font-semibold text-primary">
            <Pin size={13} /> Pinned
          </span>
          <span className="flex items-center gap-2 text-[#86868b]">
            <Copy size={13} />
            <X size={13} />
          </span>
        </div>
      </div>
    </div>
  );
}
