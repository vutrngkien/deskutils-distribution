import '@/app/globals.css';
import type { Metadata } from 'next';
import { SearchX } from 'lucide-react';
import { UmamiAnalytics } from '@/components/UmamiAnalytics';
import { Nav } from '@/components/layout/Nav';
import { translate } from '@/content/i18n';

export const metadata: Metadata = {
  title: 'Page Not Found — DeskUtils',
  robots: { index: false, follow: false },
};

/**
 * Served with a real HTTP 404 status (see tests/website.spec.ts). It is
 * English-only and noindex, so it renders the shared Nav but no footer.
 */
export default function GlobalNotFound() {
  const t = translate.bind(null, 'en');
  const links = [
    { href: '/', label: t('notFound.back'), primary: true },
    { href: '/features/', label: t('notFound.features'), primary: false },
    { href: '/support/', label: t('notFound.support'), primary: false },
  ];

  return (
    <html lang="en">
      <body>
        <Nav locale="en" />
        <main id="main" data-track-placement="not_found" data-umami-section="not-found">
          <div className="container-page flex flex-col items-center gap-5 pt-20 text-center dt:pt-24">
            <SearchX size={54} strokeWidth={1.5} className="text-primary" aria-hidden="true" />
            <p className="text-[15px] font-semibold text-primary">{t('notFound.label')}</p>
            <h1 className="h-display text-[28px] dt:text-[42px]">{t('notFound.title')}</h1>
            <p className="lede max-w-[520px]">{t('notFound.description')}</p>
            <div className="mt-2 flex w-full flex-col gap-4 dt:w-auto dt:flex-row">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex min-h-[50px] items-center justify-center rounded-[12px] px-6 text-[15.5px] font-semibold ${
                    link.primary
                      ? 'bg-primary text-white hover:bg-[#0b3bc0]'
                      : 'bg-[#f3f6ff] text-base-content hover:bg-[#eaf0ff]'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </main>
        <UmamiAnalytics />
      </body>
    </html>
  );
}
