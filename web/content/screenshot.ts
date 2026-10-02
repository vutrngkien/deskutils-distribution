import type { MessageKey } from './i18n';
import type { ToolIconName } from '@/components/ToolIcon';

/**
 * Content for the Screenshot feature page (`/screenshot/`). Layout mirrors
 * `Site v1 - Screenshot.dc.html`; facts (modes, shortcuts, permissions) are
 * verified against the DeskUtils app source. Free/Pro labels are intentionally
 * omitted on feature pages (see the approved plan).
 */
export type ScreenshotMode = {
  id: string;
  icon: ToolIconName;
  name: MessageKey;
  body: MessageKey;
  keys: string;
};

export const screenshotModes: ScreenshotMode[] = [
  {
    id: 'area',
    icon: 'crop',
    name: 'screenshot.mode.area.name',
    body: 'screenshot.mode.area.body',
    keys: '⌥⇧⌘4',
  },
  {
    id: 'previous',
    icon: 'previous',
    name: 'screenshot.mode.previous.name',
    body: 'screenshot.mode.previous.body',
    keys: '⇧⌘8',
  },
  {
    id: 'window',
    icon: 'window',
    name: 'screenshot.mode.window.name',
    body: 'screenshot.mode.window.body',
    keys: '⌥⇧⌘9',
  },
  {
    id: 'fullscreen',
    icon: 'display',
    name: 'screenshot.mode.fullscreen.name',
    body: 'screenshot.mode.fullscreen.body',
    keys: '⌥⇧⌘3',
  },
  {
    id: 'scrolling',
    icon: 'scroll',
    name: 'screenshot.mode.scrolling.name',
    body: 'screenshot.mode.scrolling.body',
    keys: '⌥⇧⌘6',
  },
  {
    id: 'subject',
    icon: 'subject',
    name: 'screenshot.mode.subject.name',
    body: 'screenshot.mode.subject.body',
    keys: '⇧⌘1',
  },
  {
    id: 'smart-element',
    icon: 'pointer',
    name: 'screenshot.mode.smartElement.name',
    body: 'screenshot.mode.smartElement.body',
    keys: '⌥⇧4',
  },
  {
    id: 'annotate',
    icon: 'annotate',
    name: 'screenshot.mode.annotate.name',
    body: 'screenshot.mode.annotate.body',
    keys: '⇧⌘7',
  },
];

export const screenshotTools: {
  icon: ToolIconName;
  name: MessageKey;
  body: MessageKey;
}[] = [
  { icon: 'arrow', name: 'screenshot.tool.shapes.name', body: 'screenshot.tool.shapes.body' },
  { icon: 'text', name: 'screenshot.tool.text.name', body: 'screenshot.tool.text.body' },
  {
    icon: 'annotate',
    name: 'screenshot.tool.highlighter.name',
    body: 'screenshot.tool.highlighter.body',
  },
  { icon: 'blur', name: 'screenshot.tool.redact.name', body: 'screenshot.tool.redact.body' },
  {
    icon: 'spotlight',
    name: 'screenshot.tool.spotlight.name',
    body: 'screenshot.tool.spotlight.body',
  },
  { icon: 'crop', name: 'screenshot.tool.crop.name', body: 'screenshot.tool.crop.body' },
];

export const screenshotQuickAccess: { id: string; label: MessageKey }[] = [
  { id: 'copy', label: 'screenshot.quickAccess.copy' },
  { id: 'save', label: 'screenshot.quickAccess.save' },
  { id: 'edit', label: 'screenshot.quickAccess.edit' },
  { id: 'pin', label: 'screenshot.quickAccess.pin' },
  { id: 'delete', label: 'screenshot.quickAccess.delete' },
  { id: 'dismiss', label: 'screenshot.quickAccess.dismiss' },
];

export const screenshotFaqs: { id: string; question: MessageKey; answer: MessageKey }[] = [
  { id: 'modes', question: 'screenshot.faq.q1', answer: 'screenshot.faq.a1' },
  { id: 'upload', question: 'screenshot.faq.q2', answer: 'screenshot.faq.a2' },
  { id: 'screen-recording', question: 'screenshot.faq.q3', answer: 'screenshot.faq.a3' },
  { id: 'full-page', question: 'screenshot.faq.q4', answer: 'screenshot.faq.a4' },
  { id: 'history', question: 'screenshot.faq.q5', answer: 'screenshot.faq.a5' },
];

export const screenshotRelated: {
  id: string;
  icon: ToolIconName;
  href: string;
  name: MessageKey;
  body: MessageKey;
}[] = [
  {
    id: 'capture-text',
    icon: 'text',
    href: '/capture-text/',
    name: 'tool.capture-text.name',
    body: 'screenshot.related.captureText.body',
  },
  {
    id: 'color-picker',
    icon: 'color',
    href: '/color-picker/',
    name: 'tool.color-picker.name',
    body: 'screenshot.related.colorPicker.body',
  },
  {
    id: 'quick-ring',
    icon: 'ring',
    href: '/quick-ring/',
    name: 'tool.quick-ring.name',
    body: 'screenshot.related.quickRing.body',
  },
  {
    id: 'clipboard-manager',
    icon: 'clipboard',
    href: '/clipboard-manager/',
    name: 'tool.clipboard-manager.name',
    body: 'screenshot.related.clipboard.body',
  },
];

export const screenshotPermissions: { icon: ToolIconName; name: MessageKey; body: MessageKey }[] = [
  {
    icon: 'lock',
    name: 'permission.screen.title',
    body: 'permission.screen.description',
  },
  {
    icon: 'keyboard',
    name: 'permission.accessibility.title',
    body: 'permission.accessibility.description',
  },
  {
    icon: 'tools',
    name: 'permission.network.title',
    body: 'permission.network.description',
  },
];
