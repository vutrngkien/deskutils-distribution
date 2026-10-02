import type { MetadataRoute } from 'next';
import { product } from '@/content/product';
import { localePath } from '@/content/locales';
import { translatedLocalesFor } from '@/content/translations';
import { sitemapRoutes } from '@/content/routes';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapRoutes().flatMap((route) => {
    const locales = translatedLocalesFor(route.id);
    return locales.map((locale) => ({
      url: `${product.origin}${localePath(locale, route.path)}`,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((code) => [code, `${product.origin}${localePath(code, route.path)}`]),
          ['x-default', `${product.origin}${route.path}`],
        ]),
      },
    }));
  });
}
