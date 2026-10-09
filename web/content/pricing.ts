import type { MessageKey, MessageValues } from './i18n';
import { product } from './product';

export type PricingFaq = {
  id: string;
  question: MessageKey;
  answer: MessageKey;
  values?: MessageValues;
};

export function pricingFaqs(): PricingFaq[] {
  return [
    { id: 'free', question: 'faq.free.question', answer: 'faq.free.answer' },
    { id: 'donation', question: 'donation.faq.question', answer: 'donation.faq.answer' },
    { id: 'devices', question: 'faq.devices.question', answer: 'faq.devices.answer' },
    { id: 'account', question: 'faq.account.question', answer: 'faq.account.answer' },
    {
      id: 'macos',
      question: 'faq.macos.question',
      answer: 'faq.macos.answer',
      values: { version: product.minimumMacOS },
    },
    { id: 'clipboard', question: 'faq.clipboard.question', answer: 'faq.clipboard.answer' },
  ];
}
