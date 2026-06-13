import { SubscriptionModel } from "../model/Subscription";
import { SubscriptionLean } from "@/shared/types/domain-leans";

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
  async find(userId: string, feedId: string): Promise<SubscriptionLean | null> {
    return SubscriptionModel.findOne({
      userId,
      feedId,
    })
      .lean<SubscriptionLean>()
      .exec();
  }

  /**
   * 새로운 구독 생성 (Feed 기준)
   *
   * @returns 생성된 Subscription
   */
  async create(userId: string, feedId: string): Promise<SubscriptionLean> {
    const doc = await SubscriptionModel.create({
      userId,
      feedId,
    });

    return {
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      feedId: doc.feedId.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  /**
   * 특정 사용자의 모든 구독 조회
   *
   * @description
   * pagination 없이 전체 데이터를 조회한다.
   * 내부 로직 (feedId 매핑, batch 처리 등)에서 사용됨.
   */
  async findByUserId(userId: string): Promise<SubscriptionLean[]> {
    return SubscriptionModel.find({ userId }).lean().exec();
  }

  /**
   * 특정 사용자의 구독 목록 조회 (페이지네이션 적용)
   *
   * @description
   * UI 목록 조회용 API로 사용되며,
   * page/limit 기준으로 데이터를 분할해서 반환한다.
   */
  async findByUserIdPaged(
    userId: string,
    page: number,
    limit: number,
  ): Promise<SubscriptionLean[]> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);

    return SubscriptionModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean()
      .exec();
  }

  /**
   * 사용자-Feed 구독 삭제
   *
   * @description
   * 특정 userId + feedId 기준으로 구독 해제
   */
  async deleteByUserAndFeed(
    userId: string,
    feedId: string,
  ): Promise<SubscriptionLean | null> {
    return SubscriptionModel.findOneAndDelete({
      userId,
      feedId,
    }).lean();
  }

  /**
   * 사용자 구독 전체 개수 조회
   *
   * @description
   * pagination의 totalPages 계산을 위해 필요
   */
  async countByUserId(userId: string): Promise<number> {
    return SubscriptionModel.countDocuments({ userId });
  }

  /**
   * 특정 Feed를 구독 중인 사용자 목록 조회
   *
   * @description
   * FeedItem 생성 후 알림 발송 대상 조회에 사용된다.
   *
   * data flow
   * feedId
   *   ↓
   * subscriptions
   *   ↓
   * userIds
   */
  async findByFeedId(feedId: string): Promise<SubscriptionLean[]> {
    return SubscriptionModel.find({
      feedId,
    })
      .lean<SubscriptionLean[]>()
      .exec();
  }
}
