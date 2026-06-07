import { FeedItemStatsService } from "@/features/feed-items/services/FeedItemStatsService";
import { UserFeedInteractionService } from "../services/UserFeedInteractionService";
import { FeedAction } from "../types/feedActionDispatcher";

/**
 * Feed Action Dispatcher
 *
 * 역할:
 * - 사용자 행동을 단일 진입점에서 처리
 * - Interaction 상태 업데이트 + Stats 반영을 동시에 수행
 *
 * 특징:
 * - 모든 Feed 관련 action의 entry point
 * - business logic orchestration layer
 */
export class FeedActionDispatcher {
  constructor(
    private readonly interactionService = new UserFeedInteractionService(),
    private readonly statsService = new FeedItemStatsService(),
  ) {}

  /**
   * Feed Action 처리 메인 함수
   */
  async handle(params: {
    userId: string;
    feedItemId: string;
    action: FeedAction;
  }) {
    const { userId, feedItemId, action } = params;

    switch (action) {
      /**
       * 콘텐츠 클릭
       *
       * - Interaction: 클릭 기록
       * - Stats: contentClick +1
       */
      case "CONTENT_CLICK": {
        await this.interactionService.recordContentClick(userId, feedItemId);
        await this.statsService.handleContentClick(feedItemId);
        break;
      }

      /**
       * 사이트 클릭
       *
       * - Interaction: source click 기록
       * - Stats: sourceClick +1
       */
      case "SOURCE_CLICK": {
        await this.interactionService.recordSourceClick(userId, feedItemId);
        await this.statsService.handleSourceClick(feedItemId);
        break;
      }

      /**
       * 좋아요 토글
       *
       * - Interaction: toggle 상태 변경
       * - Stats: +1 / -1 반영
       */
      case "LIKE": {
        const nextState = await this.interactionService.toggleLike(
          userId,
          feedItemId,
        );

        await this.statsService.handleLikeToggle(feedItemId, nextState);
        break;
      }

      /**
       * 북마크 토글
       *
       * - Interaction: toggle 상태 변경
       * - Stats: +1 / -1 반영
       */
      case "BOOKMARK": {
        const nextState = await this.interactionService.toggleBookmark(
          userId,
          feedItemId,
        );

        await this.statsService.handleBookmarkToggle(feedItemId, nextState);
        break;
      }

      /**
       * 공유
       *
       * - Interaction: 필요 없음 (optional tracking)
       * - Stats: share +1
       */
      case "SHARE": {
        await this.statsService.handleShare(feedItemId);
        break;
      }

      /**
       * 숨김
       *
       * - Interaction: 숨김 상태만 변경
       * - Stats: 영향 없음
       */
      case "HIDE": {
        await this.interactionService.hide(userId, feedItemId);
        break;
      }

      default:
        throw new Error(`Unsupported action: ${action}`);
    }
  }
}
