import { FeedResponse } from "../../dto/feedDto";
import { isSubscribedFeedItemVisible } from "./isSubscribedFeedItemVisible";
import { userFeedInteractionRepository } from "@/features/feed-interaction/repositories/UserFeedInteractionRepository.instance";
import { feedItemStatsRepository } from "@/features/feed-items/repositories/FeedItemStatsRepository.instance";
import { loadFeedContext } from "./loadFeedContext";
import { paginateFeedItems } from "./paginateFeedItems";
import { mapFeedItemToDto } from "./feedItemDtoMapper";

export async function getFeedItems(
  userId: string,
  cursor?: string,
): Promise<FeedResponse> {
  const { items, feedMap, siteMap, subscribedMap } =
    await loadFeedContext(userId);

  const filtered = items.filter((item) => {
    return isSubscribedFeedItemVisible(item, subscribedMap, 1);
  });

  const { pagedItems, nextCursor, hasNext } = paginateFeedItems({
    items: filtered,
    cursor,
  });

  // =========================
  // 10. interaction 조회
  // =========================
  const feedItemIds = pagedItems.map((i) => i._id.toString());

  const interactions =
    await userFeedInteractionRepository.findByUserAndFeedItemIds(
      userId,
      feedItemIds,
    );

  const interactionMap = new Map(
    interactions.map((i) => [i.feedItemId.toString(), i]),
  );

  // =========================
  // 11. stats 조회
  // =========================
  const statsList = await feedItemStatsRepository.findByFeedIds(feedItemIds);

  const statsMap = new Map(statsList.map((i) => [i.feedItemId.toString(), i]));

  // =========================
  // 12. DTO 변환 (mapper 사용)
  // =========================
  const result = pagedItems.map((item) =>
    mapFeedItemToDto({
      item,
      feedMap,
      siteMap,
      interactionMap,
      statsMap,
    }),
  );

  // =========================
  // 13. response
  // =========================
  return {
    items: result,
    nextCursor,
    hasNext,
    status: items.length === 0 ? "EMPTY_FEED" : "HAS_DATA",
  };
}
