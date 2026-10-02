import type { MessageKey } from './i18n';
import type { ToolIconName } from '@/components/ToolIcon';

/** Content for `/window-switcher/` (`Site v1 - Window Switcher.dc.html`). */
export const windowSwitcherFlows: { icon: ToolIconName; title: MessageKey; body: MessageKey }[] = [
  {
    icon: 'window',
    title: 'window-switcher.flow.every.title',
    body: 'window-switcher.flow.every.body',
  },
  {
    icon: 'keyboard',
    title: 'window-switcher.flow.switch.title',
    body: 'window-switcher.flow.switch.body',
  },
  {
    icon: 'external',
    title: 'window-switcher.flow.dock.title',
    body: 'window-switcher.flow.dock.body',
  },
];

export const windowSwitcherCases: { icon: ToolIconName; title: MessageKey; body: MessageKey }[] = [
  {
    icon: 'window',
    title: 'window-switcher.case.browser.title',
    body: 'window-switcher.case.browser.body',
  },
  {
    icon: 'file',
    title: 'window-switcher.case.finder.title',
    body: 'window-switcher.case.finder.body',
  },
  {
    icon: 'annotate',
    title: 'window-switcher.case.editor.title',
    body: 'window-switcher.case.editor.body',
  },
];

export const windowSwitcherShortcuts: { name: MessageKey; keys: string }[] = [
  { name: 'window-switcher.shortcut.keyboard', keys: '⌘Tab' },
  { name: 'window-switcher.shortcut.menu', keys: 'DeskUtils icon' },
];

export const windowSwitcherFaqs: { id: string; question: MessageKey; answer: MessageKey }[] = [
  { id: 'enable', question: 'window-switcher.faq.q1', answer: 'window-switcher.faq.a1' },
  { id: 'permissions', question: 'window-switcher.faq.q2', answer: 'window-switcher.faq.a2' },
  { id: 'dock', question: 'window-switcher.faq.q3', answer: 'window-switcher.faq.a3' },
  { id: 'ring', question: 'window-switcher.faq.q4', answer: 'window-switcher.faq.a4' },
];

export const windowSwitcherRelated: {
  id: string;
  icon: ToolIconName;
  name: MessageKey;
  body: MessageKey;
}[] = [
  {
    id: 'quick-ring',
    icon: 'ring',
    name: 'tool.quick-ring.name',
    body: 'window-switcher.related.quickRing',
  },
  {
    id: 'screenshot',
    icon: 'capture',
    name: 'tool.screenshot.name',
    body: 'window-switcher.related.screenshot',
  },
  {
    id: 'clipboard-manager',
    icon: 'clipboard',
    name: 'tool.clipboard-manager.name',
    body: 'window-switcher.related.clipboard',
  },
  {
    id: 'external-display-only',
    icon: 'external',
    name: 'tool.external-display-only.name',
    body: 'window-switcher.related.external',
  },
];
