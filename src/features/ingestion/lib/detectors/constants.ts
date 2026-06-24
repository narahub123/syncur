export const CONTENT_SELECTORS = [
  "article",
  "main",
  ".post-body",
  ".entry-content",
  ".post-content",
  "#content",
];
export const SPA_ROOT_IDS = ["#root", "#__next", "#app", "#__nuxt"];

export const RSS_FALLBACK_PATHS = [
  "/rss",
  "/feed",
  "/atom.xml",
  "/feed.json",
] as const;

export const RSS_LINK_SELECTORS = [
  'link[type="application/rss+xml"]',
  'link[type="application/atom+xml"]',
  'link[type="application/feed+json"]',
] as const;

export const RSS_CONTENT_TYPES = [
  "application/rss+xml",
  "application/atom+xml",
  "application/feed+json",
] as const;
