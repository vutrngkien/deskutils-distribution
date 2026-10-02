import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ScreenshotPage } from '@/components/pages/ScreenshotPage';
import { isLocale, type Locale } from '@/content/locales';
import { routeMetadata } from '@/content/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? routeMetadata(locale, 'screenshot') : {};
}

export default async function LocalizedScreenshot({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <ScreenshotPage locale={locale as Locale} />;
}
