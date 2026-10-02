import type { MessageKey } from './i18n';
import type { ToolIconName } from '@/components/ToolIcon';
import type { Locale } from './locales';
import { routeHref } from './routes';

export type Tool = {
  id: string;
  icon: ToolIconName;
  nameKey: MessageKey;
  bodyKey: MessageKey;
};

const productTools: Tool[] = [
  {
    id: 'screenshot',
    icon: 'capture',
    nameKey: 'tool.screenshot.name',
    bodyKey: 'tool.screenshot.body',
  },
  {
    id: 'clipboard-manager',
    icon: 'clipboard',
    nameKey: 'tool.clipboard-manager.name',
    bodyKey: 'tool.clipboard-manager.body',
  },
  {
    id: 'quick-ring',
    icon: 'ring',
    nameKey: 'tool.quick-ring.name',
    bodyKey: 'tool.quick-ring.body',
  },
  {
    id: 'capture-text',
    icon: 'text',
    nameKey: 'tool.capture-text.name',
    bodyKey: 'tool.capture-text.body',
  },
  {
    id: 'color-picker',
    icon: 'color',
    nameKey: 'tool.color-picker.name',
    bodyKey: 'tool.color-picker.body',
  },
  {
    id: 'window-switcher',
    icon: 'window',
    nameKey: 'tool.window-switcher.name',
    bodyKey: 'tool.window-switcher.body',
  },
];

const utilityTools: Tool[] = [
  {
    id: 'prevent-sleep',
    icon: 'moon',
    nameKey: 'tool.prevent-sleep.name',
    bodyKey: 'tool.prevent-sleep.body',
  },
  {
    id: 'mouse-jiggler',
    icon: 'jiggler',
    nameKey: 'tool.mouse-jiggler.name',
    bodyKey: 'tool.mouse-jiggler.body',
  },
  {
    id: 'clean-keyboard',
    icon: 'keyboard',
    nameKey: 'tool.clean-keyboard.name',
    bodyKey: 'tool.clean-keyboard.body',
  },
  {
    id: 'display-dimming',
    icon: 'dim',
    nameKey: 'tool.display-dimming.name',
    bodyKey: 'tool.display-dimming.body',
  },
  {
    id: 'external-display-only',
    icon: 'external',
    nameKey: 'tool.external-display-only.name',
    bodyKey: 'tool.external-display-only.body',
  },
  {
    id: 'system-monitoring',
    icon: 'gauge',
    nameKey: 'tool.system-monitoring.name',
    bodyKey: 'tool.system-monitoring.body',
  },
];

/** Six flagship tools shown in the Product navigation menu. */
export const productMenu = productTools;

/** All twelve tools shown on the homepage grid and the features index. */
export const allTools: Tool[] = [...productTools, ...utilityTools];

/** Localized href for a tool: its real route once published, else #tools. */
export function toolHref(locale: Locale, tool: Tool): string {
  return routeHref(locale, tool.id, '/#tools');
}

export const quickRingActions: MessageKey[] = [
  'quickring.captureArea',
  'quickring.captureText',
  'quickring.clipboard',
  'quickring.preventSleep',
  'quickring.history',
  'quickring.cleanKeyboard',
  'quickring.quickAnnotate',
  'quickring.colorPicker',
];
