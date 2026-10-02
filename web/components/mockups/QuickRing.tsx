'use client';

import {
  ClipboardList,
  History,
  Keyboard,
  Moon,
  PencilLine,
  Pipette,
  ScanText,
  type LucideProps,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useIllustrationClock } from './useIllustrationClock';

function CaptureAreaGlyph(props: LucideProps) {
  return (
    <svg
      {...props}
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3H4v4M16 3h4v4M20 17v4h-4M8 21H4v-4" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

const actions: { label: string; icon: ComponentType<LucideProps> }[] = [
  { label: 'Capture Area', icon: CaptureAreaGlyph },
  { label: 'Capture Text', icon: ScanText },
  { label: 'Clipboard', icon: ClipboardList },
  { label: 'Prevent Sleep', icon: Moon },
  { label: 'Screenshot History', icon: History },
  { label: 'Clean Keyboard', icon: Keyboard },
  { label: 'Quick Annotate', icon: PencilLine },
  { label: 'Color Picker', icon: Pipette },
];

/** Temporary visual: Quick Ring radial menu (ported from DUQuickRing). */
export function QuickRing({ className = '', selected }: { className?: string; selected?: number }) {
  const { ref, tick, motionAllowed } = useIllustrationClock(0, selected === undefined);
  const activeIndex = selected ?? (motionAllowed ? [0, 2, 7, 1][Math.floor(tick / 5) % 4] : 0);
  return (
    <div
      ref={ref}
      data-ring-selected={activeIndex}
      aria-hidden="true"
      className={`relative h-[300px] w-[300px] ${className}`}
    >
      <div className="absolute inset-0 rounded-full bg-[#f8f9fd]/95 shadow-[0_0_0_0.5px_rgba(0,0,0,0.14),0_28px_60px_-16px_rgba(10,30,110,0.55)] backdrop-blur-xl" />
      <div
        className="absolute inset-[2%] rounded-full"
        style={{
          background:
            activeIndex >= 0
              ? `conic-gradient(from ${activeIndex * 45 - 22.5}deg, #1450f5 0deg 45deg, transparent 45deg 360deg)`
              : 'transparent',
        }}
      />
      {actions.map((_, index) => (
        <div
          key={`sep-${index}`}
          className="absolute left-1/2 top-[2%] h-[29.6%] w-px bg-black/[0.08]"
          style={{ transformOrigin: '0 144px', transform: `rotate(${22.5 + index * 45}deg)` }}
        />
      ))}
      <div className="absolute left-1/2 top-1/2 flex h-[36.6%] w-[36.6%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full bg-white text-center shadow-[0_0_0_0.5px_rgba(0,0,0,0.1),0_4px_14px_rgba(10,30,110,0.12)]">
        <span className="max-w-[80%] text-[12.5px] font-semibold leading-tight text-[#1d1d1f]">
          {actions[activeIndex]?.label ?? 'Quick Ring'}
        </span>
        <span className="text-[10.5px] tracking-widest text-[#86868b]">⌘ ⌘</span>
      </div>
      {actions.map((action, index) => {
        const angle = -Math.PI / 2 + (index * Math.PI) / 4;
        const Icon = action.icon;
        const active = index === activeIndex;
        return (
          <span
            key={action.label}
            data-ring-icon={index}
            className="absolute flex items-center justify-center"
            style={{
              left: 150 + Math.cos(angle) * 100,
              top: 150 + Math.sin(angle) * 100,
              width: 30,
              height: 30,
              margin: '-15px 0 0 -15px',
            }}
          >
            <Icon
              className={`h-6 w-6 ${active ? 'text-white' : 'text-[#3a3a3f]'}`}
              strokeWidth={1.7}
            />
          </span>
        );
      })}
    </div>
  );
}
