import { v4 as uuid } from "uuid";
import { FeedExecutionLogRepository } from "../repository/FeedExecutionLogRepository";
import { normalizeError } from "../utils/normalizeError";

/**
 * FeedExecutionLogService
 *
 * 역할:
 * - execution lifecycle 관리
 * - ingestion 과정 관측 (observability layer)
 * - repository 위에 비즈니스 규칙 추가
 *
 * 핵심 책임:
 * - execution 생성
 * - stage 업데이트
 * - success/fail 종료 처리
 * - duration 계산
 */
export class FeedExecutionLogService {
  constructor(private readonly repo: FeedExecutionLogRepository) {}

  /**
   * execution 시작
   *
   * - ingestion 시작 시 호출
   * - executionId 생성 책임은 service가 가진다
   */
  async startExecution(feedId: string) {
    const executionId = uuid();
    const startedAt = new Date();

    await this.repo.create({
      feedId,
      executionId,
      status: "running",
      startedAt,
    });

    return {
      executionId,
      startedAt,
    };
  }

  /**
   * stage 업데이트
   *
   * - ingestion 진행 상태 기록
   * - FETCH / CACHE_CHECK / PARSE / PERSIST
   */
  async updateStage(executionId: string, stage: string) {
    return this.repo.updateByExecutionId(executionId, {
      currentStage: stage,
    });
  }

  /**
   * execution 성공 종료
   *
   * - ingestion 정상 완료 시 호출
   * - 통계 데이터 포함 업데이트
   */
  async successExecution(
    executionId: string,
    data: {
      fetchedCount: number;
      insertedCount?: number;
    },
  ) {
    const finishedAt = new Date();

    const execution = await this.repo.findByExecutionId(executionId);

    const durationMs = execution?.startedAt
      ? finishedAt.getTime() - execution.startedAt.getTime()
      : undefined;

    return this.repo.updateByExecutionId(executionId, {
      status: "success",
      finishedAt,
      durationMs,

      fetchedCount: data.fetchedCount,
      insertedCount: data.insertedCount ?? 0,
    });
  }

  /**
   * execution 실패 종료
   *
   * - ingestion 중 에러 발생 시 호출
   */
  async failExecution(
    executionId: string,
    error: unknown,
    failedAtStage?: string,
  ) {
    const finishedAt = new Date();

    const execution = await this.repo.findByExecutionId(executionId);

    const durationMs = execution?.startedAt
      ? finishedAt.getTime() - execution.startedAt.getTime()
      : undefined;

    const normalized = normalizeError(error);

    return this.repo.updateByExecutionId(executionId, {
      status: "failed",
      finishedAt,
      durationMs,

      errorMessage: normalized.message,
      errorCode: normalized.code,

      failedAtStage,
    });
  }

  /**
   * feed 기준 로그 조회 (관리자용)
   */
  async getLogsByFeedId(feedId: string, limit?: number) {
    return this.repo.findByFeedId(feedId, limit);
  }
}
