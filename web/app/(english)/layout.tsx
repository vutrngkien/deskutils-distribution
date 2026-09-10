import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { product } from '@/content/product';
import '@/app/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(product.origin),
  icons: { icon: '/assets/icons/favicon.png' },
};
export const viewport: Viewport = { themeColor: '#ffffff' };
export default function EnglishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
