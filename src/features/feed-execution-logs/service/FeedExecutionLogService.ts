import { PAGINATION } from "@/shared/constants/pagination";
import {
  FEED_EXECUTION_STATUS,
  FeedExecutionReason,
  FeedExecutionStage,
  FeedExecutionStatus,
} from "../constants/feed-execution-log";
import { FeedExecutionLogModel } from "../model/feed-execution-log";
import {
  AdminFeedExecutionLogsQuery,
  FeedExecutionError,
  FetchLog,
  ParseLog,
  PersistLog,
} from "../types";
import { ADMIN_CONFIG } from "@/features/admin/constants/admin-config";
import { FeedExecutionLogWithFeedAndSiteDtoPagedResponse } from "../dto/feedExecutionLogDto";
import { feedExecutionLogRepository } from "../repository/FeedExecutionLogRepository.instance";
import { toFeedExecutionLogWithFeedAndSiteDto } from "../mappers/toFeedExecutionLogWithFeedAndSiteDto";

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
  }

  /**
   * 로그 목록 조회 (admin)
   */
  async getLogsPaginated(
    query: AdminFeedExecutionLogsQuery,
  ): Promise<FeedExecutionLogWithFeedAndSiteDtoPagedResponse> {
    const page = query.page ?? PAGINATION.DEFAULT_PAGE;
    const limit =
      query.limit ?? ADMIN_CONFIG.FEED_EXECUTION_LOGS.PAGINATION_LIMIT;

    const { items, totalCount } =
      await feedExecutionLogRepository.findAllPaginated({
        page,
        limit,
        search: query.search,
        searchField: query.searchField,
        sort: query.sort,
        sortOrder: query.sortOrder,
      });

    return {
      items: items.map(toFeedExecutionLogWithFeedAndSiteDto),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }
}
