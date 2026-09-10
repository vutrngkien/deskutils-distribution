import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TermsPage } from '@/app/(english)/terms/page';
import { isLocale, languages, type Locale } from '@/content/locales';
import { pageMetadata } from '@/content/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) && locale !== 'en' ? pageMetadata(locale, 'terms', '/terms/') : {};
}
export function generateStaticParams() {
  return languages.filter(({ code }) => code !== 'en').map(({ code }) => ({ locale: code }));
}
export default async function LocalizedTerms({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === 'en') notFound();
  return <TermsPage locale={locale as Locale} />;
}
