import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UtilityPage } from '@/components/features/utility/UtilityPage';
import { isLocale, type Locale } from '@/content/locales';
import { routeMetadata } from '@/content/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? routeMetadata(locale, 'clean-keyboard') : {};
}

export default async function LocalizedUtility({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <UtilityPage locale={locale as Locale} id="clean-keyboard" />;
}
