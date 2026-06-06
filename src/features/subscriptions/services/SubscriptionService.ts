import { siteRepository } from "@/features/rss/site/repository/SiteRepository.instance";
import { SubscriptionRepository } from "../repository/SubscriptionRepository";
import { subscriptionRepository } from "../repository/SubscriptionRepository.instance";
import { SubscriptionListDto } from "../dto/subscriptionDto";

/**
 * 구독 생성 요청 입력값
 */
type CreateSubscriptionInput = {
  userId: string;
  siteId: string;
};

/**
 * 구독 생성 결과
 *
 * @description
 * 이미 구독 중이면 상태만 반환하고,
 * 신규 구독이면 created 반환
 */
type CreateSubscriptionResult =
  | { status: "subscribed" }
  | { status: "already_subscribed" };

/**
 * SubscriptionService
 *
 * @description
 * 사용자 ↔ 사이트 구독 관계를 관리하는 서비스
 *
 * 책임:
 * - 중복 구독 방지
 * - 구독 생성
 * - 구독 상태 반환
 *
 * DB unique index와 함께 idempotent 보장
 */
export class SubscriptionService {
  private readonly repository: SubscriptionRepository;

  constructor(repository: SubscriptionRepository) {
    this.repository = repository;
  }

  /**
   * 구독 생성
   *
   * @param input userId, siteId
   * @returns 생성 여부 상태
   */
  async create(
    input: CreateSubscriptionInput,
  ): Promise<CreateSubscriptionResult> {
    const { userId, siteId } = input;

    /**
     * 1. 기존 구독 확인
     */
    const exists = await this.repository.find(userId, siteId);

    /**
     * 2. 이미 구독 중이면 종료
     */
    if (exists) {
      return {
        status: "already_subscribed",
      };
    }

    /**
     * 3. 신규 구독 생성
     */
    await this.repository.create(userId, siteId);

    return {
      status: "subscribed",
    };
  }

  /**
   * 사용자의 구독 목록 + 사이트 정보 결합
   */
  async getUserSubscriptions(userId: string): Promise<SubscriptionListDto[]> {
    // 1. 구독 목록 조회
    const subscriptions = await subscriptionRepository.findByUserId(userId);

    if (!subscriptions.length) return [];

    // 2. siteId 추출
    const siteIds = subscriptions.map((sub) => sub.siteId);

    // 3. 사이트 정보 조회
    const sites = await siteRepository.findByIds(siteIds);

    // 4. site map 생성 (성능 최적화)
    const siteMap = new Map(sites.map((site) => [site._id.toString(), site]));

    // 5. DTO 변환
    return subscriptions.map((sub) => {
      const site = siteMap.get(sub.siteId.toString());

      return {
        subscriptionId: sub._id.toString(),
        siteId: sub.siteId.toString(),

        siteName: site?.name ?? "",
        siteUrl: site?.url ?? "",
        favicon_url: site?.favicon_url ?? null,

        created_at: sub.createdAt.toISOString(),
        updated_at: sub.updatedAt.toISOString(),

        isSubscribed: true,
      };
    });
  }

  /**
   * 구독 해제 처리 서비스
   *
   * @description
   * 특정 사용자가 특정 사이트에 대해 설정한 구독 정보를 삭제한다.
   * Repository 레벨의 삭제 로직을 호출하여 DB에서 해당 관계를 제거한다.
   *
   * @layer
   * Service
   *
   * @flow
   * Controller / Action
   *   → Service.unsubscribe
   *   → Repository.deleteByUserAndSite
   *   → DB에서 Subscription 삭제
   *
   * @param userId - 구독을 해제하는 사용자 ID
   * @param siteId - 구독 해제 대상 사이트 ID
   *
   * @returns 삭제 결과 (Repository 반환값)
   */
  async unsubscribe(userId: string, siteId: string) {
    return subscriptionRepository.deleteByUserAndSite(userId, siteId);
  }
}
