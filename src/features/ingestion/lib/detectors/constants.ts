export const CONTENT_SELECTORS = ["article", "main", "[role='main']"] as const;
export const SPA_ROOT_IDS = [
  "#__next",
  "#root",
  "#app",
  "#svelte",
  "#angular",
] as const;

export const STATIC_TEXT_LENGTH = 300;

export const DYNAMIC_TEXT_LENGTH = 50;

export const SCRIPT_HEAVY_COUNT = 10;


// ----------------------------------------------------------------
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
