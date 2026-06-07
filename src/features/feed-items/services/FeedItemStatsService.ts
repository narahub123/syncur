import { FeedItemStatsRepository } from "../respositories/FeedItemStatsRepository";

/**
 * FeedItemStats Service
 *
 * FeedItem interaction 결과를 기반으로
 * 집계 상태를 업데이트하는 비즈니스 계층
 *
 * 특징:
 * - UserFeedInteraction 결과를 입력으로 받음
 * - +1 / -1 규칙 처리
 * - toggle 상태 반영
 */
export class FeedItemStatsService {
  constructor(private readonly repo = new FeedItemStatsRepository()) {}

  /**
   * 콘텐츠 클릭 처리
   */
  async handleContentClick(feedItemId: string) {
    return this.repo.incrementContentClick(feedItemId);
  }

  /**
   * 사이트 클릭 처리
   */
  async handleSourceClick(feedItemId: string) {
    return this.repo.incrementSourceClick(feedItemId);
  }

  /**
   * 좋아요 토글 반영
   *
   * @param nextState true = 좋아요 ON / false = OFF
   */
  async handleLikeToggle(feedItemId: string, nextState: boolean) {
    if (nextState) {
      return this.repo.incrementLike(feedItemId);
    }

    return this.repo.decrementLike(feedItemId);
  }

  /**
   * 북마크 토글 반영
   *
   * @param nextState true = 북마크 ON / false = OFF
   */
  async handleBookmarkToggle(feedItemId: string, nextState: boolean) {
    if (nextState) {
      return this.repo.incrementBookmark(feedItemId);
    }

    return this.repo.decrementBookmark(feedItemId);
  }

  /**
   * 공유 처리 (단방향)
   */
  async handleShare(feedItemId: string) {
    return this.repo.incrementShare(feedItemId);
  }
}
