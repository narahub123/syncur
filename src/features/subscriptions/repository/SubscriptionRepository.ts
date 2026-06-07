import type { Subscription } from "@/shared/types/subscription";
import { SubscriptionModel } from "../model/Subscription";

/**
 * SubscriptionRepository
 *
 * @description
 * Subscription 컬렉션에 대한 DB 접근 계층
 *
 * 변경사항 (Step 3):
 * - siteId → feedId 기준으로 완전 전환
 * - Subscription은 "Feed 단위 관계"로 변경됨
 *
 * 책임:
 * - 사용자-Feed 구독 조회
 * - 구독 생성
 * - 구독 삭제
 *
 * 특징:
 * - 순수 DB 접근 계층 (비즈니스 로직 없음)
 */
export class SubscriptionRepository {
  /**
   * 특정 user-feed 구독 존재 여부 조회
   *
   * @returns Subscription | null
   */
  async find(userId: string, feedId: string) {
    const doc = await SubscriptionModel.findOne({
      userId,
      feedId,
    }).lean();

    if (!doc) return null;

    return {
      ...doc,
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      feedId: doc.feedId.toString(),
    };
  }

  /**
   * 새로운 구독 생성 (Feed 기준)
   *
   * @returns 생성된 Subscription
   */
  async create(userId: string, feedId: string) {
    const doc = await SubscriptionModel.create({
      userId,
      feedId,
    });

    return {
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      feedId: doc.feedId.toString(),
      createdAt: doc.createdAt?.toISOString(),
      updatedAt: doc.updatedAt?.toISOString(),
    };
  }

  /**
   * 특정 사용자의 모든 구독 조회
   *
   * @description
   * Context에서 feedId 매핑용으로 사용됨
   */
  async findByUserId(userId: string): Promise<Subscription[]> {
    return SubscriptionModel.find({ userId }).lean();
  }

  /**
   * 사용자-Feed 구독 삭제
   *
   * @description
   * 특정 userId + feedId 기준으로 구독 해제
   */
  async deleteByUserAndFeed(userId: string, feedId: string) {
    return SubscriptionModel.deleteOne({
      userId,
      feedId,
    });
  }
}
