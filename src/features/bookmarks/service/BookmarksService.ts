import { userFeedInteractionRepository } from "@/features/feed-interaction/repositories/UserFeedInteractionRepository.instance";
import { feedItemStatsRepository } from "@/features/feed-items/repositories/FeedItemStatsRepository.instance";
import { loadFeedContext } from "@/features/feeds/service/getMyFeedItems/loadFeedContext";
import { UserFeedInteractionRepository } from "@/features/feed-interaction/repositories/UserFeedInteractionRepository";
import { FeedItemRepository } from "@/features/feed-items/repositories/FeedItemRepository";
import { FeedItemStatsRepository } from "@/features/feed-items/repositories/FeedItemStatsRepository";
import { FeedRepository } from "@/features/feeds/repository/FeedRepository";
import { SiteRepository } from "@/features/rss/site/repository/SiteRepository";
import { bookmarkCollectionMapRepository } from "../collection-map/repository/BookmarkCollectionMapRepository.instance";
import { bookmarkCollectionRepository } from "../collections/repository/BookmarkCollectionRepository.instance";
import { toBookmarkItemDto } from "../mappers/toBookmarkItemDto";
import { BookmarkResponse } from "../dto/bookmarkDto";
import { paginateBookmarkedItems } from "./paginateBookmarkedItems";

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

  async getBookmarks(
    userId: string,
    cursor?: string,
  ): Promise<BookmarkResponse> {
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

    const bookmaredFeedItemIds = bookmarkedItems.map((item) =>
      item._id.toString(),
    );

    const collectionMaps =
      await bookmarkCollectionMapRepository.findByFeedItemIds(
        bookmaredFeedItemIds,
      );

    const collectionIds = [
      ...new Set(collectionMaps.map((m) => m.collectionId.toString())),
    ];

    const collections =
      await bookmarkCollectionRepository.findByIds(collectionIds);

    const collectionMap = new Map(
      collections.map((c) => {
        const feedItemId = collectionMaps.filter(
          (m) => m.collectionId.toString() === c._id.toString(),
        )[0].feedItemId;

        return [feedItemId.toString(), c];
      }),
    );

    // =========================
    // 5. stats 조회
    // =========================
    const pagedIds = bookmarkedItems.map((i) => i._id.toString());

    const statsList = await feedItemStatsRepository.findByFeedIds(pagedIds);

    const statsMap = new Map(
      statsList.map((i) => [i.feedItemId.toString(), i]),
    );

    // =========================
    // 6. DTO 변환 (Feed와 동일)
    // =========================
    const result = bookmarkedItems.map((item) =>
      toBookmarkItemDto({
        item,
        feedMap,
        siteMap,
        interactionMap,
        statsMap,
        collectionMap,
      }),
    );

    // =========================
    // 4. 페이지네이션
    // =========================
    const { pagedItems, nextCursor, hasNext } = paginateBookmarkedItems({
      items: result,
      cursor,
    });

    // =========================
    // 7. Response (Feed와 동일 구조)
    // =========================
    return {
      items: pagedItems,
      nextCursor,
      hasNext,
      status: bookmarkedItems.length === 0 ? "EMPTY_FEED" : "HAS_DATA",
    };
  }
}
