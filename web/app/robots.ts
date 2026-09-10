import type { MetadataRoute } from 'next';
import { product } from '@/content/product';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${product.origin}/sitemap.xml` };
}
