import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  // Images are pre-optimized assets served by GitHub Pages, with explicit sizes.
  { rules: { '@next/next/no-img-element': 'off', '@next/next/no-html-link-for-pages': 'off' } },
  globalIgnores([
    '.next/**',
    'out/**',
    'public/assets/**',
    'next-env.d.ts',
    'test-results/**',
    'playwright-report/**',
  ]),
]);
