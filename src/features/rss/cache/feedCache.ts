const feedCache = new Map<
  string,
  {
    valid: boolean;
    itemCount: number;
    expiresAt: number;
  }
>();

const TTL = {
  FEED: 1000 * 60 * 60 * 24, // 1 day
};

export function getFeedCache(url: string) {
  const cached = feedCache.get(url);

  if (!cached) return null;

  if (Date.now() > cached.expiresAt) {
    feedCache.delete(url);
    return null;
  }

  return cached;
}

export function setFeedCache(
  url: string,
  value: { valid: boolean; itemCount: number },
) {
  feedCache.set(url, {
    ...value,
    expiresAt: Date.now() + TTL.FEED,
  });
}
