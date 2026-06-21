import { AdminUserFeedInteractionRepository } from "@/features/admin/users/repositories/AdminUserFeedInteractionRepository";
import { UserFeedInteractionLean } from "@/shared/types/domain-leans";
import { toUserFeedInteractionPopulatedDtos } from "../mappers/toUserFeedInteractionPopulatedDto";

// 클라이언트에서 사용할 DTO 정의
export type UserInteractionDto = {
  interactionId: string;
  feedItemTitle: string;
  lastAction: string;
  lastInteractedAt: Date | null;
  hasLiked: boolean;
  hasBookmarked: boolean;
};

export class AdminUserFeedInteractionService {
  constructor(
    private readonly interactionRepository: AdminUserFeedInteractionRepository,
  ) {}

  /**
   * 관리자 상세 페이지용 활동 목록 조회
   */
  async getUserActivityList(userId: string, page: number, limit: number) {
    const { items, totalCount } = await this.interactionRepository.findByUserId(
      userId,
      page,
      limit,
    );

    return { items: toUserFeedInteractionPopulatedDtos(items), totalCount };
  }

  /**
   * 통계 정보 조회
   */
  async getInteractionStats(userId: string) {
    return await this.interactionRepository.getInteractionStats(userId);
  }

  /**
   * 가장 최근에 수행된 행동을 문자열로 반환 (UI 표시용)
   */
  private getLatestAction(item: UserFeedInteractionLean): string {
    if (item.lastLikedAt && item.lastLikedAt === item.lastInteractedAt)
      return "좋아요";
    if (
      item.lastBookmarkedAt &&
      item.lastBookmarkedAt === item.lastInteractedAt
    )
      return "북마크";
    if (
      item.lastContentClickedAt &&
      item.lastContentClickedAt === item.lastInteractedAt
    )
      return "본문 클릭";
    return "상호작용";
  }
}
