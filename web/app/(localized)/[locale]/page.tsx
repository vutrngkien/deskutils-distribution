import { notFound } from 'next/navigation';
import Home from '@/app/(english)/page';
import { isLocale, languages } from '@/content/locales';
import { pageMetadata } from '@/content/metadata';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return languages
    .filter((language) => language.code !== 'en')
    .map(({ code }) => ({ locale: code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? pageMetadata(locale, 'home', '/') : {};
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <Home locale={locale} />;
}
