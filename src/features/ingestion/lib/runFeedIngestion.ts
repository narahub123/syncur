import { feedExecutionLogService } from "@/features/feed-execution-logs/service/FeedExecutionLogService.instance";
import { feedIngestionService } from "@/features/feeds/service/FeedIngestionService.instance";
import { FeedLean } from "@/features/feeds/types/leans";
import { notificationService } from "@/features/notifications/service/NotificationService.instance";
import {
  FEED_EXECUTION_ERROR_TYPE,
  FEED_EXECUTION_REASON,
  FEED_EXECUTION_STAGE,
  FEED_EXECUTION_STATUS,
} from "@/features/admin/logs/types/search";
import { runRssPipeline } from "./pipelines/rss/runRssPipeline";
import { runCrawlPipeline } from "./pipelines/crawl/runCrawlPipeline";
import { RSS_CONFIG } from "@/ingestion/rss/rss-config";
import { createTraceId } from "../logger/trace-id";
import { ingestionLogger } from "../logger/pipelines";

export async function runFeedIngestion(feed: FeedLean) {
  const feedId = feed._id.toString();

  const execution = await feedExecutionLogService.startExecution(feedId);
  const executionId = execution.executionId;
  const feedExecutionLogId = execution.id;

  /**
   * Ingestion Run Context 생성
   *
   * 하나의 ingestion cron 실행 단위를 추적한다.
   * traceId는 전체 흐름,
   * executionId는 observation(실행 상태) 추적용이다.
   */
  const traceId = createTraceId();
  const runLogger = ingestionLogger.child({
    traceId,
  });

  runLogger.debug({ traceId }, "ingestion.trace.created");

  /**
   * Feed Logger (핵심 단위)
   *
   * feed 단위 ingestion 흐름을 추적한다.
   * executionId / feedExecutionLogId는 observation(실행 상태) 추적용 키이며
   * logger context에도 함께 바인딩한다.
   */
  const feedLogger = runLogger.child({
    feedId,
    executionId,
    feedExecutionLogId,
  });

  feedLogger.debug({ feedId }, "ingestion.feed.bound");

  try {
    /**
     * 1. DISABLED CHECK
     */
    if (feed.status === RSS_CONFIG.STATUS.DISABLED) {
      feedLogger.info({ feedId }, "ingestion.skipped.disabled");

      await feedExecutionLogService.updateExecution(executionId, {
        status: FEED_EXECUTION_STATUS.SKIPPED,
        reason: FEED_EXECUTION_REASON.DISABLED_FEED,
        finishedAt: new Date(),
      });

      return;
    }

    /**
     * 2. SOURCE TYPE 분기
     */
    feedLogger.debug({ sourceType: feed.sourceType }, "ingestion.route.select");

    if (feed.sourceType === "rss") {
      const pipelineLogger = feedLogger.child({
        sourceType: "rss",
      });

      pipelineLogger.info({ feedId }, "ingestion.pipeline.rss.start");

      return await runRssPipeline({
        feed,
        executionId,
        feedExecutionLogId,
        logger: pipelineLogger,
      });
    }

    if (feed.sourceType === "crawl") {
      const pipelineLogger = feedLogger.child({
        sourceType: "crawl",
      });

      pipelineLogger.info({ feedId }, "ingestion.pipeline.crawl.start");

      return await runCrawlPipeline({
        feed,
        executionId,
        feedExecutionLogId,
        logger: pipelineLogger,
      });
    }

    /**
     * 3. 알 수 없는 sourceType
     */
    feedLogger.warn(
      { feedId, sourceType: feed.sourceType },
      "ingestion.route.unknown",
    );

    await feedExecutionLogService.updateExecution(executionId, {
      status: FEED_EXECUTION_STATUS.FAILED,
      reason: FEED_EXECUTION_REASON.FETCH_ERROR,
      failedAtStage: FEED_EXECUTION_STAGE.FETCH,
      finishedAt: new Date(),
      error: {
        type: FEED_EXECUTION_ERROR_TYPE.HTTP_ERROR,
        message: `지원하지 않는 sourceType: ${feed.sourceType}`,
      },
    });
  } catch (err) {
    feedLogger.error({ feedId, err }, "ingestion.run.exception");

    /**
     * 파이프라인 내부에서 처리되지 않은 예외
     * (startExecution 실패, 예상치 못한 런타임 에러 등)
     */

    /**
     * 4. FAIL EXECUTION
     */
    await feedExecutionLogService.updateExecution(executionId, {
      status: FEED_EXECUTION_STATUS.FAILED,
      reason: FEED_EXECUTION_REASON.FETCH_ERROR,
      failedAtStage: FEED_EXECUTION_STAGE.FETCH,
      finishedAt: new Date(),
      error: {
        type: FEED_EXECUTION_ERROR_TYPE.HTTP_ERROR,
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      },
    });

    /**
     * 5. ADMIN NOTIFICATION
     */
    await notificationService.createAdminErrorNotification({
      siteId: feed.siteId.toString(),
      feedId,
      feedExecutionLogId,
      stage: FEED_EXECUTION_STAGE.FETCH,
      errorMessage: err instanceof Error ? err.message : String(err),
    });

    /**
     * 6. FEED FAILURE POLICY
     */
    const result = await feedIngestionService.handleFailure(feedId);

    return {
      feedId,
      status: "FAILED",
      disabled: result.disabled,
      errorCount: result.errorCount,
    };
  }
}
