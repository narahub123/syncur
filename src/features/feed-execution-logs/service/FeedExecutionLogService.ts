import {
  FEED_EXECUTION_STATUS,
  FeedExecutionReason,
  FeedExecutionStage,
  FeedExecutionStatus,
} from "@/features/admin/logs/types/search";
import { FeedExecutionLogModel } from "../model/feed-execution-log";
import { FeedExecutionError, FetchLog, ParseLog, PersistLog } from "../types";
import { FeedExecutionLogWithFeedAndSiteDto } from "../dto/feedExecutionLogDto";
import { feedExecutionLogRepository } from "../repository/FeedExecutionLogRepository.instance";
import { toFeedExecutionLogWithFeedAndSiteDto } from "../mappers/toFeedExecutionLogWithFeedAndSiteDto";
import { feedExecutionLogStatsService } from "./FeedExecutionLogStatsService.instance";

/**
 * Execution write contract
 * - ingestion ↔ DB 1:1 매핑
 */
type ExecutionUpdatePayload = {
  status: FeedExecutionStatus;
  reason?: FeedExecutionReason;

  fetch?: FetchLog;
  parse?: ParseLog;
  persist?: PersistLog;

  failedAtStage?: FeedExecutionStage;
  finishedAt?: Date;

  error?: FeedExecutionError;
};

export class FeedExecutionLogService {
  /**
   * execution 시작
   * - ingestion 1회 실행 단위 생성
   */
  async startExecution(feedId: string) {
    const doc = await FeedExecutionLogModel.create({
      feedId,
      executionId: crypto.randomUUID(),
      status: FEED_EXECUTION_STATUS.RUNNING,
      startedAt: new Date(),
    });

    return {
      id: doc._id.toString(),
      executionId: doc.executionId,
    };
  }

  /**
   * execution 부분 업데이트
   * - fetch / parse / persist 결과 기록
   * - 구조 제한된 safe patch
   */
  async patchExecution(executionId: string, patch: ExecutionUpdatePayload) {
    await FeedExecutionLogModel.updateOne(
      { executionId },
      {
        $set: patch,
      },
    );
  }

  /**
   * execution 종료 처리 (success / failed / skipped)
   * - duration 자동 계산
   */
  async updateExecution(executionId: string, data: ExecutionUpdatePayload) {
    const doc = await FeedExecutionLogModel.findOne({ executionId });
    if (!doc) return;

    const finishedAt = new Date();
    const startedAt = doc.startedAt;

    await FeedExecutionLogModel.updateOne(
      { executionId },
      {
        $set: {
          ...data,
          finishedAt,
          durationMs: startedAt
            ? finishedAt.getTime() - startedAt.getTime()
            : 0,
        },
      },
    );

    if (data.status === FEED_EXECUTION_STATUS.FAILED) {
      await feedExecutionLogStatsService.updateStats({
        fails: 1,
      });
    }
  }

  async getLogDetailById(
    id: string,
  ): Promise<FeedExecutionLogWithFeedAndSiteDto> {
    /**
     * 1. 전송 인자 검증 (방어 코드)
     */
    if (!id || id.trim().length === 0) {
      throw new Error("올바르지 않은 로그 식별자입니다.");
    }

    try {
      console.log(`🔍 [Service] 장애 로그 상세 조회 시작 (ID: ${id})`);

      /**
       * 2. 기존 목록 뼈대를 재활용한 레포지토리 단건 조회 실행
       * - 레포지토리 결과 타입이 확실히 추론되므로 any가 필요 없습니다.
       */
      const logDetail = await feedExecutionLogRepository.findOneById(id);

      /**
       * 3. 예외 예방 조치: 존재하지 않는 데이터인 경우 가드
       */
      if (!logDetail) {
        console.warn(
          `⚠️ [Service] 해당 ID의 장애 로그를 찾을 수 없습니다: ${id}`,
        );
        throw new Error("해당 장애 로그 상세 정보를 찾을 수 없습니다.");
      }

      console.log(
        `✅ [Service] 장애 로그 상세 조회 성공 (Status: ${logDetail.status})`,
      );

      // 💡 4. 비즈니스 규격 DTO 변환 후 온전한 인스턴스로 반환
      return toFeedExecutionLogWithFeedAndSiteDto(logDetail);
    } catch (error: unknown) {
      // error가 자바스크립트 Error 인스턴스인지 안전하게 가드(Type Guard)
      if (error instanceof Error) {
        // 💡 내부에 이미 발생한 고유 예외("해당 장애 로그를 찾을 수 없습니다" 등)는 그대로 상위로 튕겨냄
        throw error;
      }

      console.error(`❌ [Service] 장애 로그 조회 중 시스템 에러 발생:`, error);
      throw new Error(
        "장애 로그를 불러오는 도중 알 수 없는 오류가 발생했습니다.",
      );
    }
  }
}
