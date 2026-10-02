/**
 * Single route registry. This is the source of truth for route paths and
 * publish/index/nav/sitemap status. Navigation, footer, metadata, the sitemap,
 * `verify-output.mjs` and Playwright derive route information from here.
 *
 * Locale completeness is NOT stored here — see `content/translations.ts`, which
 * is route-aware. `publish`/`sitemap` flip to `true` as each route is
 * implemented in its phase (P2 features, P3 utilities, P4 install/support,
 * P5 pricing); while gated, feature links fall back to homepage anchors.
 */
import { localePath, type Locale } from './locales';

export type RouteGroup = 'core' | 'feature' | 'utility' | 'legal' | 'guide';
export type ContentState = 'ready' | 'gated' | 'blocker';
export type NavSlot = 'product' | 'footer' | 'none';

export type RouteEntry = {
  id: string;
  path: string;
  group: RouteGroup;
  designFile: string;
  publish: boolean;
  index: boolean;
  nav: NavSlot;
  sitemap: boolean;
  guide: boolean;
  contentState: ContentState;
  /** Homepage anchor used by nav/footer while this route is gated. */
  anchor?: string;
};

const ready: Pick<RouteEntry, 'publish' | 'index' | 'sitemap' | 'guide' | 'contentState'> = {
  publish: true,
  index: true,
  sitemap: true,
  guide: false,
  contentState: 'ready',
};

const gated: Pick<RouteEntry, 'publish' | 'index' | 'sitemap' | 'guide' | 'contentState'> = {
  publish: false,
  index: false,
  sitemap: false,
  guide: false,
  contentState: 'gated',
};

function featureRoute(id: string, anchor: string, designFile: string): RouteEntry {
  return {
    id,
    path: `/${id}/`,
    group: 'feature',
    designFile,
    nav: 'product',
    anchor,
    ...gated,
  };
}

function utilityRoute(id: string): RouteEntry {
  return {
    id,
    path: `/${id}/`,
    group: 'utility',
    designFile: 'Site v1 - Utilities.dc.html',
    nav: 'product',
    anchor: '/#tools',
    ...gated,
  };
}

export const routes: RouteEntry[] = [
  {
    id: 'home',
    path: '/',
    group: 'core',
    designFile: 'DeskUtils Homepage v2.dc.html',
    nav: 'none',
    ...ready,
  },
  {
    id: 'features',
    path: '/features/',
    group: 'feature',
    designFile: 'Site v1 - Features.dc.html',
    nav: 'product',
    anchor: '/#tools',
    ...ready,
  },
  { ...featureRoute('screenshot', '/#tools', 'Site v1 - Screenshot.dc.html'), ...ready },
  {
    ...featureRoute('clipboard-manager', '/#tools', 'Site v1 - Clipboard Manager.dc.html'),
    ...ready,
  },
  { ...featureRoute('quick-ring', '/#tools', 'Site v1 - Quick Ring.dc.html'), ...ready },
  { ...featureRoute('capture-text', '/#tools', 'Site v1 - Capture Text.dc.html'), ...ready },
  { ...featureRoute('color-picker', '/#tools', 'Site v1 - Color Picker.dc.html'), ...ready },
  { ...featureRoute('window-switcher', '/#tools', 'Site v1 - Window Switcher.dc.html'), ...ready },
  { ...utilityRoute('prevent-sleep'), ...ready },
  { ...utilityRoute('mouse-jiggler'), ...ready },
  { ...utilityRoute('clean-keyboard'), ...ready },
  { ...utilityRoute('display-dimming'), ...ready },
  { ...utilityRoute('external-display-only'), ...ready },
  { ...utilityRoute('system-monitoring'), ...ready },
  {
    id: 'install',
    path: '/install/',
    group: 'core',
    designFile: 'Site v1 - Install.dc.html',
    nav: 'footer',
    ...ready,
  },
  {
    id: 'changelog',
    path: '/changelog/',
    group: 'core',
    designFile: 'Site v1 - Legal.dc.html',
    nav: 'footer',
    ...ready,
  },
  {
    id: 'support',
    path: '/support/',
    group: 'core',
    designFile: 'Site v1 - Support.dc.html',
    nav: 'footer',
    anchor: '/#faq',
    ...ready,
  },
  {
    id: 'pricing',
    path: '/pricing/',
    group: 'core',
    designFile: 'Site v1 - Pricing.dc.html',
    nav: 'footer',
    anchor: '/#pricing',
    ...ready,
  },
  {
    id: 'privacy',
    path: '/privacy/',
    group: 'legal',
    designFile: 'Site v1 - Legal.dc.html',
    nav: 'footer',
    ...ready,
  },
  {
    id: 'terms',
    path: '/terms/',
    group: 'legal',
    designFile: 'Site v1 - Legal.dc.html',
    nav: 'footer',
    ...ready,
  },
  {
    id: 'feedback',
    path: '/feedback/',
    group: 'core',
    designFile: 'Site v1 - Feedback.dc.html',
    nav: 'footer',
    ...ready,
    index: false,
    sitemap: false,
  },
  {
    id: 'guides',
    path: '/guides/',
    group: 'guide',
    designFile: 'Site v1 - Guides.dc.html',
    nav: 'none',
    anchor: '/#faq',
    ...gated,
    guide: true,
  },
];

export const routesById: Record<string, RouteEntry> = Object.fromEntries(
  routes.map((route) => [route.id, route]),
);

export function getRoute(id: string): RouteEntry {
  const route = routesById[id];
  if (!route) throw new Error(`Unknown route id: ${id}`);
  return route;
}

export function publishedRoutes(): RouteEntry[] {
  return routes.filter((route) => route.publish);
}

/** Routes eligible for the XML sitemap (before locale-completeness gating). */
export function sitemapRoutes(): RouteEntry[] {
  return routes.filter((route) => route.publish && route.index && route.sitemap && !route.guide);
}

/**
 * Localized href for a route: its real path when published, otherwise the
 * route's homepage anchor (or a fallback while it is still gated).
 */
export function routeHref(locale: Locale, id: string, fallbackPath = '/'): string {
  const route = getRoute(id);
  return localePath(locale, route.publish ? route.path : (route.anchor ?? fallbackPath));
}
