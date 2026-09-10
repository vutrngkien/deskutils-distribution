import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PrivacyPage } from '@/app/(english)/privacy/page';
import { isLocale, languages, type Locale } from '@/content/locales';
import { pageMetadata } from '@/content/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? pageMetadata(locale, 'privacy', '/privacy/') : {};
}
export function generateStaticParams() {
  return languages.filter(({ code }) => code !== 'en').map(({ code }) => ({ locale: code }));
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
