import { FeedExecutionLogModel } from "../model/feed-execution-log";

type ExecutionStatus =
  | "RUNNING"
  | "SUCCESS"
  | "FAILED"
  | "PARTIAL_SUCCESS"
  | "SKIPPED";

type ExecutionStage = "fetch" | "cache_check" | "parse" | "persist";

type FetchLog = {
  url: string;
  etag?: string;
  lastModified?: string;
  cacheResult?: "HIT" | "MISS";
  responseTimeMs?: number;
};

type ParseLog = {
  normalizedCount: number;
  errorSnippet?: string;
};

type PersistLog = {
  upserted: number;
  matched: number;
  modified: number;
};

type TimingLog = {
  startedAt?: Date;
  finishedAt?: Date;
  totalDurationMs?: number;
};

type ExecutionError = {
  type: "HTTP_ERROR" | "XML_PARSE_ERROR" | "DB_ERROR" | "UNKNOWN";
  message: string;
  stack?: string;
};

type ExecutionUpdatePayload = {
  status: ExecutionStatus;
  reason?: string;

  timing?: TimingLog;

  fetch?: FetchLog;
  parse?: ParseLog;
  persist?: PersistLog;

  error?: ExecutionError;
};

export class FeedExecutionLogService {
  /**
   * execution 시작
   */
  async startExecution(feedId: string) {
    const doc = await FeedExecutionLogModel.create({
      feedId,
      executionId: crypto.randomUUID(),
      status: "RUNNING",
      stage: "fetch",
      timing: {
        startedAt: new Date(),
      },
      fetch: {
        retryCount: 0,
      },
      persist: {
        upserted: 0,
        matched: 0,
        modified: 0,
      },
    });

    return {
      executionId: doc.executionId,
    };
  }

  /**
   * stage 이동 (lightweight update)
   */
  async updateStage(executionId: string, stage: ExecutionStage) {
    await FeedExecutionLogModel.updateOne(
      { executionId },
      {
        $set: {
          stage,
        },
      },
    );
  }

  /**
   * partial update (중간 상태 기록)
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
   * 최종 종료 (SUCCESS / FAILED / SKIPPED)
   */
  async updateExecution(executionId: string, data: ExecutionUpdatePayload) {
    const finishedAt = new Date();

    const doc = await FeedExecutionLogModel.findOne({
      executionId,
    });

    if (!doc) return;

    const startedAt = doc.timing?.startedAt;

    await FeedExecutionLogModel.updateOne(
      { executionId },
      {
        $set: {
          ...data,

          "timing.finishedAt": finishedAt,
          "timing.totalDurationMs": startedAt
            ? finishedAt.getTime() - startedAt.getTime()
            : undefined,
        },
      },
    );
  }
}
