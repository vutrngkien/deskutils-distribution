import type { MessageKey } from './i18n';
import type { ToolIconName } from '@/components/ToolIcon';

/**
 * Content for the six utility pages (template: `SiteUtilityPage.dc.html`).
 * Facts are verified against the DeskUtils app source: permissions, behavior,
 * persistence and Free/Pro gates. Free/Pro labels are intentionally omitted on
 * these pages per the approved plan.
 */
export type UtilityPageData = {
  id: string;
  path: string;
  /** Per-page media slot so a real master never leaks across utilities. */
  mediaSlot: string;
  /** Alt text key for that slot (kept explicit to avoid a node:fs import). */
  altKey: MessageKey;
  icon: ToolIconName;
  eyebrow: MessageKey;
  title: MessageKey;
  desc: MessageKey;
  shortcutNote: MessageKey;
  howTitle: MessageKey;
  howDesc: MessageKey;
  permission: MessageKey;
  related: { id: string; icon: ToolIconName; name: MessageKey; body: MessageKey }[];
  faqs: { id: string; question: MessageKey; answer: MessageKey }[];
};

export const utilityPages: Record<string, UtilityPageData> = {
  'prevent-sleep': {
    id: 'prevent-sleep',
    path: '/prevent-sleep/',
    mediaSlot: 'utility-prevent-sleep',
    altKey: 'media.utility.preventSleep.alt',
    icon: 'moon',
    eyebrow: 'utilities.preventSleep.eyebrow',
    title: 'utilities.preventSleep.title',
    desc: 'utilities.preventSleep.desc',
    shortcutNote: 'utilities.preventSleep.shortcut',
    howTitle: 'utilities.preventSleep.howTitle',
    howDesc: 'utilities.preventSleep.howDesc',
    permission: 'utilities.preventSleep.permission',
    related: [
      {
        id: 'mouse-jiggler',
        icon: 'jiggler',
        name: 'tool.mouse-jiggler.name',
        body: 'utilities.preventSleep.related.jiggler',
      },
      {
        id: 'system-monitoring',
        icon: 'gauge',
        name: 'tool.system-monitoring.name',
        body: 'utilities.preventSleep.related.monitor',
      },
    ],
    faqs: [
      {
        id: 'vs-jiggler',
        question: 'utilities.preventSleep.faq.q1',
        answer: 'utilities.preventSleep.faq.a1',
      },
      {
        id: 'auto-off',
        question: 'utilities.preventSleep.faq.q2',
        answer: 'utilities.preventSleep.faq.a2',
      },
      {
        id: 'lock-screen',
        question: 'utilities.preventSleep.faq.q3',
        answer: 'utilities.preventSleep.faq.a3',
      },
      {
        id: 'permission',
        question: 'utilities.preventSleep.faq.q4',
        answer: 'utilities.preventSleep.faq.a4',
      },
    ],
  },
  'mouse-jiggler': {
    id: 'mouse-jiggler',
    path: '/mouse-jiggler/',
    mediaSlot: 'utility-mouse-jiggler',
    altKey: 'media.utility.mouseJiggler.alt',
    icon: 'jiggler',
    eyebrow: 'utilities.mouseJiggler.eyebrow',
    title: 'utilities.mouseJiggler.title',
    desc: 'utilities.mouseJiggler.desc',
    shortcutNote: 'utilities.mouseJiggler.shortcut',
    howTitle: 'utilities.mouseJiggler.howTitle',
    howDesc: 'utilities.mouseJiggler.howDesc',
    permission: 'utilities.mouseJiggler.permission',
    related: [
      {
        id: 'prevent-sleep',
        icon: 'moon',
        name: 'tool.prevent-sleep.name',
        body: 'utilities.mouseJiggler.related.sleep',
      },
    ],
    faqs: [
      {
        id: 'vs-sleep',
        question: 'utilities.mouseJiggler.faq.q1',
        answer: 'utilities.mouseJiggler.faq.a1',
      },
      {
        id: 'interval',
        question: 'utilities.mouseJiggler.faq.q2',
        answer: 'utilities.mouseJiggler.faq.a2',
      },
      {
        id: 'area',
        question: 'utilities.mouseJiggler.faq.q3',
        answer: 'utilities.mouseJiggler.faq.a3',
      },
      {
        id: 'permission',
        question: 'utilities.mouseJiggler.faq.q4',
        answer: 'utilities.mouseJiggler.faq.a4',
      },
    ],
  },
  'clean-keyboard': {
    id: 'clean-keyboard',
    path: '/clean-keyboard/',
    mediaSlot: 'utility-clean-keyboard',
    altKey: 'media.utility.cleanKeyboard.alt',
    icon: 'keyboard',
    eyebrow: 'utilities.cleanKeyboard.eyebrow',
    title: 'utilities.cleanKeyboard.title',
    desc: 'utilities.cleanKeyboard.desc',
    shortcutNote: 'utilities.cleanKeyboard.shortcut',
    howTitle: 'utilities.cleanKeyboard.howTitle',
    howDesc: 'utilities.cleanKeyboard.howDesc',
    permission: 'utilities.cleanKeyboard.permission',
    related: [
      {
        id: 'quick-ring',
        icon: 'ring',
        name: 'tool.quick-ring.name',
        body: 'utilities.cleanKeyboard.related.ring',
      },
    ],
    faqs: [
      {
        id: 'unlock',
        question: 'utilities.cleanKeyboard.faq.q1',
        answer: 'utilities.cleanKeyboard.faq.a1',
      },
      {
        id: 'mouse',
        question: 'utilities.cleanKeyboard.faq.q2',
        answer: 'utilities.cleanKeyboard.faq.a2',
      },
      {
        id: 'permission',
        question: 'utilities.cleanKeyboard.faq.q3',
        answer: 'utilities.cleanKeyboard.faq.a3',
      },
    ],
  },
  'display-dimming': {
    id: 'display-dimming',
    path: '/display-dimming/',
    mediaSlot: 'utility-display-dimming',
    altKey: 'media.utility.dimming.alt',
    icon: 'dim',
    eyebrow: 'utilities.dimming.eyebrow',
    title: 'utilities.dimming.title',
    desc: 'utilities.dimming.desc',
    shortcutNote: 'utilities.dimming.shortcut',
    howTitle: 'utilities.dimming.howTitle',
    howDesc: 'utilities.dimming.howDesc',
    permission: 'utilities.dimming.permission',
    related: [
      {
        id: 'external-display-only',
        icon: 'external',
        name: 'tool.external-display-only.name',
        body: 'utilities.dimming.related.external',
      },
    ],
    faqs: [
      { id: 'hardware', question: 'utilities.dimming.faq.q1', answer: 'utilities.dimming.faq.a1' },
      { id: 'range', question: 'utilities.dimming.faq.q2', answer: 'utilities.dimming.faq.a2' },
      { id: 'persist', question: 'utilities.dimming.faq.q3', answer: 'utilities.dimming.faq.a3' },
      {
        id: 'permission',
        question: 'utilities.dimming.faq.q4',
        answer: 'utilities.dimming.faq.a4',
      },
    ],
  },
  'external-display-only': {
    id: 'external-display-only',
    path: '/external-display-only/',
    mediaSlot: 'utility-external-display-only',
    altKey: 'media.utility.external.alt',
    icon: 'external',
    eyebrow: 'utilities.external.eyebrow',
    title: 'utilities.external.title',
    desc: 'utilities.external.desc',
    shortcutNote: 'utilities.external.shortcut',
    howTitle: 'utilities.external.howTitle',
    howDesc: 'utilities.external.howDesc',
    permission: 'utilities.external.permission',
    related: [
      {
        id: 'display-dimming',
        icon: 'dim',
        name: 'tool.display-dimming.name',
        body: 'utilities.external.related.dimming',
      },
      {
        id: 'window-switcher',
        icon: 'window',
        name: 'tool.window-switcher.name',
        body: 'utilities.external.related.window',
      },
    ],
    faqs: [
      {
        id: 'supported',
        question: 'utilities.external.faq.q1',
        answer: 'utilities.external.faq.a1',
      },
      {
        id: 'disconnect',
        question: 'utilities.external.faq.q2',
        answer: 'utilities.external.faq.a2',
      },
      {
        id: 'immediate',
        question: 'utilities.external.faq.q3',
        answer: 'utilities.external.faq.a3',
      },
    ],
  },
  'system-monitoring': {
    id: 'system-monitoring',
    path: '/system-monitoring/',
    mediaSlot: 'utility-system-monitoring',
    altKey: 'media.utility.monitor.alt',
    icon: 'gauge',
    eyebrow: 'utilities.monitor.eyebrow',
    title: 'utilities.monitor.title',
    desc: 'utilities.monitor.desc',
    shortcutNote: 'utilities.monitor.shortcut',
    howTitle: 'utilities.monitor.howTitle',
    howDesc: 'utilities.monitor.howDesc',
    permission: 'utilities.monitor.permission',
    related: [
      {
        id: 'prevent-sleep',
        icon: 'moon',
        name: 'tool.prevent-sleep.name',
        body: 'utilities.monitor.related.sleep',
      },
      {
        id: 'clean-keyboard',
        icon: 'keyboard',
        name: 'tool.clean-keyboard.name',
        body: 'utilities.monitor.related.keyboard',
      },
    ],
    faqs: [
      { id: 'refresh', question: 'utilities.monitor.faq.q1', answer: 'utilities.monitor.faq.a1' },
      { id: 'scope', question: 'utilities.monitor.faq.q2', answer: 'utilities.monitor.faq.a2' },
      {
        id: 'permission',
        question: 'utilities.monitor.faq.q3',
        answer: 'utilities.monitor.faq.a3',
      },
    ],
  },
};

export const utilityIds = Object.keys(utilityPages);
