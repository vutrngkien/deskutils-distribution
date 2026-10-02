import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FeedbackPage } from '@/app/(english)/feedback/page';
import { isLocale, type Locale } from '@/content/locales';
import { routeMetadata } from '@/content/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? routeMetadata(locale, 'feedback') : {};
}

export default async function LocalizedFeedback({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <FeedbackPage locale={locale as Locale} />;
}
