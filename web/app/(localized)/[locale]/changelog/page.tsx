import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChangelogPage } from '@/components/pages/ChangelogPage';
import { isLocale, type Locale } from '@/content/locales';
import { routeMetadata } from '@/content/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? routeMetadata(locale, 'changelog') : {};
}

export default async function LocalizedChangelog({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <ChangelogPage locale={locale as Locale} />;
}
