import type { MessageKey } from './i18n';
import type { ToolIconName } from '@/components/ToolIcon';

/**
 * Support hub topics. `routeId` resolves through `routeHref` so a topic never
 * points at an unpublished page; `external` is used for the GitHub releases.
 * `hash` appends an in-page anchor (e.g. /install/#permissions).
 */
export type SupportTopic = {
  id: string;
  icon: ToolIconName;
  title: MessageKey;
  body: MessageKey;
  routeId?: string;
  external?: string;
  hash?: string;
};

export const supportTopics: SupportTopic[] = [
  {
    id: 'install',
    icon: 'external',
    title: 'support.topic.install.title',
    body: 'support.topic.install.body',
    routeId: 'install',
  },
  {
    id: 'permissions',
    icon: 'lock',
    title: 'support.topic.permissions.title',
    body: 'support.topic.permissions.body',
    routeId: 'install',
    hash: 'permissions',
  },
  {
    id: 'screenshot',
    icon: 'capture',
    title: 'support.topic.screenshot.title',
    body: 'support.topic.screenshot.body',
    routeId: 'screenshot',
  },
  {
    id: 'clipboard',
    icon: 'clipboard',
    title: 'support.topic.clipboard.title',
    body: 'support.topic.clipboard.body',
    routeId: 'clipboard-manager',
  },
  {
    id: 'feedback',
    icon: 'annotate',
    title: 'support.topic.feedback.title',
    body: 'support.topic.feedback.body',
    routeId: 'feedback',
  },
  {
    id: 'releases',
    icon: 'previous',
    title: 'support.topic.releases.title',
    body: 'support.topic.releases.body',
    routeId: 'changelog',
  },
];
