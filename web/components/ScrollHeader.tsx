'use client';

import { useEffect, useState, type ReactNode } from 'react';
import styles from './Site.module.css';

const COMPACT_AFTER = 24;
const EXPAND_BEFORE = 8;

export function ScrollHeader({ children }: { children: ReactNode }) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setCompact((current) => {
          const next = current ? window.scrollY > EXPAND_BEFORE : window.scrollY > COMPACT_AFTER;
          return current === next ? current : next;
        });
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={`${styles.headerShell} ${compact ? styles.headerShellScrolled : ''}`}>
      {children}
    </div>
  );
}
