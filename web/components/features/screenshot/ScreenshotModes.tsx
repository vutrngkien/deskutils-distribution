'use client';

import { useState } from 'react';
import { ToolIcon, type ToolIconName } from '@/components/ToolIcon';
import { ShotMenu } from '@/components/mockups/ShotMenu';

type Mode = { id: string; icon: ToolIconName; name: string; body: string; keys: string };

/**
 * Capture modes + the Screenshot submenu. Hovering a mode highlights the
 * matching menu row, matching the design's `modeHL` interaction. No timers, so
 * it is inert under Reduce Motion.
 */
/** Maps a capture mode to its row index in the Screenshot menu artwork. */
const menuRow: Record<string, number> = {
  area: 2,
  previous: 3,
  window: 8,
  fullscreen: 1,
  scrolling: 5,
  subject: 6,
  'smart-element': 7,
  annotate: 4,
};

export function ScreenshotModes({
  eyebrow,
  title,
  body,
  items,
}: {
  eyebrow: string;
  title: string;
  body: string;
  items: Mode[];
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const highlight = hovered ? (menuRow[hovered] ?? 2) : 2;
  return (
    <section
      className="container-page grid grid-cols-1 gap-10 pt-16 dt:grid-cols-[5fr_7fr] dt:items-center dt:gap-[72px] dt:pt-[130px]"
      data-umami-section="screenshot-modes"
    >
      <div
        className="relative flex h-[470px] items-center justify-center overflow-hidden rounded-[28px] dt:h-[620px]"
        style={{
          background:
            'radial-gradient(80% 70% at 78% 8%, #86c8ff 0%, #2f6bff 36%, #2a2bd0 66%, #5b2fc2 100%)',
        }}
      >
        <div>
          <ShotMenu highlight={highlight} />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h-section text-[30px] dt:text-[46px]">{title}</h2>
        <p className="text-[17px] leading-[1.55] text-muted">{body}</p>
        <ul className="flex flex-col">
          {items.map((mode) => (
            <li
              key={mode.id}
              onMouseEnter={() => setHovered(mode.id)}
              onFocus={() => setHovered(mode.id)}
              onMouseLeave={() => setHovered(null)}
              onBlur={() => setHovered(null)}
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
