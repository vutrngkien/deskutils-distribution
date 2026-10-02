import React from 'react';
import { createRoot } from 'react-dom/client';
import { FeedbackExperience } from '../../components/feedback/FeedbackExperience';
import type { MessageKey } from '../../content/i18n';

// Bundled with `NEXT_PUBLIC_DESKUTILS_FEEDBACK_FORM_ENDPOINT` defined to a mock
// URL, so the endpoint/validation paths can be tested without any production
// submission. See the matching test in tests/website.spec.ts.
const tipsByKind = {
  bug: {
    title: 'feedback.tips.bug.title' as MessageKey,
    items: ['feedback.tips.bug.1'] as MessageKey[],
  },
  feedback: {
    title: 'feedback.tips.feedback.title' as MessageKey,
    items: ['feedback.tips.feedback.1'] as MessageKey[],
  },
  idea: {
    title: 'feedback.tips.idea.title' as MessageKey,
    items: ['feedback.tips.idea.1'] as MessageKey[],
  },
};

createRoot(document.querySelector('#root')!).render(
  <FeedbackExperience
    locale="en"
    tipsByKind={tipsByKind}
    links={[{ id: 'install', icon: 'install', label: 'feedback.links.install', href: '/install/' }]}
  />,
);
