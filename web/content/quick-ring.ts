import type { MessageKey } from './i18n';
import type { ToolIconName } from '@/components/ToolIcon';

/** Content for `/quick-ring/` (`Site v1 - Quick Ring.dc.html`). */
export const quickRingSteps: { number: string; title: MessageKey; body: MessageKey }[] = [
  {
    number: '01',
    title: 'quick-ring.step.press.title',
    body: 'quick-ring.step.press.body',
  },
  {
    number: '02',
    title: 'quick-ring.step.opens.title',
    body: 'quick-ring.step.opens.body',
  },
  {
    number: '03',
    title: 'quick-ring.step.choose.title',
    body: 'quick-ring.step.choose.body',
  },
];

export const quickRingActions: {
  id: string;
  icon: ToolIconName;
  name: MessageKey;
  body: MessageKey;
}[] = [
  {
    id: 'screenshot',
    icon: 'capture',
    name: 'quickring.captureArea',
    body: 'quick-ring.action.captureArea.body',
  },
  {
    id: 'capture-text',
    icon: 'text',
    name: 'quickring.captureText',
    body: 'quick-ring.action.captureText.body',
  },
  {
    id: 'clipboard-manager',
    icon: 'clipboard',
    name: 'quickring.clipboard',
    body: 'quick-ring.action.clipboard.body',
  },
  {
    id: 'prevent-sleep',
    icon: 'moon',
    name: 'quickring.preventSleep',
    body: 'quick-ring.action.preventSleep.body',
  },
  {
    id: 'screenshot',
    icon: 'previous',
    name: 'quickring.history',
    body: 'quick-ring.action.history.body',
  },
  {
    id: 'clean-keyboard',
    icon: 'keyboard',
    name: 'quickring.cleanKeyboard',
    body: 'quick-ring.action.cleanKeyboard.body',
  },
  {
    id: 'screenshot',
    icon: 'annotate',
    name: 'quickring.quickAnnotate',
    body: 'quick-ring.action.quickAnnotate.body',
  },
  {
    id: 'color-picker',
    icon: 'color',
    name: 'quickring.colorPicker',
    body: 'quick-ring.action.colorPicker.body',
  },
];

export const quickRingFaqs: { id: string; question: MessageKey; answer: MessageKey }[] = [
  { id: 'open', question: 'quick-ring.faq.q1', answer: 'quick-ring.faq.a1' },
  { id: 'actions', question: 'quick-ring.faq.q2', answer: 'quick-ring.faq.a2' },
  { id: 'customize', question: 'quick-ring.faq.q3', answer: 'quick-ring.faq.a3' },
  { id: 'menu', question: 'quick-ring.faq.q4', answer: 'quick-ring.faq.a4' },
];

export const quickRingRelated: {
  id: string;
  icon: ToolIconName;
  name: MessageKey;
  body: MessageKey;
}[] = [
  {
    id: 'screenshot',
    icon: 'capture',
    name: 'tool.screenshot.name',
    body: 'quick-ring.related.screenshot',
  },
  {
    id: 'clipboard-manager',
    icon: 'clipboard',
    name: 'tool.clipboard-manager.name',
    body: 'quick-ring.related.clipboard',
  },
  {
    id: 'capture-text',
    icon: 'text',
    name: 'tool.capture-text.name',
    body: 'quick-ring.related.captureText',
  },
  {
    id: 'color-picker',
    icon: 'color',
    name: 'tool.color-picker.name',
    body: 'quick-ring.related.colorPicker',
  },
];
