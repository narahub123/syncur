export const FEED_FILTER = {
  DEFAULT: "DEFAULT",
  ALL: "ALL",
  KEYWORD_ONLY: "KEYWORD_ONLY",
} as const;

export type FeedFilter = (typeof FEED_FILTER)[keyof typeof FEED_FILTER];
