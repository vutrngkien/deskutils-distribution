import type { MessageKey } from './i18n';
import type { ToolIconName } from '@/components/ToolIcon';

/** Content for `/clipboard-manager/` (`Site v1 - Clipboard Manager.dc.html`). */
export const clipboardFlows: { icon: ToolIconName; title: MessageKey; body: MessageKey }[] = [
  {
    icon: 'search',
    title: 'clipboard-manager.flow.search.title',
    body: 'clipboard-manager.flow.search.body',
  },
  {
    icon: 'pin',
    title: 'clipboard-manager.flow.keep.title',
    body: 'clipboard-manager.flow.keep.body',
  },
  {
    icon: 'eye',
    title: 'clipboard-manager.flow.preview.title',
    body: 'clipboard-manager.flow.preview.body',
  },
  {
    icon: 'filter',
    title: 'clipboard-manager.flow.filter.title',
    body: 'clipboard-manager.flow.filter.body',
  },
];

export const clipboardFilters: {
  id: string;
  icon: ToolIconName;
  title: MessageKey;
  body: MessageKey;
  active?: boolean;
}[] = [
  {
    id: 'pinned',
    icon: 'pin',
    title: 'clipboard-manager.filter.pinned.title',
    body: 'clipboard-manager.filter.pinned.body',
    active: true,
  },
  {
    id: 'text',
    icon: 'text',
    title: 'clipboard-manager.filter.text.title',
    body: 'clipboard-manager.filter.text.body',
  },
  {
    id: 'image',
    icon: 'image',
    title: 'clipboard-manager.filter.image.title',
    body: 'clipboard-manager.filter.image.body',
  },
  {
    id: 'file',
    icon: 'file',
    title: 'clipboard-manager.filter.file.title',
    body: 'clipboard-manager.filter.file.body',
  },
];

export const clipboardFaqs: { id: string; question: MessageKey; answer: MessageKey }[] = [
  { id: 'open', question: 'clipboard-manager.faq.q1', answer: 'clipboard-manager.faq.a1' },
  { id: 'save', question: 'clipboard-manager.faq.q2', answer: 'clipboard-manager.faq.a2' },
  { id: 'search', question: 'clipboard-manager.faq.q3', answer: 'clipboard-manager.faq.a3' },
  { id: 'privacy', question: 'clipboard-manager.faq.q4', answer: 'clipboard-manager.faq.a4' },
  { id: 'accessibility', question: 'clipboard-manager.faq.q5', answer: 'clipboard-manager.faq.a5' },
];

export const clipboardRelated: {
  id: string;
  icon: ToolIconName;
  name: MessageKey;
  body: MessageKey;
}[] = [
  {
    id: 'screenshot',
    icon: 'capture',
    name: 'tool.screenshot.name',
    body: 'clipboard-manager.related.screenshot',
  },
  {
    id: 'capture-text',
    icon: 'text',
    name: 'tool.capture-text.name',
    body: 'clipboard-manager.related.captureText',
  },
  {
    id: 'quick-ring',
    icon: 'ring',
    name: 'tool.quick-ring.name',
    body: 'clipboard-manager.related.quickRing',
  },
  {
    id: 'color-picker',
    icon: 'color',
    name: 'tool.color-picker.name',
    body: 'clipboard-manager.related.colorPicker',
  },
];

export const clipboardPrivacy: MessageKey[] = [
  'clipboard-manager.privacy.network',
  'clipboard-manager.privacy.link',
  'clipboard-manager.privacy.accessibility',
];
