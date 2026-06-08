import { FeedItem } from "@/shared/types/feed";

const DAY_MS = 1000 * 60 * 60 * 24;

export const feedCondition = (
  item: FeedItem,
  subscribedAtMap: Map<string, Date>,
  offsetDays: number,
) => {
  const publishedAt = new Date(item.publishedAt ?? 0).getTime();

  const subscribedAt = subscribedAtMap.get(item.feedId.toString())?.getTime();
  if (!subscribedAt) return false;

  const adjustedSubscribedAt = subscribedAt - offsetDays * DAY_MS;

  return publishedAt > adjustedSubscribedAt;
};
