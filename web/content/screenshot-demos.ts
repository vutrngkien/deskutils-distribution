import { existsSync } from 'node:fs';
import path from 'node:path';

/** Add recordings here; absent files keep the approved mockup, without dead requests. */
export function screenshotDemoSources() {
  return ['capture', 'annotate', 'save'].map((state) =>
    ['webm', 'mp4'].flatMap((extension) => {
      const file = `screenshot-${state}.${extension}`;
      return existsSync(path.join(process.cwd(), 'public', 'demos', file))
        ? [{ src: `/demos/${file}`, type: `video/${extension}` }]
        : [];
    }),
  );
}
