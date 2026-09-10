import type { Metadata } from 'next';
import { translate } from './i18n';
import { languages, localePath, type Locale } from './locales';
import { product } from './product';

type Page = 'home' | 'install' | 'privacy' | 'terms';
const openGraphLocales: Record<Locale, string> = {
  en: 'en_US',
  vi: 'vi_VN',
  'zh-CN': 'zh_CN',
  'zh-TW': 'zh_TW',
  ja: 'ja_JP',
  ko: 'ko_KR',
  ru: 'ru_RU',
};

export function pageMetadata(locale: Locale, page: Page, path: string): Metadata {
  const title = translate(locale, `meta.${page}.title`);
  const description = translate(locale, `meta.${page}.description`);
  const canonicalPath = localePath(locale, path);
  const url = new URL(canonicalPath, product.origin).href;
  const languagesMap = Object.fromEntries(
    languages.map(({ code }) => [code, localePath(code, path)]),
  );
  languagesMap['x-default'] = path;
  const image = {
    url: `${product.origin}/assets/images/og-deskutils.png`,
    width: 1200,
    height: 630,
    alt: translate(locale, 'meta.ogAlt'),
  };
  return {
    title,
    description,
    alternates: { canonical: url, languages: languagesMap },
    openGraph: {
      type: 'website',
      siteName: product.name,
      title,
      description,
      url,
      images: [image],
      locale: openGraphLocales[locale],
      alternateLocale: languages
        .filter(({ code }) => code !== locale)
        .map(({ code }) => openGraphLocales[code]),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
