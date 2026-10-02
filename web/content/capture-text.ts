import type { MessageKey } from './i18n';
import type { ToolIconName } from '@/components/ToolIcon';

/** Content for `/capture-text/` (`Site v1 - Capture Text.dc.html`). */
export const captureTextFlows: { icon: ToolIconName; title: MessageKey; body: MessageKey }[] = [
  {
    icon: 'image',
    title: 'capture-text.flow.images.title',
    body: 'capture-text.flow.images.body',
  },
  {
    icon: 'display',
    title: 'capture-text.flow.slides.title',
    body: 'capture-text.flow.slides.body',
  },
  {
    icon: 'lock',
    title: 'capture-text.flow.locked.title',
    body: 'capture-text.flow.locked.body',
  },
];

export const captureTextShortcuts: { name: MessageKey; keys: string }[] = [
  { name: 'capture-text.shortcut.keyboard', keys: '⇧⌘2' },
  { name: 'capture-text.shortcut.ring', keys: '⌘ ⌘' },
  { name: 'capture-text.shortcut.menu', keys: 'Menu bar' },
];

export const captureTextFaqs: { id: string; question: MessageKey; answer: MessageKey }[] = [
  { id: 'start', question: 'capture-text.faq.q1', answer: 'capture-text.faq.a1' },
  { id: 'upload', question: 'capture-text.faq.q2', answer: 'capture-text.faq.a2' },
  { id: 'permission', question: 'capture-text.faq.q3', answer: 'capture-text.faq.a3' },
  { id: 'qr', question: 'capture-text.faq.q4', answer: 'capture-text.faq.a4' },
];

export const captureTextRelated: {
  id: string;
  icon: ToolIconName;
  name: MessageKey;
  body: MessageKey;
}[] = [
  {
    id: 'screenshot',
    icon: 'capture',
    name: 'tool.screenshot.name',
    body: 'capture-text.related.screenshot',
  },
  {
    id: 'clipboard-manager',
    icon: 'clipboard',
    name: 'tool.clipboard-manager.name',
    body: 'capture-text.related.clipboard',
  },
  {
    id: 'quick-ring',
    icon: 'ring',
    name: 'tool.quick-ring.name',
    body: 'capture-text.related.quickRing',
  },
  {
    id: 'color-picker',
    icon: 'color',
    name: 'tool.color-picker.name',
    body: 'capture-text.related.colorPicker',
  },
];
