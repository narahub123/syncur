import { RSS_CONFIG } from "@/features/ingestion/lib/rss/rss-config";
import { FeedRepository } from "../repository/FeedRepository";
import { feedStatsService } from "./FeedStatService.instance";

/**
 * FeedIngestionService
 *
 * 역할:
 * - ingestion 결과에 따른 Feed 상태 관리
 * - repository 호출 orchestration
 * - business rule (threshold 등) 담당
 */
export class FeedIngestionService {
  constructor(private readonly repo: FeedRepository) {}

  /**
   * ingestion 성공 처리
   */
  async handleSuccess(params: {
    feedId: string;
    etag?: string;
    lastModified?: string;
    lastSeenUrl?: string;
  }) {
    return this.repo.markIngestionSuccess(params);
  }

  /**
   * ingestion 실패 처리
   *
   * - errorCount 증가
   * - threshold 초과 시 disable 처리
   */
  async handleFailure(feedId: string) {
    const updated = await this.repo.incrementErrorCount(feedId);

    const errorCount = updated?.errorCount ?? 0;

    if (errorCount >= RSS_CONFIG.ERROR_THRESHOLD) {
      await this.repo.disableFeed(feedId);

      await feedStatsService.updateStats({ active: -1, inactive: 1 });

      return {
        disabled: true,
        errorCount,
      };
    }

    return {
      disabled: false,
      errorCount,
    };
  }
}
