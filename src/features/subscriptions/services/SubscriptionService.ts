import { siteRepository } from "@/features/rss/site/repository/SiteRepository.instance";
import { subscriptionRepository } from "../repository/SubscriptionRepository.instance";
import { SubscriptionListDto } from "../dto/subscriptionDto";
import { feedRepository } from "@/features/feeds/repository/FeedRepository.instance";

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

  constructor(repository: typeof subscriptionRepository) {
    this.repository = repository;
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

    /**
     * 기존 구독 존재 여부 확인 (idempotent 보장)
     */
    const exists = await this.repository.find(userId, feedId);

    if (exists) {
      return { status: "already_subscribed" };
    }

    /**
     * 신규 구독 생성
     */
    await this.repository.create(userId, feedId);

    return { status: "subscribed" };
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
  async getUserSubscriptions(userId: string): Promise<SubscriptionListDto[]> {
    const subscriptions = await subscriptionRepository.findByUserId(userId);

    if (!subscriptions.length) return [];

    /**
     * Subscription → Feed 매핑을 위한 feedId 추출
     */
    const feedIds = subscriptions.map((sub) => sub.feedId);

    const feeds = await feedRepository.findByIds(feedIds);

    /**
     * Feed → Site 매핑을 위한 siteId 추출
     */
    const siteIds = feeds.map((f) => f.siteId);

    const sites = await siteRepository.findBySiteIds(siteIds);

    /**
     * in-memory lookup 최적화를 위한 Map 구성
     */
    const siteMap = new Map(sites.map((site) => [site._id.toString(), site]));

    const feedMap = new Map(feeds.map((feed) => [feed._id.toString(), feed]));

    /**
     * Subscription DTO 변환
     *
     * @note
     * feed → site join 실패 시 안전하게 fallback 처리
     */
    return subscriptions.map((sub) => {
      const feed = feedMap.get(sub.feedId.toString());
      const site = feed ? siteMap.get(feed.siteId.toString()) : null;

      return {
        subscriptionId: sub._id.toString(),
        feedId: sub.feedId.toString(),

        siteName: site?.name ?? "",
        siteUrl: site?.url ?? "",
        favicon_url: site?.favicon_url ?? null,

        created_at: sub.createdAt ?? "",
        updated_at: sub.updatedAt ?? "",

        isSubscribed: true,
      };
    });
  }

  /**
   * 구독 해제
   *
   * @description
   * user-feed 관계를 기준으로 구독을 삭제한다.
   */
  async unsubscribe(userId: string, feedId: string) {
    return subscriptionRepository.deleteByUserAndFeed(userId, feedId);
  }
}
