import type { MetadataRoute } from 'next';
import { product } from '@/content/product';
import { languages, localePath } from '@/content/locales';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/install/', '/privacy/', '/terms/'];
  return languages.flatMap(({ code }) =>
    paths.map((path) => ({
      url: `${product.origin}${localePath(code, path)}`,
      alternates: {
        languages: Object.fromEntries([
          ...languages.map(({ code: locale }) => [
            locale,
            `${product.origin}${localePath(locale, path)}`,
          ]),
          ['x-default', `${product.origin}${path}`],
        ]),
      },
    })),
  );
}
