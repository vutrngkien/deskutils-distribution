import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { isLocale } from '@/content/locales';
import { product } from '@/content/product';
import '@/app/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(product.origin),
  icons: { icon: '/assets/icons/favicon.png' },
};
export const viewport: Viewport = { themeColor: '#ffffff' };
export default async function LocalizedRootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
