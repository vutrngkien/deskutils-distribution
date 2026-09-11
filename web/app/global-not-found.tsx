import '@/app/globals.css';
import type { Metadata } from 'next';
import { Button, Shell } from '@/components/Site';

export const metadata: Metadata = {
  title: 'Page not found — DeskUtils',
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main id="main">
          <Shell>
            <section style={{ padding: '12rem 0', textAlign: 'center' }}>
              <p>404 / Page not found</p>
              <h1>This one got away.</h1>
              <p>The page you’re looking for isn’t here. Your everyday tools are one click back.</p>
              <Button href="/" placement="not_found">
                Back to DeskUtils →
              </Button>
            </section>
          </Shell>
        </main>
      </body>
    </html>
  );
}
