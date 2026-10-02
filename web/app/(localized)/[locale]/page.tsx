import { notFound } from 'next/navigation';
import Home from '@/app/(english)/page';
import { isLocale } from '@/content/locales';
import { routeMetadata } from '@/content/metadata';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? routeMetadata(locale, 'home') : {};
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <Home locale={locale} />;
}
