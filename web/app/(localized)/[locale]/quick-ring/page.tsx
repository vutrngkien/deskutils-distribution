import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QuickRingPage } from '@/components/pages/QuickRingPage';
import { isLocale, type Locale } from '@/content/locales';
import { routeMetadata } from '@/content/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? routeMetadata(locale, 'quick-ring') : {};
}

export default async function LocalizedQuickRing({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <QuickRingPage locale={locale as Locale} />;
}
