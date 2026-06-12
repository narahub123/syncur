import {
  FEED_EXECUTION_STATUS,
  FeedExecutionReason,
  FeedExecutionStage,
  FeedExecutionStatus,
} from "../constants/feed-execution-log";
import { FeedExecutionLogModel } from "../model/feed-execution-log";
import { FeedExecutionError, FetchLog, ParseLog, PersistLog } from "../types";

type ExecutionUpdatePayload = {
  status: FeedExecutionStatus;
  reason?: FeedExecutionReason;

  fetch?: FetchLog;
  parse?: ParseLog;
  persist?: PersistLog;

  finishedAt?: Date;

  error?: FeedExecutionError;
};

export class FeedExecutionLogService {
  /**
   * execution 시작
   * - ingestion 1회 실행 단위를 생성한다
   */
  async startExecution(feedId: string) {
    const doc = await FeedExecutionLogModel.create({
      feedId,
      executionId: crypto.randomUUID(),
      status: FEED_EXECUTION_STATUS.RUNNING,
      startedAt: new Date(),
      fetchedCount: 0,
      insertedCount: 0,
    });

    return {
      executionId: doc.executionId,
    };
  }

  /**
   * execution 단계 이동
   * - 현재 실행 단계만 갱신 (lightweight tracking)
   */
  async updateStage(executionId: string, stage: FeedExecutionStage) {
    await FeedExecutionLogModel.updateOne(
      { executionId },
      {
        $set: { stage },
      },
    );
  }

  /**
   * execution 중간 상태 업데이트
   * - fetch / parse / persist 결과 누적 기록
   */
  async patchExecution(
    executionId: string,
    patch: Partial<ExecutionUpdatePayload>,
  ) {
    await FeedExecutionLogModel.updateOne(
      { executionId },
      {
        $set: patch,
      },
    );
  }

  /**
   * execution 종료 처리
   * - 성공 / 실패 최종 상태 기록
   * - duration 자동 계산
   */
  async updateExecution(executionId: string, data: ExecutionUpdatePayload) {
    const finishedAt = new Date();

    const doc = await FeedExecutionLogModel.findOne({ executionId });
    if (!doc) return;

    const startedAt = doc.startedAt;

    await FeedExecutionLogModel.updateOne(
      { executionId },
      {
        $set: {
          ...data,
          finishedAt,
          durationMs: startedAt
            ? finishedAt.getTime() - startedAt.getTime()
            : undefined,
        },
      },
    );
  }
}
