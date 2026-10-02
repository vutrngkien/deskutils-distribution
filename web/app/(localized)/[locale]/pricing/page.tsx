import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PricingPage } from '@/components/pages/PricingPage';
import { isLocale, type Locale } from '@/content/locales';
import { routeMetadata } from '@/content/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? routeMetadata(locale, 'pricing') : {};
}

export default async function LocalizedPricing({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <PricingPage locale={locale as Locale} />;
}
