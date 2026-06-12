import { PAGINATION } from "@/shared/constants/pagination";
import {
  FEED_EXECUTION_STATUS,
  FeedExecutionReason,
  FeedExecutionStage,
  FeedExecutionStatus,
} from "../constants/feed-execution-log";
import { toFeedExecutionLogWithFeedAndSiteDto } from "../mappers/toFeedExecutionLogWithFeedAndSiteDto";
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
      /**
       * FeedExecutionLog ID
       */
      id: doc._id.toString(),

      /**
       * 외부 노출용 실행 ID
       */
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

  /**
   * 로그 목록 조회 (페이지네이션 + 검색 + 정렬)
   *
   * - admin monitoring 용
   */
  async getLogsPaginated(
    query: AdminFeedExecutionLogsQuery,
  ): Promise<FeedExecutionLogWithFeedAndSiteDtoPagedResponse> {
    const page = query.page ?? PAGINATION.DEFAULT_PAGE;
    const limit =
      query.limit ?? ADMIN_CONFIG.FEED_EXECUTION_LOGS.PAGINATION_LIMIT;

    /**
     * 1. repository 호출
     *
     * - aggregation 기반 raw data 조회
     * - feed + site join 포함
     */
    const { items, totalCount } =
      await feedExecutionLogRepository.findAllPaginated({
        page,
        limit,
        search: query.search,
        searchField: query.searchField,
        sort: query.sort,
        sortOrder: query.sortOrder,
      });

    /**
     * 2. pagination 계산
     */
    const totalPages = Math.ceil(totalCount / limit);

    /**
     * 3. DTO 변환
     *
     * - ObjectId → string
     * - Date → ISO string
     * - feed/site flatten
     */
    return {
      items: items.map(toFeedExecutionLogWithFeedAndSiteDto),

      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    };
  }
}
