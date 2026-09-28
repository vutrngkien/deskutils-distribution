import { en, type MessageKey, type Messages } from './messages/en';
import { ja } from './messages/ja';
import { ko } from './messages/ko';
import { ru } from './messages/ru';
import { vi } from './messages/vi';
import { zhCN } from './messages/zh-CN';
import { zhTW } from './messages/zh-TW';
import { es } from './messages/es';
import { fr } from './messages/fr';
import { de } from './messages/de';
import type { Locale } from './locales';

export type { MessageKey } from './messages/en';
export type MessageValues = Record<string, string | number>;

const catalog: Partial<Record<Locale, Messages>> = {
  en,
  vi,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  es,
  ja,
  ko,
  ru,
  fr,
  de,
};

export function translate(locale: Locale, key: MessageKey, values: MessageValues = {}): string {
  const message = catalog[locale]?.[key] ?? en[key];
  return message.replace(/\{(\w+)\}/g, (token, name: string) =>
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : token,
  );
}
