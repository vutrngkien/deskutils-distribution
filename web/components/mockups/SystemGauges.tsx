'use client';

import { useState } from 'react';
import { Cpu, HardDrive, type LucideProps } from 'lucide-react';
import { useIllustrationClock } from './useIllustrationClock';

function MemoryChip(props: LucideProps) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x={3} y={7} width={18} height={11} rx={2} />
      <path d="M6 4v3M10 4v3M14 4v3M18 4v3M6 18v2M10 18v2M14 18v2M18 18v2" />
    </svg>
  );
}

const metrics = [
  { name: 'CPU', symbol: Cpu },
  { name: 'MEM', symbol: MemoryChip },
  { name: 'DISK', symbol: HardDrive },
];
const samples = [
  [22, 71, 64],
  [38, 73, 64],
  [27, 70, 65],
];

function Gauge({
  metric,
  value,
  decorative,
}: {
  metric: (typeof metrics)[number];
  value: number;
  decorative: boolean;
}) {
  const [pinned, setPinned] = useState(false);
  const Symbol = metric.symbol;
  const drawing = (
    <svg viewBox="0 0 60 60" aria-hidden="true" focusable="false">
      <circle
        cx={30}
        cy={30}
        r={27.5}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.18}
        strokeWidth={5}
      />
      <circle
        className="du-metric-arc"
        cx={30}
        cy={30}
        r={27.5}
        fill="none"
        stroke="#00c82d"
        strokeWidth={5}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={`${value} 100`}
        transform="rotate(-90 30 30)"
      />
      <Symbol
        className="du-metric-symbol"
        x={22.5}
        y={18}
        width={15}
        height={15}
        strokeWidth={1.8}
      />
      <text className="du-metric-value" x={30} y={27} textAnchor="middle" dominantBaseline="middle">
        {value}%
      </text>
      <text className="du-metric-label" x={30} y={38} textAnchor="middle" dominantBaseline="middle">
        {metric.name}
      </text>
    </svg>
  );
  return decorative ? (
    <div className="du-metric-gauge">{drawing}</div>
  ) : (
    <button
      type="button"
      className="du-metric-gauge"
      data-metric={metric.name}
      data-pinned={pinned}
      aria-label={`${metric.name} ${value}%`}
      aria-pressed={pinned}
      onClick={() => setPinned((value) => !value)}
    >
      {drawing}
    </button>
  );
}

/** Mirrors SystemMonitoringHeaderView.swift: 60pt, 5pt round green arcs, icon → percentage on hover. */
export function SystemGauges({
  decorative = false,
  animated = false,
}: {
  decorative?: boolean;
  animated?: boolean;
}) {
  const { ref, tick, motionAllowed } = useIllustrationClock(0, animated);
  const values = samples[motionAllowed ? Math.floor(tick / 3) % samples.length : 0];
  return (
    <div
      ref={ref}
      className={`du-system-gauges ${decorative ? 'du-system-gauges-menu' : ''}`}
      data-motion={animated ? 'system-monitor' : undefined}
    >
      {metrics.map((metric, i) => (
        <Gauge key={metric.name} metric={metric} value={values[i]} decorative={decorative} />
      ))}
    </div>
  );
}
