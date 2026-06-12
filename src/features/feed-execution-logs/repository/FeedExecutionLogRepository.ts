import { FeedExecutionLogModel } from "../model/feed-execution-log";

/**
 * FeedExecutionLogRepository
 *
 * 역할:
 * - MongoDB 접근 전담 계층
 * - 순수 CRUD만 담당 (비즈니스 로직 금지)
 *
 * 특징:
 * - executionId 기반 업데이트가 핵심
 * - ingestion flow에서 계속 업데이트되므로 update 중심 구조
 */
export class FeedExecutionLogRepository {
  /**
   * Execution 생성
   *
   * - ingestion 시작 시 1회 호출
   * - execution 단위의 시작 상태 기록
   */
  async create(data: {
    feedId: string;
    executionId: string;
    status: string;
    startedAt: Date;
  }) {
    return FeedExecutionLogModel.create(data);
  }

  /**
   * executionId 기준 단일 업데이트
   *
   * - stage 업데이트
   * - success/fail 종료 처리
   * - partial update 모두 포함
   */
  async updateByExecutionId(
    executionId: string,
    update: Partial<{
      status: string;
      startedAt: Date;
      finishedAt: Date;
      durationMs: number;

      httpStatus: number;
      cacheHit: boolean;

      fetchedCount: number;
      insertedCount: number;

      errorMessage: string;
      errorCode: string;
      failedAtStage: string;

      currentStage: string;
    }>,
  ) {
    return FeedExecutionLogModel.updateOne({ executionId }, { $set: update });
  }

  /**
   * feedId 기준 로그 조회
   *
   * - 관리자 페이지 (Logs UI)
   * - 최근 실행 이력 조회
   */
  async findByFeedId(feedId: string, limit = 50) {
    return FeedExecutionLogModel.find({ feedId })
      .sort({ startedAt: -1 })
      .limit(limit);
  }

  /**
   * executionId 단건 조회
   *
   * - 디버깅 / trace 용도
   */
  async findByExecutionId(executionId: string) {
    return FeedExecutionLogModel.findOne({ executionId });
  }
}
