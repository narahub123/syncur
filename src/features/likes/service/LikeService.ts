import { userFeedInteractionRepository } from "@/features/feed-interaction/repositories/UserFeedInteractionRepository.instance";
import { feedItemStatsRepository } from "@/features/feed-items/repositories/FeedItemStatsRepository.instance";
import { FeedResponse } from "@/features/feeds/dto/feedDto";
import { mapFeedItemToDto } from "@/features/feeds/service/getMyFeedItems/feedItemDtoMapper";
import { isSubscribedFeedItemVisible } from "@/features/feeds/service/getMyFeedItems/isSubscribedFeedItemVisible";
import { paginateFeedItems } from "@/features/feeds/service/getMyFeedItems/paginateFeedItems";
import { loadLikedFeedContext } from "./loadLikedFeedContext";

export class LikeService {
  async getMyLikes(userId: string, cursor?: string): Promise<FeedResponse> {
    // =========================
    // 1. Like 기반 Feed Context 로딩
    // =========================
    // - subscription 기반 feed scope 유지
    // - 해당 scope 내 feedItem 전체 로딩
    // - 이후 단계에서 filter/pagination 재사용 가능 구조
    const { items, feedMap, siteMap, subscribedMap } =
      await loadLikedFeedContext(userId);

    // =========================
    // 2. feed 노출 정책 필터링
    // =========================
    // - 기존 feed와 동일한 정책 유지
    // - subscribedMap 기반 visibility control
    const filtered = items.filter((item) => {
      return isSubscribedFeedItemVisible(item, subscribedMap, 1);
    });

    // =========================
    // 3. cursor 기반 pagination
    // =========================
    const { pagedItems, nextCursor, hasNext } = paginateFeedItems({
      items: filtered,
      cursor,
    });

    // =========================
    // 4. interaction 조회 (user state merge)
    // =========================
    // - like, bookmark, click 등 사용자 상태 merge용
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
    // 5. feed stats 조회
    // =========================
    // - view count, engagement 등 통계 정보 merge
    const statsList = await feedItemStatsRepository.findByFeedIds(feedItemIds);

    const statsMap = new Map(
      statsList.map((i) => [i.feedItemId.toString(), i]),
    );

    // =========================
    // 6. DTO 변환
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
    // 7. response
    // =========================
    return {
      items: result,
      nextCursor,
      hasNext,
      status: items.length === 0 ? "EMPTY_FEED" : "HAS_DATA",
    };
  }
}
