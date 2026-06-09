import { FeedItem } from "@/shared/types/feed";

const DAY_MS = 1000 * 60 * 60 * 24;

/**
 * FeedItem의 기준 노출 여부 판단
 *
 * 핵심:
 * - publishedAt / createdAt 중 존재하는 값을 기준으로 시간 통일
 * - 구독 시점 + offsetDays 기준으로 필터링
 */
const getItemTime = (item: FeedItem): number => {
  return new Date(item.publishedAt ?? item.createdAt ?? 0).getTime();
};

export const isSubscribedFeedItemVisible = (
  item: FeedItem,
  subscribedAtMap: Map<string, Date>,
  offsetDays: number,
): boolean => {
  // 1. feed item 시간 통일 (publishedAt → createdAt fallback)
  const itemTime = getItemTime(item);

  // 2. 구독 시점 조회
  const subscribedAt = subscribedAtMap.get(item.feedId.toString())?.getTime();

  // 구독 정보 없으면 제외
  if (!subscribedAt) return false;

  // 3. offset 적용 (구독 이후 N일 이전까지 포함 여부 조정)
  const adjustedSubscribedAt = subscribedAt - offsetDays * DAY_MS;

  // 4. 구독 이후 생성된 feed item만 허용
  return itemTime > adjustedSubscribedAt;
};
