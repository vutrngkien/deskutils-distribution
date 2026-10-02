import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

/**
 * Minimal static file server for `out/`, used by Playwright. More reliable than
 * python's http.server under parallel workers (correct MIME types, keep-alive).
 */
const root = new URL('../out/', import.meta.url).pathname;
const port = Number(process.argv[2] ?? 3100);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

async function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const safe = normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const candidates = safe.endsWith('/') ? [`${safe}index.html`] : [safe, `${safe}/index.html`];
  for (const candidate of candidates) {
    const file = join(root, candidate);
    if (!file.startsWith(root)) continue;
    try {
      const info = await stat(file);
      if (info.isFile()) return file;
    } catch {
      // try next candidate
    }
  }
  return null;
}

createServer(async (req, res) => {
  try {
    const file = await resolveFile(req.url ?? '/');
    if (!file) {
      // Mirror static hosting: serve the exported global 404 with a real 404.
      const body = await readFile(join(root, '404.html'));
      res.writeHead(404, {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
      });
      res.end(body);
      return;
    }
    res.writeHead(200, {
      'content-type': types[extname(file)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    createReadStream(file).pipe(res);
  } catch (error) {
    res.writeHead(500);
    res.end(String(error));
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Serving out/ at http://127.0.0.1:${port}`);
});
