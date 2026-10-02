'use client';

import { MockupCanvas } from './MockupCanvas';
import { QuickRing } from './QuickRing';
import { useIllustrationClock } from './useIllustrationClock';

export function QuickRingDemo({ steps }: { steps: string[] }) {
  const { ref, tick, motionAllowed } = useIllustrationClock(6);
  const phase = motionAllowed ? tick % 12 : 6;
  const open = phase >= 4 && phase <= 9;
  const selected = phase >= 5 && phase <= 9 ? 0 : -1;
  const step = !open ? 0 : phase === 4 ? 1 : 2;
  return (
    <div ref={ref} className="home-ring-demo" data-ring-phase={phase} aria-hidden="true">
      <MockupCanvas width={300} height={300} className="home-ring-art">
        <div className="home-ring-reveal" data-open={open}>
          <QuickRing selected={selected} />
        </div>
      </MockupCanvas>
      <span className="home-ring-pill">{steps[step]}</span>
      <div className="home-ring-keys">
        <span data-pressed={phase === 2}>⌘</span>
        <span data-pressed={phase === 3}>⌘</span>
      </div>
    </div>
  );
}
