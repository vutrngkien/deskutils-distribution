'use client';
import { useEffect, useRef, useState } from 'react';
import type { Demo, Locale } from '@/content/product';
import { translate } from '@/content/i18n';
import styles from './DemoMedia.module.css';
import { ToolIcon } from './ToolIcon';
import { trackUmamiEvent } from '@/lib/umami';
export function DemoMedia({
  demo,
  caption = true,
  locale = 'en',
}: {
  demo: Demo;
  caption?: boolean;
  locale?: Locale;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const hasTrackedView = useRef(false);
  const sourceKey = JSON.stringify(demo.sources ?? []);
  const failed = failedSource === sourceKey;
  const hasVideo = Boolean(demo.sources?.length);
  const title = translate(locale, demo.title);
  const description = translate(locale, demo.description);

  useEffect(() => {
    if (!demo.autoplay) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      const video = videoRef.current;
      const shouldPlay = isNearViewport && !motion.matches;
      setShouldAutoplay(shouldPlay);
      if (shouldPlay) {
        void video?.play().catch(() => {});
      } else {
        video?.pause();
      }
    };
    update();
    motion.addEventListener('change', update);
    return () => motion.removeEventListener('change', update);
  }, [demo.autoplay, isNearViewport, sourceKey]);

  useEffect(() => {
    if (!demo.autoplay || !frameRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsNearViewport(entry.isIntersecting),
      { rootMargin: '300px 0px' },
    );
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [demo.autoplay]);

  useEffect(() => {
    if (!frameRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasTrackedView.current) return;
        if (trackUmamiEvent('demo_view', { demo: demo.title, locale }))
          hasTrackedView.current = true;
      },
      { threshold: 0.5 },
    );
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [demo.title, locale]);

  const content =
    hasVideo && !failed && (!demo.autoplay || isNearViewport) ? (
      <video
        key={sourceKey}
        ref={videoRef}
        autoPlay={demo.autoplay && shouldAutoplay}
        controls={!demo.autoplay}
        loop={demo.autoplay && shouldAutoplay}
        muted={demo.autoplay}
        playsInline
        preload="none"
        poster={demo.poster}
        aria-label={title}
        onError={() => setFailedSource(sourceKey)}
      >
        {demo.sources!.map((source, index) => (
          <source
            key={source.src}
            src={source.src}
            type={source.type}
            onError={() => {
              if (index === demo.sources!.length - 1) setFailedSource(sourceKey);
            }}
          />
        ))}
        {translate(locale, 'video.unsupported')}
      </video>
    ) : demo.poster ? (
      <img
        src={demo.poster}
        alt={description}
        width={demo.posterWidth}
        height={demo.posterHeight}
        loading="lazy"
        decoding="async"
      />
    ) : (
      <div className={styles.placeholder}>
        <span className={styles.placeholderIcon} aria-hidden="true">
          <ToolIcon name={demo.icon ?? 'capture'} />
        </span>
        <strong>{title}</strong>
        <small>{translate(locale, 'video.comingSoon')}</small>
      </div>
    );
  return (
    <figure className={styles.media}>
      <div
        ref={frameRef}
        className={`${styles.frame} ${demo.inset ? styles.inset : ''} ${demo.mockup ? styles.mockupFrame : ''}`}
        style={{ aspectRatio: demo.mockup ? '2048 / 1241' : demo.aspectRatio }}
      >
        {demo.mockup ? (
          <div className={styles.mockup}>
            <div className={styles.screen}>{content}</div>
            <img
              className={styles.mockupShell}
              src="/assets/images/macbook-mockup.svg"
              alt=""
              aria-hidden="true"
              width="2048"
              height="1241"
            />
          </div>
        ) : (
          content
        )}
      </div>
      {failed && (
        <p className={styles.error} role="status">
          {translate(locale, 'video.failed')}
        </p>
      )}
      {caption && <figcaption className={styles.caption}>{description}</figcaption>}
    </figure>
  );
}
