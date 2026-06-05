import { SubscriptionRepository } from "../repository/SubscriptionRepository";

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
}
