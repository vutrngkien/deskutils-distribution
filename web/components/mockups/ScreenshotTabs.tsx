'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { ScanLine, PencilLine, Copy, Play } from 'lucide-react';
import { useIllustrationClock } from './useIllustrationClock';

export type ScreenshotState = 'capture' | 'annotate' | 'save';
const StateContext = createContext<ScreenshotState>('annotate');
export const useScreenshotState = () => useContext(StateContext);
const states: ScreenshotState[] = ['capture', 'annotate', 'save'];
const icons = [ScanLine, PencilLine, Copy];
type VideoSource = { src: string; type: string };

function Recording({
  sources,
  title,
  playLabel,
  onEnded,
  children,
}: {
  sources: VideoSource[];
  title: string;
  playLabel: string;
  onEnded: () => void;
  children: ReactNode;
}) {
  const { ref, inView } = useIllustrationClock();
  const video = useRef<HTMLVideoElement>(null);
  const sourceErrors = useRef(0);
  const automaticallyPaused = useRef(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);

  useEffect(() => {
    const player = video.current;
    if (!player || failed) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = (stopForReducedMotion = false) => {
      if (!inView || document.hidden || stopForReducedMotion) {
        if (!player.paused) {
          automaticallyPaused.current = true;
          player.pause();
        }
      } else if (!preference.matches && !manuallyPaused && !player.ended) {
        void player.play().catch(() => {});
      }
    };
    const onVisibilityChange = () => sync();
    const onMotionChange = () => sync(preference.matches);
    sync();
    document.addEventListener('visibilitychange', onVisibilityChange);
    preference.addEventListener('change', onMotionChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      preference.removeEventListener('change', onMotionChange);
    };
  }, [inView, manuallyPaused, failed]);

  return (
    <div
      ref={ref}
      className="home-shot-media"
      data-video-state={failed ? 'failed' : ready ? 'ready' : 'fallback'}
    >
      {children}
      {!failed && (
        <>
          <video
            ref={video}
            className="home-shot-video"
            data-ready={ready}
            controls
            muted
            playsInline
            preload="metadata"
            aria-label={title}
            onLoadedData={() => setReady(true)}
            onPause={() => {
              // Visibility/preference pauses must not be mistaken for a user's Pause.
              if (automaticallyPaused.current) {
                automaticallyPaused.current = false;
                return;
              }
              if (inView && !document.hidden && !video.current?.ended) setManuallyPaused(true);
            }}
            onPlay={() => setManuallyPaused(false)}
            onEnded={onEnded}
            onError={() => setFailed(true)}
          >
            {sources.map((source) => (
              <source
                key={source.src}
                {...source}
                onError={() => {
                  sourceErrors.current += 1;
                  if (sourceErrors.current >= sources.length) setFailed(true);
                }}
              />
            ))}
          </video>
          {!ready && (
            <button
              type="button"
              className="home-shot-play"
              aria-label={playLabel}
              onClick={() => {
                setManuallyPaused(false);
                void video.current?.play().catch(() => {});
              }}
            >
              <Play size={18} aria-hidden="true" />
              {playLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export function ScreenshotTabs({
  labels,
  descriptions,
  videos = [],
  playLabel = 'Play demo',
  children,
}: {
  labels: string[];
  descriptions: string[];
  videos?: VideoSource[][];
  playLabel?: string;
  children: ReactNode;
}) {
  const [active, setActive] = useState<ScreenshotState>('annotate');
  const index = states.indexOf(active);
  const sources = videos[index] ?? [];
  return (
    <StateContext value={active}>
      <div className="home-shot-tabs" role="group" aria-label={labels.join(', ')}>
        {states.map((state, i) => {
          const Icon = icons[i];
          return (
            <button
              key={state}
              type="button"
              aria-pressed={active === state}
              onClick={() => setActive(state)}
            >
              <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
              {labels[i]}
            </button>
          );
        })}
      </div>
      {sources.length > 0 ? (
        <Recording
          key={active}
          sources={sources}
          title={labels[index]}
          playLabel={playLabel}
          onEnded={() => setActive(states[(index + 1) % states.length])}
        >
          {children}
        </Recording>
      ) : (
        children
      )}
      <p className="home-shot-caption">{descriptions[index]}</p>
    </StateContext>
  );
}
