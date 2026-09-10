'use client';

import { useState } from 'react';
import type { Locale } from '@/content/locales';
import { translate } from '@/content/i18n';
import styles from './DimmingControl.module.css';

export function DimmingControl({
  locale = 'en',
  showLabel = true,
}: {
  locale?: Locale;
  showLabel?: boolean;
}) {
  const [brightness, setBrightness] = useState(100);

  return (
    <>
      <div
        className={styles.overlay}
        style={{ opacity: (100 - brightness) / 100 }}
        aria-hidden="true"
      />
      {showLabel && <div className={styles.divider} aria-hidden="true" />}
      <div className={styles.control}>
        {showLabel && (
          <div className={styles.labelRow}>
            <label htmlFor="dimming-level">{translate(locale, 'a11y.brightness')}</label>
          </div>
        )}
        <input
          id="dimming-level"
          type="range"
          min="15"
          max="100"
          step="1"
          value={brightness}
          onChange={(event) => setBrightness(Number(event.target.value))}
          aria-label={translate(locale, 'a11y.brightness')}
          aria-valuetext={
            brightness === 100
              ? translate(locale, 'a11y.brightnessFull')
              : brightness > 60
                ? translate(locale, 'a11y.brightnessDimmed')
                : translate(locale, 'a11y.brightnessVeryDim')
          }
        />
      </div>
    </>
  );
}
