import { en, type MessageKey, type Messages } from './messages/en';
import { ja } from './messages/ja';
import { ko } from './messages/ko';
import { ru } from './messages/ru';
import { vi } from './messages/vi';
import { zhCN } from './messages/zh-CN';
import { zhTW } from './messages/zh-TW';
import type { Locale } from './locales';

export type { MessageKey } from './messages/en';
export type MessageValues = Record<string, string | number>;

const catalog: Record<Locale, Messages> = { en, vi, 'zh-CN': zhCN, 'zh-TW': zhTW, ja, ko, ru };

export function translate(locale: Locale, key: MessageKey, values: MessageValues = {}): string {
  return catalog[locale][key].replace(/\{(\w+)\}/g, (token, name: string) =>
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : token,
  );
}
