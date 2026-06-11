import { UserFeedInteractionRepository } from "../repositories/UserFeedInteractionRepository";

export class UserFeedInteractionService {
  constructor(private readonly repo = new UserFeedInteractionRepository()) {}

  /**
   * LIKE 토글
   */
  async toggleLike(userId: string, feedItemId: string) {
    const doc = await this.repo.findOrCreate(userId, feedItemId);

    const nextState = !doc.hasLiked;

    await this.repo.update(userId, feedItemId, {
      hasLiked: nextState,
      lastLikedAt: nextState ? new Date() : undefined,
      lastInteractedAt: new Date(),
    });

    return nextState;
  }

  /**
   * BOOKMARK 토글
   */
  async toggleBookmark(userId: string, feedItemId: string) {
    const doc = await this.repo.find(userId, feedItemId);

    const nextState = !doc?.hasBookmarked;

    await this.repo.update(userId, feedItemId, {
      hasBookmarked: nextState,
      lastBookmarkedAt: nextState ? new Date() : undefined,
      lastInteractedAt: new Date(),
    });

    return nextState;
  }

  /**
   * CONTENT CLICK (누적)
   */
  async recordContentClick(userId: string, feedItemId: string) {
    await this.repo.update(userId, feedItemId, {
      hasContentClicked: true,
      lastContentClickedAt: new Date(),
      lastInteractedAt: new Date(),
    });

    return true;
  }

  /**
   * SOURCE CLICK (누적)
   */
  async recordSourceClick(userId: string, feedItemId: string) {
    await this.repo.update(userId, feedItemId, {
      hasSourceClicked: true,
      lastSourceClickedAt: new Date(),
      lastInteractedAt: new Date(),
    });

    return true;
  }

  /**
   * HIDE
   */
  async hide(userId: string, feedItemId: string) {
    await this.repo.update(userId, feedItemId, {
      isHidden: true,
      hiddenAt: new Date(),
      lastInteractedAt: new Date(),
    });

    return true;
  }
}
