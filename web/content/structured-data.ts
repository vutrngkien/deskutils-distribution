import { translate } from './i18n';
import { localePath, type Locale } from './locales';
import { product } from './product';

type SchemaValue = string | boolean | SchemaObject | SchemaValue[];
type SchemaObject = { [key: string]: SchemaValue };

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
