'use client';

import { useRef } from 'react';
import { trackUmamiEvent } from '@/lib/umami';

export function TrackedFaq({
  id,
  question,
  answer,
  locale,
}: {
  id: string;
  question: string;
  answer: string;
  locale: string;
}) {
  const details = useRef<HTMLDetailsElement>(null);
  return (
    <details
      ref={details}
      onToggle={() => {
        if (details.current?.open) trackUmamiEvent('faq_open', { faq: id, locale });
      }}
    >
      <summary>{question}</summary>
      <p>{answer}</p>
    </details>
  );
}
