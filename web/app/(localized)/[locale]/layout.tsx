import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { UmamiAnalytics } from '@/components/UmamiAnalytics';
import { RootShell } from '@/components/layout/RootShell';
import { fontVariables } from '@/components/fonts';
import { isLocale, languages } from '@/content/locales';
import { product } from '@/content/product';
import '@/app/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(product.origin),
  icons: { icon: '/assets/icons/favicon.png' },
};
export const viewport: Viewport = { themeColor: '#ffffff' };

/** Locale enumeration lives once, at the [locale] segment. */
export function generateStaticParams() {
  return languages
    .filter((language) => language.code !== 'en')
    .map(({ code }) => ({ locale: code }));
}

export default async function LocalizedRootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return (
    <html lang={locale} className={fontVariables}>
      <body>
        <RootShell locale={locale}>{children}</RootShell>
        <UmamiAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
