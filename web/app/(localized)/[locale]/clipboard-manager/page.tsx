import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClipboardManagerPage } from '@/components/pages/ClipboardManagerPage';
import { isLocale, type Locale } from '@/content/locales';
import { routeMetadata } from '@/content/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? routeMetadata(locale, 'clipboard-manager') : {};
}

export default async function LocalizedClipboardManager({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <ClipboardManagerPage locale={locale as Locale} />;
}
