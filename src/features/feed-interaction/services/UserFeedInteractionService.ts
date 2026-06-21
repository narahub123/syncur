import { UserFeedInteractionRepository } from "../repositories/UserFeedInteractionRepository";
import { userStatsService } from "@/features/admin/users/services/UserStatsService.instance"; // 인스턴스 import

export class UserFeedInteractionService {
  constructor(private readonly repo = new UserFeedInteractionRepository()) {}

  /**
   * 공통으로 사용할 활성 사용자 기록 메서드
   * 비동기로 호출하여 메인 로직의 속도를 저하시키지 않음
   */
  private trackActiveUser(userId: string) {
    const today = new Date().toISOString().split("T")[0];
    // .catch()를 붙여 혹시 모를 DB 에러가 메인 로직을 방해하지 않도록 처리
    userStatsService.recordActiveUser(today, userId).catch(console.error);
  }

  async toggleLike(userId: string, feedItemId: string) {
    const doc = await this.repo.findOrCreate(userId, feedItemId);
    const nextState = !doc.hasLiked;

    await this.repo.update(userId, feedItemId, {
      hasLiked: nextState,
      lastLikedAt: nextState ? new Date() : undefined,
      lastInteractedAt: new Date(),
    });

    this.trackActiveUser(userId); // 활동 기록
    return nextState;
  }

  async toggleBookmark(userId: string, feedItemId: string) {
    const doc = await this.repo.find(userId, feedItemId);
    const nextState = !doc?.hasBookmarked;

    await this.repo.update(userId, feedItemId, {
      hasBookmarked: nextState,
      lastBookmarkedAt: nextState ? new Date() : undefined,
      lastInteractedAt: new Date(),
    });

    this.trackActiveUser(userId); // 활동 기록
    return nextState;
  }

  async recordContentClick(userId: string, feedItemId: string) {
    await this.repo.update(userId, feedItemId, {
      hasContentClicked: true,
      lastContentClickedAt: new Date(),
      lastInteractedAt: new Date(),
    });

    this.trackActiveUser(userId); // 활동 기록
    return true;
  }

  async recordSourceClick(userId: string, feedItemId: string) {
    await this.repo.update(userId, feedItemId, {
      hasSourceClicked: true,
      lastSourceClickedAt: new Date(),
      lastInteractedAt: new Date(),
    });

    this.trackActiveUser(userId); // 활동 기록
    return true;
  }

  async hide(userId: string, feedItemId: string) {
    await this.repo.update(userId, feedItemId, {
      isHidden: true,
      hiddenAt: new Date(),
      lastInteractedAt: new Date(),
    });

    this.trackActiveUser(userId); // 활동 기록
    return true;
  }
}
