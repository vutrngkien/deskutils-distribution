import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaptureTextPage } from '@/components/pages/CaptureTextPage';
import { isLocale, type Locale } from '@/content/locales';
import { routeMetadata } from '@/content/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? routeMetadata(locale, 'capture-text') : {};
}

export default async function LocalizedCaptureText({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <CaptureTextPage locale={locale as Locale} />;
}
