'use client';

import { useState } from 'react';
import { Check, ChevronRight, Download, HelpCircle, Mail } from 'lucide-react';
import { FeedbackForm } from '@/components/FeedbackForm';
import { translate, type MessageKey } from '@/content/i18n';
import type { Locale } from '@/content/locales';

export type FeedbackKind = 'bug' | 'feedback' | 'idea';

/**
 * Wraps the form so the tips column follows the selected feedback type, matching
 * the design. The type is owned here and mirrored into `FeedbackForm` via a
 * callback; the form keeps its own submission state and payload.
 */
export function FeedbackExperience({
  locale,
  tipsByKind,
  links,
}: {
  locale: Locale;
  tipsByKind: Record<FeedbackKind, { title: MessageKey; items: MessageKey[] }>;
  links: { id: string; label: MessageKey; href: string; icon: 'install' | 'support' | 'email' }[];
}) {
  const t = translate.bind(null, locale);
  const [kind, setKind] = useState<FeedbackKind>('feedback');
  const tips = tipsByKind[kind];
  const linkIcons = { install: Download, support: HelpCircle, email: Mail };

  return (
    <>
      <FeedbackForm locale={locale} onKindChange={setKind} />
      <aside data-track-placement="feedback_links" className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 rounded-[24px] bg-[#f3f6ff] p-7">
          <h2 className="text-[20px] font-bold">{t(tips.title)}</h2>
          {tips.items.map((item) => (
            <div key={item} className="flex gap-2.5 text-[15px] leading-[1.5] text-ink-2">
              <Check size={19} aria-hidden="true" className="mt-0.5 flex-none text-primary" />
              {t(item)}
            </div>
          ))}
        </div>
        <div className="flex flex-col px-7">
          {links.map((link) => {
            const Icon = linkIcons[link.icon];
            return (
              <a
                key={link.id}
                href={link.href}
                className="flex min-h-[56px] items-center gap-3 border-b border-line text-[15.5px] font-medium"
              >
                <Icon size={21} aria-hidden="true" className="flex-none text-primary" />
                <span className="flex-1">{t(link.label)}</span>
                <ChevronRight size={19} aria-hidden="true" className="text-[#9aa3b5]" />
              </a>
            );
          })}
        </div>
      </aside>
    </>
  );
}
