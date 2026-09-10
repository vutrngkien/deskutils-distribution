import type { ToolIconName } from '@/components/ToolIcon';
import type { MessageKey, MessageValues } from './i18n';
export { languages, type Locale } from './locales';

export const product = {
  name: 'DeskUtils',
  origin: 'https://deskutils.app',
  downloadURL:
    'https://github.com/vutrngkien/deskutils-distribution/releases/latest/download/DeskUtils.dmg',
  releasesURL: 'https://github.com/vutrngkien/deskutils-distribution/releases',
  repositoryURL: 'https://github.com/vutrngkien/deskutils-distribution',
  supportEmail: 'deskutils.app@gmail.com',
  minimumMacOS: '15.2',
  freeHistory: 50,
  proHistory: 500,
  description:
    'Clipboard history, screenshots, color tools and everyday utilities. One native macOS app, right in your menu bar.',
  pricing: {
    amount: '7.99',
    originalAmount: '14.99',
    currency: 'USD',
    period: 'year',
    macs: 1,
    status: 'coming-soon',
  },
} as const;

// Product facts in this file are verified against the DeskUtils app source and
// release workflow. The PDF is a layout wireframe only; it is not a source for
// pricing, feature availability, system requirements, or visual tokens.

export const navigation = [
  { label: 'nav.features', href: '/#features' },
  { label: 'nav.pricing', href: '/#pricing' },
  { label: 'nav.help', href: '/install/' },
] satisfies { label: MessageKey; href: string }[];

export type Demo = {
  title: MessageKey;
  description: MessageKey;
  poster?: string;
  posterWidth?: number;
  posterHeight?: number;
  sources?: { src: string; type: 'video/mp4' | 'video/webm' }[];
  aspectRatio: string;
  icon?: ToolIconName;
  inset?: boolean;
  mockup?: boolean;
  autoplay?: boolean;
};

// Add recordings here when ready. Use /videos/file.mp4 for videos in web/public/videos/.
export const demos = {
  screenshot: {
    title: 'capture.demoTitle',
    description: 'capture.demoDescription',
    poster: '/videos/annotate-poster.webp',
    posterWidth: 1280,
    posterHeight: 720,
    sources: [{ src: '/videos/annotate-demo.mp4', type: 'video/mp4' }],
    aspectRatio: '16 / 9',
    icon: 'capture',
    mockup: true,
    autoplay: true,
  },
  clipboard: {
    title: 'clipboard.demoTitle',
    description: 'clipboard.demoDescription',
    poster: '/assets/images/clipboard_search.webp',
    posterWidth: 1200,
    posterHeight: 758,
    sources: [{ src: '/videos/clipboard-demo.mp4', type: 'video/mp4' }],
    aspectRatio: '8 / 5',
    mockup: true,
    autoplay: true,
  },
  clipboardPreview: {
    title: 'clipboard.preview.title',
    description: 'clipboard.preview.description',
    poster: '/assets/images/quickpreview-demo.webp',
    posterWidth: 1094,
    posterHeight: 771,
    aspectRatio: '1094 / 771',
  },
  clipboardSearch: {
    title: 'clipboard.search.title',
    description: 'clipboard.search.description',
    poster: '/assets/images/search-demo.webp',
    posterWidth: 1094,
    posterHeight: 771,
    aspectRatio: '1094 / 771',
  },
  color: {
    title: 'utilities.color.title',
    description: 'utilities.color.description',
    poster: '/assets/images/color_picker_panel.webp',
    posterWidth: 860,
    posterHeight: 678,
    aspectRatio: '16 / 10',
    inset: true,
  },
} satisfies Record<string, Demo>;

export const clipboardFeatures = [
  {
    title: 'clipboard.find.title',
    detail: 'clipboard.find.description',
  },
  { title: 'clipboard.keep.title', detail: 'clipboard.keep.description' },
  {
    title: 'clipboard.back.title',
    detail: 'clipboard.back.description',
  },
] satisfies { title: MessageKey; detail: MessageKey }[];

