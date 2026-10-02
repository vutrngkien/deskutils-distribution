import type { MessageKey, MessageValues } from './i18n';
import { product, launchOffer } from './product';

/**
 * Pricing page data (`Site v1 - Pricing.dc.html`). Every value comes from
 * `content/product.ts` — no separate price or plan is hardcoded here.
 */
export type PricingCell =
  | { kind: 'included' }
  | { kind: 'none' }
  | { kind: 'text'; key: MessageKey; values?: MessageValues };

export type PricingRow = {
  id: string;
  feature: MessageKey;
  free: PricingCell;
  pro: PricingCell;
};

const included: PricingCell = { kind: 'included' };
const none: PricingCell = { kind: 'none' };

export const pricingComparison: PricingRow[] = [
  {
    id: 'free-toolkit',
    feature: 'pricing.compare.freeToolsLabel',
    free: { kind: 'text', key: 'pricing.compare.freeTools' },
    pro: { kind: 'text', key: 'pricing.everythingFree' },
  },
  { id: 'quick-ring', feature: 'pricing.compare.quickRing', free: included, pro: included },
  { id: 'customize', feature: 'pricing.compare.customize', free: none, pro: included },
  {
    id: 'clipboard',
    feature: 'pricing.compare.clipboardLabel',
    free: {
      kind: 'text',
      key: 'pricing.compare.clipboard',
      values: { count: product.freeHistory },
    },
    pro: { kind: 'text', key: 'pricing.compare.clipboard', values: { count: product.proHistory } },
  },
  { id: 'screenshots', feature: 'pricing.compare.screenshots', free: included, pro: included },
  { id: 'extra-capture', feature: 'pricing.compare.extraCapture', free: none, pro: included },
  { id: 'ocr', feature: 'pricing.compare.ocr', free: none, pro: included },
  {
    id: 'external-display',
    feature: 'pricing.compare.externalDisplayLabel',
    free: { kind: 'text', key: 'pricing.compare.externalDisplayFree' },
    pro: { kind: 'text', key: 'pricing.compare.externalDisplayPro' },
  },
  {
    id: 'dimming',
    feature: 'pricing.compare.dimming',
    free: { kind: 'text', key: 'pricing.dimmingPreview' },
    pro: { kind: 'text', key: 'pricing.persistentDimming' },
  },
  {
    id: 'devices',
    feature: 'pricing.compare.devicesLabel',
    free: none,
    pro: { kind: 'text', key: 'pricing.compare.devices', values: { count: product.pricing.macs } },
  },
];

export type PricingFaq = {
  id: string;
  question: MessageKey;
  answer: MessageKey;
  values?: MessageValues;
};

const basePricingFaqs: PricingFaq[] = [
  { id: 'subscription', question: 'faq.subscription.question', answer: 'faq.subscription.answer' },
  {
    id: 'devices',
    question: 'faq.devices.question',
    answer: 'faq.devices.answer',
    values: { count: product.pricing.macs },
  },
  { id: 'free', question: 'faq.free.question', answer: 'faq.free.answer' },
  { id: 'account', question: 'faq.account.question', answer: 'faq.account.answer' },
  {
    id: 'macos',
    question: 'faq.macos.question',
    answer: 'faq.macos.answer',
    values: { version: product.minimumMacOS },
  },
  { id: 'clipboard', question: 'faq.clipboard.question', answer: 'faq.clipboard.answer' },
];

/** Launch-price FAQ appears only while the launch promotion is active. */
export function pricingFaqs(): PricingFaq[] {
  if (!launchOffer.enabled) return basePricingFaqs;
  return [
    {
      id: 'launch-price',
      question: 'faq.launchPrice.question',
      answer: 'faq.launchPrice.answer',
      values: {
        amount: launchOffer.launchAmount,
        customers: launchOffer.customerLimit,
        original: launchOffer.regularAmount,
      },
    },
    ...basePricingFaqs,
  ];
}
