'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Tag } from 'lucide-react';
import { Markdown } from '@/components/Markdown';
import type { Release } from '@/content/releases';
import type { Locale } from '@/content/locales';
import { fetchGithubReleases } from '@/lib/github-releases';

/** Stable, shareable anchor for a version (e.g. #v0.1.10). */
export function releaseAnchor(tag: string) {
  return tag.replace(/[^a-zA-Z0-9._-]/g, '-');
}

function formatDate(locale: Locale, iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export function ChangelogReleases({
  initialReleases,
  locale,
  labels,
}: {
  initialReleases: Release[];
  locale: Locale;
  labels: {
    title: string;
    empty: string;
    latest: string;
    releasedOn: string;
    viewOnGitHub: string;
  };
}) {
  const [releases, setReleases] = useState(initialReleases);
  const [source, setSource] = useState<'snapshot' | 'github'>('snapshot');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    let active = true;
    fetchGithubReleases(controller.signal)
      .then((latest) => {
        if (!active) return;
        setReleases(latest);
        setSource('github');
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (source !== 'github' || !window.location.hash) return;
    try {
      const anchor = decodeURIComponent(window.location.hash.slice(1));
      // The browser already handled anchors present in the initial HTML.
      if (initialReleases.some((release) => releaseAnchor(release.tag_name) === anchor)) return;
      document.getElementById(anchor)?.scrollIntoView();
    } catch {
      // An invalid URL hash must not prevent release notes from rendering.
    }
  }, [source, initialReleases]);

  return (
    <section
      data-umami-section="changelog-releases"
      data-release-source={source}
      data-release-status={status}
      className="container-page flex flex-col gap-6 pt-12 dt:pt-16"
      aria-label={labels.title}
    >
      {releases.length === 0 ? (
        <p className="max-w-[620px] rounded-[18px] border-[1.5px] border-dashed border-[#c3cde0] p-7 text-[15px] text-muted">
          {labels.empty}
        </p>
      ) : (
        releases.map((release, index) => (
          <article
            key={release.id}
            id={releaseAnchor(release.tag_name)}
            className="scroll-mt-24 rounded-[22px] border border-line bg-white p-6 shadow-[0_16px_42px_rgba(29,32,40,0.05)] [overflow-wrap:anywhere] dt:p-8"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 text-[20px] font-bold" lang="en">
                <Tag size={18} aria-hidden="true" className="text-primary" />
                {release.name || release.tag_name}
              </span>
              {index === 0 && (
                <span className="rounded-full bg-[#eaf0ff] px-3 py-0.5 text-xs font-semibold text-primary">
                  {labels.latest}
                </span>
              )}
              <time dateTime={release.published_at} className="text-[14px] text-muted">
                {labels.releasedOn.replace('{date}', formatDate(locale, release.published_at))}
              </time>
            </div>

            {release.body.trim() && (
              // Release notes are mirrored verbatim from GitHub and stay in
              // their original language.
              <div className="mt-4" lang="en">
                <Markdown text={release.body} />
              </div>
            )}

            <a
              href={release.html_url}
              className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-primary hover:text-[#0b3bc0]"
              data-track-event="external_link"
              data-track-event-placement="changelog"
              data-track-event-target={release.tag_name}
            >
              {labels.viewOnGitHub}
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          </article>
        ))
      )}
    </section>
  );
}