export const clipboardDetails = [
  {
    id: 'clipboard-preview',
    label: 'clipboard.preview.label',
    title: 'clipboard.preview.title',
    description: 'clipboard.preview.description',
    demo: demos.clipboardPreview,
  },
  {
    id: 'clipboard-search',
    label: 'clipboard.search.label',
    title: 'clipboard.search.title',
    description: 'clipboard.search.description',
    demo: demos.clipboardSearch,
  },
] satisfies {
  id: string;
  label: MessageKey;
  title: MessageKey;
  description: MessageKey;
  demo: Demo;
}[];

export const screenshotFeatures = [
  {
    icon: 'crop',
    title: 'capture.area.title',
    description: 'capture.area.description',
  },
  {
    icon: 'text',
    title: 'capture.ocr.title',
    description: 'capture.ocr.description',
  },
  {
    icon: 'annotate',
    title: 'capture.annotate.title',
    description: 'capture.annotate.description',
  },
  {
    icon: 'previous',
    title: 'capture.previous.title',
    description: 'capture.previous.description',
  },
  {
    icon: 'scroll',
    title: 'capture.scrolling.title',
    description: 'capture.scrolling.description',
  },
  {
    icon: 'subject',
    title: 'capture.subject.title',
    description: 'capture.subject.description',
  },
] satisfies { icon: ToolIconName; title: MessageKey; description: MessageKey }[];

export const utilities = [
  {
    icon: 'color',
    title: 'utilities.color.title',
    description: 'utilities.color.description',
  },
  {
    icon: 'keyboard',
    title: 'utilities.keyboard.title',
    description: 'utilities.keyboard.description',
  },
  {
    icon: 'moon',
    title: 'utilities.sleep.title',
    description: 'utilities.sleep.description',
  },
] satisfies { icon: ToolIconName; title: MessageKey; description: MessageKey }[];
export const permissions = [
  {
    name: 'permission.screen.title',
    description: 'permission.screen.description',
  },
  {
    name: 'permission.accessibility.title',
    description: 'permission.accessibility.description',
  },
] satisfies { name: MessageKey; description: MessageKey }[];
type CopyRef = { key: MessageKey; values?: MessageValues };
export const plans = [
  {
    id: 'free',
    pitch: 'pricing.free.pitch',
    description: 'pricing.free.description',
    features: [
      { key: 'pricing.freeItems', values: { count: product.freeHistory } },
      { key: 'pricing.screenshots' },
      { key: 'pricing.color' },
      { key: 'pricing.cleanSleep' },
      { key: 'pricing.dimmingPreview' },
    ],
  },
  {
    id: 'pro',
    pitch: 'pricing.pro.pitch',
    description: 'pricing.pro.description',
    features: [
      { key: 'pricing.everythingFree' },
      { key: 'pricing.proItems', values: { count: product.proHistory } },
      { key: 'pricing.ocr' },
      { key: 'pricing.scrolling' },
      { key: 'pricing.subject' },
      { key: 'pricing.persistentDimming' },
      { key: 'pricing.updates' },
    ],
  },
] satisfies {
  id: 'free' | 'pro';
  pitch: MessageKey;
  description: MessageKey;
  features: CopyRef[];
}[];
export const faqs = [
  {
    question: 'faq.macos.question',
    answer: 'faq.macos.answer',
    values: { version: product.minimumMacOS },
  },
  {
    question: 'faq.free.question',
    answer: 'faq.free.answer',
  },
  {
    question: 'faq.account.question',
    answer: 'faq.account.answer',
  },
  {
    question: 'faq.clipboard.question',
    answer: 'faq.clipboard.answer',
  },
  {
    question: 'faq.store.question',
    answer: 'faq.store.answer',
  },
] satisfies { question: MessageKey; answer: MessageKey; values?: MessageValues }[];
