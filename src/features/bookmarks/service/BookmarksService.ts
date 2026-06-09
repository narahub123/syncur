import { userFeedInteractionRepository } from "@/features/feed-interaction/repositories/UserFeedInteractionRepository.instance";
import { feedItemStatsRepository } from "@/features/feed-items/repositories/FeedItemStatsRepository.instance";
import { loadFeedContext } from "@/features/feeds/service/getMyFeedItems/loadFeedContext";
import { FeedResponse } from "@/features/feeds/dto/feedDto";
import { paginateFeedItems } from "@/features/feeds/service/getMyFeedItems/paginateFeedItems";
import { mapFeedItemToDto } from "@/features/feeds/service/getMyFeedItems/feedItemDtoMapper";
import { UserFeedInteractionRepository } from "@/features/feed-interaction/repositories/UserFeedInteractionRepository";
import { FeedItemRepository } from "@/features/feed-items/repositories/FeedItemRepository";
import { FeedItemStatsRepository } from "@/features/feed-items/repositories/FeedItemStatsRepository";
import { FeedRepository } from "@/features/feeds/repository/FeedRepository";
import { SiteRepository } from "@/features/rss/site/repository/SiteRepository";

/**
 * BookmarkService
 *
 * Feed pipeline을 그대로 재사용하면서
 * interaction.hasBookmarked 기준으로만 필터링하는 서비스
 */
export class BookmarkService {
  constructor(
    private userFeedInteractionRepository: UserFeedInteractionRepository,
    private feedItemRepository: FeedItemRepository,
    private feedItemStatsRepository: FeedItemStatsRepository,
    private feedRepository: FeedRepository,
    private siteRepository: SiteRepository,
  ) {}

  async getBookmarks(userId: string, cursor?: string): Promise<FeedResponse> {
    // =========================
    // 1. Feed Context 로드 (raw items only)
    // =========================
    const { items, feedMap, siteMap } = await loadFeedContext(userId);

    if (!items.length) {
      return {
        items: [],
        nextCursor: null,
        hasNext: false,
        status: "EMPTY_FEED",
      };
    }

    // =========================
    // 2. interaction 조회 (bookmark 필터링용)
    // =========================
    const feedItemIds = items.map((i) => i._id.toString());

    const interactions =
      await userFeedInteractionRepository.findByUserAndFeedIds(
        userId,
        feedItemIds,
      );

    const interactionMap = new Map(
      interactions.map((i) => [i.feedItemId.toString(), i]),
    );

    // =========================
    // 3. Bookmark 필터링 (핵심)
    // =========================
    const bookmarkedItems = items.filter((item) => {
      const interaction = interactionMap.get(item._id.toString());

      return interaction?.hasBookmarked === true;
    });

    // =========================
    // 4. 페이지네이션
    // =========================
    const { pagedItems, nextCursor, hasNext } = paginateFeedItems({
      items: bookmarkedItems,
      cursor,
    });

    // =========================
    // 5. stats 조회
    // =========================
    const pagedIds = pagedItems.map((i) => i._id.toString());

    const statsList = await feedItemStatsRepository.findByFeedIds(pagedIds);

    const statsMap = new Map(
      statsList.map((i) => [i.feedItemId.toString(), i]),
    );

    // =========================
    // 6. DTO 변환 (Feed와 동일)
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
    // 7. Response (Feed와 동일 구조)
    // =========================
    return {
      items: result,
      nextCursor,
      hasNext,
      status: bookmarkedItems.length === 0 ? "EMPTY_FEED" : "HAS_DATA",
    };
  }
}
