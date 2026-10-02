'use client';

import { useEffect, useRef, useState } from 'react';
import {
  demos,
  quickRingCommandPresses,
  quickRingStaticPoster,
  type Locale,
} from '@/content/product';
import { translate } from '@/content/i18n';
import { useDemoTracking } from './useDemoTracking';

/** The key follows the recording's clock, including pauses, seeks and looping. */
export function QuickRingRecording({ locale }: { locale: Locale }) {
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(true);
  const [pressed, setPressed] = useState(false);
  const demo = demos.quickring;
  const tracking = useDemoTracking(host, demo.title, locale);

  useEffect(() => {
    const player = video.current;
    const container = host.current;
    if (!player || !container || failed) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let frame = 0;
    const updateKey = () => {
      setPressed(
        !preference.matches &&
          !player.paused &&
          quickRingCommandPresses.some(
            ([start, end]) => player.currentTime >= start && player.currentTime < end,
          ),
      );
    };
    const animate = () => {
      updateKey();
      if (!player.paused) frame = requestAnimationFrame(animate);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      animate();
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      setPressed(false);
    };
    const sync = () => {
      setMotionAllowed(!preference.matches);
      if (visible && !preference.matches && !document.hidden) {
        void player.play().catch(() => {});
      } else {
        player.pause();
        setReady(false);
        if (player.currentTime !== 0) player.currentTime = 0;
        stop();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        sync();
      },
      { threshold: 0.5 },
    );
    observer.observe(container);
    player.addEventListener('play', start);
    player.addEventListener('pause', stop);
    player.addEventListener('seeked', updateKey);
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      player.removeEventListener('play', start);
      player.removeEventListener('pause', stop);
      player.removeEventListener('seeked', updateKey);
      preference.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [failed]);

  return (
    <div
      ref={host}
      className="home-ring-visual"
      data-media-slot="quickring"
      data-media-state="ready"
      data-ring-recording
    >
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src={failed || !motionAllowed ? quickRingStaticPoster : demo.poster}
        alt={translate(locale, demo.title)}
        width={demo.posterWidth}
        height={demo.posterHeight}
        loading="lazy"
        decoding="async"
      />
      {!failed && (
        <video
          ref={video}
          className={`absolute inset-0 h-full w-full object-cover ${ready && motionAllowed ? 'opacity-100' : 'opacity-0'}`}
          muted
          playsInline
          loop
          preload="none"
          poster={demo.poster}
          aria-label={translate(locale, demo.title)}
          onLoadedData={() => setReady(true)}
          onPlaying={() => {
            tracking.onPlaying();
            setReady(true);
          }}
          onError={() => {
            tracking.onError();
            setFailed(true);
          }}
        >
          {demo.sources.map((source) => (
            <source
              key={source.src}
              {...source}
              onError={() => {
                tracking.onError();
                setFailed(true);
              }}
            />
          ))}
        </video>
      )}
      <div className="home-ring-keys" aria-hidden="true">
        <span className="kbd" data-pressed={pressed} data-command-key>
          ⌘
        </span>
      </div>
    </div>
  );
}
