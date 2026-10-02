'use client';

import { Moon, Lock } from 'lucide-react';
import { useIllustrationClock } from './useIllustrationClock';
import { SystemGauges } from './SystemGauges';

/** 9×9 pixel loupe (ported from the Color Picker card). */
export function PixelLoupe({ className = '' }: { className?: string }) {
  const size = 9;
  const cells = Array.from({ length: size * size }, (_, index) => {
    const x = index % size;
    const y = Math.floor(index / size);
    const center = x === 4 && y === 4;
    return {
      center,
      hue: 240 + (x - 4) * 3 + (y - 4) * 2,
      lightness: 62 + (y - 4) * 2 - (x - 4),
    };
  });
  return (
    <div
      aria-hidden="true"
      className={`grid overflow-hidden rounded-full shadow-[0_0_0_5px_#fff,0_20px_40px_-10px_rgba(30,10,90,0.6)] ${className}`}
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
    >
      {cells.map((cell, index) => (
        <span
          key={index}
          style={{
            background: `hsl(${cell.hue} 85% ${cell.lightness}%)`,
            boxShadow: cell.center
              ? 'inset 0 0 0 2px #fff'
              : 'inset 0 0 0 .5px rgba(255,255,255,.18)',
          }}
        />
      ))}
    </div>
  );
}

/** Temporary visual: Prevent Sleep toggle + export progress. */
export function PreventSleepVisual() {
  const { ref, tick, motionAllowed } = useIllustrationClock(12);
  const progress = motionAllowed ? (tick * 6) % 100 : 72;
  return (
    <div
      ref={ref}
      data-motion="export-progress"
      aria-hidden="true"
      className="flex w-full flex-col justify-center gap-3.5"
    >
      <div className="flex items-center gap-2.5 rounded-xl bg-white/95 px-3.5 py-3 text-[14px] text-[#1d1d1f]">
        <Moon size={20} strokeWidth={1.7} />
        <span className="flex-1">Prevent Sleep</span>
        <span className="relative h-[21px] w-9 rounded-full bg-[#1450f5]">
          <span className="absolute right-0.5 top-0.5 h-[17px] w-[17px] rounded-full bg-white" />
        </span>
      </div>
      <div className="flex flex-col gap-2.5 rounded-xl bg-white/12 p-3.5">
        <div className="flex justify-between text-[13px] text-[#dfe7ff]">
          <span>Exporting video</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
          <div
            className="home-export-progress h-full rounded-full bg-[#7fb0ff]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/** Temporary visual: Mouse Jiggler pointer area.
 * Cursor: Google Material Symbols rounded arrow_selector_tool, fill=1.
 * Apache-2.0; see licenses/material-symbols.txt. Matches the Claude export.
 */
export function MouseJigglerVisual() {
  const { ref, tick, motionAllowed } = useIllustrationClock();
  const positions = [
    [15, 25],
    [70, 20],
    [60, 62],
    [25, 58],
  ];
  const [x, y] = motionAllowed ? positions[Math.floor(tick / 2) % 4] : [62, 38];
  return (
    <div
      ref={ref}
      data-motion="mouse-jiggler"
      aria-hidden="true"
      className="relative h-[130px] w-full rounded-xl border-[1.5px] border-dashed border-[#a99bf0]"
    >
      <svg
        className="home-jiggler-pointer"
        data-testid="jiggler-pointer"
        width={26}
        height={26}
        viewBox="0 -960 960 960"
        style={{ left: `${x}%`, top: `${y}%` }}
        focusable="false"
      >
        <path
          d="M606-105q-23 11-46 2.5T526-134L406-392l-93 130q-17 24-45 15t-28-38v-513q0-25 22.5-36t42.5 5l404 318q23 17 13.5 44T684-440H516l119 255q11 23 2.5 46T606-105Z"
          fill="#2a1f6b"
        />
      </svg>
    </div>
  );
}

/** Temporary visual: Clean Keyboard lock. */
export function CleanKeyboardVisual() {
  return (
    <div aria-hidden="true" className="relative flex h-[130px] items-center justify-center">
      <div className="grid grid-cols-8 gap-1.5 opacity-55">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="h-5 w-[22px] rounded-[5px] bg-white shadow-[0_1px_0_#cfd4dd]"
          />
        ))}
      </div>
      <span className="absolute flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#0a1530] text-white">
        <Lock className="h-6 w-6" strokeWidth={1.8} />
      </span>
    </div>
  );
}

/** Temporary visual: two-display dimming scene. */
export function DisplayDimmingVisual() {
  const { ref, tick, motionAllowed } = useIllustrationClock(3);
  const darkness = motionAllowed ? (Math.floor(tick / 3) % 2 ? 0.74 : 0.12) : 0.74;
  return (
    <div ref={ref} aria-hidden="true" className="flex h-[130px] items-end justify-center gap-3.5">
      <span
        className="h-[60px] w-[90px] rounded-[7px]"
        style={{ background: 'linear-gradient(135deg,#7cc4ff,#2f6bff)' }}
      />
      <span
        className="relative h-[80px] w-[120px] overflow-hidden rounded-[7px]"
        style={{ background: 'linear-gradient(135deg,#7cc4ff,#2f6bff)' }}
      >
        <span data-dim-overlay className="home-display-shade" style={{ opacity: darkness }} />
      </span>
    </div>
  );
}

/** Temporary visual: built-in + external display scene. */
export function ExternalDisplayOnlyVisual() {
  return (
    <div aria-hidden="true" className="flex h-[130px] items-end justify-center gap-4">
      <span className="flex flex-col items-center">
        <span className="h-[54px] w-[84px] rounded-t-md bg-[#1b2233]" />
        <span className="h-1.5 w-[104px] rounded-b bg-[#c3c9d4]" />
      </span>
      <span
        className="h-[84px] w-[130px] rounded-[7px]"
        style={{ background: 'linear-gradient(135deg,#7cc4ff,#2f6bff)' }}
      />
    </div>
  );
}

/** Actual app gauge design, with keyboard and touch equivalents to hover. */
export function SystemMonitoringVisual({ interactive = true }: { interactive?: boolean }) {
  return (
    <div className="home-system-visual">
      <SystemGauges animated interactive={interactive} />
    </div>
  );
}
