import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { InstallPage } from '@/components/pages/InstallPage';
import { isLocale, type Locale } from '@/content/locales';
import { routeMetadata } from '@/content/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? routeMetadata(locale, 'install') : {};
}
export default async function LocalizedInstall({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <InstallPage locale={locale as Locale} />;
}
