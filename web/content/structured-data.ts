import { translate } from './i18n';
import { localePath, type Locale } from './locales';
import { product } from './product';

type SchemaValue = string | number | boolean | SchemaObject | SchemaValue[];
type SchemaObject = { [key: string]: SchemaValue };

export type BreadcrumbItem = { name: string; item: string };

/** BreadcrumbList for a nested page. `items` are ordered root → current. */
export function breadcrumbData(items: BreadcrumbItem[]): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

/** ItemList for a catalog/index page. */
export function itemListData(name: string, items: { name: string; url: string }[]): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/** FAQPage for the questions actually rendered on the page. */
export function faqData(entries: { question: string; answer: string }[]): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

/**
 * SoftwareApplication + free Offer. Donations are optional and are never
 * represented as the price of the application.
 */
export function pricingStructuredData(locale: Locale): SchemaObject {
  const url = `${product.origin}${localePath(locale, '/pricing/')}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${url}#app`,
    name: product.name,
    url,
    operatingSystem: `macOS ${product.minimumMacOS} or later`,
    applicationCategory: 'UtilitiesApplication',
    downloadUrl: product.downloadURL,
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: product.pricing.amount,
      priceCurrency: product.pricing.currency,
      availability: 'https://schema.org/InStock',
      url: product.downloadURL,
    },
    inLanguage: locale,
    sameAs: [product.repositoryURL],
  };
}

export function homeStructuredData(locale: Locale): SchemaObject {
  const url = `${product.origin}${localePath(locale, '/')}`;
  const description = translate(locale, 'meta.home.description');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${product.origin}/#website`,
        name: product.name,
        url: product.origin,
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${url}#app`,
        name: product.name,
        url,
        description,
        image: `${product.origin}/assets/images/og-deskutils.png`,
        operatingSystem: `macOS ${product.minimumMacOS} or later`,
        applicationCategory: 'UtilitiesApplication',
        applicationSubCategory: 'Clipboard Manager and Screenshot Tool',
        downloadUrl: product.downloadURL,
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: product.pricing.amount,
          priceCurrency: product.pricing.currency,
          availability: 'https://schema.org/InStock',
          url: product.downloadURL,
        },
        inLanguage: locale,
        sameAs: [product.repositoryURL],
        featureList: [
          translate(locale, 'clipboard.title'),
          translate(locale, 'capture.title'),
          translate(locale, 'capture.ocr.title'),
          translate(locale, 'dimming.title'),
          translate(locale, 'utilities.color.title'),
        ],
      },
    ],
  };
}
