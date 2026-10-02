import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WindowSwitcherPage } from '@/components/pages/WindowSwitcherPage';
import { isLocale, type Locale } from '@/content/locales';
import { routeMetadata } from '@/content/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? routeMetadata(locale, 'window-switcher') : {};
}

export default async function LocalizedWindowSwitcher({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <WindowSwitcherPage locale={locale as Locale} />;
}
