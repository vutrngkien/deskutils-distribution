import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PrivacyPage } from '@/components/pages/PrivacyPage';
import { isLocale, type Locale } from '@/content/locales';
import { routeMetadata } from '@/content/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? routeMetadata(locale, 'privacy') : {};
}
export default async function LocalizedPrivacy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <PrivacyPage locale={locale as Locale} />;
}
