import '@/app/globals.css';
import { Button, Shell } from '@/components/Site';

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
              <Button href="/">Back to DeskUtils →</Button>
            </section>
          </Shell>
        </main>
      </body>
    </html>
  );
}
