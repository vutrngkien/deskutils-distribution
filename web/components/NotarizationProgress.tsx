'use client';

import { useEffect, useState } from 'react';

const endpoint = process.env.NEXT_PUBLIC_DESKUTILS_KOFI_GOAL_ENDPOINT;

/** Public goal data only. All webhook and storage credentials stay on the server. */
export function NotarizationProgress({
  initialPercent,
  targetUSD,
  targetAmount,
  raisedLabel,
  targetLabel,
  progressTemplate,
  title,
}: {
  initialPercent: number;
  targetUSD: number;
  targetAmount: string;
  raisedLabel: string;
  targetLabel: string;
  progressTemplate: string;
  title: string;
}) {
  const [percent, setPercent] = useState(initialPercent);

  useEffect(() => {
    if (!endpoint) return;
    let active: AbortController | undefined;
    let disposed = false;

    async function refresh() {
      if (active || document.visibilityState === 'hidden') return;
      const controller = new AbortController();
      active = controller;
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(endpoint!, { signal: controller.signal });
        if (!response.ok) return;
        const data: unknown = await response.json();
        if (!data || typeof data !== 'object') return;
        const goal = data as Record<string, unknown>;
        if (
          goal.currency === 'USD' &&
          goal.targetUSD === targetUSD &&
          typeof goal.fundedPercent === 'number' &&
          Number.isInteger(goal.fundedPercent) &&
          goal.fundedPercent >= 0 &&
          goal.fundedPercent <= 100 &&
          !disposed
        ) {
          setPercent(goal.fundedPercent);
        }
      } catch {
        // Retain the last confirmed value when Ko-fi sync is unavailable.
      } finally {
        clearTimeout(timeout);
        active = undefined;
      }
    }

    void refresh();
    const interval = setInterval(() => void refresh(), 60000);
    const onVisibility = () => void refresh();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      disposed = true;
      active?.abort();
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [targetUSD]);

  const progressLabel = progressTemplate.replace('{percent}', String(percent));
  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-1">
          <span className="text-2xl leading-tight font-bold tracking-tight tabular-nums">
            {targetAmount}
          </span>
          <span className="text-xs text-muted">{targetLabel}</span>
        </div>
        <span className="font-bold tabular-nums">{percent}%</span>
      </div>
      <progress
        className="progress notarization-progress mt-3 block h-[18px] w-full md:h-4"
        value={percent}
        max={100}
        aria-label={title}
        aria-valuetext={progressLabel}
      />
      <p className="mt-2 text-xs text-muted">
        {progressLabel} · {raisedLabel}
      </p>
    </>
  );
}
