import type { MessageKey } from './i18n';
import type { ToolIconName } from '@/components/ToolIcon';

/** Content for `/color-picker/` (`Site v1 - Color Picker.dc.html`). */
export const colorPickerFlows: { icon: ToolIconName; title: MessageKey; body: MessageKey }[] = [
  {
    icon: 'color',
    title: 'color-picker.flow.match.title',
    body: 'color-picker.flow.match.body',
  },
  {
    icon: 'clipboard',
    title: 'color-picker.flow.copy.title',
    body: 'color-picker.flow.copy.body',
  },
  {
    icon: 'previous',
    title: 'color-picker.flow.recent.title',
    body: 'color-picker.flow.recent.body',
  },
];

export const colorPickerFormats: { code: string; value: string; body: MessageKey }[] = [
  { code: 'HEX', value: '#6D5DF5', body: 'color-picker.format.hex' },
  { code: 'RGB', value: 'rgb(109, 93, 245)', body: 'color-picker.format.rgb' },
  { code: 'HSL', value: 'hsl(246, 88%, 66%)', body: 'color-picker.format.hsl' },
];

export const colorPickerSwatches = [
  { hex: '#FAF9F5' },
  { hex: '#1D1D1F' },
  { hex: '#FF8A5B' },
  { hex: '#F25C9B' },
  { hex: '#1450F5' },
  { hex: '#6D5DF5' },
];

export const colorPickerShortcuts: { name: MessageKey; keys: string }[] = [
  { name: 'color-picker.shortcut.keyboard', keys: '⇧⌘C' },
  { name: 'color-picker.shortcut.ring', keys: '⌘ ⌘' },
  { name: 'color-picker.shortcut.menu', keys: 'DeskUtils icon' },
];

export const colorPickerFaqs: { id: string; question: MessageKey; answer: MessageKey }[] = [
  { id: 'pick', question: 'color-picker.faq.q1', answer: 'color-picker.faq.a1' },
  { id: 'formats', question: 'color-picker.faq.q2', answer: 'color-picker.faq.a2' },
  { id: 'permission', question: 'color-picker.faq.q3', answer: 'color-picker.faq.a3' },
  { id: 'recent', question: 'color-picker.faq.q4', answer: 'color-picker.faq.a4' },
];

export const colorPickerRelated: {
  id: string;
  icon: ToolIconName;
  name: MessageKey;
  body: MessageKey;
}[] = [
  {
    id: 'screenshot',
    icon: 'capture',
    name: 'tool.screenshot.name',
    body: 'color-picker.related.screenshot',
  },
  {
    id: 'clipboard-manager',
    icon: 'clipboard',
    name: 'tool.clipboard-manager.name',
    body: 'color-picker.related.clipboard',
  },
  {
    id: 'quick-ring',
    icon: 'ring',
    name: 'tool.quick-ring.name',
    body: 'color-picker.related.quickRing',
  },
  {
    id: 'capture-text',
    icon: 'text',
    name: 'tool.capture-text.name',
    body: 'color-picker.related.captureText',
  },
];
