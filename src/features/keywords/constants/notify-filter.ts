export const NOTIFY_FILTER = {
  DEFAULT: "DEFAULT",
  ALL: "ALL",
  KEYWORD_ONLY: "KEYWORD_ONLY",
} as const;

export type NotifyFilter = (typeof NOTIFY_FILTER)[keyof typeof NOTIFY_FILTER];
