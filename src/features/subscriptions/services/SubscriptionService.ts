import { siteRepository } from "@/features/rss/site/repository/SiteRepository.instance";
import { subscriptionRepository } from "../repository/SubscriptionRepository.instance";
import { SubscriptionDto, SubscriptionItemDto } from "../dto/subscriptionDto";
import { feedRepository } from "@/features/feeds/repository/FeedRepository.instance";
import { PaginatedResponse } from "@/shared/types/pagination";
import { toSubscriptionDto } from "../mapper/toSubscriptionDto";
import { FeedService } from "@/features/feeds/service/FeedService";

/**
 * 구독 생성 요청 입력값
 *
 * @description
 * 사용자가 특정 Feed에 대해 구독을 요청할 때 사용하는 입력 데이터
 * - userId: 구독 주체
 * - feedId: 구독 대상 (RSS 단위)
 */
type CreateSubscriptionInput = {
  userId: string;
  feedId: string;
};

/**
 * 구독 생성 결과 상태
 *
 * @description
 * 멱등성(idempotent)을 보장하기 위한 응답 모델
 * - 이미 구독 중이면 상태만 반환
 * - 신규 생성이면 subscribed 반환
 */
type CreateSubscriptionResult =
  | { status: "subscribed" }
  | { status: "already_subscribed" };

/**
 * SubscriptionService
 *
 * @description
 * 사용자 ↔ Feed 구독 관계를 관리하는 서비스 계층
 *
 * @architecture
 * - Subscription: 관계 데이터 (user ↔ feed)
 * - Feed: RSS ingestion 단위 (site의 실질 데이터 소스)
 * - Site: 원본 URL 메타 정보
 *
 * @responsibility
 * - 구독 생성 (중복 방지 포함)
 * - 구독 해제
 * - 사용자 구독 목록 조회 (feed → site join)
 *
 * @performance_note
 * - subscription list 조회는 feed → site 2-step join 구조
 * - feedMap + siteMap을 사용하여 N+1 문제 방지
 * - 향후 성능 최적화 필요 시 subscription에 siteId denormalization 고려 가능
 */
export class SubscriptionService {
  private readonly repository: typeof subscriptionRepository;
  private readonly feedService: FeedService;

  constructor(
    repository: typeof subscriptionRepository,
    feedService: FeedService,
  ) {
    this.repository = repository;
    this.feedService = feedService;
  }

  /**
   * 사용자 구독 목록 조회
   *
   * @description
   * Subscription → Feed → Site 순으로 데이터를 조합하여
   * UI에서 사용할 DTO 형태로 변환한다.
   *
   * @data_flow
   * subscriptions
   *   → feedIds 추출
   *   → Feed batch 조회 (findByIds)
   *   → siteIds 추출
   *   → Site batch 조회 (findBySiteIds)
   *   → Map 기반 in-memory join
   *
   * @performance
   * - N+1 query 방지 (batch fetch)
   * - Map lookup으로 O(1) join 처리
   */
  async getUserSubscriptions(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<SubscriptionItemDto>> {
    const subscriptions = await subscriptionRepository.findByUserIdPaged(
      userId,
      page,
      limit,
    );

    if (!subscriptions.length) {
      return {
        items: [],
        pagination: {
          page,
          limit,
          totalCount: 0,
          totalPages: 0,
        },
      };
    }

    const totalCount = await subscriptionRepository.countByUserId(userId);

    const feedIds = subscriptions.map((sub) => sub.feedId);
    const feeds = await feedRepository.findByIds(feedIds);

    const siteIds = feeds.map((f) => f.siteId);
    const sites = await siteRepository.findBySiteIds(siteIds);

    const siteMap = new Map(sites.map((site) => [site._id.toString(), site]));
    const feedMap = new Map(feeds.map((feed) => [feed._id.toString(), feed]));

    const items = subscriptions.map((sub) => {
      const feed = feedMap.get(sub.feedId.toString());
      const site = feed ? siteMap.get(feed.siteId.toString()) : null;

      return {
        subscriptionId: sub._id.toString(),
        feedId: sub.feedId.toString(),

        siteName: site?.name ?? "",
        siteUrl: site?.url ?? "",
        favicon_url: site?.favicon_url ?? null,

        createdAt: sub.createdAt.toISOString() ?? "",
        updatedAt: sub.updatedAt.toISOString() ?? "",

        isSubscribed: true,
      };
    });

    return {
      items,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  /**
   * 구독 생성
   *
   * @description
   * 동일 user-feed 조합에 대해 중복 구독을 방지하며 생성한다.
   * DB unique index와 함께 이중 안전장치 역할을 수행한다.
   */
  async create(
    input: CreateSubscriptionInput,
  ): Promise<CreateSubscriptionResult> {
    const { userId, feedId } = input;

    const subscription = await this.repository.find(userId, feedId);

    if (subscription && subscription.deletedAt === null) {
      return { status: "already_subscribed" };
    }

    await this.repository.create(userId, feedId);

    return { status: "subscribed" };
  }

  async subscribe(userId: string, feedId: string) {
    const result = await this.create({ userId, feedId });

    if (result.status === "subscribed") {
      await this.feedService.incrementSubscriberCount(feedId);
    }

    return result;
  }

  /**
   * 구독 해제
   *
   * @description
   * user-feed 관계를 기준으로 구독을 삭제한다.
   */
  async unsubscribe(
    userId: string,
    feedId: string,
  ): Promise<SubscriptionDto | null> {
    const doc = await subscriptionRepository.softDelete(userId, feedId);

    if (!doc) return null;

    // 2. FeedService를 통해 구독자 수 감소 (도메인 위임)
    await this.feedService.decrementSubscriberCount(feedId);

    return toSubscriptionDto(doc);
  }

  /**
   * 특정 Feed 구독자 목록 조회
   *
   * @description
   * FeedItem 생성 후 알림 발송 대상을 조회한다.
   *
   * data flow
   * feedId
   *   ↓
   * subscriptions
   *   ↓
   * userIds
   */
  async getSubscribers(feedId: string) {
    return this.repository.findByFeedId(feedId);
  }

  async subscribeMany(userId: string, feedIds: string[]) {
    try {
      const uniqueFeedIds = [...new Set(feedIds)];

      await Promise.all(
        uniqueFeedIds.map((feedId) => this.subscribe(userId, feedId)),
      );

      return { success: true };
    } catch (error) {
      console.error("구독 추가 실패", error);
      return { success: false };
    }
  }
}
