import type { MessageKey } from './i18n';
import type { ToolIconName } from '@/components/ToolIcon';

type ToolRef = { id: string; icon: ToolIconName; name: MessageKey; body: MessageKey };

/** Grouped catalog shown on `/features/` (`Site v1 - Features.dc.html`). */
export const featureGroups: {
  id: string;
  icon: ToolIconName;
  title: MessageKey;
  body: MessageKey;
  tools: ToolRef[];
}[] = [
  {
    id: 'capture',
    icon: 'capture',
    title: 'features.group.capture.title',
    body: 'features.group.capture.body',
    tools: [
      {
        id: 'screenshot',
        icon: 'capture',
        name: 'tool.screenshot.name',
        body: 'tool.screenshot.body',
      },
      {
        id: 'color-picker',
        icon: 'color',
        name: 'tool.color-picker.name',
        body: 'tool.color-picker.body',
      },
    ],
  },
  {
    id: 'copy',
    icon: 'clipboard',
    title: 'features.group.copy.title',
    body: 'features.group.copy.body',
    tools: [
      {
        id: 'clipboard-manager',
        icon: 'clipboard',
        name: 'tool.clipboard-manager.name',
        body: 'tool.clipboard-manager.body',
      },
      {
        id: 'capture-text',
        icon: 'text',
        name: 'tool.capture-text.name',
        body: 'tool.capture-text.body',
      },
    ],
  },
  {
    id: 'navigate',
    icon: 'ring',
    title: 'features.group.navigate.title',
    body: 'features.group.navigate.body',
    tools: [
      {
        id: 'quick-ring',
        icon: 'ring',
        name: 'tool.quick-ring.name',
        body: 'tool.quick-ring.body',
      },
      {
        id: 'window-switcher',
        icon: 'window',
        name: 'tool.window-switcher.name',
        body: 'tool.window-switcher.body',
      },
    ],
  },
  {
    id: 'focus',
    icon: 'moon',
    title: 'features.group.focus.title',
    body: 'features.group.focus.body',
    tools: [
      {
        id: 'prevent-sleep',
        icon: 'moon',
        name: 'tool.prevent-sleep.name',
        body: 'tool.prevent-sleep.body',
      },
      {
        id: 'mouse-jiggler',
        icon: 'jiggler',
        name: 'tool.mouse-jiggler.name',
        body: 'tool.mouse-jiggler.body',
      },
      {
        id: 'clean-keyboard',
        icon: 'keyboard',
        name: 'tool.clean-keyboard.name',
        body: 'tool.clean-keyboard.body',
      },
    ],
  },
  {
    id: 'display',
    icon: 'gauge',
    title: 'features.group.display.title',
    body: 'features.group.display.body',
    tools: [
      {
        id: 'display-dimming',
        icon: 'dim',
        name: 'tool.display-dimming.name',
        body: 'tool.display-dimming.body',
      },
      {
        id: 'external-display-only',
        icon: 'external',
        name: 'tool.external-display-only.name',
        body: 'tool.external-display-only.body',
      },
      {
        id: 'system-monitoring',
        icon: 'gauge',
        name: 'tool.system-monitoring.name',
        body: 'tool.system-monitoring.body',
      },
    ],
  },
];

export const featureCompares: {
  id: string;
  title: MessageKey;
  a: {
    id: string;
    icon: ToolIconName;
    href?: string;
    name: MessageKey;
    body: MessageKey;
    link: MessageKey;
  };
  b: {
    id: string;
    icon: ToolIconName;
    href?: string;
    name: MessageKey;
    body: MessageKey;
    link: MessageKey;
  };
}[] = [
  {
    id: 'sleep-jiggler',
    title: 'features.compare.sleepJiggler.title',
    a: {
      id: 'prevent-sleep',
      icon: 'moon',
      name: 'tool.prevent-sleep.name',
      body: 'features.compare.sleepJiggler.a',
      link: 'features.compare.sleepJiggler.aLink',
    },
    b: {
      id: 'mouse-jiggler',
      icon: 'jiggler',
      name: 'tool.mouse-jiggler.name',
      body: 'features.compare.sleepJiggler.b',
      link: 'features.compare.sleepJiggler.bLink',
    },
  },
  {
    id: 'screenshot-text',
    title: 'features.compare.screenshotText.title',
    a: {
      id: 'screenshot',
      icon: 'capture',
      name: 'tool.screenshot.name',
      body: 'features.compare.screenshotText.a',
      link: 'features.compare.screenshotText.aLink',
    },
    b: {
      id: 'capture-text',
      icon: 'text',
      name: 'tool.capture-text.name',
      body: 'features.compare.screenshotText.b',
      link: 'features.compare.screenshotText.bLink',
    },
  },
  {
    id: 'ring-menu',
    title: 'features.compare.ringMenu.title',
    a: {
      id: 'quick-ring',
      icon: 'ring',
      name: 'tool.quick-ring.name',
      body: 'features.compare.ringMenu.a',
      link: 'features.compare.ringMenu.aLink',
    },
    b: {
      id: 'home',
      icon: 'tools',
      name: 'features.compare.ringMenu.bName',
      body: 'features.compare.ringMenu.b',
      link: 'features.compare.ringMenu.bLink',
    },
  },
];
