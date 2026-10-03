import snapshot from './releases.json';

/**
 * Build-time snapshot of published GitHub releases. Regenerate with
 * `npm run sync:releases`; builds never call GitHub. The Changelog browser
 * component refreshes this initial HTML/fallback snapshot on each visit.
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
