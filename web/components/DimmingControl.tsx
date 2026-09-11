'use client';

import { useRef, useState } from 'react';
import type { Locale } from '@/content/locales';
import { translate } from '@/content/i18n';
import { trackUmamiEvent } from '@/lib/umami';
import styles from './DimmingControl.module.css';

export function DimmingControl({
  locale = 'en',
  showLabel = true,
}: {
  locale?: Locale;
  showLabel?: boolean;
}) {
  const [brightness, setBrightness] = useState(100);
  const hasTrackedInteraction = useRef(false);

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
          onChange={(event) => {
            const nextBrightness = Number(event.target.value);
            setBrightness(nextBrightness);
            if (!hasTrackedInteraction.current && nextBrightness !== 100) {
              hasTrackedInteraction.current = true;
              trackUmamiEvent('dimming_interact', {
                level: nextBrightness > 60 ? 'dimmed' : 'very_dim',
                locale,
              });
            }
          }}
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
