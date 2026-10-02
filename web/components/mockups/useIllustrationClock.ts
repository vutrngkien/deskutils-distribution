'use client';

import { useEffect, useRef, useState } from 'react';

/** Decorative loops only run while visible, with motion allowed and the tab active. */
export function useIllustrationClock(initialTick = 0, enabled = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [tick, setTick] = useState(initialTick);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const host = ref.current;
    if (!host) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
      const allowed = !preference.matches;
      setMotionAllowed(allowed);
      setInView(visible);
      if (allowed && visible && !document.hidden) {
        timer = setInterval(() => setTick((value) => value + 1), 700);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(host);
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      if (timer) clearInterval(timer);
    };
  }, [enabled]);

  return { ref, tick, motionAllowed, inView };
}
