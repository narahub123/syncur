import { Site } from "@/shared/types/site";
import { feedRepository } from "../repository/FeedRepository.instance";
import { Feed } from "@/shared/types/feed";
import { subscriptionRepository } from "@/features/subscriptions/repository/SubscriptionRepository.instance";
import { feedItemRepository } from "@/features/feed-items/respositories/FeedItemRespository.instance";
import { siteRepository } from "@/features/rss/site/repository/SiteRepository.instance";
import { FeedResponse } from "../dto/feedDto";
import { userFeedInteractionRepository } from "@/features/feed-interaction/repositories/UserFeedInteractionRepository.instance";
import { feedItemStatsRepository } from "@/features/feed-items/respositories/FeedItemStatsRepository.instance";
import { feedCondition } from "../utils/feedCondition";
import { FEED_CONFIG } from "../constants/feed-config";

export class FeedService {
  async ensureFeed(site: Site): Promise<Feed | null> {
    if (!site?.feed_url) return null;

    let feed = await feedRepository.findBySiteId(site._id);

    if (!feed) {
      feed = await feedRepository.create({
        siteId: site._id.toString(),
        feedUrl: site.feed_url,
        status: "active",
        errorCount: 0,
        categories: [],
      });
    }

    return feed;
  }

  async getMyFeedItems(userId: string, cursor?: string): Promise<FeedResponse> {
    // 1. 사용자 구독 목록 조회
    // - 해당 사용자가 구독한 feed 목록 기반으로 피드 생성
    const subscriptions = await subscriptionRepository.findByUserId(userId);

    // 구독이 없는 경우: 피드 생성 자체가 불가능
    if (!subscriptions.length) {
      return {
        items: [],
        nextCursor: null,
        hasNext: false,
        status: "NO_SUBSCRIPTION",
      };
    }

    // 2. feedId → subscribedAt 매핑
    // - 각 feed를 언제 구독했는지 기준으로 필터링/정렬에 활용
    const subscribedMap = new Map(
      subscriptions
        .map((s) => {
          if (!s.createdAt) return null;
          return [s.feedId.toString(), new Date(s.createdAt)] as const;
        })
        .filter(Boolean) as Array<[string, Date]>,
    );

    const feedIds = [...subscribedMap.keys()];

    // 3. feed / site 데이터 조회 (join 역할)
    const feeds = await feedRepository.findByIds(feedIds);

    const siteIds = [...new Set(feeds.map((f) => f.siteId.toString()))];

    const sites = await siteRepository.findByIds(siteIds);

    // 빠른 lookup을 위한 map 구성
    const siteMap = new Map(sites.map((s) => [s._id.toString(), s]));
    const feedMap = new Map(feeds.map((f) => [f._id.toString(), f]));

    // 4. feed item 조회 (전체 raw 데이터)
    const items = await feedItemRepository.findByFeedIds(feedIds);

    // 5. 필터링
    // - 구독 이후 생성된 feed item만 유지
    const filtered = items.filter((item) => {
      if (!item.publishedAt) return false;

      const subscribedAt = subscribedMap.get(item.feedId.toString());
      if (!subscribedAt) return false;

      return feedCondition(item, subscribedMap, 1);
    });

    // 6. 최신순 정렬 (feed timeline 기준)
    filtered.sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() -
        new Date(a.publishedAt ?? 0).getTime(),
    );

    // 7. cursor 기반 pagination 시작 index 계산
    // - cursor는 마지막으로 본 publishedAt 기준
    const startIndex = cursor
      ? filtered.findIndex(
          (item) => new Date(item.publishedAt!).toISOString() === cursor,
        ) + 1
      : 0;

    // 8. 페이지 단위 데이터 slicing
    const pagedItems = filtered.slice(
      startIndex,
      startIndex + FEED_CONFIG.FEED_PAGINATION_LIMIT,
    );

    // 9. nextCursor 계산
    // - 현재 페이지의 마지막 item 기준으로 다음 cursor 생성
    const lastItem = pagedItems[pagedItems.length - 1];

    const nextCursor = lastItem
      ? new Date(lastItem.publishedAt!).toISOString()
      : null;

    // 10. hasNext 계산
    // - 전체 데이터 대비 아직 남아있는지 여부
    const hasNext =
      startIndex + FEED_CONFIG.FEED_PAGINATION_LIMIT < filtered.length;

    // 11. interaction 데이터 조회 (유저 행동 정보)
    const feedItemIds = pagedItems.map((i) => i._id.toString());

    const interactions =
      await userFeedInteractionRepository.findByUserAndFeedIds(
        userId,
        feedItemIds,
      );

    const interactionMap = new Map(
      interactions.map((i) => [i.feedItemId.toString(), i]),
    );

    // 12. stats 데이터 조회 (집계 정보)
    const statsList = await feedItemStatsRepository.findByFeedIds(feedItemIds);

    const statsMap = new Map(
      statsList.map((s) => [s.feedItemId.toString(), s]),
    );

    // 13. 최종 DTO 매핑
    const result = pagedItems.map((item) => {
      const feed = feedMap.get(item.feedId.toString());
      if (!feed) throw new Error("Feed missing");

      const site = siteMap.get(feed.siteId.toString());
      if (!site) throw new Error("Site missing");

      const interaction = interactionMap.get(item._id.toString());
      const stats = statsMap.get(item._id.toString());

      return {
        meta: {
          site: {
            siteId: site._id.toString(),
            url: site.url,
            favicon_url: site.favicon_url,
            name: site.name,
            feed_url: site.feed_url,
          },
          feedId: feed._id.toString(),
          publishedAt: item.publishedAt ?? "",
          feedItemId: item._id.toString(),
        },

        content: {
          feedItemId: item._id.toString(),
          title: item.title,
          description: item.description,
          link: item.link,
        },

        categories: item.categories ?? [],

        interaction: {
          hasLiked: interaction?.hasLiked ?? false,
          hasBookmarked: interaction?.hasBookmarked ?? false,
          isHidden: interaction?.isHidden ?? false,

          hasContentClicked: interaction?.hasContentClicked ?? false,
          hasSourceClicked: interaction?.hasSourceClicked ?? false,

          lastInteractedAt:
            interaction?.lastInteractedAt?.toISOString() ?? null,
          lastContentClickedAt:
            interaction?.lastContentClickedAt?.toISOString() ?? null,
          lastSourceClickedAt:
            interaction?.lastSourceClickedAt?.toISOString() ?? null,
          lastLikedAt: interaction?.lastLikedAt?.toISOString() ?? null,
          lastBookmarkedAt:
            interaction?.lastBookmarkedAt?.toISOString() ?? null,
          hiddenAt: interaction?.hiddenAt?.toISOString() ?? null,
        },

        stats: {
          contentClickCount: stats?.contentClickCount ?? 0,
          sourceClickCount: stats?.sourceClickCount ?? 0,
          likeCount: stats?.likeCount ?? 0,
          bookmarkCount: stats?.bookmarkCount ?? 0,
          shareCount: stats?.shareCount ?? 0,
          lastInteractedAt: stats?.lastInteractedAt?.toISOString() ?? null,
        },
      };
    });

    // 14. 최종 응답 반환
    return {
      items: result,
      nextCursor,
      hasNext,
      status: items.length === 0 ? "EMPTY_FEED" : "HAS_DATA",
    };
  }
}
