import snapshot from './releases.json';

/**
 * Build-time snapshot of published GitHub releases. Regenerate with
 * `npm run sync:releases`; the build and tests never call GitHub.
 */
export type Release = {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
  html_url: string;
};

export const releases = snapshot as Release[];
