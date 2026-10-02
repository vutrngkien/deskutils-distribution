import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ColorPickerPage } from '@/components/pages/ColorPickerPage';
import { isLocale, type Locale } from '@/content/locales';
import { routeMetadata } from '@/content/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? routeMetadata(locale, 'color-picker') : {};
}

export default async function LocalizedColorPicker({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <ColorPickerPage locale={locale as Locale} />;
}
