export const SSE_EVENT = {
  CONNECTED: "connected",
  PING: "ping",
  USER_EVENT: "user:notify",
  ADMIN_EVENT: "admin:notify",
} as const;

export type SseEvent = (typeof SSE_EVENT)[keyof typeof SSE_EVENT];
