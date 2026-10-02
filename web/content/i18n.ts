import { en, catalog } from './translations';
import type { Locale } from './locales';

export type { MessageKey } from './messages/en';
export type MessageValues = Record<string, string | number>;

/**
 * Resolve a localized string. Missing keys fall back to the canonical English
 * catalog so partial catalogs never render `undefined`. Locales that are
 * production-complete are enforced separately by `scripts/check-translations.mjs`.
 */
export function translate(
  locale: Locale,
  key: keyof typeof en,
  values: MessageValues = {},
): string {
  const template = catalog[locale]?.[key] ?? en[key];
  return template.replace(/\{(\w+)\}/g, (token, name: string) =>
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : token,
  );
}
