import { Subscription } from "../model/Subscription";

/**
 * SubscriptionRepository
 *
 * @description
 * Subscription 컬렉션에 대한 DB 접근 계층
 *
 * 책임:
 * - 사용자-사이트 구독 조회
 * - 구독 생성
 * - MongoDB ↔ 도메인 데이터 변환
 *
 * 특징:
 * - 비즈니스 로직 없음 (순수 DB 접근만 담당)
 * - Service 계층에서만 호출됨
 */
export class SubscriptionRepository {
  /**
   * 특정 user-site 구독 존재 여부 조회
   *
   * @returns Subscription | null
   */
  async find(userId: string, siteId: string) {
    const doc = await Subscription.findOne({
      userId,
      siteId,
    }).lean();

    if (!doc) return null;

    return {
      ...doc,
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      siteId: doc.siteId.toString(),
    };
  }

  /**
   * 새로운 구독 생성
   *
   * @returns 생성된 Subscription
   */
  async create(userId: string, siteId: string) {
    const doc = await Subscription.create({
      userId,
      siteId,
    });

    return {
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      siteId: doc.siteId.toString(),
      createdAt: doc.createdAt?.toISOString(),
      updatedAt: doc.updatedAt?.toISOString(),
    };
  }
}
