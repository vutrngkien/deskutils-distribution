import type { Metadata } from 'next';
import { translate, type MessageKey } from './i18n';
import { localePath, type Locale } from './locales';
import { translatedLocalesFor } from './translations';
import { getRoute } from './routes';
import { product } from './product';

const openGraphLocales: Record<Locale, string> = {
  en: 'en_US',
  vi: 'vi_VN',
  'zh-CN': 'zh_CN',
  'zh-TW': 'zh_TW',
  es: 'es_ES',
  ja: 'ja_JP',
  ko: 'ko_KR',
  ru: 'ru_RU',
  fr: 'fr_FR',
  de: 'de_DE',
};

/**
 * Page metadata derived from the route registry: canonical path, index/noindex
 * and hreflang alternates (only for locales where this route has a complete
 * equivalent translation).
 */
export function routeMetadata(locale: Locale, id: string): Metadata {
  const route = getRoute(id);
  const title = translate(locale, `meta.${id}.title` as MessageKey);
  const description = translate(locale, `meta.${id}.description` as MessageKey);
  const url = new URL(localePath(locale, route.path), product.origin).href;

  const translated = translatedLocalesFor(id);
  const languagesMap = Object.fromEntries(
    translated.map((code) => [code, localePath(code, route.path)]),
  );
  languagesMap['x-default'] = route.path;

  const complete = translated.includes(locale);
  const robots = !route.index || !complete ? { index: false, follow: false } : undefined;

  const image = {
    url: `${product.origin}/assets/images/og-deskutils.png`,
    width: 1200,
    height: 630,
    alt: translate(locale, 'meta.ogAlt'),
  };

  return {
    title,
    description,
    robots,
    alternates: { canonical: url, languages: languagesMap },
    openGraph: {
      type: 'website',
      siteName: product.name,
      title,
      description,
      url,
      images: [image],
      locale: openGraphLocales[locale],
      alternateLocale: translated
        .filter((code) => code !== locale)
        .map((code) => openGraphLocales[code]),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
