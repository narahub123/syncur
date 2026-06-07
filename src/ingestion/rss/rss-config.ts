export const RSS_CONFIG = {
  RSS_FETCH_TIMEOUT: 8000,
  RSS_USER_AGENT: "Syncur RSS Bot",
  RSS_ACCEPT: "application/rss+xml, application/xml, text/xml",

  CRON_SCHEDULE: "*/10 * * * *",

  FETCH_INTERVAL_MS: 10 * 60 * 1000, // 10분

  STATUS: {
    ACTIVE: "active",
    ERROR: "error",
    DISABLED: "disabled",
  },

  ERROR_THRESHOLD: 5,
} as const;
