'use client';

import { useRef } from 'react';
import { Plus, Minus } from 'lucide-react';
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
      className="home-faq-item"
      name="homepage-faq"
      onToggle={() => {
        if (details.current?.open) trackUmamiEvent('faq_open', { faq: id, locale });
      }}
    >
      <summary>
        <h3>{question}</h3>
        <Plus className="home-faq-plus" size={22} aria-hidden="true" />
        <Minus className="home-faq-minus" size={22} aria-hidden="true" />
      </summary>
      <p>{answer}</p>
    </details>
  );
}
